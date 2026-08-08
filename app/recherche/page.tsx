import Link from "next/link";
import Image from "next/image";
import { searchPhones } from "@/lib/queries/search";
import Logo from "@/components/public/Logo";

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? await searchPhones(query) : [];

  return (
    <div className="bg-night text-white min-h-screen">
      <header className="sticky top-0 z-50 bg-night/90 backdrop-blur border-b border-hairline">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Logo light />
          </Link>
          <nav className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted">
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

      <section className="max-w-4xl mx-auto px-6 pt-14 pb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-signal mb-4">
          Recherche
        </p>
        <form action="/recherche" className="mb-2">
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
              name="q"
              defaultValue={query}
              placeholder="Rechercher un téléphone, une marque..."
              autoFocus
              className="bg-transparent flex-1 text-sm outline-none placeholder:text-muted"
            />
          </div>
        </form>
      </section>

      <main className="max-w-4xl mx-auto px-6 pb-16">
        {!query && (
          <p className="text-muted text-sm">Tape un nom de téléphone ou de marque ci-dessus.</p>
        )}

        {query && (
          <p className="text-sm text-muted mb-6">
            {results.length} résultat{results.length > 1 ? "s" : ""} pour «&nbsp;{query}&nbsp;»
          </p>
        )}

        {query && results.length === 0 && (
          <p className="text-muted text-sm">
            Aucun téléphone ne correspond à cette recherche.{" "}
            <Link href="/marques" className="text-signal underline">
              Parcourir les marques
            </Link>{" "}
            à la place.
          </p>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {results.map((phone) => (
              <Link
                key={phone.id}
                href={`/smartphones/${phone.slug}`}
                className="bg-card border border-hairline rounded-xl overflow-hidden hover:border-signal/40 hover:scale-[1.02] transition-all"
              >
                <div className="aspect-square bg-panel flex items-center justify-center">
                  {phone.cover_url ? (
                    <Image
                      src={phone.cover_url}
                      alt={phone.name}
                      width={200}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-4xl opacity-30">📱</span>
                  )}
                </div>
                <div className="p-4">
                  <div className="font-medium text-sm mb-1 truncate">{phone.name}</div>
                  <div className="font-mono text-xs text-muted mb-2">
                    {phone.brand_name} · {phone.release_year}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {phone.screen_size && (
                      <span className="font-mono text-[10px] bg-panel text-muted px-1.5 py-0.5 rounded">
                        {phone.screen_size}&quot;
                      </span>
                    )}
                    {phone.storage_gb && (
                      <span className="font-mono text-[10px] bg-panel text-muted px-1.5 py-0.5 rounded">
                        {phone.storage_gb} Go
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-hairline py-8">
        <div className="max-w-6xl mx-auto px-6 text-xs text-muted">© 2026 PhoneTimeline</div>
      </footer>
    </div>
  );
}
