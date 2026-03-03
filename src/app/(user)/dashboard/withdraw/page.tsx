"use client";
import React, { useEffect, useState } from "react";
import { ArrowUpLeft, ShieldCheck, Coins, Loader2, Wallet, Info, Landmark, User, Hash } from "lucide-react";
import { useTonAddress } from "@tonconnect/ui-react";

export default function WithdrawPage() {
  const tonAddress = useTonAddress();
  const [method, setMethod] = useState("local"); // 'local' or 'crypto'
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState(""); 
  const [accountName, setAccountName] = useState(""); 
  const [provider, setProvider] = useState("JazzCash"); 
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      setUserData(data);
      if (data.walletAddress && !address) setAddress(data.walletAddress);
    } catch (err) {
      console.error("Failed to fetch user data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || !address) return alert("Please fill all details");
    if (method === "local" && !accountName) return alert("Please enter Account Holder Name");
    if (parseFloat(amount) > (userData?.balance || 0)) return alert("Insufficient balance");
    
    setExecuting(true);
    try {
      const res = await fetch("/api/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: parseFloat(amount), 
          method,
          provider: method === "local" ? provider : "Crypto",
          accountName: method === "local" ? accountName : "Crypto Wallet",
          address 
        }),
      });
      if (res.ok) {
        alert("Withdrawal request submitted.");
        setAmount(""); setAddress(""); setAccountName("");
        fetchUserData();
      }
    } catch (err) { console.error(err); } finally { setExecuting(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#E11D48]" size={40} />
      </div>
    );
  }

  return (
    <div className="bg-[#F3F4F6] min-h-screen p-5 md:p-10 pt-24 lg:pt-10 font-sans text-[#1F2937]">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header with Switch */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[#111827]">
              Payout <span className="text-[#E11D48]">Request</span>
            </h1>
            <p className="text-[#6B7280] text-sm font-medium mt-1">
              Currently withdrawing via <span className="text-[#E11D48] font-bold uppercase italic">{method}</span>
            </p>
          </div>
          
          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-[#E5E7EB]">
            <button 
              onClick={() => setMethod("local")}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${method === "local" ? "bg-[#E11D48] text-white shadow-md shadow-rose-200" : "text-[#9CA3AF]"}`}
            >
              Local Transfer
            </button>
            <button 
              onClick={() => setMethod("crypto")}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${method === "crypto" ? "bg-[#E11D48] text-white shadow-md shadow-rose-200" : "text-[#9CA3AF]"}`}
            >
              USDT
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white relative">
              
              {/* Balance Card */}
              <div className="flex items-center gap-5 mb-12 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                <div className="bg-white p-4 rounded-2xl text-[#E11D48] shadow-sm">
                  <Coins size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">Balance Available</p>
                  <h3 className="text-3xl font-black text-[#111827]">Rs. {userData?.balance?.toLocaleString() || "0.00"}</h3>
                </div>
              </div>

              <div className="space-y-8">
                
                {/* Condition: Show Name and Provider ONLY if Method is LOCAL */}
                {method === "local" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-[#9CA3AF] tracking-widest px-2">Provider</label>
                      <select 
                        value={provider}
                        onChange={(e) => setProvider(e.target.value)}
                        className="w-full bg-[#F9FAFB] border-2 border-transparent focus:border-[#E11D48] rounded-[1.2rem] py-4 px-6 font-bold text-[#111827] outline-none transition-all"
                      >
                        <option>JazzCash</option>
                        <option>EasyPaisa</option>
                        <option>Bank Transfer</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-[#9CA3AF] tracking-widest px-2">Account Holder Name</label>
                      <div className="relative">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={18} />
                        <input 
                          type="text" 
                          value={accountName}
                          onChange={(e) => setAccountName(e.target.value)}
                          placeholder="Beneficiary Name"
                          className="w-full bg-[#F9FAFB] border-2 border-transparent focus:border-[#E11D48] rounded-[1.2rem] py-4 pl-12 pr-6 font-bold text-[#111827] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Always Show: Address (Changes Label based on method) */}
                <div className="space-y-3 animate-in fade-in duration-500">
                  <label className="text-[10px] font-black uppercase text-[#9CA3AF] tracking-widest px-2">
                    {method === "local" ? "Account / Mobile Number" : "USDT / TON Wallet Address"}
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={18} />
                    <input 
                      type="text" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={method === "local" ? "03XXXXXXXXX" : "0x... or TON Hash"}
                      className="w-full bg-[#F9FAFB] border-2 border-transparent focus:border-[#E11D48] rounded-[1.2rem] py-5 pl-12 pr-6 font-mono text-sm text-[#4B5563] outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Always Show: Amount */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-2">
                    <label className="text-[10px] font-black uppercase text-[#9CA3AF] tracking-widest">Withdrawal Amount (Rs.)</label>
                    <button 
                      onClick={() => setAmount(userData?.balance.toString())} 
                      className="text-[10px] font-black text-[#E11D48] hover:underline"
                    >
                      Use Max
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-[#111827] text-xl">Rs.</span>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-[#F9FAFB] border-2 border-transparent focus:border-[#E11D48] focus:bg-white rounded-[2rem] py-7 pl-16 pr-8 text-2xl font-black text-[#111827] transition-all outline-none"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleWithdraw}
                  disabled={executing}
                  className="w-full bg-[#111827] hover:bg-black disabled:opacity-50 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[11px] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] mt-4"
                >
                  {executing ? <Loader2 className="animate-spin" size={20} /> : <><ArrowUpLeft size={20} strokeWidth={3} /> Request Payout</>}
                </button>
              </div>
            </div>
          </div>

          {/* Rules Sidebar */}
          <div className="space-y-6">
            <div className="bg-[#111827] p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
              <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12"><ShieldCheck size={160} /></div>
              <div className="bg-[#E11D48] w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-rose-900/20">
                <ShieldCheck className="text-white" size={24} />
              </div>
              <h4 className="text-xl font-black uppercase italic mb-8 tracking-tighter">Security <br/> <span className="text-[#E11D48]">Guidelines</span></h4>
              <ul className="space-y-6 relative z-10 text-[11px] font-bold text-white/60 uppercase tracking-widest leading-relaxed">
                <li className="flex gap-4"><div className="w-1.5 h-1.5 bg-[#E11D48] rounded-full mt-1.5 shrink-0" /> Local: 2 - 24 Hours</li>
                <li className="flex gap-4"><div className="w-1.5 h-1.5 bg-[#E11D48] rounded-full mt-1.5 shrink-0" /> Crypto: 15 - 60 Minutes</li>
                <li className="flex gap-4"><div className="w-1.5 h-1.5 bg-[#E11D48] rounded-full mt-1.5 shrink-0" /> Fee: 2.5% Maintenance</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}