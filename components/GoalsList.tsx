"use client";

import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { collection, addDoc, getDocs, doc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
}

export default function GoalsList({ area }: { area: string }) {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 تحميل الأهداف من Firestore
  useEffect(() => {
    const fetchGoals = async () => {
      if (!user || !area) return;
      try {
        const colRef = collection(db, `users/${user.uid}/life_areas/${area}/goals`);
        const snapshot = await getDocs(colRef);
        const data: Goal[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Goal[];
        setGoals(data);
      } catch (err) {
        console.error("❌ خطأ في تحميل الأهداف:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, [user, area]);

  // ➕ إضافة هدف جديد
  const addGoal = async () => {
    if (!user || !newGoal.trim()) return;
    try {
      const colRef = collection(db, `users/${user.uid}/life_areas/${area}/goals`);
      const docRef = await addDoc(colRef, {
        title: newGoal,
        description: desc,
        progress: 0,
        createdAt: serverTimestamp(),
      });
      setGoals([...goals, { id: docRef.id, title: newGoal, description: desc, progress: 0 }]);
      setNewGoal("");
      setDesc("");
    } catch (err) {
      console.error("❌ خطأ في الإضافة:", err);
    }
  };

  // 🗑️ حذف هدف
  const deleteGoal = async (id: string) => {
    if (!user) return;
    if (!confirm("هل أنت متأكد من حذف هذا الهدف؟")) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/life_areas/${area}/goals/${id}`));
      setGoals(goals.filter((g) => g.id !== id));
    } catch (err) {
      console.error("❌ خطأ في الحذف:", err);
    }
  };

  if (loading) return <p>⏳ جاري تحميل الأهداف...</p>;

  return (
    <div className="space-y-6">
      {/* 🆕 إضافة هدف جديد */}
      <div className="bg-white p-5 rounded-2xl shadow">
        <h3 className="font-bold text-gray-800 mb-3">🎯 أضف هدفًا جديدًا</h3>
        <input
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder="اسم الهدف..."
          className="w-full border rounded-xl p-2 mb-2 focus:ring focus:ring-orange-200"
        />
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="وصف مختصر للهدف..."
          className="w-full border rounded-xl p-2 mb-3 focus:ring focus:ring-orange-200"
          rows={2}
        />
        <button
          onClick={addGoal}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> إضافة هدف
        </button>
      </div>

      {/* 🔸 عرض الأهداف */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {goals.map((goal) => (
          <motion.div
            key={goal.id}
            whileHover={{ scale: 1.03 }}
            className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition relative"
          >
            <Link href={`/life/${encodeURIComponent(area)}/goal/${goal.id}`}>
              <h4 className="text-lg font-semibold text-orange-600 mb-1">{goal.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{goal.description || "بدون وصف"}</p>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${goal.progress}%` }}
                  transition={{ duration: 0.6 }}
                  className="h-full bg-orange-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{goal.progress}% إنجاز</p>
            </Link>
            <button
              onClick={() => deleteGoal(goal.id)}
              className="absolute top-3 left-3 text-gray-400 hover:text-red-500 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
