import Link from "next/link";
import { getBrandsWithStats } from "@/lib/queries/brands";
import Logo from "@/components/public/Logo";

export default async function BrandsPage() {
  const brands = await getBrandsWithStats();
  const sortedBrands = [...brands].sort((a, b) => b.phone_count - a.phone_count);

  return (
    <div className="bg-night text-white min-h-screen">
      <header className="sticky top-0 z-50 bg-night/90 backdrop-blur border-b border-hairline">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Logo light />
          </Link>
          <Link href="/" className="text-sm text-muted hover:text-white transition-colors">
            ← Accueil
          </Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 pt-14 pb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-signal mb-4">
          Catalogue
        </p>
        <h1 className="font-display font-bold text-3xl md:text-4xl mb-3">
          Toutes les marques
        </h1>
        <p className="text-muted max-w-lg">
          {sortedBrands.length} marque{sortedBrands.length > 1 ? "s" : ""} référencée
          {sortedBrands.length > 1 ? "s" : ""} sur PhoneTimeline.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        {sortedBrands.length === 0 ? (
          <p className="text-muted text-sm">Aucune marque pour le moment.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {sortedBrands.map((brand) => (
              <Link
                key={brand.id}
                href={`/marques/${brand.slug}`}
                className="bg-card border border-hairline rounded-xl p-5 hover:border-signal/40 hover:scale-[1.02] transition-all"
              >
                <div className="font-display font-semibold text-lg mb-1">{brand.name}</div>
                <div className="font-mono text-xs text-muted mb-4">
                  {brand.min_year ?? "—"}
                  {brand.max_year ? ` → ${brand.max_year}` : ""}
                </div>
                <span className="font-mono text-xs text-signal bg-signal/10 px-2.5 py-1 rounded-full">
                  {brand.phone_count} modèle{brand.phone_count > 1 ? "s" : ""}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-hairline py-8">
        <div className="max-w-6xl mx-auto px-6 text-xs text-muted">© 2026 PhoneTimeline</div>
      </footer>
    </div>
  );
}
