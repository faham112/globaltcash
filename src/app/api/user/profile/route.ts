import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // 1. User basic info fetch karo
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        balance: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Real Deposits Calculation (Sirf APPROVED wale, excluding PLAN_PURCHASE)
    const totalDepositsAgg = await db.deposit.aggregate({
      where: {
        userId: userId,
        status: "APPROVED" as any, // 'as any' lagane se build error nahi aayega
        NOT: {
          gateway: "PLAN_PURCHASE" 
        }
      },
      _sum: {
        amount: true
      }
    });

    // 3. Total Investment Calculation (Sirf PLAN_PURCHASE wali entries)
    const totalInvestedAgg = await db.deposit.aggregate({
      where: {
        userId: userId,
        gateway: "PLAN_PURCHASE"
      },
      _sum: {
        amount: true
      }
    });

    // Final Response
    return NextResponse.json({
      ...user,
      totalDeposited: totalDepositsAgg._sum.amount || 0,
      totalInvested: totalInvestedAgg._sum.amount || 0
    });

  } catch (error: any) {
    console.error("Profile API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}