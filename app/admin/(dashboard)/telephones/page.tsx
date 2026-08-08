import { createClient } from "@/lib/supabase/server";
import { deletePhone } from "../../actions";
import type { PhoneWithBrand, Brand, PhoneDataStatus } from "@/lib/types";
import Link from "next/link";
import DeleteButton from "@/components/admin/DeleteButton";

const STATUS_BADGE: Record<PhoneDataStatus, { icon: string; label: string; className: string }> = {
  verified: { icon: "✓", label: "Vérifié", className: "text-jade" },
  needs_review: { icon: "⚠", label: "À vérifier", className: "text-amber" },
  unverified: { icon: "○", label: "Non vérifié", className: "text-inksoft" }
};

export default async function PhonesPage({
  searchParams
}: {
  searchParams: Promise<{ marque?: string; statut?: string }>;
}) {
  const { marque, statut } = await searchParams;
  const supabase = await createClient();

  const { data: brands } = (await supabase
    .from("brands")
    .select("id, slug, name, founded_year, logo_url, created_at")
    .order("name")) as { data: Brand[] | null };

  let query = supabase
    .from("phones")
    .select("*, brands(id, name, slug)")
    .order("release_year", { ascending: false });

  if (marque) {
    const brand = (brands ?? []).find((b) => b.slug === marque);
    if (brand) query = query.eq("brand_id", brand.id);
  }
  if (statut && ["verified", "needs_review", "unverified"].includes(statut)) {
    query = query.eq("data_status", statut);
  }

  const { data: phones } = (await query) as { data: PhoneWithBrand[] | null };

  return (
    <main className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Téléphones</h1>
        <Link
          href="/admin/telephones/nouveau"
          className="bg-jade text-white text-sm font-medium px-4 py-2 rounded"
        >
          + Ajouter un téléphone
        </Link>
      </div>

      <div className="flex gap-2 mb-3 flex-wrap">
        <Link
          href={{ pathname: "/admin/telephones", query: statut ? { statut } : {} }}
          className={`text-xs font-mono px-3 py-1.5 rounded-full border ${
            !marque ? "bg-dark text-white border-dark" : "border-line text-inksoft"
          }`}
        >
          Toutes marques
        </Link>
        {(brands ?? []).map((b) => (
          <Link
            key={b.id}
            href={{
              pathname: "/admin/telephones",
              query: { marque: b.slug, ...(statut ? { statut } : {}) }
            }}
            className={`text-xs font-mono px-3 py-1.5 rounded-full border ${
              marque === b.slug
                ? "bg-dark text-white border-dark"
                : "border-line text-inksoft"
            }`}
          >
            {b.name}
          </Link>
        ))}
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        <Link
          href={{ pathname: "/admin/telephones", query: marque ? { marque } : {} }}
          className={`text-xs font-mono px-3 py-1.5 rounded-full border ${
            !statut ? "bg-dark text-white border-dark" : "border-line text-inksoft"
          }`}
        >
          Tous statuts
        </Link>
        {(
          [
            ["verified", "✓ Vérifié"],
            ["needs_review", "⚠ À vérifier"],
            ["unverified", "○ Non vérifié"]
          ] as const
        ).map(([value, label]) => (
          <Link
            key={value}
            href={{
              pathname: "/admin/telephones",
              query: { ...(marque ? { marque } : {}), statut: value }
            }}
            className={`text-xs font-mono px-3 py-1.5 rounded-full border ${
              statut === value
                ? "bg-dark text-white border-dark"
                : "border-line text-inksoft"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      <table className="w-full text-sm bg-surface border border-line rounded overflow-hidden">
        <thead className="bg-bg text-inksoft text-xs uppercase">
          <tr>
            <th className="text-left px-4 py-2">Modèle</th>
            <th className="text-left px-4 py-2">Marque</th>
            <th className="text-left px-4 py-2">Année</th>
            <th className="text-left px-4 py-2">Marquant</th>
            <th className="text-left px-4 py-2">Données</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {(phones ?? []).map((phone) => {
            const badge = STATUS_BADGE[phone.data_status ?? "unverified"];
            return (
              <tr key={phone.id} className="border-t border-line">
                <td className="px-4 py-2 font-medium">{phone.name}</td>
                <td className="px-4 py-2 text-inksoft">{phone.brands?.name}</td>
                <td className="px-4 py-2 text-inksoft">{phone.release_year}</td>
                <td className="px-4 py-2">
                  {phone.is_milestone ? (
                    <span className="text-amber">★</span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className={`px-4 py-2 font-mono text-xs ${badge.className}`} title={badge.label}>
                  {badge.icon} {badge.label}
                </td>
                <td className="px-4 py-2 text-right space-x-3">
                  <Link
                    href={`/admin/telephones/${phone.id}`}
                    className="text-jade font-medium"
                  >
                    Modifier
                  </Link>
                  <form action={deletePhone.bind(null, phone.id)} className="inline">
                    <DeleteButton
                      confirmText={`Supprimer « ${phone.name} » ? Ses photos seront supprimées avec lui. Cette action est irréversible.`}
                    />
                  </form>
                </td>
              </tr>
            );
          })}
          {(phones ?? []).length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-center text-inksoft">
                Aucun téléphone pour le moment.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}
