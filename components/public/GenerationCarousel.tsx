"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Item = {
  slug: string;
  name: string;
  coverUrl: string | null;
  anchor: string;
};

export default function GenerationCarousel({ items }: { items: Item[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollBy(amount: number) {
    scrollerRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  function goTo(anchor: string) {
    document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="relative">
      <button
        onClick={() => scrollBy(-240)}
        aria-label="Précédent"
        className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-card border border-hairline items-center justify-center hover:border-signal/40 transition-colors"
      >
        <ChevronLeft size={16} />
      </button>

      <div ref={scrollerRef} className="flex gap-4 overflow-x-auto scroll-smooth pb-2 px-1">
        {items.map((item) => (
          <button
            key={item.slug}
            onClick={() => goTo(item.anchor)}
            className="flex flex-col items-center gap-2 shrink-0 w-28 group text-left"
          >
            <div className="w-24 h-24 rounded-xl bg-card border border-hairline flex items-center justify-center overflow-hidden group-hover:border-signal/40 transition-colors">
              {item.coverUrl ? (
                <Image
                  src={item.coverUrl}
                  alt={item.name}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-2xl opacity-30">📱</span>
              )}
            </div>
            <div className="text-xs text-center text-muted group-hover:text-white transition-colors">
              {item.name}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={() => scrollBy(240)}
        aria-label="Suivant"
        className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-card border border-hairline items-center justify-center hover:border-signal/40 transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
