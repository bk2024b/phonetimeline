import Link from "next/link";
import Image from "next/image";
import { getBrandsWithStats } from "@/lib/queries/brands";
import { getSiteStats, getLatestPhones, getPhoneCountsByYear } from "@/lib/queries/stats";
import Logo from "@/components/public/Logo";
import YearsOverviewChart from "@/components/public/YearsOverviewChart";

export default async function HomePage() {
  const [brands, stats, latest, yearCounts] = await Promise.all([
    getBrandsWithStats(),
    getSiteStats(),
    getLatestPhones(6),
    getPhoneCountsByYear()
  ]);

  const popularBrands = [...brands].sort((a, b) => b.phone_count - a.phone_count);

  return (
    <div className="bg-night text-white min-h-screen">
      <header className="sticky top-0 z-50 bg-night/90 backdrop-blur border-b border-hairline">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Logo light />
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted">
            <Link href="/marques" className="hover:text-white transition-colors">
              Marques
            </Link>
            <Link href="/timeline" className="hover:text-white transition-colors">
              Timeline
            </Link>
            <Link href="/comparer" className="hover:text-white transition-colors">
              Comparateur
            </Link>
          </nav>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 pt-16 pb-10 grid md:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-signal mb-5">
            Historique complet des smartphones
          </p>
          <h1 className="font-display font-bold text-4xl md:text-5xl leading-[1.1] mb-5">
            L&apos;évolution complète des smartphones,{" "}
            <span className="text-signal">génération par génération.</span>
          </h1>
          <p className="text-muted max-w-lg mb-8">
            Historique, caractéristiques et évolution de chaque marque, modèle
            par modèle, année par année.
          </p>

          <form action="/marques" className="max-w-xl mb-10">
            <div className="flex items-center gap-3 bg-card border border-hairline rounded-xl px-4 py-3 focus-within:border-signal/50 transition-colors">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-muted shrink-0"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher un téléphone, une marque..."
                className="bg-transparent flex-1 text-sm outline-none placeholder:text-muted"
                disabled
              />
            </div>
            <p className="text-xs text-muted mt-2 font-mono">
              Recherche en cours de construction — parcours les marques ci-dessous pour l&apos;instant
            </p>
          </form>

          <div className="grid grid-cols-3 gap-4 max-w-xl">
            <div className="bg-card border border-hairline rounded-lg px-4 py-3">
              <div className="font-mono font-bold text-2xl">{stats.totalPhones}</div>
              <div className="text-xs text-muted mt-1">Téléphones</div>
            </div>
            <div className="bg-card border border-hairline rounded-lg px-4 py-3">
              <div className="font-mono font-bold text-2xl">{stats.totalBrands}</div>
              <div className="text-xs text-muted mt-1">Marques</div>
            </div>
            <div className="bg-card border border-hairline rounded-lg px-4 py-3">
              <div className="font-mono font-bold text-2xl">
                {stats.minYear && stats.maxYear ? stats.maxYear - stats.minYear : 0}
              </div>
              <div className="text-xs text-muted mt-1">Années couvertes</div>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-center">
          <Image
            src="/images/hero-phones.png"
            alt="Illustration de plusieurs smartphones"
            width={929}
            height={876}
            priority
            className="w-full max-w-md h-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
          />
        </div>
      </section>

      <section id="marques" className="max-w-6xl mx-auto px-6 py-14 border-t border-hairline">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-semibold text-xl">Marques populaires</h2>
          <Link href="/marques" className="font-mono text-xs text-signal">
            Voir toutes les marques →
          </Link>
        </div>

        {popularBrands.length === 0 ? (
          <p className="text-muted text-sm">Aucune marque pour le moment.</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {popularBrands.map((brand) => (
              <Link
                key={brand.id}
                href={`/marques/${brand.slug}`}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 rounded-2xl bg-card border border-hairline flex items-center justify-center mb-2 overflow-hidden group-hover:border-signal/40 transition-colors">
                  {brand.logo_url ? (
                    <Image
                      src={brand.logo_url}
                      alt={brand.name}
                      width={80}
                      height={80}
                      className="object-contain w-14 h-14"
                    />
                  ) : (
                    <span className="font-display font-bold text-2xl text-muted">
                      {brand.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="text-sm font-medium">{brand.name}</div>
                <div className="font-mono text-[11px] text-muted">
                  {brand.phone_count} modèle{brand.phone_count > 1 ? "s" : ""}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {latest.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-14 border-t border-hairline">
          <h2 className="font-display font-semibold text-xl mb-6">Derniers ajouts</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {latest.map((phone) => {
              const cover = phone.phone_images?.[0];
              return (
                <Link
                  key={phone.id}
                  href={`/smartphones/${phone.slug}`}
                  className="group"
                >
                  <div className="bg-card border border-hairline rounded-lg aspect-square flex items-center justify-center mb-2 overflow-hidden group-hover:border-signal/40 transition-colors">
                    {cover ? (
                      <Image
                        src={cover.url}
                        alt={cover.alt ?? phone.name}
                        width={160}
                        height={160}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-3xl opacity-30">📱</span>
                    )}
                  </div>
                  <div className="text-sm font-medium truncate">{phone.name}</div>
                  <div className="font-mono text-xs text-muted">
                    {phone.brands?.name} · {phone.release_year}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {yearCounts.length >= 2 && (
        <section className="max-w-6xl mx-auto px-6 py-14 border-t border-hairline">
          <h2 className="font-display font-semibold text-xl mb-2">Aperçu chronologique</h2>
          <p className="text-sm text-muted mb-6">
            Combien de téléphones sont renseignés sur le site, par année de sortie.
          </p>
          <div className="bg-card border border-hairline rounded-xl p-5">
            <YearsOverviewChart data={yearCounts} />
          </div>
        </section>
      )}

      <footer className="border-t border-hairline py-8">
        <div className="max-w-6xl mx-auto px-6 text-xs text-muted">
          © 2026 PhoneTimeline
        </div>
      </footer>
    </div>
  );
}
