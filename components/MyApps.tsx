"use client";

import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { ExternalLink, PlusCircle, Trash2 } from "lucide-react";

interface AppLink {
  id: string;
  name: string;
  url: string;
  color: string;
}

export default function MyApps() {
  const { user } = useAuth();
  const [apps, setApps] = useState<AppLink[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newApp, setNewApp] = useState({ name: "", url: "", color: "#888888" });
  const [loading, setLoading] = useState(true);

  // 🟢 تحميل التطبيقات من Firestore
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const q = query(
        collection(db, "users", user.uid, "my_apps"),
        orderBy("name")
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<AppLink, "id">),
      }));
      setApps(data);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  // 🟡 إضافة تطبيق جديد
  const addApp = async () => {
    if (!user || !newApp.name || !newApp.url) return;
    const ref = collection(db, "users", user.uid, "my_apps");
    const docRef = await addDoc(ref, {
      ...newApp,
      createdAt: new Date().toISOString(),
    });
    setApps([...apps, { id: docRef.id, ...newApp }]);
    setNewApp({ name: "", url: "", color: "#888888" });
    setShowForm(false);
  };

  // 🔴 حذف تطبيق
  const deleteApp = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "my_apps", id));
    setApps(apps.filter((app) => app.id !== id));
  };

  if (loading) return <p>⏳ جاري تحميل تطبيقاتك...</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-700">تطبيقاتي المفضلة</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-orange-500 flex items-center gap-1 hover:text-orange-600 transition"
        >
          <PlusCircle className="w-5 h-5" /> {showForm ? "إلغاء" : "إضافة"}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 border p-4 rounded-xl space-y-3">
          <input
            type="text"
            placeholder="اسم التطبيق"
            value={newApp.name}
            onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
            className="w-full border rounded-lg p-2 focus:ring focus:ring-orange-300"
          />
          <input
            type="text"
            placeholder="رابط التطبيق (URL)"
            value={newApp.url}
            onChange={(e) => setNewApp({ ...newApp, url: e.target.value })}
            className="w-full border rounded-lg p-2 focus:ring focus:ring-orange-300"
          />
          <input
            type="color"
            value={newApp.color}
            onChange={(e) => setNewApp({ ...newApp, color: e.target.value })}
            className="w-16 h-8 cursor-pointer"
          />
          <button
            onClick={addApp}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow"
          >
            حفظ
          </button>
        </div>
      )}

      {apps.length === 0 ? (
        <p className="text-gray-500 text-sm">لم تضف أي تطبيق بعد.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {apps.map((app) => (
            <div
              key={app.id}
              className="flex items-center justify-between p-4 rounded-xl shadow-sm border hover:shadow-md transition"
              style={{ borderColor: app.color }}
            >
              <a
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium flex-1"
                style={{ color: app.color }}
              >
                {app.name}
              </a>
              <div className="flex gap-2 items-center">
                <ExternalLink className="w-4 h-4 text-gray-500" />
                <Trash2
                  onClick={() => deleteApp(app.id)}
                  className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
