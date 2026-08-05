"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { PhoneLite } from "@/lib/queries/phones";

const METRICS: {
  key: keyof Omit<PhoneLite, "id" | "name" | "slug">;
  label: string;
}[] = [
  { key: "battery_mah", label: "autonomie" },
  { key: "ram_gb", label: "RAM" },
  { key: "storage_gb", label: "stockage" },
  { key: "main_camera_mp", label: "photo (MP)" },
  { key: "weight_g", label: "poids" }
];

export default function CompareFromYourPhone({
  current,
  others
}: {
  current: PhoneLite;
  others: PhoneLite[];
}) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const selected = others.find((p) => p.id === selectedId);

  // --- Etat replie : carte "Compare" avec bouton + (design de reference) ---
  if (!open) {
    return (
      <div className="bg-card border border-dashed border-hairline rounded-xl p-5 h-full flex flex-col">
        <div className="font-mono text-[11px] uppercase tracking-wide text-muted mb-1">
          Compare
        </div>
        <p className="text-sm text-muted mb-4">Comparez ce téléphone au vôtre.</p>
        <button
          onClick={() => setOpen(true)}
          className="mt-auto flex items-center justify-center gap-2 w-full border border-hairline rounded-lg py-3 text-sm text-muted hover:text-white hover:border-signal/40 transition-colors"
        >
          <Plus size={16} strokeWidth={1.75} />
          Ajouter un téléphone
        </button>
      </div>
    );
  }

  // --- Etat ouvert : selection + delta vs le telephone choisi ---
  return (
    <div className="bg-card border border-hairline rounded-xl p-5 h-full">
      <div className="flex items-center justify-between mb-2">
        <div className="font-mono text-[11px] uppercase tracking-wide text-muted">Compare</div>
        <button
          onClick={() => {
            setOpen(false);
            setSelectedId("");
          }}
          className="text-muted hover:text-white transition-colors"
          title="Fermer"
        >
          <X size={14} />
        </button>
      </div>

      <label className="text-sm font-medium block mb-2">
        Vous possédez déjà un téléphone ?
      </label>
      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="w-full border border-hairline rounded-lg px-3 py-2 text-sm bg-panel mb-3"
      >
        <option value="">Choisir mon téléphone actuel...</option>
        {others.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      {selected && (
        <div>
          <div className="font-mono text-xs text-muted uppercase mb-2">
            Depuis votre {selected.name}
          </div>
          <div className="flex flex-wrap gap-2">
            {METRICS.map(({ key, label }) => {
              const oldValue = selected[key];
              const newValue = current[key];
              if (
                oldValue === null ||
                newValue === null ||
                oldValue === undefined ||
                newValue === undefined ||
                oldValue === 0
              )
                return null;

              const delta = ((newValue - oldValue) / oldValue) * 100;
              if (delta === 0) return null;

              const sign = delta > 0 ? "+" : "";
              // Pour le poids, une baisse est une amelioration -> on l'affiche en vert aussi.
              const isImprovement = key === "weight_g" ? delta < 0 : delta > 0;

              return (
                <span
                  key={key}
                  className={`font-mono text-xs rounded-full px-2.5 py-1 ${
                    isImprovement
                      ? "bg-signal/10 text-signal"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {sign}
                  {delta.toFixed(0)}% {label}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
