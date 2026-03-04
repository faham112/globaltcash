"use client";

import { Gift, Clock, TrendingUp, Loader2, CheckCircle2, Timer as TimerIcon, Trophy, Users, Car } from "lucide-react";
import { useState, useEffect } from "react";

export default function RewardsPage() {
  const [activePlans, setActivePlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    fetchRewards();
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(interval);
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

  const getTimerDisplay = (reward: any) => {
    const startTime = reward.scheduledAt 
      ? new Date(reward.scheduledAt).getTime() 
      : new Date(reward.createdAt).getTime() + (24 * 60 * 60 * 1000);
    
    const diff = startTime - currentTime;
    if (diff <= 0) return null; 

    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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
      <div className="max-w-2xl mx-auto">
        
        {/* COMPACT MEGA REWARD SECTION - 60/40 Split */}
        <div className="mb-10 relative overflow-hidden bg-[#0F172A] rounded-[2.5rem] shadow-2xl border border-gray-800 flex flex-col md:flex-row items-stretch group hover:border-[#E11D48]/30 transition-all duration-500">
          
          {/* IMAGE SECTION - 60% on Desktop */}
          <div className="w-full md:w-[60%] h-52 md:h-auto overflow-hidden relative">
            <img 
              src="https://www.cnet.com/a/img/resize/4f704850f47fbf8cdec101401c05aa4fd2c813c5/hub/2021/04/22/7b1b5388-899a-4d4e-9f39-22d5460d32f5/2022-honda-civic-sedan-ogi1.jpg?auto=webp&fit=crop&height=675&width=1200" 
              alt="Honda Civic Reward" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0F172A]/40 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="bg-[#E11D48] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg flex items-center gap-1.5">
                <Trophy size={10} /> Grand Prize
              </span>
            </div>
          </div>
          
          {/* TEXT SECTION - 40% on Desktop */}
          <div className="w-full md:w-[40%] p-6 flex flex-col justify-center bg-[#0F172A]">
            <h2 className="text-2xl font-black text-white uppercase italic leading-none mb-1 tracking-tighter">
              Honda Civic <span className="text-[#E11D48]">RS</span>
            </h2>
            <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest leading-tight mb-4">
              Invite 50 partners <br /> <span className="text-white text-[8px] opacity-60">(100K Elite Plan)</span>
            </p>
            
            <div className="space-y-2">
              <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl flex items-center gap-2">
                <Users size={12} className="text-[#E11D48]" />
                <span className="text-[10px] font-black text-white">50 Partners</span>
              </div>
              <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl flex items-center gap-2">
                <Car size={12} className="text-[#E11D48]" />
                <span className="text-[10px] font-black text-white">100K Plan</span>
              </div>
            </div>
          </div>
        </div>

        {/* REWARDS HEADER */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black text-[#0F172A] uppercase italic leading-none">
              Daily <span className="text-[#E11D48]">Earnings</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
              Stack Terminal
            </p>
          </div>
          <div className="bg-[#0F172A] px-5 py-3 rounded-2xl shadow-xl text-center">
            <p className="text-[8px] font-black text-white/40 uppercase tracking-tighter">Active</p>
            <p className="text-lg font-black text-white italic">{allPending.length}</p>
          </div>
        </div>

        {/* PENDING REWARDS LIST */}
        {allPending.length > 0 ? (
          <div className="space-y-4">
            {allPending.map((reward) => {
              const timerStr = getTimerDisplay(reward);
              const isClaimable = !timerStr;

              return (
                <div 
                  key={reward.id} 
                  className={`bg-white border-2 transition-all duration-500 ${isClaimable ? 'border-[#E11D48]/20 bg-rose-50/10' : 'border-gray-50'} p-6 rounded-[2rem] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4`}
                >
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isClaimable ? 'bg-[#E11D48] text-white shadow-lg rotate-3' : 'bg-gray-100 text-gray-400'}`}>
                      {isClaimable ? <Gift size={24} /> : <Clock size={24} />}
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{reward.planName}</p>
                      <p className="text-xl font-black text-[#0F172A]">Rs. {reward.amount.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-auto">
                    {isClaimable ? (
                      <button 
                        disabled={claimingId === reward.id}
                        onClick={() => handleClaim(reward.id)}
                        className="w-full md:w-auto bg-[#0F172A] text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#E11D48] transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        {claimingId === reward.id ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle2 size={14} />}
                        {claimingId === reward.id ? "WAIT" : "CLAIM"}
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 text-[#E11D48] bg-rose-50/50 px-4 py-2 rounded-xl border border-rose-100/50">
                        <TimerIcon size={14} className="animate-pulse" />
                        <span className="font-black text-sm tabular-nums tracking-widest">{timerStr}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 shadow-inner">
            <Clock size={40} className="text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-black text-[#0F172A] uppercase italic">Terminal Idle</h3>
          </div>
        )}

      </div>
    </div>
  );
}