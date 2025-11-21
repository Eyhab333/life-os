import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import Header from "@/components/Header";
import BottomNav from "../components/BottomNav";

export const metadata = {
  title: "Life OS",
  description: "نظام تنظيم الحياة الشخصي",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gray-50 font-[Tajawal] text-gray-800 min-h-screen flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-1 pt-2 pb-20">{children}</main>
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
