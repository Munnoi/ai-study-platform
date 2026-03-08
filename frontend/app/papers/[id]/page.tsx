"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function PaperDetailPage() {
  const { id } = useParams(); // Reads the id from url params.
  const router = useRouter();
  const [paper, setPaper] = useState<Paper | null>(null);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (!confirm("Delete this paper and all its questions?")) return;
    await fetch(`/api/papers/${id}/`, { method: "DELETE" });
    router.push("/papers"); // Redirects to /papers after deletion.
  }

  useEffect(() => {
    async function fetchPaper() {
      try {
        const res = await fetch(`/api/papers/${id}/`);
        if (!res.ok) {
          setError("Paper not found.");
          return;
        }
        setPaper(await res.json());
      } catch {
        setError("Something went wrong.");
      }
    }
    fetchPaper();
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">AI Study Platform</h1>
        <div className="flex items-center gap-3">
          <Link
            href={`/papers/${id}/flashcards`}
            className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 border border-indigo-200 rounded-lg transition-colors"
          >
            Flashcards
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
          >
            Delete Paper
          </button>
          <Link
            href="/papers"
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg transition-colors"
          >
            Back to Papers
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {!paper && !error && (
          <p className="text-gray-500">Loading...</p>
        )}

        {paper && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900">
                {paper.title}
              </h2>
              <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                {paper.status}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Uploaded {new Date(paper.uploaded_at).toLocaleDateString()}
            </p>

            {paper.questions.length === 0 && (
              <p className="text-gray-500">No questions were detected.</p>
            )}

            {paper.questions.map((q) => (
              <div
                key={q.id}
                className="bg-white rounded-xl shadow-sm p-6 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold text-gray-900">
                    Q{q.question_number}. {q.question_text}
                  </h4>
                  {q.marks && (
                    <span className="ml-4 shrink-0 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {q.marks} marks
                    </span>
                  )}
                </div>
                <div className="bg-indigo-50 rounded-lg p-4">
                  <p className="text-xs font-medium text-indigo-600 mb-1">
                    AI-Generated Answer
                  </p>
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {q.answer || "No answer generated."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
