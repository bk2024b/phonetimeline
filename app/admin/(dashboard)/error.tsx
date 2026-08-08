"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AdminError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="p-8 flex items-center justify-center min-h-[70vh]">
      <div className="max-w-md w-full bg-surface border border-line rounded p-6 text-center">
        <div className="text-3xl mb-3">⚠️</div>
        <h1 className="text-lg font-bold mb-2">Une erreur est survenue</h1>
        <p className="text-sm text-inksoft mb-1">
          Quelque chose s&apos;est mal passé pendant le chargement ou
          l&apos;enregistrement.
        </p>
        {error.message && (
          <p className="text-xs font-mono text-inksoft bg-bg border border-line rounded px-3 py-2 mt-3 mb-1 text-left break-words">
            {error.message}
          </p>
        )}
        <div className="flex items-center justify-center gap-3 mt-5">
          <button
            onClick={() => reset()}
            className="bg-jade text-white text-sm font-medium px-4 py-2 rounded"
          >
            Réessayer
          </button>
          <Link
            href="/admin"
            className="text-sm text-inksoft hover:text-ink font-medium px-4 py-2"
          >
            ← Tableau de bord
          </Link>
        </div>
      </div>
    </main>
  );
}
