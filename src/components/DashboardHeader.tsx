"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, Settings, ShieldCheck, Activity } from "lucide-react";

export default function DashboardHeader({ type = "user" }: { type?: "user" | "admin" }) {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname.includes("/plans")) return "Investment Plans";
    if (pathname.includes("/deposit")) return "Add Deposits";
    if (pathname.includes("/withdraw")) return "Withdraw Funds";
    if (pathname.includes("/affiliates") || pathname.includes("/investors")) return "My Referrals";
    if (pathname.includes("/settings")) return "Profile Settings";
    if (pathname.includes("/wallet") || pathname.includes("/railway")) return "System Status";
    return type === "admin" ? "Admin Panel" : "User Dashboard";
  };

  const getPageSubtitle = () => {
     if (pathname.includes("/plans")) return "Choose your growth strategy";
     if (pathname.includes("/deposit")) return "Inject liquidity to terminal";
     if (pathname.includes("/withdraw")) return "Extract funds to wallet";
     if (pathname.includes("/affiliates")) return "Network expansion status";
     if (pathname.includes("/settings")) return "System & Security Config";
     return "Encrypted Session • Status: Secure";
    };

  return (
    <header className="hidden lg:flex flex-col border-b border-gray-100 bg-white/80 backdrop-blur-xl sticky top-0 z-40 transition-all">
      {/* Main Header Row */}
      <div className="flex items-center justify-between px-10 py-5">
        
        {/* Left Side: Dynamic Title */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="flex items-center gap-3 mb-1">
              {/* Rose Red Indicator */}
              <div className="h-6 w-1.5 rounded-full shadow-[0_0_15px_rgba(225,29,72,0.3)] bg-[#E11D48]" />
              <h1 className="text-2xl font-black uppercase tracking-tighter italic text-[#111827] leading-none">
                {getPageTitle()}
              </h1>
            </div>
            <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.3em] ml-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              {getPageSubtitle()}
            </p>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-4">
          {/* Quick Stats (Optional but looks Pro) */}
          <div className="hidden xl:flex items-center gap-4 mr-6 border-r border-gray-100 pr-6">
            <div className="text-right">
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Global</p>
              <p className="text-[10px] font-bold text-[#111827] uppercase italic">Network</p>
            </div>
            <div className="bg-rose-50 p-2 rounded-xl text-[#E11D48]">
               <Activity size={16} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-400 hover:text-[#E11D48] hover:border-rose-100 hover:bg-rose-50 transition-all group">
              <Search size={18} className="group-hover:scale-110 transition-transform" />
            </button>
            <button className="p-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-400 hover:text-[#E11D48] hover:border-rose-100 hover:bg-rose-50 transition-all group relative">
              <Bell size={18} className="group-hover:rotate-12 transition-transform" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-[#E11D48] rounded-full border-2 border-white" />
            </button>
          </div>

          <div className="h-10 w-[1px] bg-gray-100 mx-2" />
          
          {/* Status Badge */}
          <div className="bg-[#111827] px-4 py-2 rounded-2xl flex items-center gap-3 shadow-lg shadow-black/5">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             <span className="text-[10px] font-black text-white uppercase tracking-widest">Live</span>
          </div>
        </div>
      </div>
    </header>
  );
}