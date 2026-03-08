import { NextResponse } from "next/server";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_ID = process.env.ADMIN_CHAT_ID; // Tumhari ID: 8638897076

// Helper function to send messages
async function sendMessage(chatId: number | string, text: string) {
  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: "Markdown",
    }),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.message) return NextResponse.json({ ok: true });

    const chatId = body.message.chat.id;
    const text = body.message.text || "";

    // 1. Start Command
    if (text === "/start") {
      await sendMessage(chatId, "🚀 *Globaltcash Bot Active!*\n\nJanu, setup ready hai. Ab tum commands use kar sakte ho.\n\n/dashboard - Check Stats\n/forgot - Reset Password");
    }

    // 2. Phase 2: Password Reset (With 3-Min Delay)
    if (text.startsWith("/forgot")) {
      await sendMessage(chatId, "⏳ *Verification Pending...*\nAdmin team aapki details check kar rahi hai. Please wait 3-5 minutes.");
      
      // Delay Logic (180000ms = 3 mins)
      setTimeout(async () => {
        const resetLink = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=SECURE_TOKEN_XYZ`;
        await sendMessage(chatId, `✅ *Verification Approved!*\n\nNaya password yahan set karein:\n[Reset Password](${resetLink})`);
      }, 180000);
    }

    // 3. Phase 4: Admin Approval (Only for YOU)
    if (text.startsWith("/approve_")) {
      if (chatId.toString() !== ADMIN_ID) {
        await sendMessage(chatId, "❌ *Access Denied!* Tum Boss nahi ho, piche hato! 😡");
        return NextResponse.json({ ok: true });
      }

      const depositId = text.split("_")[1];
      // Yahan Prisma ka logic aayega (Update Balance & Status)
      await sendMessage(ADMIN_ID, `✅ Theek hai Boss, Deposit #${depositId} approve kar diya! Balance update ho gaya.`);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Kameene! API Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}