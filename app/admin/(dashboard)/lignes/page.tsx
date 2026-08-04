import { createClient } from "@/lib/supabase/server";
import { createModelLine, deleteModelLine } from "../../actions";
import type { Brand, ModelLine } from "@/lib/types";
import Link from "next/link";

type ModelLineWithBrand = ModelLine & { brands: Pick<Brand, "id" | "name"> };

export default async function ModelLinesPage() {
  const supabase = await createClient();

  const [{ data: lines }, { data: brands }] = await Promise.all([
    supabase
      .from("model_lines")
      .select("*, brands(id, name)")
      .order("name") as unknown as Promise<{ data: ModelLineWithBrand[] | null }>,
    supabase.from("brands").select("*").order("name") as unknown as Promise<{
      data: Brand[] | null;
    }>
  ]);

  return (
    <main className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-2">Lignes de modèle</h1>
      <p className="text-sm text-inksoft mb-6">
        Une ligne suit un palier de produit à travers les années (ex:
        &quot;iPhone Pro&quot; de l&apos;iPhone 11 Pro au 16 Pro) — à ne pas
        confondre avec une gamme, qui regroupe les variants d&apos;une même
        génération (ex: &quot;iPhone 13&quot; = mini/13/Pro/Pro Max).
      </p>

      <table className="w-full text-sm mb-10 bg-surface border border-line rounded overflow-hidden">
        <thead className="bg-bg text-inksoft text-xs uppercase">
          <tr>
            <th className="text-left px-4 py-2">Nom</th>
            <th className="text-left px-4 py-2">Marque</th>
            <th className="text-left px-4 py-2">Slug</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {(lines ?? []).map((line) => (
            <tr key={line.id} className="border-t border-line">
              <td className="px-4 py-2 font-medium">{line.name}</td>
              <td className="px-4 py-2 text-inksoft">{line.brands?.name}</td>
              <td className="px-4 py-2 text-inksoft">{line.slug}</td>
              <td className="px-4 py-2 text-right space-x-3">
                <Link href={`/admin/lignes/${line.id}`} className="text-jade font-medium">
                  Modifier
                </Link>
                <form action={deleteModelLine.bind(null, line.id)} className="inline">
                  <button className="text-red-600 font-medium">Supprimer</button>
                </form>
              </td>
            </tr>
          ))}
          {(lines ?? []).length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-inksoft">
                Aucune ligne de modèle pour le moment.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="bg-surface border border-line rounded p-6 max-w-md">
        <h2 className="font-semibold mb-4">Ajouter une ligne de modèle</h2>
        <form action={createModelLine} className="space-y-3">
          <div>
            <label className="text-sm font-medium block mb-1">Marque</label>
            <select
              name="brand_id"
              required
              defaultValue=""
              className="w-full border border-line rounded px-3 py-2 text-sm bg-white"
            >
              <option value="" disabled>
                Choisir...
              </option>
              {(brands ?? []).map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Nom de la ligne</label>
            <input
              name="name"
              required
              placeholder="iPhone Pro"
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
              placeholder="iphone-pro"
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
