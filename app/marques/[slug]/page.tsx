import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getBrandBySlug, getRangesByBrandId, getPhonesByBrandId } from "@/lib/queries/phones";
import { getModelLinesByBrandId } from "@/lib/queries/model-lines";
import Logo from "@/components/public/Logo";
import BrandPhoneGrid from "@/components/public/BrandPhoneGrid";

export default async function BrandPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();

  const [ranges, modelLines, phones] = await Promise.all([
    getRangesByBrandId(brand.id),
    getModelLinesByBrandId(brand.id),
    getPhonesByBrandId(brand.id)
  ]);

  const years = phones.map((p) => p.release_year);
  const minYear = years.length ? Math.min(...years) : brand.founded_year;
  const maxYear = years.length ? Math.max(...years) : null;
  const firstPhone = phones[0];

  const phonesByRange = new Map<string, typeof phones>();
  const phonesByLine = new Map<string, typeof phones>();
  for (const phone of phones) {
    if (phone.range_id) {
      const list = phonesByRange.get(phone.range_id) ?? [];
      list.push(phone);
      phonesByRange.set(phone.range_id, list);
    }
    if (phone.model_line_id) {
      const list = phonesByLine.get(phone.model_line_id) ?? [];
      list.push(phone);
      phonesByLine.set(phone.model_line_id, list);
    }
  }

  // Un modele par annee pour l'apercu chronologique, jusqu'a 6.
  const preview: typeof phones = [];
  const seenYears = new Set<number>();
  for (const phone of phones) {
    if (!seenYears.has(phone.release_year)) {
      seenYears.add(phone.release_year);
      preview.push(phone);
    }
    if (preview.length >= 6) break;
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

      <nav className="max-w-5xl mx-auto px-6 pt-6 text-xs font-mono text-muted">
        <Link href="/" className="hover:text-white transition-colors">
          Accueil
        </Link>
        {" / "}
        <Link href="/marques" className="hover:text-white transition-colors">
          Marques
        </Link>
        {" / "}
        <span className="text-white">{brand.name}</span>
      </nav>

      <section className="max-w-5xl mx-auto px-6 pt-6 pb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-signal mb-4">
          {minYear ? `Depuis ${minYear}` : "Marque"}
        </p>
        {brand.logo_url && (
          <div className="w-16 h-16 rounded-2xl bg-card border border-hairline flex items-center justify-center mb-4 overflow-hidden">
            <Image
              src={brand.logo_url}
              alt={brand.name}
              width={64}
              height={64}
              className="object-contain w-10 h-10"
            />
          </div>
        )}
        <h1 className="font-display font-bold text-3xl md:text-5xl mb-8">{brand.name}</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
          <div className="bg-card border border-hairline rounded-lg px-4 py-3">
            <div className="font-mono font-bold text-2xl">{phones.length}</div>
            <div className="text-xs text-muted mt-1">Téléphones</div>
          </div>
          <div className="bg-card border border-hairline rounded-lg px-4 py-3">
            <div className="font-mono font-bold text-2xl">{ranges.length}</div>
            <div className="text-xs text-muted mt-1">Gammes</div>
          </div>
          <div className="bg-card border border-hairline rounded-lg px-4 py-3">
            <div className="font-mono font-bold text-2xl">
              {minYear && maxYear ? maxYear - minYear + 1 : "—"}
            </div>
            <div className="text-xs text-muted mt-1">Années</div>
          </div>
          <div className="bg-card border border-hairline rounded-lg px-4 py-3">
            <div className="font-mono font-bold text-2xl">{minYear ?? "—"}</div>
            <div className="text-xs text-muted mt-1">
              1er modèle{firstPhone ? ` · ${firstPhone.name}` : ""}
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 pb-16">
        {preview.length > 1 && (
          <section className="mb-14">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-semibold text-lg">Aperçu chronologique</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {preview.map((phone) => {
                const cover = phone.phone_images?.[0];
                return (
                  <Link
                    key={phone.id}
                    href={`/smartphones/${phone.slug}`}
                    className="flex flex-col items-center gap-2 shrink-0 w-24 group"
                  >
                    <div className="w-20 h-20 rounded-full bg-card border border-hairline flex items-center justify-center overflow-hidden group-hover:border-signal/40 transition-colors">
                      {cover ? (
                        <Image
                          src={cover.url}
                          alt={cover.alt ?? phone.name}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-2xl opacity-30">📱</span>
                      )}
                    </div>
                    <span className="w-2 h-2 rounded-full bg-signal" />
                    <div className="text-center">
                      <div className="font-mono text-xs">{phone.release_year}</div>
                      <div className="text-[11px] text-muted truncate w-24">{phone.name}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {ranges.length > 0 && (
          <section className="mb-14">
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

        {modelLines.length > 0 && (
          <section className="mb-14">
            <h2 className="font-display font-semibold text-lg mb-4">Lignes de modèle</h2>
            <p className="text-sm text-muted mb-4">
              Suis l&apos;évolution d&apos;un palier précis à travers les années.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {modelLines.map((line) => {
                const linePhones = phonesByLine.get(line.id) ?? [];
                return (
                  <Link
                    key={line.id}
                    href={`/marques/${brand.slug}/ligne/${line.slug}`}
                    className="bg-card border border-hairline rounded-xl p-5 hover:border-signal/40 transition-colors"
                  >
                    <div className="font-display font-semibold mb-1">{line.name}</div>
                    <div className="font-mono text-xs text-muted">
                      {linePhones.length} modèle{linePhones.length > 1 ? "s" : ""}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <section>
          <h2 className="font-display font-semibold text-lg mb-4">
            Tous les {brand.name}
          </h2>
          {phones.length === 0 ? (
            <p className="text-muted text-sm">Aucun modèle pour le moment.</p>
          ) : (
            <BrandPhoneGrid phones={phones} ranges={ranges} />
          )}
        </section>
      </main>

      <footer className="border-t border-hairline py-8">
        <div className="max-w-5xl mx-auto px-6 text-xs text-muted">© 2026 PhoneTimeline</div>
      </footer>
    </div>
  );
}
