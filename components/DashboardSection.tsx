"use client";

import { useState, ReactNode } from "react";

interface DashboardSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export default function DashboardSection({
  title,
  children,
  defaultOpen = true,
}: DashboardSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-2xl shadow mb-6 overflow-hidden border">
      <div className="flex justify-between items-center px-4 py-3">
        <h2 className="font-semibold text-lg">{title}</h2>
        <div className="flex gap-3 items-center">
          {/* هنا هنحط زر القلم بعدين */}
          <button
            onClick={() => setOpen((p) => !p)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            {open ? "إخفاء" : "عرض"}
          </button>
        </div>
      </div>
      {open && <div className="px-4 pb-4 pt-1">{children}</div>}
    </div>
  );
}
