"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Map, Heart, Settings } from "lucide-react";

export default function BottomNav() {
  const path = usePathname();

  const links = [
    { href: "/dashboard", icon: Home, label: "الرئيسية" },
    { href: "/mood", icon: Heart, label: "فترات المزاج" },
    { href: "/life", icon: Map, label: "شعلاتي" },
    { href: "/settings", icon: Settings, label: "الإعدادات" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 shadow-md z-40 sm:hidden">
      <ul className="flex justify-around items-center py-2 text-sm">
        {links.map(({ href, icon: Icon, label }) => {
          const isActive = path.startsWith(href);

          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex flex-col items-center transition ${
                  isActive ? "text-orange-600 font-semibold" : "text-gray-500 hover:text-orange-500"
                }`}
              >
                {isActive ? (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <Icon className="w-6 h-6 mb-0.5" />
                  </motion.div>
                ) : (
                  <Icon className="w-5 h-5 mb-0.5" />
                )}
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
