"use client";

import { useEffect, useState } from "react";
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

export default function PapersPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paper, setPaper] = useState<Paper | null>(null);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchPapers();
  }, []);

  async function fetchPapers() {
    try {
      const res = await fetch("/api/papers/list/");
      if (res.ok) {
        setPapers(await res.json());
      }
    } catch {}
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this paper and all its questions?")) return;
    setDeleting(id);
    try {
      await fetch(`/api/papers/${id}/`, { method: "DELETE" });
      setPapers((prev) => prev.filter((p) => p.id !== id));
      if (paper?.id === id) setPaper(null);
    } catch {} finally {
      setDeleting(null);
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title) return;

    setLoading(true);
    setError("");
    setPaper(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    try {
      const res = await fetch("/api/papers/upload/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || JSON.stringify(data));
        return;
      }

      setPaper(data);
      setTitle("");
      setFile(null);
      fetchPapers();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">AI Study Platform</h1>
        <Link
          href="/"
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg transition-colors"
        >
          Back to Dashboard
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Upload Question Paper
        </h2>

        <form
          onSubmit={handleUpload}
          className="bg-white rounded-xl shadow-sm p-6 mb-8 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full text-gray-400 placeholder:text-gray-400 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Physics Mid-Term 2025"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PDF File
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Processing…" : "Upload & Generate Answers"}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        {paper && (
          <div className="space-y-4 mb-12">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">
                {paper.title}
              </h3>
              <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                {paper.status}
              </span>
            </div>

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

        {papers.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your Papers
            </h2>
            <div className="space-y-3">
              {papers.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow flex items-center justify-between"
                >
                  <Link href={`/papers/${p.id}`} className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">
                      {p.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {p.questions.length} questions &middot;{" "}
                      {new Date(p.uploaded_at).toLocaleDateString()}
                    </p>
                  </Link>
                  <div className="flex items-center gap-3 ml-4">
                    <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                      {p.status}
                    </span>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deleting === p.id}
                      className="px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {deleting === p.id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
