"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { ComparablePhone } from "@/lib/queries/compare";

type Row = {
  label: string;
  unit: string;
  key: keyof ComparablePhone;
  higherIsBetter: boolean | null; // null = pas de comparaison (texte)
};

const ROWS: Row[] = [
  { label: "Écran", unit: '"', key: "screen_size", higherIsBetter: true },
  { label: "Type de dalle", unit: "", key: "screen_type", higherIsBetter: null },
  { label: "Taux de rafraîchissement", unit: " Hz", key: "refresh_rate", higherIsBetter: true },
  { label: "Processeur", unit: "", key: "processor", higherIsBetter: null },
  { label: "RAM", unit: " Go", key: "ram_gb", higherIsBetter: true },
  { label: "Stockage", unit: " Go", key: "storage_gb", higherIsBetter: true },
  { label: "Batterie", unit: " mAh", key: "battery_mah", higherIsBetter: true },
  { label: "Caméra principale", unit: " MP", key: "main_camera_mp", higherIsBetter: true },
  { label: "Poids", unit: " g", key: "weight_g", higherIsBetter: false },
  { label: "Prix au lancement", unit: " $", key: "price_launch", higherIsBetter: false }
];

function PhonePicker({
  label,
  phones,
  selected,
  onSelect
}: {
  label: string;
  phones: ComparablePhone[];
  selected: ComparablePhone | null;
  onSelect: (p: ComparablePhone) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!query.trim()) return phones.slice(0, 8);
    const q = query.toLowerCase();
    return phones
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.brand_name.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [phones, query]);

  return (
    <div className="relative">
      <label className="font-mono text-[11px] uppercase text-muted block mb-2">{label}</label>
      {selected ? (
        <button
          onClick={() => {
            setOpen(true);
            setQuery("");
          }}
          className="w-full bg-card border border-hairline rounded-xl p-4 flex items-center gap-3 text-left hover:border-signal/40 transition-colors"
        >
          <div className="w-14 h-14 rounded-lg bg-panel flex items-center justify-center overflow-hidden shrink-0">
            {selected.cover_url ? (
              <Image
                src={selected.cover_url}
                alt={selected.name}
                width={56}
                height={56}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-xl opacity-30">📱</span>
            )}
          </div>
          <div>
            <div className="font-medium text-sm">{selected.name}</div>
            <div className="font-mono text-xs text-muted">
              {selected.brand_name} · {selected.release_year}
            </div>
          </div>
        </button>
      ) : (
        <input
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          placeholder="Rechercher un téléphone..."
          className="w-full bg-card border border-hairline rounded-xl px-4 py-4 text-sm outline-none focus:border-signal/50 transition-colors"
        />
      )}

      {open && (
        <div className="absolute z-20 top-full mt-2 w-full bg-card border border-hairline rounded-xl overflow-hidden max-h-72 overflow-y-auto shadow-xl">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted px-4 py-3">Aucun résultat.</p>
          ) : (
            filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  onSelect(p);
                  setOpen(false);
                  setQuery("");
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-panel transition-colors"
              >
                <div className="w-9 h-9 rounded bg-panel flex items-center justify-center overflow-hidden shrink-0">
                  {p.cover_url ? (
                    <Image
                      src={p.cover_url}
                      alt={p.name}
                      width={36}
                      height={36}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-sm opacity-30">📱</span>
                  )}
                </div>
                <div>
                  <div className="text-sm">{p.name}</div>
                  <div className="font-mono text-[11px] text-muted">
                    {p.brand_name} · {p.release_year}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
      )}
    </div>
  );
}

export default function Comparator({
  phones,
  initialA,
  initialB
}: {
  phones: ComparablePhone[];
  initialA?: ComparablePhone;
  initialB?: ComparablePhone;
}) {
  const [a, setA] = useState<ComparablePhone | null>(initialA ?? null);
  const [b, setB] = useState<ComparablePhone | null>(initialB ?? null);

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-4 mb-8 relative">
        <PhonePicker label="Téléphone A" phones={phones} selected={a} onSelect={setA} />
        <PhonePicker label="Téléphone B" phones={phones} selected={b} onSelect={setB} />
      </div>

      {a && b && (
        <div className="bg-card border border-hairline rounded-xl overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_1fr] text-sm">
            <div className="p-4 font-semibold border-b border-hairline">{a.name}</div>
            <div className="p-4 border-b border-hairline" />
            <div className="p-4 font-semibold text-right border-b border-hairline">{b.name}</div>
          </div>

          {ROWS.map((row) => {
            const valA = a[row.key];
            const valB = b[row.key];
            if (
              (valA === null || valA === undefined) &&
              (valB === null || valB === undefined)
            )
              return null;

            const numA = typeof valA === "number" ? valA : null;
            const numB = typeof valB === "number" ? valB : null;
            const aWins =
              row.higherIsBetter !== null && numA !== null && numB !== null && numA !== numB
                ? row.higherIsBetter
                  ? numA > numB
                  : numA < numB
                : null;
            const bWins =
              row.higherIsBetter !== null && numA !== null && numB !== null && numA !== numB
                ? row.higherIsBetter
                  ? numB > numA
                  : numB < numA
                : null;

            return (
              <div
                key={String(row.key)}
                className="grid grid-cols-[1fr_auto_1fr] text-sm border-t border-hairline"
              >
                <div
                  className={`p-4 ${aWins ? "text-signal font-semibold" : "text-muted"}`}
                >
                  {valA !== null && valA !== undefined ? `${valA}${row.unit}` : "—"}
                </div>
                <div className="p-4 font-mono text-[11px] text-muted text-center whitespace-nowrap">
                  {row.label}
                </div>
                <div
                  className={`p-4 text-right ${bWins ? "text-signal font-semibold" : "text-muted"}`}
                >
                  {valB !== null && valB !== undefined ? `${valB}${row.unit}` : "—"}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {(!a || !b) && (
        <p className="text-sm text-muted text-center py-10">
          Choisis deux téléphones pour voir la comparaison.
        </p>
      )}
    </div>
  );
}
