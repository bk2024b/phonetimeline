import Link from "next/link";
import { notFound } from "next/navigation";
import { getPhoneBySlug, getAllPhonesLite } from "@/lib/queries/phones";
import { getPhonesByRangeId } from "@/lib/queries/ranges";
import CompareFromYourPhone from "@/components/public/CompareFromYourPhone";
import PhoneDNA from "@/components/public/PhoneDNA";

function SpecRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="grid grid-cols-[180px_1fr] text-sm border-t border-line first:border-t-0">
      <div className="px-4 py-3 font-mono text-xs text-inksoft">{label}</div>
      <div className="px-4 py-3 border-l border-line font-medium">{value}</div>
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

  if (!phone) notFound();

  const [allPhones, rangePhones] = await Promise.all([
    getAllPhonesLite(),
    phone.range_id ? getPhonesByRangeId(phone.range_id) : Promise.resolve([])
  ]);

  const otherPhones = allPhones.filter((p) => p.id !== phone.id);
  const phoneForDNA = { ...phone, phone_changes: phone.phone_changes ?? [] };

  return (
    <>
      <header className="bg-dark text-white sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold tracking-tight">
            PhoneTimeline
          </Link>
          <Link
            href={`/marques/${phone.brands.slug}`}
            className="text-sm text-white/60 hover:text-white"
          >
            ← Tous les {phone.brands.name}
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {phone.phone_images && phone.phone_images.length > 0 && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={phone.phone_images[0].url}
            alt={phone.phone_images[0].alt ?? phone.name}
            className="w-full max-w-sm rounded border border-line mb-8"
          />
        )}

        <div className="font-mono text-xs text-jade uppercase tracking-wide mb-2">
          {phone.brands.name}
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">{phone.name}</h1>

        <div className="flex flex-wrap gap-2 mb-8">
          <span className="font-mono text-xs border border-line rounded px-2.5 py-1 text-inksoft">
            Sorti en {phone.release_year}
          </span>
          {phone.is_milestone && (
            <span className="font-mono text-xs bg-amber/20 text-amber-700 rounded px-2.5 py-1">
              ★ Modèle marquant
            </span>
          )}
          {phone.price_launch && (
            <span className="font-mono text-xs border border-line rounded px-2.5 py-1 text-inksoft">
              {phone.price_launch} € au lancement
            </span>
          )}
        </div>

        {phone.milestone_note && (
          <div className="bg-jade/10 border border-jade/30 text-jade text-sm rounded p-4 mb-8">
            {phone.milestone_note}
          </div>
        )}

        {(phone.predecessor || phone.successor) && (
          <div className="grid grid-cols-2 gap-3 mb-8">
            {phone.predecessor ? (
              <Link
                href={`/smartphones/${phone.predecessor.slug}`}
                className="bg-surface border border-line rounded p-4 hover:border-jade transition-colors"
              >
                <div className="font-mono text-[11px] text-inksoft uppercase mb-1">
                  ← Prédécesseur
                </div>
                <div className="font-semibold text-sm">{phone.predecessor.name}</div>
                <div className="font-mono text-xs text-inksoft">
                  {phone.predecessor.release_year}
                </div>
              </Link>
            ) : (
              <div className="border border-dashed border-line rounded p-4 text-inksoft text-sm">
                Premier de sa lignée
              </div>
            )}

            {phone.successor ? (
              <Link
                href={`/smartphones/${phone.successor.slug}`}
                className="bg-surface border border-line rounded p-4 text-right hover:border-jade transition-colors"
              >
                <div className="font-mono text-[11px] text-inksoft uppercase mb-1">
                  Successeur →
                </div>
                <div className="font-semibold text-sm">{phone.successor.name}</div>
                <div className="font-mono text-xs text-inksoft">
                  {phone.successor.release_year}
                </div>
              </Link>
            ) : (
              <div className="border border-dashed border-line rounded p-4 text-inksoft text-sm text-right">
                Dernier de sa lignée (pour l&apos;instant)
              </div>
            )}
          </div>
        )}

        {phone.phone_changes && phone.phone_changes.length > 0 && (
          <div className="mb-10">
            <h2 className="font-bold text-lg mb-3">
              Ce qui change depuis {phone.predecessor?.name ?? "le modèle précédent"}
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="font-mono text-xs text-jade uppercase mb-2">
                  ✓ Ajouté
                </div>
                <ul className="space-y-1.5">
                  {phone.phone_changes
                    .filter((c) => c.type === "added")
                    .map((c) => (
                      <li
                        key={c.id}
                        className="text-sm bg-jade/10 rounded px-3 py-2"
                      >
                        {c.description}
                      </li>
                    ))}
                </ul>
              </div>
              <div>
                <div className="font-mono text-xs text-red-600 uppercase mb-2">
                  ✗ Supprimé
                </div>
                <ul className="space-y-1.5">
                  {phone.phone_changes
                    .filter((c) => c.type === "removed")
                    .map((c) => (
                      <li
                        key={c.id}
                        className="text-sm bg-red-50 rounded px-3 py-2"
                      >
                        {c.description}
                      </li>
                    ))}
                </ul>
              </div>
              <div>
                <div className="font-mono text-xs text-inksoft uppercase mb-2">
                  = Inchangé
                </div>
                <ul className="space-y-1.5">
                  {phone.phone_changes
                    .filter((c) => c.type === "unchanged")
                    .map((c) => (
                      <li key={c.id} className="text-sm bg-bg rounded px-3 py-2">
                        {c.description}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {Object.keys(phone.scores ?? {}).length > 0 && (
          <div className="mb-10">
            <h2 className="font-bold text-lg mb-3">Score d&apos;évolution</h2>
            <div className="bg-surface border border-line rounded p-5">
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
                      <span className="text-inksoft">{label}</span>
                      <span className="text-amber font-mono">
                        {"★".repeat(phone.scores[key] as number)}
                        {"☆".repeat(5 - (phone.scores[key] as number))}
                      </span>
                    </div>
                  ) : null
                )}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-line font-semibold text-sm">
                <span>Score global</span>
                <span className="font-mono text-jade">
                  {(
                    Object.values(phone.scores ?? {}).reduce((a, b) => a + (b ?? 0), 0) /
                    Object.values(phone.scores ?? {}).length
                  ).toFixed(1)}{" "}
                  / 5
                </span>
              </div>
            </div>
          </div>
        )}

        <h2 className="font-bold text-lg mb-3">Caractéristiques</h2>
        <div className="bg-surface border border-line rounded overflow-hidden mb-4">
          <SpecRow label="Date de sortie" value={phone.release_date} />
          <SpecRow
            label="Écran"
            value={
              phone.screen_size
                ? `${phone.screen_size}" ${phone.screen_type ?? ""}`.trim()
                : phone.screen_type
            }
          />
          <SpecRow
            label="Taux de rafraîchissement"
            value={phone.refresh_rate ? `${phone.refresh_rate} Hz` : null}
          />
          <SpecRow label="Processeur" value={phone.processor} />
          <SpecRow label="RAM" value={phone.ram_gb ? `${phone.ram_gb} Go` : null} />
          <SpecRow
            label="Stockage"
            value={phone.storage_gb ? `${phone.storage_gb} Go` : null}
          />
          <SpecRow
            label="Batterie"
            value={phone.battery_mah ? `${phone.battery_mah} mAh` : null}
          />
          <SpecRow
            label="Caméra principale"
            value={phone.main_camera_mp ? `${phone.main_camera_mp} MP` : null}
          />
          <SpecRow label="Poids" value={phone.weight_g ? `${phone.weight_g} g` : null} />
        </div>

        {Object.keys(phone.extra_specs ?? {}).length > 0 && (
          <>
            <h2 className="font-bold text-lg mb-3 mt-8">Autres caractéristiques</h2>
            <div className="bg-surface border border-line rounded overflow-hidden">
              {Object.entries(phone.extra_specs).map(([key, value]) => (
                <SpecRow key={key} label={key} value={value} />
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="bg-dark text-white/50 text-xs py-8">
        <div className="max-w-5xl mx-auto px-6">© 2026 PhoneTimeline</div>
      </footer>
    </>
  );
}
