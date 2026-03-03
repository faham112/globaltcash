import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planName, amount: rawAmount } = await req.json();
    const amount = parseFloat(rawAmount);

    const plan = await db.plan.findUnique({
      where: { name: planName, active: true }
    });

    if (!plan || amount < plan.minAmount || amount > plan.maxAmount) {
      return NextResponse.json({ error: "Invalid plan or amount out of range" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!user || user.balance < amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    const transactionId = `PLAN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // TRANSACTION BLOCK
    await db.$transaction([
      // 1. User ka balance kam karo aur totalInvested barhao
      db.user.update({
        where: { id: user.id },
        data: { 
          balance: { decrement: amount },
          // Agar aapke schema mein totalInvested hai to niche wali line uncomment karein
          // totalInvested: { increment: amount } 
        }
      }),
      
      // 2. Plan ki entry karo lekin gateway "PLAN_PURCHASE" rakho
      db.deposit.create({
        data: {
          userId: user.id,
          amount: amount,
          planName: planName,
          gateway: "PLAN_PURCHASE", // <--- Pehchaan ke liye
          status: "COMPLETED", 
          transactionId
        }
      })
    ]);

    return NextResponse.json({ success: true, message: "Plan activated successfully" });

  } catch (error) {
    console.error("Plan purchase error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}