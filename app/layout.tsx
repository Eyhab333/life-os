import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

export const metadata = {
  title: "Life OS",
  description: "نظام تنظيم الحياة الشخصي",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
