"use client";
import { useAuth } from "../context/AuthContext";
import GoogleLogin from "./GoogleLogin";

export default function ProtectedPage({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-20">⏳ جاري التحميل...</p>;

  if (!user) return <GoogleLogin />;

  return <>{children}</>;
}
