"use client";

import ProtectedPage from "../../components/ProtectedPage";
import { useAuth } from "../../context/AuthContext";

export default function SettingsPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-gray-50 font-[Tajawal] text-gray-800">
        <main className="max-w-xl mx-auto px-4 pt-8 pb-20 space-y-6">
          <h1 className="text-2xl font-bold text-orange-600 mb-2">
            ⚙️ الإعدادات
          </h1>

          <section className="bg-white rounded-2xl shadow p-4 border">
            <h2 className="font-semibold mb-3 text-gray-800">حسابي</h2>
            <p className="text-sm text-gray-700">
              الاسم:{" "}
              <span className="font-medium">
                {user?.displayName || "بدون اسم"}
              </span>
            </p>
            <p className="text-sm text-gray-700 mt-1">
              البريد:{" "}
              <span className="font-mono text-xs">{user?.email}</span>
            </p>
          </section>

          <section className="bg-white rounded-2xl shadow p-4 border">
            <h2 className="font-semibold mb-3 text-gray-800">الجلسة</h2>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow"
            >
              تسجيل الخروج
            </button>
          </section>

          {/* تقدر بعدين تضيف إعدادات الثيم / اللغة / إشعارات هنا */}
        </main>
      </div>
    </ProtectedPage>
  );
}
