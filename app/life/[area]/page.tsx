interface AreaOverviewPageProps {
  params: { area: string };
}

export default function AreaOverviewPage({ params }: AreaOverviewPageProps) {
  const areaId = decodeURIComponent(params.area);

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-orange-600">
          لوحة تحكم المجال
        </h1>
        <p className="text-sm text-gray-600">
          هذه نظرة عامة على المجال:{" "}
          <span className="font-semibold">{areaId}</span>.  
          من القائمة الجانبية يمكنك الانتقال لإدارة الأهداف،
          الروتين اليومي، والعقبات المرتبطة بهذا المجال.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-4 text-sm shadow-sm">
          <h2 className="mb-1 text-sm font-semibold text-gray-800">
            🎯 الأهداف
          </h2>
          <p className="text-xs text-gray-600">
            راقب أهدافك طويلة ومتوسطة المدى لهذا المجال من صفحة الأهداف.
          </p>
        </div>
        <div className="rounded-2xl border bg-white p-4 text-sm shadow-sm">
          <h2 className="mb-1 text-sm font-semibold text-gray-800">
            🧘 الروتين اليومي
          </h2>
          <p className="text-xs text-gray-600">
            أنشئ عادات وأنظمة يومية تدعم هذا الجانب من حياتك.
          </p>
        </div>
        <div className="rounded-2xl border bg-white p-4 text-sm shadow-sm">
          <h2 className="mb-1 text-sm font-semibold text-gray-800">
            🚧 العقبات
          </h2>
          <p className="text-xs text-gray-600">
            سجّل العوائق والتحديات حتى تعمل على حلّها تدريجيًا.
          </p>
        </div>
      </div>
    </section>
  );
}
