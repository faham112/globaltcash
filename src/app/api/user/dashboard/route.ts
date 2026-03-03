import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as any).id;

    // ✅ Calculation: Sirf wo deposits jo Admin ne Approve kiye aur jo Plan Purchase nahi hain
    const stats = await db.deposit.aggregate({
      where: {
        userId: userId,
        status: "APPROVED" as any, 
        NOT: {
          gateway: { in: ["Internal", "PLAN_PURCHASE"] } // Dono cover kar liye safety ke liye
        }
      },
      _sum: { amount: true }
    });

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { balance: true }
    });

    return NextResponse.json({
      balance: user?.balance || 0,
      totalDeposited: stats._sum.amount || 0,
    });
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}