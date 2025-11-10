"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
    const { user, logout } = useAuth();
  return (
    <header className="flex justify-between items-center px-6 py-5 bg-white mb-6 shadow rounded-b-2xl border-b">
          <div className="flex flex-col">
            {/* 🧭 الشعار */}
            <Link
              href="/dashboard"
              className="text-xl font-bold text-orange-600 hover:text-orange-700 transition select-none"
            >
              Life OS
            </Link>
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
  );
}
