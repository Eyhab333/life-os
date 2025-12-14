"use client";

import { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRightCircle,
  Flame,
  LayoutDashboard,
  Repeat,
  ShieldAlert,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

interface AreaDashboardLayoutProps {
  areaId: string;
  areaName: string;
  description?: string;
  intensityPercent: number;
  savingIntensity?: boolean;
  onIntensityChange: (value: number) => void;
  children: ReactNode;
}

export default function AreaDashboardLayout({
  areaId,
  areaName,
  description,
  intensityPercent,
  savingIntensity,
  onIntensityChange,
  children,
}: AreaDashboardLayoutProps) {
  const encodedId = encodeURIComponent(areaId);

  return (
    <div className="min-h-[calc(100vh-80px)] py-6">
      {/* grid عامة: محتوى يسار + سايدبار يمين (row-reverse عشان RTL) */}
      <div className="mx-auto max-w-6xl px-4 md:flex md:flex-row-reverse md:gap-6">
        {/* Sidebar يمين */}
        <aside className="mb-6 w-full md:mb-0 md:w-72 md:flex-shrink-0 space-y-4">
          {/* رجوع إلى شعلات حياتي */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl border bg-white px-4 py-3 shadow-sm flex items-center justify-between"
          >
            <div className="text-sm">
              <p className="text-xs text-gray-500">العودة إلى</p>
              <p className="font-semibold text-gray-800">🔥 شعلات حياتي</p>
            </div>
            <Link
              href="/life"
              className="inline-flex items-center gap-1 text-xs font-medium text-orange-600 hover:text-orange-700"
            >
              <span>رجوع</span>
              <ArrowRightCircle className="h-4 w-4" />
            </Link>
          </motion.div>

          {/* معلومات المجال */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border bg-white p-4 shadow-sm space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs text-gray-500">المجال</p>
                <h2 className="text-lg font-bold text-orange-600">
                  {areaName}
                </h2>
              </div>
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
            {description && description.trim() !== "" && (
              <p className="text-xs text-gray-600 leading-relaxed">
                {description}
              </p>
            )}
          </motion.div>

          {/* شدة الشعلة */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span className="inline-flex items-center gap-1 font-medium">
                🔥 شدة الشعلة
              </span>
              <span className="font-semibold text-gray-800">
                {intensityPercent}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={intensityPercent}
              onChange={(e) => onIntensityChange(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
            <p className="mt-1 text-[11px] text-gray-500">
              {savingIntensity
                ? "جارٍ حفظ مستوى الشدة..."
                : "اضبط مستوى التركيز والنشاط في هذا المجال."}
            </p>
          </motion.div>

          {/* تنقل داخل المجال */}
          <motion.nav
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border bg-white p-3 shadow-sm text-sm space-y-1"
          >
            <p className="mb-2 text-xs font-semibold text-gray-500">
              الأقسام داخل هذا المجال
            </p>

            <SidebarLink
              href={`/life/${encodedId}`}
              icon={<LayoutDashboard className="h-4 w-4" />}
              label="نظرة عامة"
            />
            <SidebarLink
              href={`/life/${encodedId}/goals`}
              icon={<Target className="h-4 w-4" />}
              label="الأهداف & خارطة الطريق"
            />
            <SidebarLink
              href={`/life/${encodedId}/routines`}
              icon={<Repeat className="h-4 w-4" />}
              label="الروتين اليومي"
            />
            <SidebarLink
              href={`/life/${encodedId}/obstacles`}
              icon={<ShieldAlert className="h-4 w-4" />}
              label="العقبات"
            />
          </motion.nav>
        </aside>

        {/* المحتوى الرئيسي يسار */}
        <section className="flex-1 min-w-0">{children}</section>
      </div>
    </div>
  );
}

interface SidebarLinkProps {
  href: string;
  icon: ReactNode;
  label: string;
}

function SidebarLink({ href, icon, label }: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive =
    pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition
      ${
        isActive
          ? "bg-orange-100 text-orange-800"
          : "text-gray-700 hover:bg-orange-50 hover:text-orange-700"
      }`}
    >
      <span className="inline-flex items-center gap-2">
        {icon}
        {label}
      </span>
      {isActive && (
        <span className="h-2 w-2 rounded-full bg-orange-500" />
      )}
    </Link>
  );
}
