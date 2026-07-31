import Link from "next/link";
import { getBrandsWithStats } from "@/lib/queries/brands";

export default async function HomePage() {
  const brands = await getBrandsWithStats();

  return (
    <>
      <header className="bg-dark text-white sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold tracking-tight">
            PhoneTimeline
          </Link>
        </div>
      </header>

      <section className="bg-dark text-white py-16">
        <div className="max-w-5xl mx-auto px-6">
          <p className="font-mono text-xs uppercase tracking-widest text-signal mb-4">
            Historique complet
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-4 max-w-xl">
            Chaque téléphone. Chaque année. Depuis le début.
          </h1>
          <p className="text-white/60 max-w-md">
            L&apos;évolution complète des grandes marques de smartphones,
            génération par génération.
          </p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 py-14">
        <h2 className="text-xl font-bold mb-6">Choisis une marque</h2>

        {brands.length === 0 ? (
          <p className="text-inksoft">
            Aucune marque pour le moment.{" "}
            <Link href="/admin/marques" className="text-jade underline">
              Ajoutes-en une depuis l&apos;admin
            </Link>
            .
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/marques/${brand.slug}`}
                className="bg-surface border border-line rounded p-6 text-center hover:border-jade transition-colors"
              >
                <div className="font-bold text-lg mb-2">{brand.name}</div>
                <div className="font-mono text-xs text-inksoft mb-3">
                  {brand.min_year ?? "—"}
                  {brand.max_year ? ` — ${brand.max_year}` : ""}
                </div>
                <span className="font-mono text-xs text-jade bg-bg px-2.5 py-1 rounded-full">
                  {brand.phone_count} modèle{brand.phone_count > 1 ? "s" : ""}
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-dark text-white/50 text-xs py-8">
        <div className="max-w-5xl mx-auto px-6">© 2026 PhoneTimeline</div>
      </footer>
    </>
  );
}

