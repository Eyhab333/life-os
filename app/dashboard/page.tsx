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


          <DashboardSection title="🌤️ فترات المزاج" defaultOpen={false}>
            <p className="text-gray-500 text-sm">
              فترات مثل توليفة الربيع أو الإجازة وما يقابلها من نظام حياة.
            </p>
          </DashboardSection>

          <DashboardSection title="🧘 جلسة اليوم" defaultOpen={false}>
            <p className="text-gray-500 text-sm">
              مكان لتوليفة اليوم من روتينك ومهامك وأهدافك الصغيرة.
            </p>
          </DashboardSection>


          <DashboardSection title="🕌 أيامي الخاصة (الجمعة / السبت)" defaultOpen={false}>
            <p className="text-gray-500 text-sm">
              خططك وأنشطتك الثابتة في أيام الراحة والتجديد الأسبوعي.
            </p>
          </DashboardSection>






          <DashboardSection title="📅 خريطة العمر (90 سنة)" defaultOpen={false}>
            <p className="text-gray-500 text-sm">
              تصور بصري لحياتك من سنة ميلادك حتى التسعين.
            </p>
          </DashboardSection>


          <DashboardSection title="🔗 تطبيقاتي" defaultOpen={false}>
            <MyApps />
          </DashboardSection>

        </main>
      </div>
    </ProtectedPage>
  );
}
