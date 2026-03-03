"use client";
import React from 'react';
import { Shield, Lock, Bell, Smartphone, Save, Fingerprint, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#1F2937] font-sans">
      <div className="p-4 md:p-8 lg:p-12 pt-28 lg:pt-10 max-w-4xl mx-auto w-full">
        
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#E11D48] h-10 w-1.5 rounded-full" />
            <h1 className="text-4xl font-black uppercase tracking-tighter italic text-[#111827] leading-none">
              Account <span className="text-[#E11D48]">Settings</span>
            </h1>
          </div>
          <p className="text-[#6B7280] text-[10px] font-black uppercase tracking-[0.4em] ml-5">
             Security Terminal • Status: <span className="text-[#E11D48] italic uppercase">Online</span>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Security Card */}
          <div className="bg-white border border-[#E5E7EB] p-8 md:p-10 rounded-[3rem] shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-4 mb-10">
              <div className="bg-rose-50 p-4 rounded-2xl text-[#E11D48]">
                <Lock size={24} />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tighter italic">Security Protocol</h2>
            </div>

            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-[#4B5563] ml-2 tracking-widest">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl py-5 px-6 text-sm text-[#111827] focus:outline-none focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/5 transition-all" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-[#4B5563] ml-2 tracking-widest">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl py-5 px-6 text-sm text-[#111827] focus:outline-none focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/5 transition-all" />
                </div>
              </div>
              <button type="submit" className="w-full md:w-auto bg-[#111827] text-white px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#E11D48] transition-all flex items-center justify-center gap-3">
                <Save size={16} /> Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}