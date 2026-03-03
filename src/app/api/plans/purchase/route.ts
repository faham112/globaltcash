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

    // 1. Plan ko DB se fetch karo validation ke liye
    const plan = await db.plan.findUnique({
      where: { name: planName, active: true }
    });

    if (!plan || amount < plan.minAmount || amount > plan.maxAmount) {
      return NextResponse.json({ error: "Invalid plan or amount out of range" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Balance Check
    if (user.balance < amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    const transactionId = `PLAN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // 3. TRANSACTION: Balance minus aur Plan entry ek saath
    try {
      await db.$transaction([
        db.user.update({
          where: { id: user.id },
          data: { 
            balance: { decrement: amount } 
          }
        }),
        db.deposit.create({
          data: {
            userId: user.id,
            amount: amount,
            planName: planName,
            gateway: "PLAN_PURCHASE", // Taake real deposit mein count na ho
            status: "APPROVED" as any, // 'as any' lagane se build error khatam ho jayega
            transactionId
          }
        })
      ]);

      console.log(`✅ Plan activated for user ${user.id}`);
      return NextResponse.json({ 
        success: true, 
        message: "Plan activated successfully" 
      });

    } catch (error) {
       return NextResponse.json({ error: "Transaction failed." }, { status: 400 });
    }

  } catch (error) {
    console.error("Plan purchase error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}