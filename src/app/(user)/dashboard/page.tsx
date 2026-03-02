"use client";

import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Activity, 
  ShieldCheck, 
  ExternalLink 
} from "lucide-react";

const UserDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/user/dashboard')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setUser(data);
        }
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load dashboard');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center p-10 text-red-500">
        {error || 'User not found'}
      </div>
    );
  }

  const actualDeposits = user.deposits.filter((d: any) => d.gateway !== "Internal Balance");
  const activePlans = user.deposits.filter(
    (d: any) => d.gateway === "Internal Balance" && d.status === "ACTIVE"
  );
  const totalDeposits = actualDeposits.reduce((acc: number, curr: any) => acc + curr.amount, 0);
  const totalWithdrawals = user.withdrawals.reduce((acc: number, curr: any) => acc + curr.amount, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-200 font-sans selection:bg-emerald-500/30">
      {/* CUSTOM STYLES INJECTED VIA STYLE TAG */}
      <style>{`\n        .glass-card {\n          background: rgba(255, 255, 255, 0.03);\n          backdrop-filter: blur(12px);\n          -webkit-backdrop-filter: blur(12px);\n          border: 1px solid rgba(255, 255, 255, 0.05);\n        }\n        .neon-border {\n          border: 1px solid rgba(34, 197, 94, 0.3);\n          box-shadow: 0 0 20px rgba(34, 197, 94, 0.05);\n        }\n        .neon-text {\n          text-shadow: 0 0 10px rgba(34, 197, 94, 0.5);\n        }\n        .neon-button {\n          background: rgba(34, 197, 94, 0.1);\n          border: 1px solid rgba(34, 197, 94, 0.5);\n          color: #22c55e;\n          transition: all 0.3s ease;\n        }\n        .neon-button:hover {\n          background: #22c55e;\n          color: black;\n          box-shadow: 0 0 20px rgba(34, 197, 94, 0.4);\n        }\n        .custom-scrollbar::-webkit-scrollbar {\n          width: 4px;\n        }\n        .custom-scrollbar::-webkit-scrollbar-thumb {\n          background: #22c55e;\n          border-radius: 10px;\n        }\n        @keyframes fadeIn {\n          from { opacity: 0; transform: translateY(10px); }\n          to { opacity: 1; transform: translateY(0); }\n        }\n        .animate-fade-in {\n          animation: fadeIn 0.7s ease-out forwards;\n        }\n      `}</style>

      {/* Main Dashboard Container */}
      <div className="p-4 md:p-8 lg:p-10 max-w-[1400px] mx-auto w-full animate-fade-in custom-scrollbar">
        
        {/* 1. Header Section */}
        <div className="mb-10 flex flex-col gap-6">
          <div className="relative p-8 rounded-[2rem] glass-card neon-border overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-emerald-500 h-10 w-1.5 rounded-full shadow-[0_0_15px_#10b981]" />
                <h1 className="text-3xl font-black uppercase tracking-tighter italic text-white leading-none">
                  Account <span className="text-emerald-500 neon-text">Overview</span>
                </h1>
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] ml-5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                {user.email.split('@')[0]} • Online
              </p>
            </div>
          </div>
        </div>

        {/* 2. Primary Financial Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          
          {/* Main Balance Terminal */}
          <div className="glass-card neon-border p-6 sm:p-8 rounded-[2.5rem] relative overflow-hidden group col-span-1 md:col-span-2 min-h-[220px]">
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] group-hover:bg-emerald-500/10 transition-all duration-700" />
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] italic">Total Balance</p>
                  <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                    <Wallet size={24} />
                  </div>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Available Balance</span>
                  <h3 className="text-4xl sm:text-6xl font-black text-white tracking-tighter flex items-baseline gap-3">
                    <span className="text-emerald-500 italic opacity-80 text-xl md:text-3xl">Rs.</span>
                    {user.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h3>
                </div>
              </div>
              
              <div className="mt-8 flex flex-wrap gap-4">
                 <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/5 rounded-full border border-emerald-500/10 backdrop-blur-xl">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                    <span className="text-emerald-500 text-[9px] font-black uppercase tracking-widest">System Live</span>
                 </div>
                 <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/5 rounded-full border border-orange-500/10 backdrop-blur-xl">
                    <Activity size={12} className="text-orange-500" />
                    <span className="text-orange-500 text-[9px] font-black uppercase tracking-widest">Profit Optimized</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Global Statistics Grid */}
          <div className="grid grid-cols-2 gap-3 md:gap-4 col-span-1 md:col-span-2">
            {/* Total Inbound */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-transparent p-5 rounded-[2rem] flex flex-col justify-between group hover:border-emerald-500/40 transition-all border border-white/5">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-500 group-hover:scale-110 transition-transform">
                  <ArrowDownCircle size={22} />
                </div>
                <span className="text-emerald-500/40 text-[9px] font-black italic">IN</span>
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase mb-1">Deposits</p>
                <h3 className="text-2xl font-black text-white">Rs. {totalDeposits.toLocaleString()}</h3>
              </div>
            </div>

            {/* Total Outbound */}
            <div className="bg-gradient-to-br from-orange-500/10 to-transparent p-5 rounded-[2rem] flex flex-col justify-between group hover:border-orange-500/40 transition-all border border-white/5">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-orange-500/20 rounded-xl text-orange-500 group-hover:scale-110 transition-transform">
                  <ArrowUpCircle size={22} />
                </div>
                <span className="text-orange-500/40 text-[9px] font-black italic">OUT</span>
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase mb-1">Withdrawals</p>
                <h3 className="text-2xl font-black text-white">Rs. {totalWithdrawals.toLocaleString()}</h3>
              </div>
            </div>

            {/* Active Nodes */}
            <div className="glass-card p-5 rounded-[2rem] flex flex-col justify-between group hover:neon-border transition-all border border-white/5">
              <Activity size={22} className="text-emerald-500 mb-4" />
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase mb-1">Active Plans</p>
                <h3 className="text-2xl font-black text-white neon-text">{activePlans.length}</h3>
              </div>
            </div>

            {/* Security Status */}
            <div className="glass-card p-5 rounded-[2rem] flex flex-col justify-between group border border-white/5">
              <ShieldCheck size={22} className="text-blue-400 mb-4" />
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase mb-1">Security</p>
                <h3 className="text-2xl font-black text-white uppercase text-sm tracking-widest">Encrypted</h3>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Operational History */}
        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">
                Activity <span className="text-emerald-500 neon-text">History</span>
              </h2>
              <button className="neon-button text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest italic cursor-pointer">
                View All
              </button>
            </div>
            
            <div className="glass-card neon-border rounded-[2.5rem] p-6 md:p-8 relative overflow-hidden">
              {actualDeposits.length === 0 ? (
                <div className="text-center py-20 bg-card/50 rounded-[2rem] border-2 border-dashed border-emerald-500/10 flex flex-col items-center gap-4">
                  <Activity size={32} className="text-emerald-500/20" />
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">No Transactions</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {actualDeposits.map((dep: any) => (
                    <div key={dep.id} className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] hover:border-emerald-500/30 transition-all group cursor-pointer">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-emerald-500/40">
                           <Wallet size={20} className="text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-sm font-black uppercase text-white tracking-tight">{dep.gateway || 'Deposit'}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ID: {dep.transactionId?.substring(0, 10)}...</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-emerald-500 neon-text">+Rs. {dep.amount.toLocaleString()}</p>
                        <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase ${
                          dep.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-orange-500/20 text-orange-500'
                        }`}>{dep.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
