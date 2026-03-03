"use client";

import React, { useState, useEffect } from 'react';
import { 
  Wallet, ArrowDownCircle, Activity, 
  Clock, Loader2, UserCircle 
} from "lucide-react";

const UserDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/user/dashboard');
        const data = await res.json();
        if (data.error) setError(data.error);
        else setUser(data);
      } catch (err) {
        setError('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#F3F4F6]">
      <Loader2 className="animate-spin text-[#E11D48]" size={40} />
    </div>
  );

  if (error || !user) return (
    <div className="text-center p-10 text-[#E11D48] font-bold bg-[#F3F4F6] min-h-screen flex items-center justify-center">
      {error || 'User not found'}
    </div>
  );

  const rawName = user?.name || (user?.email ? user.email.split('@')[0] : "User");
  const userDisplayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

  const depositsArray = user?.deposits || [];
  const withdrawalsArray = user?.withdrawals || [];

  // --- FIXED LOGIC: TOTAL INVESTED ---
  // Jo bhi deposit APPROVED hai, wo "Total Invested" mein count hoga
  const actualDeposits = depositsArray.filter((d: any) => d.status === "APPROVED");
  
  // Plans check karne ke liye (Jin ka status ACTIVE ya APPROVED ho aur plan name ho)
  const activePlans = depositsArray.filter((d: any) => 
    d.planName && d.planName !== "Manual Deposit" && (d.status === "ACTIVE" || d.status === "APPROVED")
  );
  
  const totalDepositsValue = actualDeposits.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);
  const totalWithdrawalsValue = withdrawalsArray.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#1F2937] font-sans">
      <div className="p-4 md:p-8 lg:p-10 pt-24 lg:pt-10 max-w-[1400px] mx-auto w-full">
        
        {/* HEADER */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-[#E11D48] shadow-lg">
               <UserCircle size={40} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[#E11D48] text-[10px] font-black uppercase tracking-[0.4em] mb-1">Verified Account</p>
              <h1 className="text-4xl md:text-5xl font-black uppercase italic text-[#111827]">
                Welcome, <span className="text-[#E11D48]">{userDisplayName}</span>
              </h1>
            </div>
          </div>
          <div className="flex gap-3">
             <button className="bg-white px-6 py-4 rounded-2xl border border-[#E5E7EB] text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all">Support</button>
             <button className="bg-[#E11D48] text-white px-8 py-4 rounded-2xl shadow-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#BE123C] transition-all">Withdraw Now</button>
          </div>
        </div>

        {/* MAIN CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-[#111827] p-8 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="px-4 py-2 bg-[#E11D48] rounded-xl text-white text-[10px] font-black uppercase">Available Balance</div>
                <Wallet className="text-white/20" size={40} />
              </div>
              <h3 className="text-6xl md:text-8xl font-black text-white italic">
                <span className="text-[#E11D48] text-2xl md:text-4xl mr-4 not-italic font-bold">Rs.</span>
                {(user?.balance || 0).toLocaleString()}
              </h3>
              <p className="mt-10 text-white/40 text-[10px] font-black uppercase tracking-widest border-t border-white/5 pt-8 italic">Profit Updates Automatically</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
             <div className="bg-white p-8 rounded-[3rem] border border-[#E5E7EB] shadow-sm">
                <p className="text-[#9CA3AF] text-[10px] font-black uppercase tracking-widest mb-2">Total Invested</p>
                <h4 className="text-4xl font-black text-[#111827]">Rs. {totalDepositsValue.toLocaleString()}</h4>
             </div>
             <div className="bg-white p-8 rounded-[3rem] border border-[#E5E7EB] shadow-sm">
                <p className="text-[#9CA3AF] text-[10px] font-black uppercase tracking-widest mb-2">Total Withdrawn</p>
                <h4 className="text-4xl font-black text-[#111827]">Rs. {totalWithdrawalsValue.toLocaleString()}</h4>
             </div>
          </div>
        </div>

        {/* RECENT HISTORY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="bg-[#111827] p-10 rounded-[3rem] text-white">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-[#E11D48] rounded-2xl"><Activity size={24} /></div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">My <span className="text-[#E11D48]">Plans</span></h3>
              </div>
              <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center">
                 <h4 className="text-6xl font-black text-white italic">{activePlans.length}</h4>
                 <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-2">Active Plans</p>
              </div>
           </div>

           <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-[3.5rem] p-8 md:p-12">
              <h2 className="text-2xl font-black uppercase italic text-[#111827] mb-8">Recent <span className="text-[#E11D48]">History</span></h2>
              {actualDeposits.length === 0 ? (
                <div className="text-center py-20 bg-[#F9FAFB] rounded-[2rem] border-2 border-dashed border-[#E5E7EB]">
                  <p className="text-[#9CA3AF] text-[10px] font-black uppercase tracking-widest">No Approved Deposits Yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {actualDeposits.map((dep: any) => (
                    <div key={dep.id} className="flex items-center justify-between p-6 bg-[#F9FAFB] rounded-2xl border border-[#F3F4F6]">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#E11D48] border shadow-sm"><ArrowDownCircle size={20} /></div>
                        <div>
                          <p className="text-sm font-black uppercase text-[#111827]">{dep.gateway || 'Deposit'}</p>
                          <p className="text-[10px] text-[#9CA3AF] font-bold uppercase">{new Date(dep.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-[#111827]">Rs. {(dep.amount || 0).toLocaleString()}</p>
                        <span className="text-[8px] font-black px-3 py-1 rounded-full uppercase bg-emerald-100 text-emerald-700">{dep.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;