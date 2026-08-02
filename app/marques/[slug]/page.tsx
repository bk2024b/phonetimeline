import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getBrandBySlug, getPhonesByBrandId } from "@/lib/queries/phones";
import type { PhoneWithBrand } from "@/lib/types";
import Logo from "@/components/public/Logo";

type RangeGroup = { slug: string | null; name: string; phones: PhoneWithBrand[] };

function groupByRange(phones: PhoneWithBrand[]): RangeGroup[] {
  const groups: Record<string, RangeGroup> = {};
  for (const phone of phones) {
    const key = phone.ranges?.slug ?? "__none__";
    if (!groups[key]) {
      groups[key] = {
        slug: phone.ranges?.slug ?? null,
        name: phone.ranges?.name ?? "Autres modèles",
        phones: []
      };
    }
    groups[key].phones.push(phone);
  }
  return Object.values(groups);
}

export default async function BrandPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) notFound();

  const phones = await getPhonesByBrandId(brand.id);
  const minYear = phones[0]?.release_year ?? null;
  const maxYear = phones[phones.length - 1]?.release_year ?? null;
  const avgPerYear =
    minYear && maxYear
      ? (phones.length / (maxYear - minYear + 1)).toFixed(1)
      : null;

  return (
    <div className="bg-night text-white min-h-screen">
      <header className="sticky top-0 z-50 bg-night/90 backdrop-blur border-b border-hairline">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Logo light />
          </Link>
          <Link href="/" className="text-sm text-muted hover:text-white transition-colors">
            ← Toutes les marques
          </Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 pt-14 pb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-signal mb-4">
          {minYear ? `Depuis ${minYear}` : "Historique de marque"}
        </p>
        <h1 className="font-display font-bold text-4xl md:text-5xl mb-8">{brand.name}</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
          <div className="bg-card border border-hairline rounded-lg px-4 py-3">
            <div className="font-mono font-bold text-2xl">{phones.length}</div>
            <div className="text-xs text-muted mt-1">Modèles</div>
          </div>
          <div className="bg-card border border-hairline rounded-lg px-4 py-3">
            <div className="font-mono font-bold text-2xl">
              {minYear && maxYear ? `${minYear}–${maxYear}` : "—"}
            </div>
            <div className="text-xs text-muted mt-1">Période</div>
          </div>
          <div className="bg-card border border-hairline rounded-lg px-4 py-3">
            <div className="font-mono font-bold text-2xl">{avgPerYear ?? "—"}</div>
            <div className="text-xs text-muted mt-1">Modèles / an</div>
          </div>
          <div className="bg-card border border-hairline rounded-lg px-4 py-3">
            <div className="font-mono text-sm font-bold truncate">
              {phones[phones.length - 1]?.name ?? "—"}
            </div>
            <div className="text-xs text-muted mt-1">Dernier modèle</div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-10 border-t border-hairline">
        {phones.length === 0 ? (
          <p className="text-muted text-sm">
            Aucun téléphone {brand.name} pour le moment.{" "}
            <Link href="/admin/telephones/nouveau" className="text-signal underline">
              Ajoutes-en un depuis l&apos;admin
            </Link>
            .
          </p>
        ) : (
          groupByRange(phones).map((group) => (
            <div key={group.slug ?? "none"} className="mb-14 last:mb-0">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-hairline">
                <h2 className="font-display font-semibold text-lg">
                  {group.name}
                  <span className="font-mono text-xs text-muted ml-2">
                    {group.phones.length}
                  </span>
                </h2>
                {group.slug && group.phones.length > 1 && (
                  <Link
                    href={`/marques/${brand.slug}/${group.slug}`}
                    className="font-mono text-xs text-signal whitespace-nowrap"
                  >
                    Voir l&apos;évolution complète →
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {group.phones.map((phone) => {
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
                        <div className="font-mono text-xs text-muted mb-3">
                          {phone.release_year}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {phone.screen_size && (
                            <span className="font-mono text-[10px] bg-panel text-muted px-1.5 py-0.5 rounded">
                              {phone.screen_size}&quot;
                            </span>
                          )}
                          {phone.ram_gb && (
                            <span className="font-mono text-[10px] bg-panel text-muted px-1.5 py-0.5 rounded">
                              {phone.ram_gb} Go
                            </span>
                          )}
                          {phone.battery_mah && (
                            <span className="font-mono text-[10px] bg-panel text-muted px-1.5 py-0.5 rounded">
                              {phone.battery_mah} mAh
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </main>

      <footer className="border-t border-hairline py-8">
        <div className="max-w-6xl mx-auto px-6 text-xs text-muted">© 2026 PhoneTimeline</div>
      </footer>
    </div>
  );
}
