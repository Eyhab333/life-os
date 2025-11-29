"use client";

import ProtectedPage from "../../components/ProtectedPage";
import LifeFlames from "../../components/LifeFlames";

export default function LifePage() {
  return (
    <ProtectedPage>
      <div className="min-h-screen bg-gray-50 font-[Tajawal] text-gray-800">
        <main className="max-w-5xl mx-auto px-4 pb-10 pt-4">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-orange-600">🔥 شعلات حياتي</h1>
            <p className="text-gray-600 text-sm mt-1">
              هنا تتابع حرارة كل مجال في حياتك وتعدّل شدته وترتبط بالأهداف وخارطة الطريق.
            </p>
          </div>

          <LifeFlames />
        </main>
      </div>
    </ProtectedPage>
  );
}
