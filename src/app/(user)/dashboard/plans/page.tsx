"use client";

import { Zap, Trophy, Crown, ArrowRight, X, Loader2, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

const iconMap: Record<string, any> = {
  Zap: <Zap className="text-[#E11D48]" size={22} />,
  Trophy: <Trophy className="text-[#E11D48]" size={22} />,
  Crown: <Crown className="text-[#E11D48]" size={22} />,
};

export default function PlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/plans");
      const data = await res.json();
      if (Array.isArray(data)) setPlans(data);
    } catch (err) { console.error(err); }
  };

  const handlePurchase = async () => {
    if (!amount || !selectedPlan) return;
    const investAmount = parseFloat(amount);
    
    if (investAmount < selectedPlan.minAmount || investAmount > selectedPlan.maxAmount) {
      setError(`Limit: Rs. ${selectedPlan.minAmount} - ${selectedPlan.maxAmount}`);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/plans/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planName: selectedPlan.name, amount: investAmount })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => { 
          setSuccess(false); 
          setSelectedPlan(null); 
          setAmount(""); 
        }, 2000);
      } else {
        setError(data.error || "Transaction Failed");
      }
    } catch (err) { setError("Error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-4 md:p-10 pt-24 font-sans text-[#1E293B]">
      <div className="max-w-6xl mx-auto">
        
        {/* TOP BAR - Cleaned up */}
        <div className="mb-12 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h1 className="text-3xl font-black text-[#0F172A] uppercase italic leading-none">
            Investment <span className="text-[#E11D48]">Plans</span>
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Select a package to start earning daily profit</p>
        </div>

        {/* MAIN PLANS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div key={i} className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-50 flex flex-col group hover:shadow-xl transition-all">
              <div className="bg-gray-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border border-gray-100 group-hover:scale-110 transition-transform">
                {iconMap[plan.icon] || <Zap className="text-[#E11D48]" />}
              </div>
              <h3 className="text-xl font-black text-[#0F172A] uppercase mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black text-[#0F172A]">{plan.roi}%</span>
                <span className="text-[10px] font-bold text-[#E11D48] uppercase tracking-widest">/ Daily</span>
              </div>
              <div className="space-y-4 mb-8 text-[11px] font-bold text-gray-400 uppercase border-t border-gray-50 pt-6">
                <div className="flex justify-between"><span>Min Deposit</span><span className="text-[#0F172A]">Rs. {plan.minAmount.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Max Deposit</span><span className="text-[#0F172A]">Rs. {plan.maxAmount.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Duration</span><span className="text-[#E11D48] bg-rose-50 px-3 py-1 rounded-full text-[10px] font-black">{plan.duration}</span></div>
              </div>
              <button onClick={() => setSelectedPlan(plan)} className="w-full py-4 bg-[#F8FAFC] text-[#0F172A] border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#E11D48] hover:text-white transition-all flex items-center justify-center gap-2">
                Invest Now <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* PURCHASE MODAL */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-[#0F172A]/80 backdrop-blur-md">
           <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 relative animate-in zoom-in-95 shadow-2xl">
             <button onClick={() => {setSelectedPlan(null); setError(null); setAmount("");}} className="absolute top-6 right-6 text-gray-300 hover:text-red-500">
                <X size={20} />
             </button>
             <div className="text-center mb-6">
                <div className="mx-auto w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center mb-3">
                    {iconMap[selectedPlan.icon] || <Zap className="text-[#E11D48]" size={24} />}
                </div>
                <h3 className="text-xl font-black text-[#0F172A] uppercase italic leading-none">{selectedPlan.name}</h3>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2">Investment Activation</p>
             </div>
             
             {error && <div className="bg-rose-50 text-rose-600 text-[10px] font-black p-3 rounded-xl mb-4 border border-rose-100 text-center uppercase">{error}</div>}
             
             <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100 space-y-2">
                <div className="flex justify-between items-center"><span className="text-[9px] font-bold text-gray-400 uppercase">Profit</span><span className="text-xs font-black text-[#E11D48]">{selectedPlan.roi}% Daily</span></div>
                <div className="flex justify-between items-center"><span className="text-[9px] font-bold text-gray-400 uppercase">Limit</span><span className="text-[10px] font-black text-[#0F172A]">Rs.{selectedPlan.minAmount} - {selectedPlan.maxAmount}</span></div>
             </div>
             
             <div className="space-y-4">
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-gray-50 border-2 border-gray-100 focus:border-[#E11D48] rounded-xl py-4 px-5 text-lg font-black outline-none transition-all" placeholder="Enter Amount" />
                <button onClick={handlePurchase} disabled={loading || success} className={`w-full py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${success ? "bg-green-500" : "bg-[#0F172A] hover:bg-black"} text-white shadow-xl active:scale-95`}>
                   {loading ? "Processing..." : success ? "Activated Successfully!" : "Confirm Investment"}
                </button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}