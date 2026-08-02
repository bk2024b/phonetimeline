"use client";

import { useState } from "react";
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
  const [selectedId, setSelectedId] = useState("");
  const selected = others.find((p) => p.id === selectedId);

  return (
    <section className="bg-card border border-hairline rounded-xl p-5 mb-10">
      <label className="text-sm font-medium block mb-2">
        Vous possédez déjà un téléphone ? Comparez-le à celui-ci.
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
              // Pour le poids, une baisse est une amélioration -> on l'affiche en vert aussi.
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
    </section>
  );
}
