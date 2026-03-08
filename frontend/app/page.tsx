"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Question {
  id: number;
  question_number: number;
  question_text: string;
  answer: string;
  marks: number | null;
}

interface Paper {
  id: number;
  title: string;
  status: string;
  uploaded_at: string;
  questions: Question[];
}

export default function Home() {
  const router = useRouter();
  const [papers, setPapers] = useState<Paper[]>([]);

  useEffect(() => {
    fetch("/api/papers/list/")
      .then((res) => (res.ok ? res.json() : []))
      .then(setPapers)
      .catch(() => {});
  }, []);

  async function handleLogout() {
    await fetch("/api/users/logout/", { method: "POST" });
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
      <main className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome back!</h2>
          <p className="text-gray-500 text-lg mb-8">Your AI-powered study dashboard</p>
          <Link
            href="/papers"
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Upload Question Paper
          </Link>
        </div>

        {papers.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Recent Papers
            </h3>
            <div className="space-y-3">
              {papers.map((p) => (
                <Link
                  key={p.id}
                  href={`/papers/${p.id}`}
                  className="block bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {p.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {p.questions.length} questions &middot;{" "}
                        {new Date(p.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                      {p.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
