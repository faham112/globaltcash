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

    const { depositId } = await req.json();
    const userId = (session.user as any).id;

    // 1. Fetch Deposit
    const deposit = await db.deposit.findUnique({
      where: { id: depositId },
    }) as any;

    if (!deposit || deposit.userId !== userId || deposit.status !== "ACTIVE") {
      return NextResponse.json({ error: "Active deposit not found" }, { status: 400 });
    }

    // 2. Logic: Calculate Pending Days (24h blocks)
    const now = new Date();
    const lastClaim = deposit.lastClaimedAt || deposit.createdAt;
    const diffInMs = now.getTime() - lastClaim.getTime();
    const pendingDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (pendingDays < 1) {
      return NextResponse.json({ 
        error: "Profit is not yet ready. Please wait for 24 hours." 
      }, { status: 400 });
    }

    // 3. Calculation
    const roiValue = deposit.roi || 0;
    const dailyProfit = deposit.amount * (roiValue / 100);
    const totalClaimAmount = dailyProfit * pendingDays;

    // 4. Atomic Transaction
    await db.$transaction([
      // A. Update User Balance
      db.user.update({
        where: { id: userId },
        data: { balance: { increment: totalClaimAmount } }
      }),
      // B. Update Deposit Claim Date (Increment by exact days)
      db.deposit.update({
        where: { id: depositId },
        data: { 
          lastClaimedAt: new Date(lastClaim.getTime() + pendingDays * 24 * 60 * 60 * 1000) 
        }
      }),
      // C. History Record
      db.profitRecord.create({
        data: {
          depositId: deposit.id,
          amount: totalClaimAmount,
          status: "COMPLETED",
          description: `Claimed ${pendingDays} day(s) profit`
        }
      })
    ]);

    return NextResponse.json({ 
      success: true, 
      amount: totalClaimAmount, 
      claimedDays: pendingDays 
    });

  } catch (error) {
    console.error("Critical Claim Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { depositId } = await req.json();
    const userId = (session.user as any).id;

    // 1. Fetch Deposit
    const deposit = await db.deposit.findUnique({
      where: { id: depositId },
    }) as any;

    if (!deposit || deposit.userId !== userId || deposit.status !== "ACTIVE") {
      return NextResponse.json({ error: "Active deposit not found" }, { status: 400 });
    }

    // 2. Logic: Calculate Pending Days (24h blocks)
    const now = new Date();
    const lastClaim = deposit.lastClaimedAt || deposit.createdAt;
    const diffInMs = now.getTime() - lastClaim.getTime();
    const pendingDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (pendingDays < 1) {
      return NextResponse.json({ 
        error: "Profit is not yet ready. Please wait for 24 hours." 
      }, { status: 400 });
    }

    // 3. Calculation
    const roiValue = deposit.roi || 0;
    const dailyProfit = deposit.amount * (roiValue / 100);
    const totalClaimAmount = dailyProfit * pendingDays;

    // 4. Atomic Transaction
    await db.$transaction([
      // A. Update User Balance
      db.user.update({
        where: { id: userId },
        data: { balance: { increment: totalClaimAmount } }
      }),
      // B. Update Deposit Claim Date (Increment by exact days)
      db.deposit.update({
        where: { id: depositId },
        data: { 
          lastClaimedAt: new Date(lastClaim.getTime() + pendingDays * 24 * 60 * 60 * 1000) 
        }
      }),
      // C. History Record
      db.profitRecord.create({
        data: {
          depositId: deposit.id,
          amount: totalClaimAmount,
          status: "COMPLETED",
          description: `Claimed ${pendingDays} day(s) profit`
        }
      })
    ]);

    return NextResponse.json({ 
      success: true, 
      amount: totalClaimAmount, 
      claimedDays: pendingDays 
    });

  } catch (error) {
    console.error("Critical Claim Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}