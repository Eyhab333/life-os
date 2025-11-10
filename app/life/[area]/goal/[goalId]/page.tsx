"use client";

import { useParams } from "next/navigation";
import { useAuth } from "../../../../../context/AuthContext";
import { db } from "../../../../../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Plus } from "lucide-react";
import { formatDate } from "@/app/lib/helpers";

interface Step {
  id: string;
  title: string;
  description: string;
  done: boolean;
  startDate?: any;
  endDate?: any;
}

export default function RoadmapPage() {
  const { area, goalId } = useParams();
  const { user } = useAuth();
  const [goalTitle, setGoalTitle] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [newStep, setNewStep] = useState("");
  const [newDesc, setNewDesc] = useState("");

  // 🔹 تحميل الهدف والمراحل
  useEffect(() => {
    const fetchGoalData = async () => {
      if (!user || !area || !goalId) return;

      const goalRef = doc(db, `users/${user.uid}/life_areas/${area}/goals/${goalId}`);
      const goalSnap = await getDoc(goalRef);
      if (goalSnap.exists()) setGoalTitle(goalSnap.data().title);

      const roadmapRef = collection(db, `users/${user.uid}/life_areas/${area}/goals/${goalId}/roadmap`);
      const snapshot = await getDocs(roadmapRef);
      const data: Step[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Step[];
      setSteps(data.sort((a, b) => (a.startDate?.seconds || 0) - (b.startDate?.seconds || 0)));
    };
    fetchGoalData();
  }, [user, area, goalId]);

  // ➕ إضافة مرحلة جديدة
  const addStep = async () => {
    if (!user || !newStep.trim()) return;
    const colRef = collection(db, `users/${user.uid}/life_areas/${area}/goals/${goalId}/roadmap`);
    const docRef = await addDoc(colRef, {
      title: newStep,
      description: newDesc,
      done: false,
      startDate: serverTimestamp(),
      endDate: null,
      createdAt: serverTimestamp(),
    });
    setSteps((prev) => [
      ...prev,
      { id: docRef.id, title: newStep, description: newDesc, done: false, startDate: new Date() },
    ]);
    setNewStep("");
    setNewDesc("");
  };

  // ✅ تبديل حالة المرحلة
  const toggleDone = async (id: string, current: boolean) => {
    if (!user) return;
    const stepRef = doc(db, `users/${user.uid}/life_areas/${area}/goals/${goalId}/roadmap/${id}`);
    const updatedFields = current
      ? { done: false, endDate: null }
      : { done: true, endDate: serverTimestamp() };
    await updateDoc(stepRef, updatedFields);
    setSteps((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, ...updatedFields, endDate: current ? null : new Date() } : s
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white px-6 py-10 font-[Tajawal]">
      <h1 className="text-3xl font-bold text-orange-600 mb-2">🗺️ خارطة الطريق</h1>
      <p className="text-gray-600 mb-8">الهدف: <span className="font-semibold">{goalTitle}</span></p>

      {/* 🆕 إضافة مرحلة جديدة */}
      <div className="bg-white p-5 rounded-2xl shadow mb-10">
        <h3 className="font-bold text-gray-800 mb-3">➕ أضف مرحلة جديدة</h3>
        <input
          type="text"
          value={newStep}
          onChange={(e) => setNewStep(e.target.value)}
          placeholder="اسم المرحلة..."
          className="w-full border rounded-xl p-2 mb-2 focus:ring focus:ring-orange-200"
        />
        <textarea
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
          placeholder="وصف مختصر للمرحلة..."
          className="w-full border rounded-xl p-2 mb-3 focus:ring focus:ring-orange-200"
          rows={2}
        />
        <button
          onClick={addStep}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> إضافة مرحلة
        </button>
      </div>

      {/* 🌈 Timeline الأفقي */}
      <div className="overflow-x-auto pb-10">
        <div className="relative flex items-center gap-12 min-w-max px-4">
          {/* الخط المتصل */}
          <div className="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-yellow-400 to-green-400 rounded-full" />

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="relative flex flex-col items-center w-56 min-w-[14rem]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* 🔘 النقطة */}
              <div
                className={`z-10 w-6 h-6 rounded-full border-4 ${
                  step.done
                    ? "bg-green-500 border-green-200 shadow-lg shadow-green-300"
                    : "bg-orange-400 border-orange-200 shadow-md"
                }`}
              ></div>

              {/* 📦 الكارت */}
              <motion.div
                whileHover={{ scale: 1.04 }}
                className={`mt-6 bg-white shadow-lg rounded-2xl p-4 text-center border-t-4 ${
                  step.done ? "border-green-400" : "border-orange-300"
                }`}
              >
                <h4
                  className={`text-lg font-semibold ${
                    step.done ? "text-green-600 line-through" : "text-gray-800"
                  }`}
                >
                  {step.title}
                </h4>
                <p className="text-gray-600 text-sm mt-1 mb-3">
                  {step.description || "بدون وصف"}
                </p>

                {/* التواريخ */}
                <div className="text-xs text-gray-500 space-y-1 mb-3">
                  <p>📅 البداية: {formatDate(step.startDate)}</p>
                  <p>⏳ الإتمام: {formatDate(step.endDate)}</p>

                </div>

                {/* الزر */}
                <button
                  onClick={() => toggleDone(step.id, step.done)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                    step.done
                      ? "bg-green-100 text-green-700 border border-green-400"
                      : "bg-orange-100 text-orange-700 border border-orange-400 hover:bg-orange-200"
                  }`}
                >
                  {step.done ? "✅ مكتملة" : "تم التنفيذ"}
                </button>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
