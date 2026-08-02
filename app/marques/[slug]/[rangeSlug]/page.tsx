import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrandBySlug } from "@/lib/queries/phones";
import { getRangeBySlug, getPhonesByRangeId } from "@/lib/queries/ranges";
import EvolutionChart from "@/components/public/EvolutionChart";
import Logo from "@/components/public/Logo";

const CHANGE_STYLE = {
  added: { icon: "✓", color: "text-jade" },
  removed: { icon: "✗", color: "text-red-600" },
  unchanged: { icon: "=", color: "text-inksoft" }
} as const;

function buildPoints(
  phones: Awaited<ReturnType<typeof getPhonesByRangeId>>,
  key: "battery_mah" | "weight_g" | "price_launch"
) {
  return phones
    .filter((p) => p[key] !== null && p[key] !== undefined)
    .map((p) => ({ year: p.release_year, name: p.name, value: p[key] as number }));
}

export default async function RangeEvolutionPage({
  params
}: {
  params: Promise<{ slug: string; rangeSlug: string }>;
}) {
  const { slug, rangeSlug } = await params;

  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();

  const range = await getRangeBySlug(brand.id, rangeSlug);
  if (!range) notFound();

  const phones = await getPhonesByRangeId(range.id);

  return (
    <>
      <header className="bg-dark text-white sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold tracking-tight">
            <Logo light />
          </Link>
          <Link
            href={`/marques/${brand.slug}`}
            className="text-sm text-white/60 hover:text-white"
          >
            ← Tous les {brand.name}
          </Link>
        </div>
      </header>

      <section className="bg-dark text-white py-14">
        <div className="max-w-5xl mx-auto px-6">
          <p className="font-mono text-xs uppercase tracking-widest text-signal mb-4">
            Évolution complète
          </p>
          <h1 className="text-3xl font-bold tracking-tight">{range.name}</h1>
          <p className="text-white/60 mt-2">
            {phones.length} génération{phones.length > 1 ? "s" : ""}
            {phones.length > 0 &&
              ` — ${phones[0].release_year} à ${phones[phones.length - 1].release_year}`}
          </p>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {phones.length >= 2 && (
          <div className="mb-14">
            <h2 className="text-lg font-bold mb-5">Graphiques d&apos;évolution</h2>
            <div className="grid gap-4">
              <EvolutionChart
                title="Batterie"
                unit="mAh"
                points={buildPoints(phones, "battery_mah")}
              />
              <EvolutionChart
                title="Poids"
                unit="g"
                points={buildPoints(phones, "weight_g")}
              />
              <EvolutionChart
                title="Prix au lancement"
                unit="€"
                points={buildPoints(phones, "price_launch")}
              />
            </div>
          </div>
        )}

        {phones.length === 0 ? (
          <p className="text-inksoft">
            Aucun modèle dans cette gamme pour le moment.
          </p>
        ) : (
          phones.map((phone, index) => (
            <div key={phone.id}>
              {index > 0 && (
                <div className="flex justify-center py-2">
                  <span className="font-mono text-inksoft text-lg">↓</span>
                </div>
              )}

              <div
                className={`bg-surface border rounded p-5 ${
                  phone.is_milestone ? "border-jade border-[1.5px]" : "border-line"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Link
                      href={`/smartphones/${phone.slug}`}
                      className="font-bold text-lg hover:text-jade transition-colors"
                    >
                      {phone.name}
                    </Link>
                    <div className="font-mono text-xs text-inksoft mt-0.5">
                      {phone.release_year}
                    </div>
                  </div>
                  {phone.is_milestone && (
                    <span className="font-mono text-[10px] text-amber whitespace-nowrap">
                      ★ modèle marquant
                    </span>
                  )}
                </div>

                {phone.milestone_note && (
                  <div className="font-mono text-xs text-jade mb-3">
                    {phone.milestone_note}
                  </div>
                )}

                {phone.phone_changes.length > 0 && (
                  <ul className="space-y-1.5 mt-3">
                    {phone.phone_changes.map((change) => {
                      const style = CHANGE_STYLE[change.type];
                      return (
                        <li key={change.id} className="text-sm">
                          <span className={`font-mono font-bold mr-2 ${style.color}`}>
                            {style.icon}
                          </span>
                          {change.description}
                        </li>
                      );
                    })}
                  </ul>
                )}

                {phone.phone_changes.length === 0 && index > 0 && (
                  <p className="text-xs text-inksoft italic">
                    Aucun changement renseigné pour cette transition.
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </main>

      <footer className="bg-dark text-white/50 text-xs py-8">
        <div className="max-w-5xl mx-auto px-6">© 2026 PhoneTimeline</div>
      </footer>
    </>
  );
}
