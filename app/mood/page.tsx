"use client";

import { useEffect, useState } from "react";
import ProtectedPage from "../../components/ProtectedPage";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { motion } from "framer-motion";

type MoodDoc = {
  value: number;
  note?: string;
  updatedAt?: string;
};

function getTodayKey() {
  return new Date().toISOString().slice(0, 10); // 2025-11-24
}

export default function MoodPage() {
  const { user } = useAuth();
  const [value, setValue] = useState(5);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMood = async () => {
      if (!user) return;
      const key = getTodayKey();
      const ref = doc(db, "users", user.uid, "mood_logs", key);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data() as MoodDoc;
        setValue(data.value ?? 5);
        setNote(data.note ?? "");
      }
      setLoading(false);
    };
    fetchMood();
  }, [user]);

  const saveMood = async () => {
    if (!user) return;
    setSaving(true);
    setMessage("");
    try {
      const key = getTodayKey();
      const ref = doc(db, "users", user.uid, "mood_logs", key);
      await setDoc(ref, {
        value,
        note,
        updatedAt: new Date().toISOString(),
      });
      setMessage("✅ تم حفظ مزاج اليوم.");
    } catch (e) {
      console.error(e);
      setMessage("❌ حدث خطأ أثناء الحفظ.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white font-[Tajawal] text-gray-800">
        <main className="max-w-md mx-auto px-4 pt-8 pb-24">
          <h1 className="text-2xl font-bold text-orange-600 mb-2 text-center">
            💛 مزاجي اليوم
          </h1>
          <p className="text-gray-600 text-sm text-center mb-6">
            اختر مستوى مزاجك اليوم واكتب ملاحظة سريعة تربط شعورك بما يحدث في يومك.
          </p>

          {loading ? (
            <p className="text-center mt-8">⏳ جاري تحميل بيانات اليوم...</p>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow p-5 space-y-5 border"
            >
              <div>
                <div className="flex justify-between mb-2 text-sm text-gray-600">
                  <span>😔 منخفض</span>
                  <span>🙂 متوسط</span>
                  <span>😄 مرتفع</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
                <p className="text-center mt-2 text-gray-700">
                  مزاجك الآن:{" "}
                  <span className="font-semibold text-orange-600">
                    {value} / 10
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  ملاحظة عن يومك
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="w-full border rounded-xl p-3 text-sm focus:ring focus:ring-orange-200"
                  placeholder="مثلاً: نمت متأخر – ضغط شغل – خروجة لطيفة – حلقة قرآن..."
                />
              </div>

              {message && (
                <p className="text-sm text-center text-gray-700">{message}</p>
              )}

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={saveMood}
                disabled={saving}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl font-semibold shadow"
              >
                {saving ? "جارٍ الحفظ..." : "حفظ مزاج اليوم"}
              </motion.button>
            </motion.div>
          )}
        </main>
      </div>
    </ProtectedPage>
  );
}
