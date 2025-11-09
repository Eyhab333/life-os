import { db } from "./config";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  writeBatch,
} from "firebase/firestore";
import { User } from "firebase/auth";

export const createUserIfNotExists = async (user: User) => {
  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    // ✨ إنشاء المستند الأساسي
    await setDoc(userRef, {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      provider: user.providerData[0]?.providerId || "google",
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      theme: "light",
      locale: "ar",
    });

    // 🧱 إنشاء البيانات الأولية
    await initializeUserData(user.uid);
    console.log("✅ مستخدم جديد تمت تهيئته");
  } else {
    await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
    console.log("👋 مستخدم موجود، تم تحديث آخر دخول");
  }
};

// 🧩 إنشاء المجموعات الافتراضية (الجوانب + الكمبوننتس)
async function initializeUserData(userId: string) {
  const batch = writeBatch(db);

  // 1. الجوانب العشرة الافتراضية
  const lifeAreas = [
    "المالي",
    "المهني",
    "الصحي",
    "النفسي",
    "الروحاني",
    "العقلي",
    "البشري",
    "الأسري",
    "العائلي",
    "الإجتماعي",
  ];

  lifeAreas.forEach((name, index) => {
    const areaRef = doc(collection(db, `users/${userId}/life_areas`));
    batch.set(areaRef, {
      name,
      order: index + 1,
      intensity: 0.5,
      createdAt: serverTimestamp(),
      color: "#A1A1AA",
    });
  });

  // 2. كمبونات الصفحة الرئيسية
  const dashboardComponents = [
    { type: "philosophy", title: "فلسفتي الشخصية", order: 1 },
    { type: "life_flames", title: "شعلات حياتي", order: 2 },
    { type: "journey", title: "مراحل من رحلتي", order: 3 },
    { type: "my_mix", title: "جلسة اليوم", order: 4 },
  ];

  dashboardComponents.forEach((comp) => {
    const compRef = doc(collection(db, `users/${userId}/dashboard_components`));
    batch.set(compRef, {
      ...comp,
      visible: true,
      createdAt: serverTimestamp(),
    });
  });

  await batch.commit();
}
