"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

interface LifeArea {
  id: string;
  name: string;
  intensity: number;
}

export default function LifeFlames() {
  const { user } = useAuth();
  const [areas, setAreas] = useState<LifeArea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAreas = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, `users/${user.uid}/life_areas`), orderBy("order", "asc"));
        const snapshot = await getDocs(q);
        const data: LifeArea[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as LifeArea[];
        setAreas(data);
      } catch (error) {
        console.error("❌ Error loading areas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAreas();
  }, [user]);

  // 🎨 تدرّج اللون حسب الشدة
  const getFlameColor = (intensity: number) => {
    if (intensity >= 0.75) return "from-orange-500 to-red-500";
    if (intensity >= 0.4) return "from-yellow-400 to-orange-400";
    return "from-gray-300 to-gray-400";
  };

  // 🧾 تسجيل التغيير في activity_logs
  const logIntensityChange = async (areaName: string, oldVal: number, newVal: number) => {
    if (!user || oldVal === newVal) return;
    try {
      await addDoc(collection(db, `users/${user.uid}/activity_logs`), {
        areaName,
        oldValue: Math.round(oldVal * 100),
        newValue: Math.round(newVal * 100),
        changedAt: serverTimestamp(),
      });
      console.log(`📝 تم تسجيل التغيير: ${areaName} ${oldVal * 100}% → ${newVal * 100}%`);
    } catch (error) {
      console.error("❌ Error logging change:", error);
    }
  };

  const handleChangeIntensity = async (id: string, newValue: number) => {
    if (!user) return;
    try {
      const newIntensity = newValue / 100;
      const area = areas.find((a) => a.id === id);
      if (!area) return;

      // 🔹 سجل التغيير أولاً
      await logIntensityChange(area.name, area.intensity, newIntensity);

      // 🔹 حدّث Firestore
      const areaRef = doc(db, `users/${user.uid}/life_areas/${id}`);
      await updateDoc(areaRef, { intensity: newIntensity });

      // 🔹 حدّث الحالة في الواجهة
      setAreas((prev) => prev.map((a) => (a.id === id ? { ...a, intensity: newIntensity } : a)));
    } catch (error) {
      console.error("❌ Error updating intensity:", error);
    }
  };

  if (loading) return <p className="text-center mt-10">⏳ جاري تحميل الشعلات...</p>;
  if (!areas.length) return <p className="text-center mt-10">🚫 لا توجد بيانات بعد</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center font-[Tajawal]">🔥 شعلات حياتي</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {areas.map((area) => {
          const isHigh = area.intensity >= 0.8;
          const encodedId = encodeURIComponent(area.id); // ✅ نستخدم id في الرابط

          return (
            <Link key={area.id} href={`/life/${encodedId}`} className="group">
              <motion.div
                className={`rounded-xl shadow p-4 text-center cursor-pointer bg-gradient-to-br ${getFlameColor(
                  area.intensity
                )} text-white`}
                animate={
                  isHigh
                    ? {
                        boxShadow: [
                          "0 0 10px rgba(255,140,0,0.4)",
                          "0 0 30px rgba(255,80,0,0.9)",
                          "0 0 10px rgba(255,140,0,0.4)",
                        ],
                      }
                    : { boxShadow: "none" }
                }
                transition={isHigh ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <p className="text-lg font-semibold group-hover:text-yellow-200 transition">
                  {area.name}
                </p>
                <div className="mt-2 text-sm">🔥 النشاط: {(area.intensity * 100).toFixed(0)}%</div>

                {/* السلايدر قابل للتعديل */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={(area.intensity * 100).toFixed(0)}
                  onChange={(e) => handleChangeIntensity(area.id, parseInt(e.target.value))}
                  className="w-full mt-3 accent-orange-500"
                />
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
