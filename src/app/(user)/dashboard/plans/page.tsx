"use client";

import { Zap, Trophy, Crown, ArrowRight, X, Loader2, CheckCircle2, Cpu, Activity, Eye, Calendar, Percent, Clock, LayoutGrid, TrendingUp } from "lucide-react";
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
  const [activeTerminals, setActiveTerminals] = useState<any[]>([]);
  const [showMyPlans, setShowMyPlans] = useState(false);

  useEffect(() => {
    fetchPlans();
    fetchActivePlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/plans");
      const data = await res.json();
      if (Array.isArray(data)) setPlans(data);
    } catch (err) { console.error(err); }
  };

  const fetchActivePlans = async () => {
    try {
      const res = await fetch("/api/user/active-plans");
      const data = await res.json();
      if (Array.isArray(data)) setActiveTerminals(data);
    } catch (err) { console.error(err); }
  };

  const handlePurchase = async () => {
    if (!amount) return;
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
        fetchActivePlans();
        setTimeout(() => { setSuccess(false); setSelectedPlan(null); setAmount(""); setError(null); }, 2000);
      } else {
        const data = await res.json();
        setError(data.error || "Low Balance");
      }
    } catch (err) { setError("Error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-4 md:p-10 pt-24 font-sans text-[#1E293B]">
      <div className="max-w-6xl mx-auto">
        
        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-black text-[#0F172A] uppercase italic leading-none">
              Investment <span className="text-[#E11D48]">Plans</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Select a package to start</p>
          </div>
          
          <button 
            onClick={() => setShowMyPlans(true)}
            className="flex items-center gap-3 bg-[#0F172A] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95"
          >
            <Eye size={18} className="text-[#E11D48]" /> My Active Plans ({activeTerminals.length})
          </button>
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
                <div className="flex justify-between"><span>Duration</span><span className="text-[#E11D48] bg-rose-50 px-3 py-1 rounded-full text-[10px]">{plan.duration}</span></div>
              </div>
              <button onClick={() => setSelectedPlan(plan)} className="w-full py-4 bg-[#F8FAFC] text-[#0F172A] border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#E11D48] hover:text-white transition-all flex items-center justify-center gap-2">
                Invest Now <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* --- ULTRA-SLIM SIDE DRAWER --- */}
      {showMyPlans && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm" onClick={() => setShowMyPlans(false)} />
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
               <div>
                  <h2 className="text-lg font-black text-[#0F172A] uppercase italic leading-none">Portfolios</h2>
                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Live Tracking</p>
               </div>
               <button onClick={() => setShowMyPlans(false)} className="p-1.5 bg-gray-50 rounded-full hover:bg-gray-100"><X size={16}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#F8FAFC] custom-scrollbar">
              {activeTerminals.length > 0 ? activeTerminals.map((node: any) => {
                const displayRoi = node.roi || node.plan?.roi || "0";
                const displayDuration = node.duration || node.plan?.duration || "0";
                
                return (
                  <div key={node.id} className="bg-white border border-gray-100 p-3 rounded-2xl shadow-sm hover:border-[#E11D48]/30 transition-all relative overflow-hidden group">
                    {/* Compact Top Section */}
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-rose-50 rounded-lg flex items-center justify-center text-[#E11D48]"><TrendingUp size={14}/></div>
                            <h4 className="text-[10px] font-black text-[#0F172A] uppercase truncate max-w-[80px]">{node.planName}</h4>
                        </div>
                        <div className="text-right">
                           <p className="text-xs font-black text-[#0F172A]">Rs.{node.amount.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Stats Grid (Ultra Slim) */}
                    <div className="grid grid-cols-3 gap-0.5 bg-gray-50 rounded-xl p-1.5 border border-gray-100/50">
                        <div className="text-center">
                            <p className="text-[6px] font-bold text-gray-400 uppercase">ROI</p>
                            <p className="text-[10px] font-black text-[#E11D48]">{displayRoi}%</p>
                        </div>
                        <div className="text-center border-x border-gray-200">
                            <p className="text-[6px] font-bold text-gray-400 uppercase">Period</p>
                            <p className="text-[10px] font-black text-[#0F172A]">{displayDuration}d</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[6px] font-bold text-gray-400 uppercase">Started</p>
                            <p className="text-[9px] font-black text-gray-500 uppercase">{new Date(node.createdAt).toLocaleDateString('en-GB', {day: 'numeric', month: 'short'})}</p>
                        </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center py-20 opacity-20">
                  <LayoutGrid size={32} className="mx-auto mb-2" />
                  <p className="text-[8px] font-black uppercase">Empty</p>
                </div>
              )}
            </div>
            
            <div className="p-3 bg-white border-t border-gray-100 text-center">
                <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">Syncing with blockchain...</p>
            </div>
          </div>
        </div>
      )}

      {/* PURCHASE MODAL */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-[#0F172A]/80 backdrop-blur-md">
           <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 relative animate-in zoom-in-95">
             <button onClick={() => {setSelectedPlan(null); setError(null); setAmount("");}} className="absolute top-6 right-6 text-gray-300 hover:text-red-500">
                <X size={20} />
             </button>
             <div className="text-center mb-6">
                <div className="mx-auto w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center mb-3">
                    {iconMap[selectedPlan.icon] || <Zap className="text-[#E11D48]" size={24} />}
                </div>
                <h3 className="text-xl font-black text-[#0F172A] uppercase italic">{selectedPlan.name}</h3>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Activation</p>
             </div>
             <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100 space-y-2">
                <div className="flex justify-between items-center"><span className="text-[9px] font-bold text-gray-400 uppercase">Profit</span><span className="text-xs font-black text-[#E11D48]">{selectedPlan.roi}% Daily</span></div>
                <div className="flex justify-between items-center"><span className="text-[9px] font-bold text-gray-400 uppercase">Duration</span><span className="text-xs font-black text-[#0F172A]">{selectedPlan.duration}</span></div>
                <div className="flex justify-between items-center"><span className="text-[9px] font-bold text-gray-400 uppercase">Range</span><span className="text-[10px] font-black text-[#0F172A]">Rs.{selectedPlan.minAmount} - {selectedPlan.maxAmount}</span></div>
             </div>
             <div className="space-y-4">
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-gray-50 border-2 border-gray-100 focus:border-[#E11D48] rounded-xl py-4 px-5 text-lg font-black outline-none transition-all" placeholder="0.00" />
                <button onClick={handlePurchase} disabled={loading || success} className={`w-full py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all ${success ? "bg-green-500" : "bg-[#E11D48]"} text-white shadow-lg active:scale-95`}>
                   {loading ? "Processing..." : success ? "Activated!" : "Invest Now"}
                </button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}