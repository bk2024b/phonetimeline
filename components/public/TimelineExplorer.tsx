"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { TimelineBrand } from "@/lib/queries/timeline";

const ZOOM_LEVELS = [24, 40, 64, 96]; // pixels par annee

export default function TimelineExplorer({ brands }: { brands: TimelineBrand[] }) {
  const brandsWithPhones = useMemo(() => brands.filter((b) => b.phones.length > 0), [brands]);

  const [activeBrandIds, setActiveBrandIds] = useState<string[]>(() =>
    brandsWithPhones.slice(0, 3).map((b) => b.id)
  );
  const [zoomIndex, setZoomIndex] = useState(1);
  const pxPerYear = ZOOM_LEVELS[zoomIndex];

  const scrollRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ startX: number; startScroll: number } | null>(null);

  const allYears = brandsWithPhones.flatMap((b) => b.phones.map((p) => p.release_year));
  const minYear = allYears.length ? Math.min(...allYears) : new Date().getFullYear() - 1;
  const maxYear = allYears.length ? Math.max(...allYears) : new Date().getFullYear();
  const totalWidth = (maxYear - minYear + 1) * pxPerYear;

  const activeBrands = brandsWithPhones.filter((b) => activeBrandIds.includes(b.id));

  function toggleBrand(id: string) {
    setActiveBrandIds((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  }

  function onMouseDown(e: React.MouseEvent) {
    if (!scrollRef.current) return;
    dragState.current = { startX: e.clientX, startScroll: scrollRef.current.scrollLeft };
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!dragState.current || !scrollRef.current) return;
    const dx = e.clientX - dragState.current.startX;
    scrollRef.current.scrollLeft = dragState.current.startScroll - dx;
  }
  function onMouseUp() {
    dragState.current = null;
  }

  const yearMarkers = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

  return (
    <div>
      {/* --- Selection des marques --- */}
      <div className="flex flex-wrap gap-2 mb-6">
        {brandsWithPhones.map((brand) => (
          <button
            key={brand.id}
            onClick={() => toggleBrand(brand.id)}
            className={`flex items-center gap-2 font-mono text-xs px-3 py-1.5 rounded-full border transition-colors ${
              activeBrandIds.includes(brand.id)
                ? "bg-signal/10 border-signal/40 text-signal"
                : "bg-card border-hairline text-muted"
            }`}
          >
            {brand.logo_url && (
              <Image
                src={brand.logo_url}
                alt=""
                width={14}
                height={14}
                className="object-contain w-3.5 h-3.5"
              />
            )}
            {brand.name}
            <span className="opacity-60">{brand.phones.length}</span>
          </button>
        ))}
      </div>

      {/* --- Zoom --- */}
      <div className="flex items-center gap-2 mb-4">
        <span className="font-mono text-[11px] text-muted uppercase">Zoom</span>
        <button
          onClick={() => setZoomIndex((z) => Math.max(0, z - 1))}
          disabled={zoomIndex === 0}
          className="w-7 h-7 rounded bg-card border border-hairline text-sm disabled:opacity-30"
        >
          −
        </button>
        <button
          onClick={() => setZoomIndex((z) => Math.min(ZOOM_LEVELS.length - 1, z + 1))}
          disabled={zoomIndex === ZOOM_LEVELS.length - 1}
          className="w-7 h-7 rounded bg-card border border-hairline text-sm disabled:opacity-30"
        >
          +
        </button>
      </div>

      {activeBrands.length === 0 ? (
        <p className="text-muted text-sm">
          Choisis au moins une marque ci-dessus pour l&apos;afficher sur la frise.
        </p>
      ) : (
        <div
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          className="overflow-x-auto cursor-grab active:cursor-grabbing select-none bg-card border border-hairline rounded-xl"
        >
          <div style={{ width: totalWidth }} className="relative py-6">
            {/* Regle des annees */}
            <div className="flex border-b border-hairline pb-2 mb-6 sticky top-0">
              {yearMarkers.map((year) => (
                <div
                  key={year}
                  style={{ width: pxPerYear }}
                  className="shrink-0 font-mono text-[10px] text-muted text-center"
                >
                  {year}
                </div>
              ))}
            </div>

            {/* Une rangee par marque */}
            <div className="space-y-8 px-2">
              {activeBrands.map((brand) => (
                <div key={brand.id} className="relative h-16">
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-full pr-3 font-mono text-xs text-muted whitespace-nowrap">
                    {brand.name}
                  </div>
                  <div className="absolute left-0 right-0 top-1/2 h-px bg-hairline" />
                  {brand.phones.map((phone) => {
                    const left = (phone.release_year - minYear) * pxPerYear + pxPerYear / 2;
                    return (
                      <Link
                        key={phone.id}
                        href={`/smartphones/${phone.slug}`}
                        title={`${phone.name} (${phone.release_year})`}
                        style={{ left }}
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group"
                      >
                        <div
                          className={`rounded-full border-2 border-night overflow-hidden bg-panel flex items-center justify-center transition-transform group-hover:scale-125 ${
                            phone.is_milestone ? "w-4 h-4 ring-2 ring-signal" : "w-3 h-3"
                          }`}
                        >
                          {phone.cover_url && (
                            <Image
                              src={phone.cover_url}
                              alt=""
                              width={16}
                              height={16}
                              className="object-cover w-full h-full"
                            />
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <p className="font-mono text-[11px] text-muted mt-3">
        Glisse horizontalement pour explorer · survole un point pour voir le modèle · clique pour ouvrir sa fiche
      </p>
    </div>
  );
}
