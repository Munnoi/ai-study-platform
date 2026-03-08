"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/users/logout/", {
      method: "POST",
    });
    router.replace("/login");
    router.refresh();
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">AI Study Platform</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-white hover:bg-red-500 border border-gray-300 hover:border-transparent rounded-lg transition-colors duration-200"
        >
          Logout
        </button>
      </header>
      <main className="flex flex-col items-center justify-center px-4 py-24">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome back!</h2>
        <p className="text-gray-500 text-lg">Your AI-powered study dashboard</p>
      </main>
    </div>
  );
}
