"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProtectedPage from "../../../components/ProtectedPage";
import { useAuth } from "../../../context/AuthContext";
import { db } from "../../../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import GoalsList from "../../../components/GoalsList";
import AreaDailyRoutines from "../../../components/AreaDailyRoutines";
import AreaObstacles from "../../../components/AreaObstacles";
import { motion } from "framer-motion";
import { LucideSeparatorHorizontal, SeparatorHorizontal } from "lucide-react";

interface LifeAreaDoc {
  name?: string;
  intensity?: number;
  description?: string;
}

export default function LifeAreaPage() {
  const params = useParams();
  const areaId = params?.area as string;
  const { user } = useAuth();

  const [areaData, setAreaData] = useState<LifeAreaDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingIntensity, setSavingIntensity] = useState(false);

  useEffect(() => {
    const fetchArea = async () => {
      if (!user || !areaId) return;
      try {
        const ref = doc(db, "users", user.uid, "life_areas", areaId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as LifeAreaDoc;
          setAreaData({
            name: data.name || areaId,
            intensity: typeof data.intensity === "number" ? data.intensity : 0.5,
            description: data.description || "",
          });
        } else {
          setAreaData({
            name: areaId,
            intensity: 0.5,
            description: "",
          });
        }
      } catch (e) {
        console.error("❌ خطأ في تحميل بيانات المجال:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchArea();
  }, [user, areaId]);

  const handleIntensityChange = async (value: number) => {
    if (!user || !areaId || !areaData) return;
    const fraction = value / 100;
    setAreaData({ ...areaData, intensity: fraction });
    setSavingIntensity(true);
    try {
      const ref = doc(db, "users", user.uid, "life_areas", areaId);
      await updateDoc(ref, { intensity: fraction });
    } catch (e) {
      console.error("❌ خطأ في تحديث الشدة:", e);
    } finally {
      setSavingIntensity(false);
    }
  };

  if (loading) {
    return (
      <ProtectedPage>
        <p className="text-center mt-10">⏳ جاري تحميل بيانات المجال...</p>
      </ProtectedPage>
    );
  }

  if (!areaData) {
    return (
      <ProtectedPage>
        <p className="text-center mt-10 text-red-600">
          ⚠️ لم يتم العثور على هذا المجال.
        </p>
      </ProtectedPage>
    );
  }

  const intensityPercent = Math.round((areaData.intensity ?? 0.5) * 100);

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-gray-50 font-[Tajawal] text-gray-800">
        <main className="max-w-5xl mx-auto px-4 pb-20 pt-6 space-y-6">
          {/* رأس الصفحة + شدة الشعلة */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow p-5 border"
          >
            <h1 className="text-2xl font-bold text-orange-600 mb-1">
              {areaData.name}
            </h1>
            <p className="text-gray-600 text-sm mb-4">
              هنا تدير أهدافك وروتينك اليومي والعقبات في هذا الجانب من حياتك.
            </p>

            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>🔥 شدة الشعلة</span>
                <span>{intensityPercent}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={intensityPercent}
                onChange={(e) => handleIntensityChange(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {savingIntensity
                  ? "جارٍ حفظ التغيير..."
                  : "اضبط مستوى التركيز والنشاط في هذا المجال."}
              </p>
            </div>
          </motion.section>

          {/* الأهداف الخاصة بالمجال */}
          <section>
            <GoalsList area={areaId} />
          </section>

          {/* الروتين اليومي + العقبات لهذا المجال */}
          <section>
            <AreaDailyRoutines areaId={areaId} />

             <LucideSeparatorHorizontal/>

            <AreaObstacles areaId={areaId} />
          </section>
        </main>
      </div>
    </ProtectedPage>
  );
}
