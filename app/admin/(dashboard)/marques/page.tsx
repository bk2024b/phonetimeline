import { createClient } from "@/lib/supabase/server";
import { createBrand, deleteBrand } from "../../actions";
import type { Brand } from "@/lib/types";
import Link from "next/link";

export default async function BrandsPage() {
  const supabase = await createClient();
  const { data: brands } = await supabase
    .from("brands")
    .select("*")
    .order("name") as { data: Brand[] | null };

  return (
    <main className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Marques</h1>

      <table className="w-full text-sm mb-10 bg-surface border border-line rounded overflow-hidden">
        <thead className="bg-bg text-inksoft text-xs uppercase">
          <tr>
            <th className="text-left px-4 py-2">Nom</th>
            <th className="text-left px-4 py-2">Slug</th>
            <th className="text-left px-4 py-2">Depuis</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {(brands ?? []).map((brand) => (
            <tr key={brand.id} className="border-t border-line">
              <td className="px-4 py-2 font-medium">{brand.name}</td>
              <td className="px-4 py-2 text-inksoft">{brand.slug}</td>
              <td className="px-4 py-2 text-inksoft">
                {brand.founded_year ?? "—"}
              </td>
              <td className="px-4 py-2 text-right space-x-3">
                <Link
                  href={`/admin/marques/${brand.id}`}
                  className="text-jade font-medium"
                >
                  Modifier
                </Link>
                <form action={deleteBrand.bind(null, brand.id)} className="inline">
                  <button className="text-red-600 font-medium">
                    Supprimer
                  </button>
                </form>
              </td>
            </tr>
          ))}
          {(brands ?? []).length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-inksoft">
                Aucune marque pour le moment.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="bg-surface border border-line rounded p-6 max-w-md">
        <h2 className="font-semibold mb-4">Ajouter une marque</h2>
        <form action={createBrand} className="space-y-3">
          <div>
            <label className="text-sm font-medium block mb-1">Nom</label>
            <input
              name="name"
              required
              placeholder="Samsung"
              className="w-full border border-line rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">
              Slug (utilisé dans l&apos;URL)
            </label>
            <input
              name="slug"
              required
              placeholder="samsung"
              className="w-full border border-line rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">
              Année de fondation / premier modèle
            </label>
            <input
              name="founded_year"
              type="number"
              placeholder="2010"
              className="w-full border border-line rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">
              URL du logo (optionnel)
            </label>
            <input
              name="logo_url"
              placeholder="https://..."
              className="w-full border border-line rounded px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="bg-jade text-white text-sm font-medium px-4 py-2 rounded"
          >
            Ajouter
          </button>
        </form>
      </div>
    </main>
  );
}
