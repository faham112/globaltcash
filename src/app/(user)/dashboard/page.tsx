import { db } from "@/lib/db";
import { Wallet, ArrowDownCircle, ArrowUpCircle, Activity, ShieldCheck } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function UserDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email! },
    include: { 
      deposits: { orderBy: { createdAt: 'desc' } }, 
      withdrawals: { orderBy: { createdAt: 'desc' } } 
    },
  });

  if (!user) return <div className="text-white p-10 font-bold text-center neon-text">Identity Not Found</div>;

  const actualDeposits = user.deposits.filter(d => d.gateway !== "Internal Balance");
  const activePlans = user.deposits.filter(d => d.gateway === "Internal Balance" && d.status === "ACTIVE");
  
  const totalDeposits = actualDeposits.reduce((acc, curr) => acc + curr.amount, 0);
  const totalWithdrawals = user.withdrawals.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="p-4 md:p-8 lg:p-10 pt-24 lg:pt-10 max-w-[1400px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700 custom-scrollbar">
      
      {/* 1. Header Section - Mobile Only */}
      <div className="mb-10 lg:hidden flex flex-col gap-6">
        <div className="relative p-8 rounded-[2rem] glass-card neon-border overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary h-10 w-1.5 rounded-full shadow-[0_0_15px_var(--primary)]" />
              <h1 className="text-3xl font-black uppercase tracking-tighter italic text-white leading-none">
                Account <span className="text-primary neon-text">Overview</span>
              </h1>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] ml-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_var(--primary)]" />
              {user.email?.split('@')[0]} • Online
            </p>
          </div>
        </div>
      </div>

      {/* 2. Primary Financial Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
        
        {/* Main Balance Terminal */}
        <div className="glass-card neon-border p-5 sm:p-8 rounded-[2.5rem] relative overflow-hidden group col-span-1 md:col-span-2">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary/5 rounded-full blur-[100px] group-hover:bg-primary/10 transition-all duration-700" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] italic">Total Balance</p>
              <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 text-primary shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                <Wallet size={24} />
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Available Balance</span>
              <h3 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter flex items-center gap-3">
                <span className="text-primary italic opacity-80 text-2xl md:text-4xl">Rs.</span>
                {user.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-4">
               <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10 backdrop-blur-xl">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_var(--primary)]" />
                  <span className="text-primary text-[9px] font-black uppercase tracking-widest">System Live</span>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-accent/5 rounded-full border border-accent/10 backdrop-blur-xl">
                  <Activity size={12} className="text-accent" />
                  <span className="text-accent text-[9px] font-black uppercase tracking-widest">Profit Optimized</span>
               </div>
            </div>
          </div>
        </div>

        {/* Global Statistics Grid */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 col-span-1 md:col-span-2">
          {/* Total Inbound */}
          <div className="bg-gradient-to-br from-primary/20 to-transparent p-5 rounded-[2rem] flex flex-col justify-between group hover:neon-border transition-all border border-white/5">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-primary/20 rounded-xl text-primary group-hover:scale-110 transition-transform">
                <ArrowDownCircle size={22} />
              </div>
              <span className="text-primary/40 text-[9px] font-black italic">IN</span>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase mb-1">Deposits</p>
              <h3 className="text-2xl font-black text-white">Rs. {totalDeposits.toLocaleString()}</h3>
            </div>
          </div>

          {/* Total Outbound */}
          <div className="bg-gradient-to-br from-accent/20 to-transparent p-5 rounded-[2rem] flex flex-col justify-between group hover:border-accent/40 transition-all border border-white/5">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-accent/20 rounded-xl text-accent group-hover:scale-110 transition-transform">
                <ArrowUpCircle size={22} />
              </div>
              <span className="text-accent/40 text-[9px] font-black italic">OUT</span>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase mb-1">Withdrawals</p>
              <h3 className="text-2xl font-black text-white">Rs. {totalWithdrawals.toLocaleString()}</h3>
            </div>
          </div>

          {/* Active Nodes */}
          <div className="glass-card p-5 rounded-[2rem] flex flex-col justify-between group hover:neon-border transition-all border border-white/5">
            <Activity size={22} className="text-primary mb-4" />
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
              <h3 className="text-2xl font-black text-white">Encrypted</h3>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Operational History */}
      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">
              Activity <span className="text-primary neon-text">History</span>
            </h2>
            <Link href="/dashboard/deposit" className="neon-button text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest italic">
              View All
            </Link>
          </div>
          
          <div className="glass-card neon-border rounded-[2.5rem] p-6 md:p-8 relative overflow-hidden">
            {actualDeposits.length === 0 ? (
              <div className="text-center py-20 bg-card/50 rounded-[2rem] border-2 border-dashed border-primary/10 flex flex-col items-center gap-4">
                <Activity size={32} className="text-primary/20" />
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">No Transactions</p>
              </div>
            ) : (
              <div className="space-y-4">
                {actualDeposits.slice(0, 5).map((dep) => (
                  <div key={dep.id} className="flex items-center justify-between p-5 bg-card/40 border border-white/5 rounded-2xl hover:neon-border transition-all group">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-primary/40">
                         {/* Icon/Logo Logic remains same */}
                         <Wallet size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase text-white">{dep.gateway || 'Deposit'}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ID: {dep.transactionId?.substring(0, 10)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-primary neon-text">+Rs. {dep.amount.toLocaleString()}</p>
                      <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase ${
                        dep.status === 'APPROVED' ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'
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
  );
}