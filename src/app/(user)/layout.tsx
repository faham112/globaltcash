import UserSidebar from "@/components/UserSidebar";
import MobileBottomNav from "@/components/MobileBottomNav";
import DashboardHeader from "@/components/DashboardHeader";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // Redirect admins
  if (session && (session.user as any).role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  return (
    // relative aur overflow-hidden lagaya hai taake bahar ka koi element disturb na kare
    <div className="relative bg-[#F3F4F6] min-h-screen text-[#1F2937] flex overflow-hidden">
      
      {/* Sidebar - Desktop par 64 (w-64) ya 72 (w-72) space lega */}
      <UserSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-72 w-full max-w-full overflow-hidden transition-all duration-300">
        
        {/* Header sirf dashboard ka aayega */}
        <DashboardHeader type="user" />
        
        {/* Main Scrollable Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-24 lg:pb-10 px-4 md:px-0">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </div>
  );
}