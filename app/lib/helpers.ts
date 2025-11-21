// app/lib/helpers.ts

/**
 * تنسيق التاريخ القادم من Firestore أو من Date أو String
 * بشكل ذكي ومتعدد المصادر.
 * الناتج يكون بالشكل: 10 / 11 / 2025
 */
export function formatDate(val: any): string {
  if (!val) return "—";

  let date: Date | null = null;

  // Firestore Timestamp
  if (val.seconds) {
    date = new Date(val.seconds * 1000);
  }

  // JS Date
  else if (val instanceof Date) {
    date = val;
  }

  // String
  else if (typeof val === "string") {
    const parsed = new Date(val);
    if (!isNaN(parsed.getTime())) {
      date = parsed;
    }
  }

  if (!date) return "—";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day} / ${month} / ${year}`;
}
