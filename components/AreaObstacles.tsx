"use client";

interface AreaObstaclesProps {
  areaId: string;
}

export default function AreaObstacles({ areaId }: AreaObstaclesProps) {
  return (
    <section className="bg-white rounded-2xl shadow p-5 border space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">
          🚧 العقبات   
        </h2>
        
      </div>

      {/* هنا بعدين هنحط: إضافة عقبة + قائمة العقبات + حالة كل عقبة */}
      <p className="text-sm text-gray-500">
        هنا هتسجّل العوائق اللي بتوقف تقدمك في هذا المجال، وخططك للتعامل معاها.
      </p>
    </section>
  );
}
