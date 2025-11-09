"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import ProtectedPage from "../../components/ProtectedPage";

export default function SettingsPage() {
  const { user } = useAuth();
  const [theme, setTheme] = useState("light");
  const [locale, setLocale] = useState("ar");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setTheme(data.theme || "light");
        setLocale(data.locale || "ar");
      }
      setLoading(false);
    };
    fetchSettings();
  }, [user]);

  const saveSettings = async () => {
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    await updateDoc(ref, { theme, locale });
    alert("✅ تم حفظ الإعدادات بنجاح!");
  };

  if (loading) return <p className="text-center mt-10">⏳ جاري تحميل الإعدادات...</p>;

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-gray-50 font-[Tajawal] text-gray-800">
        <div className="max-w-xl mx-auto bg-white shadow-md rounded-2xl p-8 mt-10">
          <h1 className="text-2xl font-bold mb-6 text-center">⚙️ إعدادات المستخدم</h1>

          {/* إعداد الثيم */}
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700">المظهر</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring focus:ring-orange-300"
            >
              <option value="light">☀️ فاتح</option>
              <option value="dark">🌙 داكن</option>
            </select>
          </div>

          {/* إعداد اللغة */}
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700">اللغة</label>
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring focus:ring-orange-300"
            >
              <option value="ar">🇸🇦 العربية</option>
              <option value="en">🇺🇸 English</option>
            </select>
          </div>

          <button
            onClick={saveSettings}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold shadow"
          >
            حفظ التغييرات
          </button>
        </div>
      </div>
    </ProtectedPage>
  );
}
