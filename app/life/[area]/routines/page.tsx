import AreaDailyRoutines from "../../../../components/AreaDailyRoutines";

interface RoutinesPageProps {
  params: { area: string };
}

export default function RoutinesPage({ params }: RoutinesPageProps) {
  const areaId = decodeURIComponent(params.area);

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h1 className="mb-1 text-xl font-bold text-orange-600">
          🧘 الروتين اليومي
        </h1>
        <p className="text-sm text-gray-600">
          هنا تدير العادات والروتينات اليومية المرتبطة بهذا المجال.
        </p>
      </div>

      <AreaDailyRoutines areaId={areaId} />
    </section>
  );
}
