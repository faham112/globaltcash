"use client";

import { Gift, Clock, TrendingUp, Loader2, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

// ✅ Next.js needs a default export
export default function RewardsPage() {
  const [activePlans, setActivePlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const res = await fetch("/api/user/active-plans");
      const data = await res.json();
      if (Array.isArray(data)) setActivePlans(data);
    } catch (err) { 
      console.error("Rewards Fetch Error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleClaim = async (recordId: string) => {
    if (claimingId) return;
    setClaimingId(recordId);
    try {
      const res = await fetch("/api/user/claim-profit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordId })
      });
      if (res.ok) { 
        fetchRewards(); 
      } else {
        alert("Server error while claiming.");
      }
    } catch (err) { 
      alert("Network connection error.");
    } finally { 
      setClaimingId(null); 
    }
  };

  const allPending = activePlans.flatMap(plan => 
    (plan.profitRecords || [])
      .filter((r: any) => r.status === "PENDING")
      .map((r: any) => ({ ...r, planName: plan.planName }))
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="animate-spin text-[#E11D48]" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-4 pt-24 pb-20 font-sans">
      <div className="max-w-xl mx-auto">
        
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-[#0F172A] uppercase italic leading-none">
              My <span className="text-[#E11D48]">Rewards</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
              Daily Profit Terminals
            </p>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm text-center min-w-[60px]">
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Pending</p>
            <p className="text-sm font-black text-[#0F172A]">{allPending.length}</p>
          </div>
        </div>

        {allPending.length > 0 ? (
          <div className="space-y-3">
            {allPending.map((reward) => (
              <div 
                key={reward.id} 
                className="bg-white border border-gray-100 p-5 rounded-[2.5rem] shadow-sm flex items-center justify-between group hover:border-[#E11D48]/20 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-rose-50 rounded-[1.5rem] flex items-center justify-center text-[#E11D48] group-hover:scale-110 transition-transform">
                    <Gift size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{reward.planName}</p>
                    <p className="text-xl font-black text-[#0F172A]">Rs. {reward.amount.toLocaleString()}</p>
                  </div>
                </div>
                
                <button 
                  disabled={claimingId === reward.id}
                  onClick={() => handleClaim(reward.id)}
                  className="bg-[#0F172A] text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#E11D48] transition-all disabled:opacity-50 shadow-lg active:scale-95"
                >
                  {claimingId === reward.id ? "..." : "Claim"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3.5rem] border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock size={40} className="text-gray-200 animate-pulse" />
            </div>
            <h3 className="text-lg font-black text-[#0F172A] uppercase italic">Nothing to claim</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 leading-relaxed">
              Your next reward will be <br /> generated in <span className="text-[#E11D48]">24 hours</span>
            </p>
          </div>
        )}

        <div className="mt-10 p-6 bg-[#0F172A] rounded-[2rem] text-center">
           <TrendingUp size={20} className="mx-auto text-[#E11D48] mb-2" />
           <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
             System auto-syncs every 24 hours. <br /> Keep your plans active for maximum ROI.
           </p>
        </div>

      </div>
    </div>
  );
}