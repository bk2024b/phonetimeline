"use client";

import { useState } from "react";

export default function PhoneTabs({
  overview,
  specs,
  design
}: {
  overview: React.ReactNode;
  specs: React.ReactNode;
  design: React.ReactNode | null;
}) {
  const tabs = [
    { key: "overview", label: "Overview", content: overview },
    { key: "specs", label: "Specifications", content: specs },
    ...(design ? [{ key: "design", label: "Design", content: design }] : [])
  ];

  const [active, setActive] = useState(tabs[0].key);

  return (
    <div>
      <div className="flex gap-1 border-b border-hairline mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors ${
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
