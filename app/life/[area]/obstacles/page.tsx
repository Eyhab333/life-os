import AreaObstacles from "../../../../components/AreaObstacles";

interface ObstaclesPageProps {
  params: { area: string };
}

export default function ObstaclesPage({ params }: ObstaclesPageProps) {
  const areaId = decodeURIComponent(params.area);

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h1 className="mb-1 text-xl font-bold text-orange-600">
          🚧 العقبات
        </h1>
        <p className="text-sm text-gray-600">
          سجّل التحديات والعقبات التي تواجهك في هذا المجال واعمل على حلّها
          خطوة بخطوة.
        </p>
      </div>

      <AreaObstacles areaId={areaId} />
    </section>
  );
}
