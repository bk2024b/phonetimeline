import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrandBySlug, getPhonesByBrandId } from "@/lib/queries/phones";
import type { PhoneWithBrand } from "@/lib/types";

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

export default async function BrandTimelinePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) notFound();

  const phones = await getPhonesByBrandId(brand.id);

  return (
    <>
      <header className="bg-dark text-white sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold tracking-tight">
            PhoneTimeline
          </Link>
          <Link href="/" className="text-sm text-white/60 hover:text-white">
            ← Toutes les marques
          </Link>
        </div>
      </header>

      <section className="bg-dark text-white py-14">
        <div className="max-w-5xl mx-auto px-6">
          <p className="font-mono text-xs uppercase tracking-widest text-signal mb-4">
            Historique de marque
          </p>
          <h1 className="text-3xl font-bold tracking-tight mb-3">
            Tous les {brand.name}
          </h1>
          <div className="flex gap-8 mt-6">
            <div>
              <div className="font-mono text-xl font-bold text-signal">
                {phones.length}
              </div>
              <div className="font-mono text-[11px] uppercase text-white/50">
                Modèles
              </div>
            </div>
            {phones.length > 0 && (
              <div>
                <div className="font-mono text-xl font-bold text-signal">
                  {phones[0].release_year} — {phones[phones.length - 1].release_year}
                </div>
                <div className="font-mono text-[11px] uppercase text-white/50">
                  Période
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {phones.length === 0 ? (
          <p className="text-inksoft">
            Aucun téléphone {brand.name} pour le moment.{" "}
            <Link href="/admin/telephones/nouveau" className="text-jade underline">
              Ajoutes-en un depuis l&apos;admin
            </Link>
            .
          </p>
        ) : (
          groupByRange(phones).map((group) => (
            <div key={group.slug ?? "none"} className="mb-14 last:mb-0">
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-line">
                <h2 className="text-lg font-bold">{group.name}</h2>
                {group.slug && group.phones.length > 1 && (
                  <Link
                    href={`/marques/${brand.slug}/${group.slug}`}
                    className="font-mono text-xs text-jade whitespace-nowrap"
                  >
                    Voir l&apos;évolution complète →
                  </Link>
                )}
              </div>
              <ol className="relative border-l-2 border-dashed border-line pl-8 space-y-8">
                {group.phones.map((phone) => (
                  <li key={phone.id} className="relative">
                    <span className="absolute -left-[calc(2rem+5px)] top-1.5 w-3 h-3 rounded-full bg-jade ring-4 ring-bg" />
                    <div className="font-mono text-sm font-bold text-ink mb-1.5">
                      {phone.release_year}
                    </div>
                    <Link
                      href={`/smartphones/${phone.slug}`}
                      className={`block bg-surface border rounded p-5 hover:border-jade transition-colors ${
                        phone.is_milestone ? "border-jade border-[1.5px]" : "border-line"
                      }`}
                    >
                      <div className="font-semibold text-base mb-1">
                        {phone.name}
                        {phone.is_milestone && (
                          <span className="ml-2 font-mono text-[10px] text-amber align-middle">
                            ★ modèle marquant
                          </span>
                        )}
                      </div>
                      {phone.milestone_note && (
                        <div className="font-mono text-xs text-jade mb-2">
                          {phone.milestone_note}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1.5">
                        {phone.screen_size && (
                          <span className="font-mono text-[11px] bg-bg text-inksoft px-2 py-0.5 rounded">
                            {phone.screen_size}&quot; {phone.screen_type ?? ""}
                          </span>
                        )}
                        {phone.ram_gb && (
                          <span className="font-mono text-[11px] bg-bg text-inksoft px-2 py-0.5 rounded">
                            {phone.ram_gb} Go RAM
                          </span>
                        )}
                        {phone.battery_mah && (
                          <span className="font-mono text-[11px] bg-bg text-inksoft px-2 py-0.5 rounded">
                            {phone.battery_mah} mAh
                          </span>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
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
