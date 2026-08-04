import type { PhoneWithChanges } from "@/lib/queries/model-lines";

type MetricKey =
  | "battery_mah"
  | "ram_gb"
  | "storage_gb"
  | "main_camera_mp"
  | "screen_size"
  | "refresh_rate"
  | "weight_g";

const METRICS: { key: MetricKey; label: string; unit: string; higherIsBetter: boolean }[] = [
  { key: "battery_mah", label: "Batterie", unit: "mAh", higherIsBetter: true },
  { key: "ram_gb", label: "RAM", unit: "Go", higherIsBetter: true },
  { key: "storage_gb", label: "Stockage", unit: "Go", higherIsBetter: true },
  { key: "main_camera_mp", label: "Caméra principale", unit: "MP", higherIsBetter: true },
  { key: "screen_size", label: "Taille d'écran", unit: '"', higherIsBetter: true },
  { key: "refresh_rate", label: "Taux de rafraîchissement", unit: "Hz", higherIsBetter: true },
  { key: "weight_g", label: "Poids", unit: "g", higherIsBetter: false }
];

function pctDelta(from: number, to: number) {
  if (from === 0) return null;
  return ((to - from) / from) * 100;
}

export default function PhoneDNA({
  phone,
  linePhones
}: {
  phone: PhoneWithChanges;
  linePhones: PhoneWithChanges[];
}) {
  if (linePhones.length < 2) return null;

  const first = linePhones[0];
  const predecessor = phone.predecessor_id
    ? linePhones.find((p) => p.id === phone.predecessor_id)
    : undefined;

  const rows = METRICS.map((metric) => {
    const current = phone[metric.key];
    if (current === null || current === undefined) return null;

    const vsPredecessor = predecessor?.[metric.key]
      ? pctDelta(predecessor[metric.key] as number, current)
      : null;
    const vsFirst =
      first.id !== phone.id && first[metric.key]
        ? pctDelta(first[metric.key] as number, current)
        : null;

    const values = linePhones
      .map((p) => p[metric.key])
      .filter((v): v is number => v !== null && v !== undefined);
    const best = metric.higherIsBetter ? Math.max(...values) : Math.min(...values);
    const isRecord = current === best;

    return { ...metric, current, vsPredecessor, vsFirst, best, isRecord };
  }).filter((r): r is NonNullable<typeof r> => r !== null);

  if (rows.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="font-display font-semibold text-lg mb-1">ADN du smartphone</h2>
      <p className="text-sm text-muted mb-4">
        Suivi depuis {first.name} ({first.release_year}), premier modèle de la ligne.
      </p>
      <div className="bg-card border border-hairline rounded-xl overflow-hidden">
        {rows.map((row) => (
          <div
            key={row.key}
            className="grid grid-cols-[160px_1fr] text-sm border-t border-hairline first:border-t-0"
          >
            <div className="px-4 py-3 font-mono text-xs text-muted">{row.label}</div>
            <div className="px-4 py-3 border-l border-hairline flex flex-wrap items-center gap-3">
              <span className="font-semibold">
                {row.current} {row.unit}
              </span>
              {row.vsPredecessor !== null && (
                <span
                  className={`font-mono text-xs ${
                    (row.higherIsBetter ? row.vsPredecessor > 0 : row.vsPredecessor < 0)
                      ? "text-signal"
                      : "text-red-400"
                  }`}
                >
                  {row.vsPredecessor > 0 ? "+" : ""}
                  {row.vsPredecessor.toFixed(0)}% vs précédent
                </span>
              )}
              {row.vsFirst !== null && (
                <span className="font-mono text-xs text-muted">
                  {row.vsFirst > 0 ? "+" : ""}
                  {row.vsFirst.toFixed(0)}% depuis {first.name}
                </span>
              )}
              {row.isRecord && (
                <span className="font-mono text-[10px] text-amber-400">
                  ★ record de la ligne
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
