"use client";

import ProtectedPage from "../../components/ProtectedPage";
import { useAuth } from "../../context/AuthContext";
import DashboardSection from "../../components/DashboardSection";
import LifeFlames from "../../components/LifeFlames";
import Link from "next/link";
import { Settings } from "lucide-react";
import MyApps from "../../components/MyApps";
import MyPhilosophy from "../../components/MyPhilosophy";


export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-gray-50 font-[Tajawal] text-gray-800">
        {/* الهيدر */}
        {/* الهيدر */}
        <header className="flex justify-between items-center px-6 py-5 bg-white mb-6 shadow rounded-b-2xl border-b">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold bg-linear-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              Life OS
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              👋 أهلاً {user?.displayName?.split(" ")[0] || "بك"}، استعد ليوم جديد من الوعي والنظام.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* 🔸 أيقونة الإعدادات */}
            <Link
  href="/settings"
  className="cursor-pointer"
  aria-label="الإعدادات"
>
  <Settings className="w-6 h-6 text-gray-600 hover:text-orange-500 transition" />
</Link>




            {/* 🔹 زر تسجيل الخروج */}
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl shadow text-sm font-medium"
            >
              تسجيل الخروج
            </button>
          </div>
        </header>

        {/* المحتوى */}
        <main className="max-w-5xl mx-auto px-4 pb-10">
          <DashboardSection title="🌟 فلسفتي الشخصية" defaultOpen={false}>
            <MyPhilosophy />
          </DashboardSection>

          <DashboardSection title="🔥 شعلات حياتي">
            <LifeFlames />
          </DashboardSection>

          <DashboardSection title="📜 مراحل من رحلتي" defaultOpen={false}>
            <p className="text-gray-500 text-sm">
              ستعرض هنا المراحل المهمة والنجاحات والتحوّلات التي مررت بها.
            </p>
          </DashboardSection>

          <DashboardSection title="🧘 جلسة اليوم" defaultOpen={false}>
            <p className="text-gray-500 text-sm">
              مكان لتوليفة اليوم من روتينك ومهامك وأهدافك الصغيرة.
            </p>
          </DashboardSection>

          <DashboardSection title="🔗 تطبيقاتي" defaultOpen={false}>
            <MyApps />
          </DashboardSection>

          <DashboardSection title="📅 خريطة العمر (90 سنة)" defaultOpen={false}>
            <p className="text-gray-500 text-sm">
              تصور بصري لحياتك من سنة ميلادك حتى التسعين.
            </p>
          </DashboardSection>

          <DashboardSection title="🕌 أيامي الخاصة (الجمعة / السبت)" defaultOpen={false}>
            <p className="text-gray-500 text-sm">
              خططك وأنشطتك الثابتة في أيام الراحة والتجديد الأسبوعي.
            </p>
          </DashboardSection>

          <DashboardSection title="🌤️ فترات المزاج" defaultOpen={false}>
            <p className="text-gray-500 text-sm">
              فترات مثل توليفة الربيع أو الإجازة وما يقابلها من نظام حياة.
            </p>
          </DashboardSection>
        </main>
      </div>
    </ProtectedPage>
  );
}
