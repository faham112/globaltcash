"use client";
import { useState, useEffect } from "react";
import { Copy, CheckCircle2, Wallet, Zap, UploadCloud } from "lucide-react";

export default function DepositPage() {
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [slipImage, setSlipImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetch("/api/settings").then(res => res.json()).then(data => setSettings(data));
    fetch("/api/user/profile").then(res => res.json()).then(data => setProfile(data));
  }, []);

  const methods = settings ? [
    { 
      id: 'jazzcash', 
      name: 'JazzCash', 
      holder: settings.jazzCashName, 
      account: settings.jazzCashNumber, 
      type: 'Local Gateway',
      logo: "https://crystalpng.com/wp-content/uploads/2024/12/new-Jazzcash-logo.png"
    },
    { 
      id: 'easypaisa', 
      name: 'EasyPaisa', 
      holder: settings.easyPaisaName, 
      account: settings.easyPaisaNumber, 
      type: 'Local Gateway',
      logo: "https://crystalpng.com/wp-content/uploads/2024/10/Easypaisa-logo.png"
    },
    { 
      id: 'usdt', 
      name: 'USDT (TRC20)', 
      address: settings.adminWalletAddress, 
      type: 'Crypto Node',
      logo: "https://cdn.worldvectorlogo.com/logos/tether.svg"
    }
  ] : [];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slipImage) return alert("Please upload slip");
    setLoading(true);
    try {
      const res = await fetch("/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(amount), gateway: selectedMethod.name, slipImage })
      });
      if(res.ok) {
        alert("Request Sent Successfully!");
        setSelectedMethod(null);
        setAmount("");
        setSlipImage("");
      }
    } catch (err) { 
      console.error(err); 
      alert("Something went wrong!");
    } finally { 
      setLoading(false); 
    }
  };

  // ✅ FIXED: Added (val || 0) to prevent 'undefined' error
  const formatPKR = (val: number) => (val || 0).toLocaleString('en-PK', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  });

  return (
    <div className="bg-[#F3F4F6] min-h-screen p-5 md:p-10 pt-24 lg:pt-8 font-sans text-[#1F2937]">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[#111827]">
              Deposit <span className="text-[#E11D48]">Funds</span>
            </h1>
            <p className="text-[#6B7280] text-sm font-medium mt-1">Refill your balance to activate new plans.</p>
          </div>
          <div className="bg-white px-5 py-2 rounded-2xl shadow-sm border border-[#E5E7EB] flex items-center gap-2">
            <div className="w-2 h-2 bg-[#E11D48] rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#4B5563]">Secure Gateway</span>
          </div>
        </div>

        {/* User Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1">Available Balance</p>
              {/* ✅ SAFE ACCESS */}
              <h3 className="text-3xl font-black text-[#111827]">
                Rs. {profile ? formatPKR(profile.balance) : "0.00"}
              </h3>
            </div>
            <div className="bg-[#FFF1F2] p-4 rounded-2xl text-[#E11D48]">
              <Wallet size={24} />
            </div>
          </div>
          <div className="bg-[#111827] p-8 rounded-[2.5rem] shadow-xl flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Total Funded</p>
              {/* ✅ SAFE ACCESS */}
              <h3 className="text-3xl font-black text-white italic font-serif">
                Rs. {profile ? formatPKR(profile.totalDeposited) : "0.00"}
              </h3>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl text-[#E11D48]">
              <Zap size={24} />
            </div>
          </div>
        </div>

        {/* Method Selection */}
        <div className="space-y-6">
          <h2 className="text-sm font-black text-[#111827] uppercase tracking-widest ml-2 italic">1. Select Gateway</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {methods.map((m) => (
              <div 
                key={m.id} 
                onClick={() => setSelectedMethod(m)}
                className={`group bg-white p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all duration-300 flex flex-col items-center text-center gap-4 ${selectedMethod?.id === m.id ? 'border-[#E11D48] shadow-2xl shadow-rose-100' : 'border-transparent shadow-sm hover:shadow-md'}`}
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#F9FAFB] p-2 border border-[#F3F4F6]">
                  <img src={m.logo} alt={m.name} className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1">{m.type}</p>
                  <h3 className="text-lg font-black text-[#111827]">{m.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Console */}
        {selectedMethod && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="bg-white rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.06)] border border-[#F3F4F6] overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                
                {/* Left Side: Account Info */}
                <div className="p-10 lg:p-14 bg-[#F9FAFB] border-r border-[#F3F4F6] space-y-8">
                  <div>
                    <span className="bg-[#E11D48] text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Target Account</span>
                    <h3 className="text-3xl font-black text-[#111827] mt-4 leading-tight">Transfer Funds To This Address</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white p-6 rounded-3xl border border-[#E5E7EB] flex justify-between items-center group">
                      <div className="truncate pr-4">
                        <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1">Account / Address</p>
                        <p className="text-xl font-mono font-bold text-[#111827] break-all">{selectedMethod.account || selectedMethod.address}</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleCopy(selectedMethod.account || selectedMethod.address)}
                        className="bg-[#111827] text-white p-4 rounded-2xl hover:bg-[#E11D48] transition-colors shadow-lg active:scale-90"
                      >
                        <Copy size={20} />
                      </button>
                    </div>

                    {selectedMethod.holder && (
                      <div className="bg-white p-6 rounded-3xl border border-[#E5E7EB]">
                        <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1">Account Holder Name</p>
                        <p className="text-lg font-black text-[#111827] italic uppercase tracking-tight">{selectedMethod.holder}</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-rose-50 p-6 rounded-[2rem] border border-rose-100 flex gap-4">
                    <div className="bg-white h-10 w-10 shrink-0 rounded-full flex items-center justify-center text-[#E11D48] shadow-sm">
                      <Zap size={18} />
                    </div>
                    <p className="text-xs font-bold text-[#E11D48]/80 leading-relaxed">
                      Please ensure the transfer amount matches your request. Verification takes 5-30 minutes.
                    </p>
                  </div>
                </div>

                {/* Right Side: Form */}
                <div className="p-10 lg:p-14 space-y-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em] ml-2">Exact Deposit Amount</label>
                      <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-[#111827]">Rs.</span>
                        <input 
                          type="number" 
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full bg-[#F9FAFB] border-2 border-transparent focus:border-[#E11D48] focus:bg-white rounded-2xl py-6 pl-14 pr-6 text-[#111827] outline-none font-black text-2xl transition-all"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em] ml-2">Transaction Screenshot</label>
                      <input type="file" id="slip" className="hidden" onChange={handleFileChange} required />
                      <label 
                        htmlFor="slip"
                        className="w-full bg-[#F9FAFB] border-2 border-dashed border-[#E5E7EB] hover:border-[#E11D48] py-8 rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all group"
                      >
                        {slipImage ? (
                          <div className="flex flex-col items-center gap-2">
                             <CheckCircle2 size={40} className="text-[#E11D48]" />
                             <span className="text-[10px] font-black uppercase text-[#111827]">Slip Attached Successfully</span>
                          </div>
                        ) : (
                          <>
                            <div className="bg-white p-4 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                              <UploadCloud size={30} className="text-[#9CA3AF]" />
                            </div>
                            <span className="text-[10px] font-black uppercase text-[#9CA3AF] tracking-widest">Upload Receipt</span>
                          </>
                        )}
                      </label>
                    </div>

                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#111827] py-6 rounded-2xl font-black text-white uppercase tracking-[0.2em] text-xs hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : "Confirm Deposit"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}