import GoalsList from "../../../../components/GoalsList";

interface GoalsPageProps {
  params: { area: string };
}

export default function GoalsPage({ params }: GoalsPageProps) {
  const areaId = decodeURIComponent(params.area);

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h1 className="mb-1 text-xl font-bold text-orange-600">
          🎯 أهداف هذا المجال
        </h1>
        <p className="text-sm text-gray-600">
          أضف أهدافًا جديدة، عدّلها، وتابع نسبة التقدّم الخاصة بكل هدف.
        </p>
      </div>

      <GoalsList area={areaId} />
    </section>
  );
}
