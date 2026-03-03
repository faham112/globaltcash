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
      include: {
        deposits: {
          orderBy: { createdAt: 'desc' }
        },
        withdrawals: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
      name: user.name,
      email: user.email,
      balance: user.balance || 0,
      deposits: user.deposits || [],
      withdrawals: user.withdrawals || []
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}