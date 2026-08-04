import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getBrandBySlug } from "@/lib/queries/phones";
import { getModelLineBySlug, getPhonesByModelLineId } from "@/lib/queries/model-lines";
import EvolutionChart from "@/components/public/EvolutionChart";
import Logo from "@/components/public/Logo";

const CHANGE_STYLE = {
  added: { icon: "✓", color: "text-signal" },
  removed: { icon: "✗", color: "text-red-400" },
  unchanged: { icon: "=", color: "text-muted" }
} as const;

function buildPoints(
  phones: Awaited<ReturnType<typeof getPhonesByModelLineId>>,
  key: "battery_mah" | "weight_g" | "price_launch"
) {
  return phones
    .filter((p) => p[key] !== null && p[key] !== undefined)
    .map((p) => ({ year: p.release_year, name: p.name, value: p[key] as number }));
}

export default async function ModelLineEvolutionPage({
  params
}: {
  params: Promise<{ slug: string; lineSlug: string }>;
}) {
  const { slug, lineSlug } = await params;

  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();

  const line = await getModelLineBySlug(brand.id, lineSlug);
  if (!line) notFound();

  const phones = await getPhonesByModelLineId(line.id);

  return (
    <div className="bg-night text-white min-h-screen">
      <header className="sticky top-0 z-50 bg-night/90 backdrop-blur border-b border-hairline">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Logo light />
          </Link>
          <Link
            href={`/marques/${brand.slug}`}
            className="text-sm text-muted hover:text-white transition-colors"
          >
            ← Tous les {brand.name}
          </Link>
        </div>
      </header>

      <nav className="max-w-5xl mx-auto px-6 pt-6 text-xs font-mono text-muted">
        <Link href="/" className="hover:text-white transition-colors">
          Accueil
        </Link>
        {" / "}
        <Link href={`/marques/${brand.slug}`} className="hover:text-white transition-colors">
          {brand.name}
        </Link>
        {" / "}
        <span className="text-white">{line.name}</span>
      </nav>

      <section className="max-w-5xl mx-auto px-6 pt-6 pb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-signal mb-4">
          Évolution d&apos;une ligne de modèle
        </p>
        <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">{line.name}</h1>
        <p className="text-muted">
          {phones.length} modèle{phones.length > 1 ? "s" : ""}
          {phones.length > 0 &&
            ` · ${phones[0].release_year} → ${phones[phones.length - 1].release_year}`}
        </p>
      </section>

      <main className="max-w-3xl mx-auto px-6 pb-16">
        {phones.length >= 2 && (
          <section className="mb-14">
            <h2 className="font-display font-semibold text-lg mb-5">
              Graphiques d&apos;évolution
            </h2>
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
                unit="$"
                points={buildPoints(phones, "price_launch")}
              />
            </div>
          </section>
        )}

        {phones.length === 0 ? (
          <p className="text-muted text-sm">
            Aucun modèle dans cette ligne pour le moment.
          </p>
        ) : (
          phones.map((phone, index) => {
            const cover = phone.phone_images?.[0];
            return (
              <div key={phone.id}>
                {index > 0 && (
                  <div className="flex justify-center py-2">
                    <span className="font-mono text-muted text-lg">↓</span>
                  </div>
                )}

                <div
                  className={`bg-card border rounded-xl p-5 ${
                    phone.is_milestone ? "border-signal/50" : "border-hairline"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg bg-panel flex items-center justify-center overflow-hidden shrink-0">
                      {cover ? (
                        <Image
                          src={cover.url}
                          alt={cover.alt ?? phone.name}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-2xl opacity-30">📱</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <Link
                            href={`/smartphones/${phone.slug}`}
                            className="font-display font-semibold text-lg hover:text-signal transition-colors"
                          >
                            {phone.name}
                          </Link>
                          <div className="font-mono text-xs text-muted mt-0.5">
                            {phone.release_year}
                          </div>
                        </div>
                        {phone.is_milestone && (
                          <span className="font-mono text-[10px] text-signal whitespace-nowrap">
                            ★ modèle marquant
                          </span>
                        )}
                      </div>

                      {phone.milestone_note && (
                        <div className="font-mono text-xs text-signal mb-3">
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
                        <p className="text-xs text-muted italic">
                          Aucun changement renseigné pour cette transition.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </main>

      <footer className="border-t border-hairline py-8">
        <div className="max-w-5xl mx-auto px-6 text-xs text-muted">© 2026 PhoneTimeline</div>
      </footer>
    </div>
  );
}
