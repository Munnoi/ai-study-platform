"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

// Represents the Flashcard model in backend.
interface Flashcard {
  id: number;
  front: string;
  back: string;
}

export default function FlashcardsPage() {
  const { id } = useParams();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  async function fetchFlashcards() {
    try {
      const res = await fetch(`/api/papers/${id}/flashcards`);
      if (res.ok) {
        const data = await res.json();
        setFlashcards(Array.isArray(data) ? data : []);
      }
    } catch {
      setError("Failed to load flashcards.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate() {
    setGenerating(true);
    setError("");
    try {
      const res = await fetch(`/api/papers/${id}/flashcards`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to generate flashcards.");
        return;
      }
      const data = await res.json();
      setFlashcards(Array.isArray(data) ? data : []);
      setFlipped(new Set());
    } catch {
      setError("Failed to generate flashcards.");
    } finally {
      setGenerating(false);
    }
  }

  // Cardflip func.
  function toggleFlip(cardId: number) {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) next.delete(cardId);
      else next.add(cardId);
      return next;
    });
  }

  useEffect(() => {
    fetchFlashcards();
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Flashcards</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {generating ? "Generating..." : "Generate Flashcards"}
          </button>
          <Link
            href={`/papers/${id}`}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg transition-colors"
          >
            Back to Paper
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading && <p className="text-gray-500">Loading...</p>}

        {!loading && flashcards.length === 0 && !error && (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">
              No flashcards yet. Click &quot;Generate Flashcards&quot; to create
              them from this paper&apos;s Q&amp;A pairs.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {flashcards.map((card) => (
            <div
              key={card.id}
              onClick={() => toggleFlip(card.id)}
              className="cursor-pointer min-h-[200px] rounded-xl shadow-sm transition-all hover:shadow-md"
            >
              <div
                className={`h-full rounded-xl p-6 flex items-center justify-center text-center ${
                  flipped.has(card.id)
                    ? "bg-indigo-50 border-2 border-indigo-200"
                    : "bg-white border-2 border-gray-200"
                }`}
              >
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-2">
                    {flipped.has(card.id) ? "BACK" : "FRONT"} — click to flip
                  </p>
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {flipped.has(card.id) ? card.back : card.front}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
