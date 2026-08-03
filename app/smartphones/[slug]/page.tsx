import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPhoneBySlug, getAllPhonesLite, getSimilarPhones } from "@/lib/queries/phones";
import { getPhonesByRangeId } from "@/lib/queries/ranges";
import CompareFromYourPhone from "@/components/public/CompareFromYourPhone";
import PhoneDNA from "@/components/public/PhoneDNA";
import PhoneTabs from "@/components/public/PhoneTabs";
import Logo from "@/components/public/Logo";

function SpecPair({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex items-center justify-between text-sm py-2 border-t border-hairline first:border-t-0">
      <span className="text-muted">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function SpecCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-hairline rounded-xl p-5">
      <div className="font-mono text-[11px] uppercase tracking-wide text-muted mb-1">
        {title}
      </div>
      {children}
    </div>
  );
}

export default async function PhoneDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const phone = await getPhoneBySlug(slug);

  if (!phone || !phone.brands) notFound();

  const [allPhones, rangePhones, similarPhones] = await Promise.all([
    getAllPhonesLite(),
    phone.range_id ? getPhonesByRangeId(phone.range_id) : Promise.resolve([]),
    phone.range_id ? getSimilarPhones(phone.range_id, phone.id) : Promise.resolve([])
  ]);

  const otherPhones = allPhones.filter((p) => p.id !== phone.id);
  const phoneForDNA = { ...phone, phone_changes: phone.phone_changes ?? [] };
  const images = phone.phone_images ?? [];
  const cover = images[0];
  const added = (phone.phone_changes ?? []).filter((c) => c.type === "added");
  const removed = (phone.phone_changes ?? []).filter((c) => c.type === "removed");
  const unchanged = (phone.phone_changes ?? []).filter((c) => c.type === "unchanged");

  const overviewContent = (
    <div>
      {added.length > 0 && (
        <section className="mb-10">
          <h2 className="font-display font-semibold text-lg mb-4">Nouveautés</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {added.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-2 bg-signal/10 border border-signal/20 rounded-lg px-3 py-2.5 text-sm"
              >
                <span className="text-signal font-bold">✓</span>
                {c.description}
              </div>
            ))}
          </div>
        </section>
      )}

      {(added.length > 0 || removed.length > 0 || unchanged.length > 0) && (
        <section className="mb-10">
          <h2 className="font-display font-semibold text-lg mb-4">
            Ce qui change depuis {phone.predecessor?.name ?? "le modèle précédent"}
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="font-mono text-xs text-signal uppercase mb-2">✓ Ajouté</div>
              <ul className="space-y-1.5">
                {added.map((c) => (
                  <li key={c.id} className="text-sm bg-signal/10 rounded-lg px-3 py-2">
                    {c.description}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-mono text-xs text-red-400 uppercase mb-2">✗ Supprimé</div>
              <ul className="space-y-1.5">
                {removed.map((c) => (
                  <li key={c.id} className="text-sm bg-red-500/10 rounded-lg px-3 py-2">
                    {c.description}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-mono text-xs text-muted uppercase mb-2">= Inchangé</div>
              <ul className="space-y-1.5">
                {unchanged.map((c) => (
                  <li key={c.id} className="text-sm bg-card rounded-lg px-3 py-2">
                    {c.description}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {Object.keys(phone.scores ?? {}).length > 0 && (
        <section className="mb-10">
          <h2 className="font-display font-semibold text-lg mb-4">Score d&apos;évolution</h2>
          <div className="bg-card border border-hairline rounded-xl p-5">
            <div className="space-y-2 mb-4">
              {(
                [
                  ["design", "Design"],
                  ["ecran", "Écran"],
                  ["photo", "Photo"],
                  ["autonomie", "Autonomie"],
                  ["performances", "Performances"]
                ] as const
              ).map(([key, label]) =>
                phone.scores?.[key] ? (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <span className="text-muted">{label}</span>
                    <span className="text-signal font-mono">
                      {"★".repeat(phone.scores[key] as number)}
                      {"☆".repeat(5 - (phone.scores[key] as number))}
                    </span>
                  </div>
                ) : null
              )}
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-hairline font-semibold text-sm">
              <span>Score global</span>
              <span className="font-mono text-signal">
                {(
                  Object.values(phone.scores ?? {}).reduce((a, b) => a + (b ?? 0), 0) /
                  Object.values(phone.scores ?? {}).length
                ).toFixed(1)}{" "}
                / 5
              </span>
            </div>
          </div>
        </section>
      )}

      <PhoneDNA phone={phoneForDNA} rangePhones={rangePhones} />
      <CompareFromYourPhone current={phone} others={otherPhones} />
    </div>
  );

  const specsContent = (
    <div className="grid md:grid-cols-2 gap-4">
      <SpecCard title="Écran">
        <SpecPair label="Taille" value={phone.screen_size ? `${phone.screen_size}"` : null} />
        <SpecPair label="Type de dalle" value={phone.screen_type} />
        <SpecPair
          label="Taux de rafraîchissement"
          value={phone.refresh_rate ? `${phone.refresh_rate} Hz` : null}
        />
      </SpecCard>

      <SpecCard title="Performance">
        <SpecPair label="Processeur" value={phone.processor} />
        <SpecPair label="RAM" value={phone.ram_gb ? `${phone.ram_gb} Go` : null} />
        <SpecPair label="Stockage" value={phone.storage_gb ? `${phone.storage_gb} Go` : null} />
      </SpecCard>

      <SpecCard title="Batterie & Photo">
        <SpecPair
          label="Batterie"
          value={phone.battery_mah ? `${phone.battery_mah} mAh` : null}
        />
        <SpecPair
          label="Caméra principale"
          value={phone.main_camera_mp ? `${phone.main_camera_mp} MP` : null}
        />
      </SpecCard>

      <SpecCard title="Général">
        <SpecPair label="Date de sortie" value={phone.release_date} />
        <SpecPair label="Poids" value={phone.weight_g ? `${phone.weight_g} g` : null} />
        <SpecPair
          label="Prix au lancement"
          value={phone.price_launch ? `${phone.price_launch} $` : null}
        />
      </SpecCard>

      {Object.keys(phone.extra_specs ?? {}).length > 0 && (
        <SpecCard title="Autres caractéristiques">
          {Object.entries(phone.extra_specs).map(([key, value]) => (
            <SpecPair key={key} label={key} value={value} />
          ))}
        </SpecCard>
      )}
    </div>
  );

  const galleryContent =
    images.length > 0 ? (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="bg-card border border-hairline rounded-xl aspect-square overflow-hidden"
          >
            <Image
              src={img.url}
              alt={img.alt ?? phone.name}
              width={300}
              height={300}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>
    ) : null;

  return (
    <div className="bg-night text-white min-h-screen">
      <header className="sticky top-0 z-50 bg-night/90 backdrop-blur border-b border-hairline">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Logo light />
          </Link>
          <Link
            href={`/marques/${phone.brands.slug}`}
            className="text-sm text-muted hover:text-white transition-colors"
          >
            ← Tous les {phone.brands.name}
          </Link>
        </div>
      </header>

      <nav className="max-w-5xl mx-auto px-6 pt-6 text-xs font-mono text-muted">
        <Link href="/" className="hover:text-white transition-colors">
          Accueil
        </Link>
        {" / "}
        <Link href={`/marques/${phone.brands.slug}`} className="hover:text-white transition-colors">
          {phone.brands.name}
        </Link>
        {" / "}
        <span className="text-white">{phone.name}</span>
      </nav>

      {/* --- Hero + sidebar --- */}
      <section className="max-w-5xl mx-auto px-6 pt-8 pb-10 grid md:grid-cols-[1fr_1fr_260px] gap-8 items-start">
        <div className="bg-card border border-hairline rounded-2xl aspect-square flex items-center justify-center overflow-hidden">
          {cover ? (
            <Image
              src={cover.url}
              alt={cover.alt ?? phone.name}
              width={420}
              height={420}
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-6xl opacity-20">📱</span>
          )}
        </div>

        <div>
          <div className="font-mono text-xs text-signal uppercase tracking-wide mb-2">
            {phone.brands.name}
            {phone.ranges ? ` · ${phone.ranges.name}` : ""}
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-4">{phone.name}</h1>

          {phone.milestone_note && <p className="text-muted mb-5">{phone.milestone_note}</p>}

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="font-mono text-xs border border-hairline rounded-full px-3 py-1 text-muted">
              {phone.release_date ?? phone.release_year}
            </span>
            {phone.is_milestone && (
              <span className="font-mono text-xs bg-signal/10 text-signal rounded-full px-3 py-1">
                ★ Modèle marquant
              </span>
            )}
            {phone.price_launch && (
              <span className="font-mono text-xs border border-hairline rounded-full px-3 py-1 text-muted">
                {phone.price_launch} $ au lancement
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {phone.screen_size && (
              <span className="font-mono text-xs bg-card border border-hairline px-2.5 py-1.5 rounded-lg">
                {phone.screen_size}&quot;
              </span>
            )}
            {phone.main_camera_mp && (
              <span className="font-mono text-xs bg-card border border-hairline px-2.5 py-1.5 rounded-lg">
                {phone.main_camera_mp} MP
              </span>
            )}
            {phone.storage_gb && (
              <span className="font-mono text-xs bg-card border border-hairline px-2.5 py-1.5 rounded-lg">
                {phone.storage_gb} Go
              </span>
            )}
            {phone.ram_gb && (
              <span className="font-mono text-xs bg-card border border-hairline px-2.5 py-1.5 rounded-lg">
                {phone.ram_gb} Go RAM
              </span>
            )}
          </div>
        </div>

        {(phone.predecessor || phone.successor) && (
          <div className="bg-card border border-hairline rounded-xl p-4">
            <div className="font-mono text-[11px] uppercase text-muted mb-3">
              Position dans la lignée
            </div>
            <div className="space-y-3">
              {phone.predecessor ? (
                <Link
                  href={`/smartphones/${phone.predecessor.slug}`}
                  className="block hover:opacity-70 transition-opacity"
                >
                  <div className="text-[10px] font-mono text-muted">Précédent</div>
                  <div className="text-sm">{phone.predecessor.name}</div>
                  <div className="text-[10px] font-mono text-muted">
                    {phone.predecessor.release_year}
                  </div>
                </Link>
              ) : (
                <div className="text-[10px] font-mono text-muted">Premier de sa lignée</div>
              )}

              <div className="border-l-2 border-signal pl-3 py-1">
                <div className="text-[10px] font-mono text-signal">Actuel</div>
                <div className="text-sm font-semibold">{phone.name}</div>
                <div className="text-[10px] font-mono text-muted">{phone.release_year}</div>
              </div>

              {phone.successor ? (
                <Link
                  href={`/smartphones/${phone.successor.slug}`}
                  className="block hover:opacity-70 transition-opacity"
                >
                  <div className="text-[10px] font-mono text-muted">Suivant</div>
                  <div className="text-sm">{phone.successor.name}</div>
                  <div className="text-[10px] font-mono text-muted">
                    {phone.successor.release_year}
                  </div>
                </Link>
              ) : (
                <div className="text-[10px] font-mono text-muted">
                  Dernier de sa lignée (pour l&apos;instant)
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      <main className="max-w-5xl mx-auto px-6 pb-16">
        <PhoneTabs overview={overviewContent} specs={specsContent} gallery={galleryContent} />

        {similarPhones.length > 0 && (
          <section className="mt-14 pt-10 border-t border-hairline">
            <h2 className="font-display font-semibold text-lg mb-4">Modèles similaires</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similarPhones.map((p) => {
                const c = p.phone_images?.[0];
                return (
                  <Link
                    key={p.id}
                    href={`/smartphones/${p.slug}`}
                    className="bg-card border border-hairline rounded-xl overflow-hidden hover:border-signal/40 transition-colors"
                  >
                    <div className="aspect-square bg-panel flex items-center justify-center">
                      {c ? (
                        <Image
                          src={c.url}
                          alt={c.alt ?? p.name}
                          width={150}
                          height={150}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-3xl opacity-30">📱</span>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="text-sm font-medium truncate">{p.name}</div>
                      <div className="font-mono text-xs text-muted">{p.release_year}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-hairline py-8">
        <div className="max-w-5xl mx-auto px-6 text-xs text-muted">© 2026 PhoneTimeline</div>
      </footer>
    </div>
  );
}
