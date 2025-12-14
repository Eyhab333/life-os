"use client";

import { ReactNode, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProtectedPage from "../../../components/ProtectedPage";
import { useAuth } from "../../../context/AuthContext";
import { db } from "../../../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import AreaDashboardLayout from "../../../components/AreaDashboardLayout";

interface AreaLayoutProps {
  children: ReactNode;
}

interface LifeAreaDoc {
  name?: string;
  intensity?: number;
  description?: string;
}

export default function AreaLayout({ children }: AreaLayoutProps) {
  const params = useParams();
  const areaId = decodeURIComponent(params.area as string); // ✅ بدل params.area من props

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
            intensity:
              typeof data.intensity === "number" ? data.intensity : 0.5,
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

  if (!user || loading || !areaData) {
    return (
      <ProtectedPage>
        <div className="min-h-screen bg-gray-50 font-[Tajawal] text-gray-800 flex items-center justify-center">
          <p className="text-sm text-gray-600">
            ⏳ جاري تحميل لوحة تحكم المجال...
          </p>
        </div>
      </ProtectedPage>
    );
  }

  const intensityPercent = Math.round((areaData.intensity ?? 0.5) * 100);

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-gray-50 font-[Tajawal] text-gray-800">
        <AreaDashboardLayout
          areaId={areaId}
          areaName={areaData.name || areaId}
          description={areaData.description}
          intensityPercent={intensityPercent}
          savingIntensity={savingIntensity}
          onIntensityChange={handleIntensityChange}
        >
          {children}
        </AreaDashboardLayout>
      </div>
    </ProtectedPage>
  );
}
