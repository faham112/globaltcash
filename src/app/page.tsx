"use client";
import React from "react";
import { 
  ArrowRight, ShieldCheck, Zap, Coins, BarChart3, Users, 
  ChevronRight, Globe, Wallet2, CheckCircle2, HelpCircle, 
  MessageSquare, TrendingUp, Loader2, Clock, Star
} from "lucide-react";

// Mocking Next.js tools
const Link = ({ href, children, className }: any) => (
  <a href={href} className={className}>{children}</a>
);

// --- 6 Constant Plans Data ---
const CONSTANT_PLANS = [
  { name: "Basic", profit: "1.5%", range: "Rs. 5000 - 10000", contract: "1 Month", popular: false },
  { name: "Basic Pro", profit: "2.5%", range: "Rs. 11000 - 20000", contract: "2 Months", popular: false },
  { name: "Supreme Basic", profit: "3.5%", range: "Rs. 25000 - 50000", contract: "4 Months", popular: false },
  { name: "Supreme Edge", profit: "5%", range: "Rs. 55000 - 100000", contract: "6 Months", popular: true },
  { name: "Supreme Pro", profit: "7.5%", range: "Rs. 110000 - 500000", contract: "12 Months", popular: false },
  { name: "Supreme", profit: "10%", range: "Rs. 550000 - 2000000", contract: "15 Months", popular: false },
];

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-rose-100 transition-all duration-500 group">
      <div className="mb-4 p-4 bg-rose-50 rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
      <p className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter italic">{value}</p>
      <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.3em] mt-1">{label}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="bg-[#F9FAFB] text-gray-800 min-h-screen selection:bg-[#E11D48]/10 font-sans overflow-x-hidden">
      
      {/* 1. Hero Section */}
      <header className="pt-24 pb-20 px-4 md:pt-36 md:pb-40 text-center max-w-7xl mx-auto relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-rose-500/5 blur-[120px] -z-10 rounded-full" />
        
        <div className="inline-flex items-center gap-3 bg-white border border-gray-200 text-[#E11D48] px-6 py-2.5 rounded-full text-[10px] font-black mb-10 tracking-[0.5em] uppercase shadow-sm">
          <div className="w-2 h-2 bg-[#E11D48] rounded-full shadow-[0_0_10px_#E11D48] animate-pulse" />
          SYSTEM LIVE • VERIFIED QUANTUM NODES 2026
        </div>

        <h1 className="text-6xl sm:text-8xl md:text-[10rem] font-black mb-10 leading-[0.8] tracking-tighter text-gray-900 uppercase italic">
          Capital <br className="hidden md:block" />
          <span className="text-[#E11D48] drop-shadow-sm">Evolution.</span>
        </h1>
        
        <p className="text-gray-500 text-lg md:text-2xl mb-16 max-w-3xl mx-auto leading-snug px-4 font-bold uppercase tracking-tight italic">
          High-performance liquidity protocols wrapped in a <span className="text-gray-900 border-b-4 border-[#E11D48]/20">secure neural network</span>. Experience the buttery smooth growth.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
          <Link href="/login" className="w-full sm:w-auto bg-[#E11D48] px-20 py-7 rounded-3xl font-black text-xl uppercase tracking-[0.2em] shadow-2xl shadow-rose-200 hover:shadow-rose-300 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 text-white group">
            Get Started <ChevronRight size={28} className="group-hover:translate-x-2 transition-transform" />
          </Link>
          <Link href="#plans" className="w-full sm:w-auto px-16 py-7 rounded-3xl font-black text-lg uppercase tracking-[0.2em] border border-gray-200 bg-white hover:bg-gray-50 transition-all text-gray-900 shadow-sm">
            Live Plans
          </Link>
        </div>
      </header>

      {/* 2. Stats Section */}
      <section className="px-4 py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <StatItem icon={<Users className="text-[#E11D48]" size={28} />} label="Active Nodes" value="12k+" />
          <StatItem icon={<Coins className="text-[#E11D48]" size={28} />} label="Total Assets" value="Rs. 4.2M" />
          <StatItem icon={<Zap className="text-[#E11D48]" size={28} />} label="Total Payouts" value="Rs. 1.8M" />
          <StatItem icon={<BarChart3 className="text-[#E11D48]" size={28} />} label="System Sync" value="100%" />
        </div>
      </section>

      {/* 3. Live Plans Section */}
      <section id="plans" className="px-4 py-32 max-w-7xl mx-auto">
        <div className="text-center mb-20">
            <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-gray-900 leading-none">
                Yield <span className="text-[#E11D48]">Protocols</span>
            </h3>
            <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-[10px] mt-4">Real-time profit distribution</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {CONSTANT_PLANS.map((plan, index) => (
            <div key={index} className="p-10 rounded-[3.5rem] bg-white border border-gray-100 flex flex-col items-center text-center group hover:border-[#E11D48]/30 hover:-translate-y-4 transition-all duration-700 shadow-xl relative overflow-hidden">
              {/* Status Bar / Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-[#E11D48] text-white px-8 py-2 rounded-bl-3xl font-black text-[8px] uppercase tracking-widest flex items-center gap-2">
                  <Star size={10} fill="white" /> Most Active
                </div>
              )}
              <div className="absolute top-0 left-0 w-full h-2 bg-gray-50 group-hover:bg-[#E11D48] transition-colors" />
              
              <h4 className="text-2xl font-black text-gray-900 uppercase italic mb-2 tracking-tighter mt-4">{plan.name}</h4>
              <div className="flex items-center gap-2 mb-6">
                  <span className="px-3 py-1 bg-rose-50 text-[#E11D48] text-[8px] font-black uppercase rounded-full tracking-widest">Active Node</span>
              </div>

              <div className="text-6xl font-black text-[#E11D48] my-6 italic drop-shadow-sm">
                {plan.profit} <span className="text-[10px] text-gray-400 block uppercase tracking-[0.4em] mt-2 not-italic">Return / Daily</span>
              </div>

              <div className="space-y-4 w-full text-[11px] font-bold text-gray-500 mb-10 border-y border-gray-50 py-8 uppercase tracking-widest">
                <div className="flex justify-between items-center italic">
                  <span>Entry Range</span>
                  <span className="text-gray-900 font-black text-sm">{plan.range}</span>
                </div>
                <div className="flex justify-between items-center italic">
                  <span>Contract</span>
                  <span className="text-gray-900 font-black text-sm">{plan.contract}</span>
                </div>
              </div>

              <Link href="/login" className="w-full py-5 bg-[#E11D48] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-lg shadow-rose-200 hover:scale-105 transition-all text-xs">
                Start Plan
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Trust Section */}
      <section className="px-4 py-32 bg-white border-y border-gray-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 space-y-8">
            <h3 className="text-5xl md:text-7xl font-black mb-8 leading-none tracking-tighter uppercase italic text-gray-900">
                Secure <br /> <span className="text-[#E11D48]">Cold Vaults</span>
            </h3>
            <div className="grid grid-cols-1 gap-6">
                {[
                  { icon: <ShieldCheck className="text-emerald-500" />, title: "Triple Encryption", desc: "Military grade data protection for all wallets." },
                  { icon: <Clock className="text-[#E11D48]" />, title: "Instant Payouts", desc: "Zero delay extraction once the cycle finishes." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 p-6 rounded-[2rem] bg-[#F9FAFB] border border-gray-100 shadow-sm">
                    <div className="shrink-0">{item.icon}</div>
                    <div>
                      <h5 className="font-black uppercase tracking-tighter text-lg text-gray-900">{item.title}</h5>
                      <p className="text-xs text-gray-500 font-bold uppercase mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="lg:w-1/2 relative">
             <div className="w-full aspect-square bg-rose-50 rounded-[4rem] rotate-3 flex items-center justify-center relative overflow-hidden border border-rose-100">
                <TrendingUp size={200} className="text-[#E11D48]/10 absolute -right-10 -bottom-10" />
                <div className="p-12 bg-white rounded-[3rem] shadow-2xl -rotate-3 border border-gray-100">
                   <Zap size={80} className="text-[#E11D48] animate-pulse" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 5. Footer CTA */}
      <footer className="px-4 py-40 text-center relative">
        <h3 className="text-6xl md:text-[9rem] font-black mb-12 tracking-tighter italic uppercase text-gray-900 leading-[0.8]">Join the <br /> <span className="text-[#E11D48]">Network.</span></h3>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link href="/login" className="bg-[#E11D48] px-20 py-8 rounded-3xl font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-rose-200 hover:scale-105 transition-all flex items-center justify-center gap-3 text-white">
            Access Terminal <ArrowRight size={20} />
          </Link>
          <Link href="/support" className="bg-white border border-gray-200 px-20 py-8 rounded-3xl font-black text-sm uppercase tracking-[0.3em] hover:bg-gray-50 transition-all text-gray-900 flex items-center justify-center gap-3">
             <MessageSquare size={20} className="text-[#E11D48]" /> Support
          </Link>
        </div>
      </footer>

    </div>
  );
}