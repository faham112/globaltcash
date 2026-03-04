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

    // Hum deposits fetch kar rahe hain jo ACTIVE hain
    const activePlans = await db.deposit.findMany({
      where: {
        userId: userId,
        status: "ACTIVE",
        // Manual deposits ko exclude kar rahe hain agar aap sirf plans dikhana chahte hain
        planName: {
          not: "Manual Deposit"
        }
      },
      include: {
        // 👇 Ye sabse important part hai rewards dikhane ke liye
        profitRecords: {
          orderBy: {
            createdAt: "desc"
          }
        }
      },
      orderBy: { 
        createdAt: "desc" 
      }
    });

    return NextResponse.json(activePlans);

  } catch (error) {
    console.error("Active plans error:", error);
    return NextResponse.json(
      { error: "Error fetching plans and rewards" }, 
      { status: 500 }
    );
  }
}