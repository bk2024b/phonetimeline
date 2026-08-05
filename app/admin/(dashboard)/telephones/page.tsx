import { createClient } from "@/lib/supabase/server";
import { deletePhone } from "../../actions";
import type { PhoneWithBrand, Brand } from "@/lib/types";
import Link from "next/link";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function PhonesPage({
  searchParams
}: {
  searchParams: Promise<{ marque?: string }>;
}) {
  const { marque } = await searchParams;
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

      <div className="flex gap-2 mb-5 flex-wrap">
        <Link
          href="/admin/telephones"
          className={`text-xs font-mono px-3 py-1.5 rounded-full border ${
            !marque ? "bg-dark text-white border-dark" : "border-line text-inksoft"
          }`}
        >
          Toutes
        </Link>
        {(brands ?? []).map((b) => (
          <Link
            key={b.id}
            href={`/admin/telephones?marque=${b.slug}`}
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

      <table className="w-full text-sm bg-surface border border-line rounded overflow-hidden">
        <thead className="bg-bg text-inksoft text-xs uppercase">
          <tr>
            <th className="text-left px-4 py-2">Modèle</th>
            <th className="text-left px-4 py-2">Marque</th>
            <th className="text-left px-4 py-2">Année</th>
            <th className="text-left px-4 py-2">Marquant</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {(phones ?? []).map((phone) => (
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
          ))}
          {(phones ?? []).length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-inksoft">
                Aucun téléphone pour le moment.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}
