"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { PhoneWithBrand, Range } from "@/lib/types";

export default function BrandPhoneGrid({
  phones,
  ranges
}: {
  phones: PhoneWithBrand[];
  ranges: Range[];
}) {
  const [query, setQuery] = useState("");
  const [rangeFilter, setRangeFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  const years = useMemo(
    () => Array.from(new Set(phones.map((p) => p.release_year))).sort((a, b) => b - a),
    [phones]
  );

  const filtered = useMemo(() => {
    return [...phones]
      .reverse()
      .filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
      .filter((p) => !rangeFilter || p.range_id === rangeFilter)
      .filter((p) => !yearFilter || String(p.release_year) === yearFilter);
  }, [phones, query, rangeFilter, yearFilter]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 bg-card border border-hairline rounded-lg px-3 py-2 flex-1">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted shrink-0"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un modèle..."
            className="bg-transparent text-sm outline-none placeholder:text-muted flex-1"
          />
        </div>
        <select
          value={rangeFilter}
          onChange={(e) => setRangeFilter(e.target.value)}
          className="bg-card border border-hairline rounded-lg px-3 py-2 text-sm text-muted"
        >
          <option value="">Toutes les gammes</option>
          {ranges.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="bg-card border border-hairline rounded-lg px-3 py-2 text-sm text-muted"
        >
          <option value="">Toutes les années</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted text-sm">Aucun modèle ne correspond à ta recherche.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((phone) => {
            const cover = phone.phone_images?.[0];
            return (
              <Link
                key={phone.id}
                href={`/smartphones/${phone.slug}`}
                className={`bg-card border rounded-xl overflow-hidden hover:border-signal/40 hover:scale-[1.02] transition-all ${
                  phone.is_milestone ? "border-signal/50" : "border-hairline"
                }`}
              >
                <div className="aspect-square bg-panel flex items-center justify-center">
                  {cover ? (
                    <Image
                      src={cover.url}
                      alt={cover.alt ?? phone.name}
                      width={200}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-4xl opacity-30">📱</span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm truncate">{phone.name}</span>
                    {phone.is_milestone && (
                      <span className="text-signal text-xs shrink-0">★</span>
                    )}
                  </div>
                  <div className="font-mono text-xs text-muted">
                    {phone.ranges?.name ? `${phone.ranges.name} · ` : ""}
                    {phone.release_year}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
