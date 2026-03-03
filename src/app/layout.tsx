"use client"; // Ye line zaroori hai kyunke hum usePathname use kar rahe hain

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation"; // Path check karne ke liye

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import AuthProvider from "@/components/SessionProvider";
import TonProvider from "@/components/TonProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Check karo ke kya user dashboard area mein hai
  // Agar path "/dashboard" ya "/admin" se shuru hota hai to true hoga
  const isDashboard = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950`}
      >
        <AuthProvider>
          <TonProvider>
            {/* AGAR DASHBOARD NAHI HAI, TABHI NAVBAR DIKHAO */}
            {!isDashboard && <Navbar />}
            
            <Toaster position="top-center" richColors theme="dark" />
            
            <main className={!isDashboard ? "min-h-[70vh]" : ""}>
              {children}
            </main>

            {/* AGAR DASHBOARD NAHI HAI, TABHI FOOTER DIKHAO */}
            {!isDashboard && <Footer />}
          </TonProvider>
        </AuthProvider>
      </body>
    </html>
  );
}