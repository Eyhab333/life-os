import GoogleLogin from "../components/GoogleLogin";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🔥 Life OS</h1>
      <GoogleLogin />
    </main>
  );
}
