import { createClient } from "@/lib/supabase/server";
import { createRange, deleteRange } from "../../actions";
import type { Brand, Range } from "@/lib/types";
import Link from "next/link";
import DeleteButton from "@/components/admin/DeleteButton";

type RangeWithBrand = Range & { brands: Pick<Brand, "id" | "name"> };

export default async function RangesPage() {
  const supabase = await createClient();

  const [{ data: ranges }, { data: brands }] = await Promise.all([
    supabase
      .from("ranges")
      .select("*, brands(id, name)")
      .order("name") as unknown as Promise<{ data: RangeWithBrand[] | null }>,
    supabase.from("brands").select("*").order("name") as unknown as Promise<{
      data: Brand[] | null;
    }>
  ]);

  return (
    <main className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Gammes</h1>

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
          {(ranges ?? []).map((range) => (
            <tr key={range.id} className="border-t border-line">
              <td className="px-4 py-2 font-medium">{range.name}</td>
              <td className="px-4 py-2 text-inksoft">{range.brands?.name}</td>
              <td className="px-4 py-2 text-inksoft">{range.slug}</td>
              <td className="px-4 py-2 text-right space-x-3">
                <Link
                  href={`/admin/gammes/${range.id}`}
                  className="text-jade font-medium"
                >
                  Modifier
                </Link>
                <form action={deleteRange.bind(null, range.id)} className="inline">
                  <DeleteButton
                    confirmText={`Supprimer la gamme « ${range.name} » ? Cette action est irréversible et peut affecter les téléphones qui lui sont rattachés.`}
                  />
                </form>
              </td>
            </tr>
          ))}
          {(ranges ?? []).length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-inksoft">
                Aucune gamme pour le moment.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="bg-surface border border-line rounded p-6 max-w-md">
        <h2 className="font-semibold mb-4">Ajouter une gamme</h2>
        <form action={createRange} className="space-y-3">
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
            <label className="text-sm font-medium block mb-1">
              Nom de la gamme
            </label>
            <input
              name="name"
              required
              placeholder="Galaxy S"
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
              placeholder="galaxy-s"
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
