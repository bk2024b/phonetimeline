import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrandBySlug, getRangesByBrandId, getPhonesByBrandId } from "@/lib/queries/phones";
import Logo from "@/components/public/Logo";

export default async function BrandPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();

  const [ranges, phones] = await Promise.all([
    getRangesByBrandId(brand.id),
    getPhonesByBrandId(brand.id)
  ]);

  const years = phones.map((p) => p.release_year);
  const minYear = years.length ? Math.min(...years) : brand.founded_year;
  const maxYear = years.length ? Math.max(...years) : null;

  const phonesByRange = new Map<string, typeof phones>();
  const phonesWithoutRange: typeof phones = [];
  for (const phone of phones) {
    if (phone.range_id) {
      const list = phonesByRange.get(phone.range_id) ?? [];
      list.push(phone);
      phonesByRange.set(phone.range_id, list);
    } else {
      phonesWithoutRange.push(phone);
    }
  }

  return (
    <div className="bg-night text-white min-h-screen">
      <header className="sticky top-0 z-50 bg-night/90 backdrop-blur border-b border-hairline">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Logo light />
          </Link>
          <Link href="/marques" className="text-sm text-muted hover:text-white transition-colors">
            ← Toutes les marques
          </Link>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 pt-14 pb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-signal mb-4">
          Marque
        </p>
        <h1 className="font-display font-bold text-3xl md:text-4xl mb-3">{brand.name}</h1>
        <p className="text-muted">
          {phones.length} modèle{phones.length > 1 ? "s" : ""}
          {minYear ? ` · ${minYear}${maxYear ? ` → ${maxYear}` : ""}` : ""}
        </p>
      </section>

      <main className="max-w-5xl mx-auto px-6 pb-16">
        {ranges.length > 0 && (
          <section className="mb-12">
            <h2 className="font-display font-semibold text-lg mb-4">Gammes</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {ranges.map((range) => {
                const rangePhones = phonesByRange.get(range.id) ?? [];
                return (
                  <Link
                    key={range.id}
                    href={`/marques/${brand.slug}/${range.slug}`}
                    className="bg-card border border-hairline rounded-xl p-5 hover:border-signal/40 transition-colors"
                  >
                    <div className="font-display font-semibold mb-1">{range.name}</div>
                    <div className="font-mono text-xs text-muted">
                      {rangePhones.length} modèle{rangePhones.length > 1 ? "s" : ""}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <section>
          <h2 className="font-display font-semibold text-lg mb-4">Tous les modèles</h2>
          {phones.length === 0 ? (
            <p className="text-muted text-sm">Aucun modèle pour le moment.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...phones].reverse().map((phone) => (
                <Link
                  key={phone.id}
                  href={`/smartphones/${phone.slug}`}
                  className="bg-card border border-hairline rounded-xl p-5 hover:border-signal/40 transition-colors"
                >
                  <div className="font-medium mb-1">{phone.name}</div>
                  <div className="font-mono text-xs text-muted">
                    {phone.ranges?.name ? `${phone.ranges.name} · ` : ""}
                    {phone.release_year}
                  </div>
                  {phone.is_milestone && (
                    <span className="font-mono text-xs text-signal mt-2 inline-block">
                      ★ Modèle marquant
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-hairline py-8">
        <div className="max-w-5xl mx-auto px-6 text-xs text-muted">© 2026 PhoneTimeline</div>
      </footer>
    </div>
  );
}
