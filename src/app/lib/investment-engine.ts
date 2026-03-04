import { db } from "@/lib/db";

export async function distributeDailyProfits() {
  console.log("[ENGINE] Starting daily profit generation...");

  try {
    // 1. Sirf ACTIVE deposits nikaalein
    const activeDeposits = await db.deposit.findMany({
      where: { status: "ACTIVE" },
    });

    // 2. Plans ka data map kar lein ROI check karne ke liye
    const plans = await db.plan.findMany();
    const planMap = new Map(plans.map(p => [p.name, p]));

    for (const deposit of activeDeposits) {
      const plan = planMap.get(deposit.planName || "");
      
      if (!plan) {
        console.warn(`[ENGINE] Plan ${deposit.planName} not found for deposit ${deposit.id}`);
        continue;
      }

      // 3. Daily Profit Calculate karein (e.g., 30000 * 2.5 / 100)
      const dailyProfit = deposit.amount * (plan.roi / 100);

      // 4. Naya Profit Record create karein (Jo user ko button ki surat mein dikhega)
      await db.profitRecord.create({
        data: {
          depositId: deposit.id,
          amount: dailyProfit,
          status: "PENDING"
        }
      });

      console.log(`[ENGINE] ✅ Generated Rs.${dailyProfit} pending claim for User: ${deposit.userId}`);
    }

    console.log("[ENGINE] Profit generation completed successfully.");
  } catch (error) {
    console.error("[ENGINE] Critical Error:", error);
  }
}