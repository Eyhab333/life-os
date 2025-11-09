"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Save, ShieldCheck, Pencil } from "lucide-react";

export default function MyPhilosophy() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  const [message, setMessage] = useState("");
  const [vision, setVision] = useState("");
  const [values, setValues] = useState("");
  const [principles, setPrinciples] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return;
        const ref = doc(db, "users", user.uid, "personal", "philosophy");
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setMessage(data.message || "");
          setVision(data.vision || "");
          setValues(data.values || "");
          setPrinciples(data.principles || "");
        }
      } catch {
        setError("حدث خطأ أثناء تحميل البيانات.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const saveData = async () => {
    if (!user) return setError("المستخدم غير مسجّل الدخول.");
    if (!message.trim() && !vision.trim() && !values.trim() && !principles.trim()) {
      setError("⚠️ اكتب على الأقل جزءًا واحدًا قبل الحفظ.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const ref = doc(db, "users", user.uid, "personal", "philosophy");
      await setDoc(
        ref,
        { message, vision, values, principles, updatedAt: new Date().toISOString() },
        { merge: true }
      );
      setIsEditing(false);
    } catch {
      setError("حدث خطأ أثناء الحفظ.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>⏳ جاري تحميل فلسفتك...</p>;

  const fields = [
    { label: "رسالتي في الحياة", value: message, setter: setMessage },
    { label: "رؤيتي المستقبلية", value: vision, setter: setVision },
    { label: "قيم حياتي", value: values, setter: setValues },
    { label: "مبادئي وفلسفتي", value: principles, setter: setPrinciples },
  ];

  return (
    <div className="space-y-5">
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-xl text-sm"
        >
          {error}
        </motion.p>
      )}

      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-700">فلسفتي الشخصية</h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 text-orange-500 hover:text-orange-600 text-sm"
          >
            <Pencil className="w-4 h-4" /> تعديل
          </button>
        )}
      </div>

      {fields.map((f, i) => (
        <div key={i}>
          <label className="block text-gray-700 font-semibold mb-2">{f.label}</label>
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.textarea
                key="edit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                rows={3}
                value={f.value}
                onChange={(e) => f.setter(e.target.value)}
                className="w-full border rounded-xl p-3 focus:ring focus:ring-orange-300"
                placeholder={`اكتب ${f.label.toLowerCase()} هنا...`}
              />
            ) : (
              <motion.p
                key="view"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-700 whitespace-pre-wrap min-h-[60px]"
              >
                {f.value || "— لا يوجد نص —"}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      ))}

      {isEditing && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={saveData}
          disabled={saving}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl shadow font-semibold flex items-center gap-2"
        >
          <ShieldCheck className="w-5 h-5" />
          {saving ? "جارٍ الحفظ..." : "حفظ بأمان"}
        </motion.button>
      )}
    </div>
  );
}
