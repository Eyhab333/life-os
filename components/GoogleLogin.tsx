"use client";
import { useState, useEffect } from "react";
import { signInWithPopup, signOut, User } from "firebase/auth";
import { auth, provider } from "../firebase/config";
import { createUserIfNotExists } from "../firebase/userService";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function GoogleLogin() {

  const [user, setUser] = useState<User | null>(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // نوقف المراقبة عند الخروج من الصفحة
  }, []);

  const router = useRouter();
const handleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const currentUser = result.user;
    setUser(currentUser);
    await createUserIfNotExists(currentUser);

    // ✅ تحويل تلقائي بعد تسجيل الدخول
    router.push("/dashboard");
  } catch (error) {
    console.error("❌ Login error:", error);
  }
};

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      console.log("✅ User logged out");
    } catch (error) {
      console.error("❌ Logout error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center mt-20">
      {user ? (
        <div className="text-center">
          <p className="text-xl mb-4">أهلاً {user.displayName} 👋</p>
          <img
            src={user.photoURL || ""}
            alt="User Avatar"
            className="w-20 h-20 rounded-full mx-auto shadow-lg"
          />
          <p className="mt-2 text-sm text-gray-500">{user.email}</p>

          <button
            onClick={handleLogout}
            className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl shadow"
          >
            تسجيل الخروج
          </button>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow"
        >
          تسجيل الدخول بحساب Google
        </button>
      )}
    </div>
  );
}
