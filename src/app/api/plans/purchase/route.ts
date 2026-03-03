import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { planName, amount: rawAmount } = await req.json();
    const amount = parseFloat(rawAmount);

    const plan = await db.plan.findUnique({ where: { name: planName, active: true } });
    if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 400 });

    const user = await db.user.findUnique({ where: { email: session.user.email! } });
    if (!user || user.balance < amount) return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });

    const transactionId = `PLAN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    await db.$transaction([
      db.user.update({
        where: { id: user.id },
        data: { balance: { decrement: amount } }
      }),
      db.deposit.create({
        data: {
          userId: user.id,
          amount: amount,
          planName: planName,
          gateway: "Internal", // Isko simple rakhein
          status: "ACTIVE" as any, // Plans dikhane ke liye aksar status "ACTIVE" chahiye hota hai
          transactionId
        }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}