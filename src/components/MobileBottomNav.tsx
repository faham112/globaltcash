"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  PlusCircle, 
  ArrowUpCircle, 
  Users2, 
  ListOrdered 
} from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: "Home", href: "/dashboard" },
    { icon: <ListOrdered size={20} />, label: "Plans", href: "/dashboard/plans" },
    { icon: <PlusCircle size={20} />, label: "Deposit", href: "/dashboard/deposit" },
    { icon: <ArrowUpCircle size={20} />, label: "Withdraw", href: "/dashboard/withdraw" },
    { icon: <Users2 size={20} />, label: "Team", href: "/dashboard/affiliates" },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link 
              key={item.label}
              href={item.href}
              className="flex flex-col items-center justify-center w-full h-full transition-all"
            >
              <div className={`mb-1 ${isActive ? "text-[#E11D48]" : "text-gray-400"}`}>
                {item.icon}
              </div>
              
              <span className={`text-[9px] min-[320px]:text-[10px] font-bold uppercase tracking-tight
                ${isActive ? "text-[#E11D48]" : "text-gray-400"}
              `}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}