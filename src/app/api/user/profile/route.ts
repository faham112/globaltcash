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

    // 1. User basic info
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        balance: true,
      }
    });

    // 2. SAHI CALCULATION: Total Real Deposits
    const totalDepositsAgg = await db.deposit.aggregate({
      where: {
        userId: userId,
        status: "COMPLETED",
        NOT: {
          gateway: "PLAN_PURCHASE" // <--- Plan wali amount ko count nahi karega
        }
      },
      _sum: {
        amount: true
      }
    });

    // 3. Total Investment Calculation
    const totalInvestedAgg = await db.deposit.aggregate({
      where: {
        userId: userId,
        gateway: "PLAN_PURCHASE"
      },
      _sum: {
        amount: true
      }
    });

    return NextResponse.json({
      ...user,
      totalDeposited: totalDepositsAgg._sum.amount || 0,
      totalInvested: totalInvestedAgg._sum.amount || 0
    });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}