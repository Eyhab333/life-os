// page file
"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { db } from "@/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import GoalsList from "../../../components/GoalsList";

export default function LifeAreaPage() {
  const { user } = useAuth();
  const { area } = useParams(); // ← هنا بنجيب اسم الشعلة من الرابط
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  // 🧠 تحميل بيانات الشعلة من Firestore
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !area) return;
      const ref = doc(db, "users", user.uid, "life_areas", decodeURIComponent(area as string));
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setData(snap.data());
      } else {
        // لو مفيش بيانات نعمل Doc فاضي أول مرة
        await setDoc(ref, {
          roadmap: [],
          routines: [],
          obstacles: [],
          focusLevel: 50,
          updatedAt: new Date().toISOString(),
        });
        setData({
          roadmap: [],
          routines: [],
          obstacles: [],
          focusLevel: 50,
        });
      }
      setLoading(false);
    };
    fetchData();
  }, [user, area]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-orange-500" />
        <p className="mt-2 text-gray-600 font-[Tajawal]">جارٍ تحميل {decodeURIComponent(area as string)}...</p>
      </div>
    );
  }

  // 🧩 واجهة عرض الشعلة
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 font-[Tajawal]">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">
        🔥 {decodeURIComponent(area as string)}
      </h1>

      <div className="space-y-6">
        <section className="bg-white p-6 rounded-2xl shadow">
          <GoalsList area={decodeURIComponent(area as string)} />
        </section>

        <section className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">🧘 الروتين اليومي</h2>
          <p className="text-gray-600 text-sm">
            أنشطتك اليومية اللي بتغذي {decodeURIComponent(area as string)}.
          </p>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">⛔ العقبات</h2>
          <p className="text-gray-600 text-sm">
            التحديات أو العوائق اللي بتواجهك في {decodeURIComponent(area as string)}.
          </p>
        </section>
      </div>
    </div>
  );
}
