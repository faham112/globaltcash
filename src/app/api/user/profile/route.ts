import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as any).id;
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, balance: true }
    });

    // Sirf Real Deposits (Jo Admin ne Approve kiye aur jo Plan Purchase nahi hain)
    const totalDepositsAgg = await db.deposit.aggregate({
      where: {
        userId: userId,
        status: "APPROVED" as any, // Ya jo bhi aapka Admin status set karta hai
        NOT: { gateway: "Internal" }
      },
      _sum: { amount: true }
    });

    return NextResponse.json({
      ...user,
      totalDeposited: totalDepositsAgg._sum.amount || 0,
    });
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}