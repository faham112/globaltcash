"use client";

import { Zap, Trophy, Crown, ArrowRight, X, Loader2, CheckCircle2, History, Clock, AlertCircle, Coins } from "lucide-react";
import { useState, useEffect } from "react";

const iconMap: Record<string, any> = {
  Zap: <Zap className="text-[#E11D48]" size={22} />,
  Trophy: <Trophy className="text-[#E11D48]" size={22} />,
  Crown: <Crown className="text-[#E11D48]" size={22} />,
};

export default function PlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [userPlans, setUserPlans] = useState<any[]>([]); 
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
    fetchUserDashboardData();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/plans");
      const data = await res.json();
      if (Array.isArray(data)) setPlans(data);
    } catch (err) { console.error("Fetch Plans Error:", err); }
  };

  const fetchUserDashboardData = async () => {
    try {
      const res = await fetch('/api/user/dashboard', { cache: "no-store" });
      const data = await res.json();
      if (!data.error && data.activePlans) {
        setUserPlans(data.activePlans);
      }
    } catch (err) { console.error("Sync Error:", err); }
  };

  const hasPendingProfit = userPlans.some(up => {
    const lastClaim = up.lastClaimedAt ? new Date(up.lastClaimedAt) : new Date(up.createdAt);
    const diffInMs = new Date().getTime() - lastClaim.getTime();
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24)) >= 1;
  });

  const handleClaim = async (depositId: string) => {
    setClaimingId(depositId);
    try {
      const res = await fetch("/api/invest/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ depositId })
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Success! Profit claimed.`);
        fetchUserDashboardData(); 
      } else {
        alert(data.error || "Claim failed");
      }
    } catch (err) { alert("Connection Error"); }
    finally { setClaimingId(null); }
  };

  const handlePurchase = async () => {
    if (!amount || !selectedPlan) return;
    const investAmount = parseFloat(amount);
    if (investAmount < selectedPlan.minAmount || investAmount > selectedPlan.maxAmount) {
      setError(`Limit: Rs. ${selectedPlan.minAmount} - ${selectedPlan.maxAmount}`);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/plans/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planName: selectedPlan.name, amount: investAmount })
      });
      if (res.ok) {
        setSuccess(true);
        fetchUserDashboardData();
        setTimeout(() => { setSuccess(false); setSelectedPlan(null); setAmount(""); }, 2000);
      } else {
        const data = await res.json();
        setError(data.error || "Transaction Failed");
      }
    } catch (err) { setError("Error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-4 md:p-10 pt-24 font-sans text-[#1E293B]">
      
      <div className="max-w-6xl mx-auto">
        {/* TOP BAR - Optimized for Desktop Clicks */}
        <div className="mb-12 bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-black text-[#0F172A] uppercase italic leading-none">
              Investment <span className="text-[#E11D48]">Plans</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Grow your wealth daily</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-20">
            {/* Global Claim Button */}
            {hasPendingProfit && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDrawerOpen(true);
                }}
                className="cursor-pointer flex items-center gap-2 bg-[#E11D48] text-white px-6 py-4 rounded-[1.8rem] hover:bg-[#BE123C] transition-all shadow-lg shadow-rose-200 animate-pulse active:scale-95"
              >
                <Coins size={18} />
                <span className="text-[10px] font-black uppercase tracking-tighter">Claim Your Profit</span>
              </button>
            )}

            {/* My Portfolio Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsDrawerOpen(true);
              }}
              className="cursor-pointer flex items-center gap-4 bg-gray-50 hover:bg-white hover:shadow-xl hover:border-gray-200 border border-transparent transition-all px-6 py-4 rounded-[1.8rem] group relative active:scale-95"
            >
              <div className="flex flex-col items-end pointer-events-none">
                <span className="text-[10px] font-black text-[#0F172A] uppercase">Active Plans</span>
                <span className="text-[9px] font-bold text-red-500 uppercase">Portfolio</span>
              </div>
              <div className="h-12 w-12 bg-[#0F172A] text-white rounded-2xl flex items-center justify-center text-lg font-black transition-all group-hover:bg-[#E11D48]">
                {userPlans.length}
              </div>
            </button>
          </div>
        </div>

        {/* PLANS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-0">
          {plans.map((plan, i) => (
            <div key={i} className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-50 flex flex-col group hover:shadow-xl transition-all">
              <div className="bg-gray-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border border-gray-100">
                {iconMap[plan.icon] || <Zap className="text-[#E11D48]" />}
              </div>
              <h3 className="text-xl font-black text-[#0F172A] uppercase mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-8 font-black">
                <span className="text-5xl text-[#0F172A]">{plan.roi}%</span>
                <span className="text-[10px] text-[#E11D48] uppercase tracking-widest">/ Daily</span>
              </div>
              <button onClick={() => setSelectedPlan(plan)} className="w-full py-4 bg-[#F8FAFC] text-[#0F172A] border border-gray-100 rounded-2xl font-black text-[10px] uppercase hover:bg-[#E11D48] hover:text-white transition-all">
                Invest Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* DRAWER SECTION */}
      <div className={`fixed inset-0 z-[500] transition-opacity duration-300 ${isDrawerOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <div className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-500 flex flex-col ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="p-8 border-b flex justify-between items-center">
              <h2 className="text-xl font-black text-[#0F172A] uppercase italic">My <span className="text-[#E11D48]">Portfolio</span></h2>
              <button onClick={() => setIsDrawerOpen(false)} className="p-3 bg-gray-50 rounded-xl hover:bg-rose-50 hover:text-red-500 transition-all"><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {userPlans.map((up, idx) => {
                const lastClaim = up.lastClaimedAt ? new Date(up.lastClaimedAt) : new Date(up.createdAt);
                const pendingDays = Math.floor((new Date().getTime() - lastClaim.getTime()) / (1000 * 60 * 60 * 24));
                const isEligible = pendingDays >= 1;
                const nextClaimAt = new Date(lastClaim.getTime() + 24 * 60 * 60 * 1000);

                return (
                  <div key={idx} className="bg-gray-50 border border-gray-100 rounded-[2rem] p-6 hover:border-[#E11D48]/30 transition-all">
                      <div className="flex justify-between items-center mb-4">
                          <span className="text-[10px] font-black text-[#E11D48] uppercase bg-white px-3 py-1 rounded-lg border border-gray-100">{up.roi}% ROI</span>
                          {isEligible && <span className="animate-bounce text-[9px] font-black text-white bg-red-500 px-3 py-1 rounded-full uppercase flex items-center gap-1 shadow-lg shadow-red-200"><AlertCircle size={10} /> {pendingDays} Pending</span>}
                      </div>
                      <h4 className="text-lg font-black text-[#0F172A] uppercase">{up.planName}</h4>
                      <div className="mt-4 mb-4">
                        {isEligible ? (
                          <button onClick={() => handleClaim(up.id)} disabled={claimingId === up.id} className="w-full py-4 bg-[#0F172A] hover:bg-[#E11D48] text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                            {claimingId === up.id ? <Loader2 className="animate-spin" size={14}/> : <Zap size={14} fill="currentColor"/>}
                            Claim {pendingDays} Day(s) Profit
                          </button>
                        ) : (
                          <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-100 rounded-xl">
                            <span className="text-[9px] font-bold text-gray-400 uppercase flex items-center gap-1"><Clock size={12} className="text-[#E11D48]"/> Next Release:</span>
                            <span className="text-[10px] font-black text-[#0F172A]">{nextClaimAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dashed border-gray-200 text-[10px]">
                          <div><p className="text-gray-400 uppercase font-black">Invested</p><p className="text-sm font-black text-[#0F172A]">Rs. {up.amount}</p></div>
                          <div className="text-right"><p className="text-gray-400 uppercase font-black">Daily</p><p className="text-sm font-black text-green-600">Rs. {(up.amount * up.roi / 100).toFixed(0)}</p></div>
                      </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      {/* PURCHASE MODAL */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-[#0F172A]/80 backdrop-blur-md">
            <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 relative animate-in zoom-in-95">
              <button onClick={() => {setSelectedPlan(null); setError(null); setAmount("");}} className="absolute top-6 right-6 text-gray-300 hover:text-red-500"><X size={20} /></button>
              <h3 className="text-xl font-black text-[#0F172A] uppercase text-center mb-6">{selectedPlan.name}</h3>
              {error && <div className="bg-rose-50 text-rose-600 text-[10px] font-black p-3 rounded-xl mb-4 border border-rose-100 text-center uppercase">{error}</div>}
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-gray-50 border-2 border-gray-100 focus:border-[#E11D48] rounded-xl py-4 px-5 text-lg font-black outline-none mb-4" placeholder="0.00" />
              <button onClick={handlePurchase} disabled={loading || success} className={`w-full py-5 rounded-2xl font-black uppercase text-xs tracking-widest text-white shadow-xl ${success ? "bg-green-500" : "bg-[#0F172A] hover:bg-black"}`}>
                  {loading ? "Processing..." : success ? "Activated!" : "Confirm Investment"}
              </button>
            </div>
        </div>
      )}
    </div>
  );
}