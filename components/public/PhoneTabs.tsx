"use client";

import { useState } from "react";

export default function PhoneTabs({
  overview,
  specs,
  gallery
}: {
  overview: React.ReactNode;
  specs: React.ReactNode;
  gallery: React.ReactNode | null;
}) {
  const tabs = [
    { key: "overview", label: "Vue d'ensemble", content: overview },
    { key: "specs", label: "Caractéristiques", content: specs },
    ...(gallery ? [{ key: "gallery", label: "Galerie", content: gallery }] : [])
  ];

  const [active, setActive] = useState(tabs[0].key);

  return (
    <div>
      <div className="flex gap-1 border-b border-hairline mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              active === tab.key
                ? "border-signal text-white"
                : "border-transparent text-muted hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.find((t) => t.key === active)?.content}
    </div>
  );
}
