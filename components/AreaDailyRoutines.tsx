"use client";

import { useMemo, useState } from "react";
import { Plus, CheckCircle2, Ban, Clock } from "lucide-react";

type Frequency = "daily" | "weekly" | "monthly";
type RoutineType = "do" | "avoid";
type TimeOfDay = "any" | "morning" | "afternoon" | "evening";

interface Routine {
  id: string;
  title: string;
  description?: string;
  frequency: Frequency;
  type: RoutineType;
  timeOfDay: TimeOfDay;
  yearGroup?: number;
  groupLabel: string;
  daysOfWeek?: number[]; // لو weekly
  dayOfMonth?: number; // لو monthly
  isActive: boolean;
}

interface AreaDailyRoutinesProps {
  areaId: string;
}

const timeOfDayLabels: Record<TimeOfDay, string> = {
  any: "أي وقت",
  morning: "الصباح",
  afternoon: "بعد الظهر",
  evening: "المساء",
};

const frequencyLabel: Record<Frequency, string> = {
  daily: "روتين يومي",
  weekly: "روتين أسبوعي",
  monthly: "روتين شهري",
};

export default function AreaDailyRoutines({ areaId }: AreaDailyRoutinesProps) {
  // 🧠 مبدئيًا: روتينات فاضية (هنربطها بعدين بـ Firestore)
  const [routines, setRoutines] = useState<Routine[]>([]);

  // 📦 الحزم (groupLabel) المستخرجة من الروتينات
  const groupLabels = useMemo(() => {
    const labels = Array.from(new Set(routines.map((r) => r.groupLabel)));
    if (labels.length === 0) {
      // لو لسه مفيش حاجة، ندي افتراضي
      return [`روتين ${new Date().getFullYear()}`];
    }
    return labels;
  }, [routines]);

  const [selectedGroupLabel, setSelectedGroupLabel] = useState<string | null>(
    null
  );

  // نتأكد دايمًا إن فيه group مختار
  const currentGroup =
    selectedGroupLabel || groupLabels[0] || `روتين ${new Date().getFullYear()}`;

  // 🆕 فورم إضافة روتين جديد
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newFrequency, setNewFrequency] = useState<Frequency>("daily");
  const [newType, setNewType] = useState<RoutineType>("do");
  const [newTimeOfDay, setNewTimeOfDay] = useState<TimeOfDay>("any");
  const [newDayOfMonth, setNewDayOfMonth] = useState<number | undefined>();
  const [newDaysOfWeek, setNewDaysOfWeek] = useState<number[]>([]);
  const [showForm, setShowForm] = useState(false);

  // تقسيم الروتينات حسب النوع والحزمة الحاليّة
  const filtered = useMemo(() => {
    const current = routines.filter((r) => r.groupLabel === currentGroup);
    return {
      daily: current.filter((r) => r.frequency === "daily"),
      weekly: current.filter((r) => r.frequency === "weekly"),
      monthly: current.filter((r) => r.frequency === "monthly"),
    };
  }, [routines, currentGroup]);

  const toggleDayOfWeek = (day: number) => {
    setNewDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleAddRoutine = () => {
    if (!newTitle.trim()) return;

    const year = new Date().getFullYear();
    const id = Math.random().toString(36).slice(2); // مبدئيًا ID عشوائي

    const newRoutine: Routine = {
      id,
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      frequency: newFrequency,
      type: newType,
      timeOfDay: newTimeOfDay,
      yearGroup: year,
      groupLabel: currentGroup,
      isActive: true,
    };

    if (newFrequency === "weekly") {
      newRoutine.daysOfWeek = [...newDaysOfWeek].sort();
    }

    if (newFrequency === "monthly" && newDayOfMonth) {
      newRoutine.dayOfMonth = newDayOfMonth;
    }

    setRoutines((prev) => [...prev, newRoutine]);

    // نفضّي الفورم
    setNewTitle("");
    setNewDescription("");
    setNewDaysOfWeek([]);
    setNewDayOfMonth(undefined);
    setNewFrequency("daily");
    setNewType("do");
    setNewTimeOfDay("any");
    setShowForm(false);
  };

  const toggleActive = (id: string) => {
    setRoutines((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  };

  // 🗓️ مسميات الأيام (لو استخدمنا weekly)
  const weekDaysShort = ["أح", "اث", "ثل", "أر", "خم", "جم", "سب"];

  return (
    <section className="space-y-5 mt-4">
      {/* 🔝 شريط الحزم */}
      <div className="bg-white rounded-2xl shadow p-4 border">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              🧩 روتيني في هذا المجال
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              المجال: <span className="font-mono text-[11px]">{areaId}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {groupLabels.map((label) => (
            <button
              key={label}
              onClick={() => setSelectedGroupLabel(label)}
              className={`px-3 py-1.5 rounded-full text-xs border transition ${
                label === currentGroup
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-orange-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ➕ زر فتح فورم إضافة روتين */}
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-700">
          الحزمة الحالية: <span className="text-orange-600">{currentGroup}</span>
        </h3>
        <button
          className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700"
          onClick={() => setShowForm((s) => !s)}
        >
          <Plus className="w-4 h-4" />
          {showForm ? "إخفاء فورم الإضافة" : "إضافة روتين جديد"}
        </button>
      </div>

      {/* 📝 فورم إضافة روتين جديد (UI فقط) */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow p-4 border space-y-3 text-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              عنوان الروتين
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="مثلاً: ادخار 2% من الراتب / عدم الصرف بهبل..."
              className="w-full border rounded-xl px-3 py-2 text-sm focus:ring focus:ring-orange-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              وصف (اختياري)
            </label>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={2}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:ring focus:ring-orange-200"
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            {/* نوع التكرار */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                نوع التكرار
              </label>
              <select
                value={newFrequency}
                onChange={(e) => setNewFrequency(e.target.value as Frequency)}
                className="w-full border rounded-xl px-3 py-2 text-sm focus:ring focus:ring-orange-200"
              >
                <option value="daily">يومي</option>
                <option value="weekly">أسبوعي</option>
                <option value="monthly">شهري</option>
              </select>
            </div>

            {/* نوع الروتين */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                نوع الروتين
              </label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as RoutineType)}
                className="w-full border rounded-xl px-3 py-2 text-sm focus:ring focus:ring-orange-200"
              >
                <option value="do">فعل إيجابي (أقوم به)</option>
                <option value="avoid">امتناع (أتوقف عنه)</option>
              </select>
            </div>

            {/* وقت اليوم */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                وقت التنفيذ
              </label>
              <select
                value={newTimeOfDay}
                onChange={(e) => setNewTimeOfDay(e.target.value as TimeOfDay)}
                className="w-full border rounded-xl px-3 py-2 text-sm focus:ring focus:ring-orange-200"
              >
                <option value="any">أي وقت</option>
                <option value="morning">الصباح</option>
                <option value="afternoon">بعد الظهر</option>
                <option value="evening">المساء</option>
              </select>
            </div>
          </div>

          {/* إعدادات إضافية حسب نوع التكرار */}
          {newFrequency === "weekly" && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                الأيام المستهدفة في الأسبوع
              </label>
              <div className="flex flex-wrap gap-1">
                {weekDaysShort.map((label, idx) => {
                  const selected = newDaysOfWeek.includes(idx);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleDayOfWeek(idx)}
                      className={`px-2 py-1 rounded-full text-xs border ${
                        selected
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-orange-50"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {newFrequency === "monthly" && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                اليوم من الشهر
              </label>
              <input
                type="number"
                min={1}
                max={31}
                value={newDayOfMonth ?? ""}
                onChange={(e) =>
                  setNewDayOfMonth(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="w-32 border rounded-xl px-3 py-2 text-sm focus:ring focus:ring-orange-200"
              />
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAddRoutine}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              حفظ الروتين في هذه الحزمة
            </button>
          </div>
        </div>
      )}

      {/* 🔹 الروتين اليومي */}
      <RoutinesBlock
        title={frequencyLabel.daily}
        routines={filtered.daily}
        onToggleActive={toggleActive}
      />

      {/* 🔹 الروتين الأسبوعي */}
      <RoutinesBlock
        title={frequencyLabel.weekly}
        routines={filtered.weekly}
        onToggleActive={toggleActive}
      />

      {/* 🔹 الروتين الشهري */}
      <RoutinesBlock
        title={frequencyLabel.monthly}
        routines={filtered.monthly}
        onToggleActive={toggleActive}
      />
    </section>
  );
}

interface RoutinesBlockProps {
  title: string;
  routines: Routine[];
  onToggleActive: (id: string) => void;
}

function RoutinesBlock({ title, routines, onToggleActive }: RoutinesBlockProps) {
  return (
    <section className="bg-white rounded-2xl shadow p-4 border text-sm">
      <h3 className="font-semibold text-gray-800 mb-3">{title}</h3>

      {routines.length === 0 ? (
        <p className="text-xs text-gray-500">
          لا يوجد روتين في هذا القسم بعد.
        </p>
      ) : (
        <ul className="space-y-2">
          {routines.map((r) => (
            <li
              key={r.id}
              className="flex items-start justify-between bg-gray-50 rounded-xl px-3 py-2"
            >
              <div className="flex items-start gap-2">
                <button
                  type="button"
                  onClick={() => onToggleActive(r.id)}
                  className={`mt-1 ${
                    r.isActive ? "text-green-600" : "text-gray-400"
                  }`}
                  aria-label="تفعيل/إيقاف الروتين"
                >
                  {r.type === "do" ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Ban className="w-4 h-4" />
                  )}
                </button>
                <div>
                  <p
                    className={`font-medium ${
                      r.isActive ? "text-gray-800" : "text-gray-400 line-through"
                    }`}
                  >
                    {r.title}
                  </p>
                  {r.description && (
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {r.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {timeOfDayLabels[r.timeOfDay]}
                    </span>

                    {r.frequency === "weekly" && r.daysOfWeek && (
                      <span>أيام: {r.daysOfWeek.join(", ")}</span>
                    )}

                    {r.frequency === "monthly" && r.dayOfMonth && (
                      <span>اليوم {r.dayOfMonth} من كل شهر</span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
 