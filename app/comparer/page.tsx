import Link from "next/link";
import { getAllPhonesForCompare } from "@/lib/queries/compare";
import Comparator from "@/components/public/Comparator";
import Logo from "@/components/public/Logo";

export default async function ComparePage({
  searchParams
}: {
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  const { a, b } = await searchParams;
  const phones = await getAllPhonesForCompare();

  const initialA = a ? phones.find((p) => p.slug === a) : undefined;
  const initialB = b ? phones.find((p) => p.slug === b) : undefined;

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
            <Link href="/comparer" className="text-white">
              Comparateur
            </Link>
          </nav>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 pt-14 pb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-signal mb-4">
          Comparateur
        </p>
        <h1 className="font-display font-bold text-3xl md:text-4xl mb-3">
          Compare deux téléphones
        </h1>
        <p className="text-muted max-w-lg">
          Choisis deux modèles pour voir leurs caractéristiques côte à côte —
          la meilleure valeur de chaque ligne est mise en avant.
        </p>
      </section>

      <main className="max-w-4xl mx-auto px-6 pb-16">
        <Comparator phones={phones} initialA={initialA} initialB={initialB} />
      </main>

      <footer className="border-t border-hairline py-8">
        <div className="max-w-6xl mx-auto px-6 text-xs text-muted">© 2026 PhoneTimeline</div>
      </footer>
    </div>
  );
}
