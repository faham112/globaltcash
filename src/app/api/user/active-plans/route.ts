import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as any).id;

    // Ye fetch karega wo saari entries jo plan purchase se bani hain
    const activePlans = await db.deposit.findMany({
      where: {
        userId: userId,
        status: "ACTIVE" as any, // Purchase API mein humne status "ACTIVE" rakha tha
        gateway: "Internal"
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(activePlans);
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}