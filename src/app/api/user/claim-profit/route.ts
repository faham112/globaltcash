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

    const { recordId } = await req.json();
    const userId = (session.user as any).id;

    // 1. Record ko find karein aur check karein ke wo sirf PENDING ho
    const record = await db.profitRecord.findUnique({
      where: { 
        id: recordId,
        status: "PENDING" // Sirf pending wala claim ho sakta hai
      },
      include: { 
        deposit: true 
      }
    });

    // Security Check: Kya ye record user ka hi hai?
    if (!record || record.deposit.userId !== userId) {
      return NextResponse.json({ error: "Profit record not found or already claimed" }, { status: 400 });
    }

    // 2. Transaction: Balance update karein aur record ko CLAIMED mark karein
    // Taake agar user bar-bar click kare to double paise na milen
    await db.$transaction([
      db.user.update({
        where: { id: userId },
        data: { 
          balance: { increment: record.amount } 
        }
      }),
      db.profitRecord.update({
        where: { id: recordId },
        data: { 
          status: "CLAIMED" 
        }
      })
    ]);

    return NextResponse.json({ 
      success: true, 
      message: "Profit added to your wallet!",
      amount: record.amount 
    });

  } catch (error) {
    console.error("Claim Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}