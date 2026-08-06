import { createClient } from "@/lib/supabase/server";
import { updateRange } from "../../../actions";
import type { Brand, Range } from "@/lib/types";
import { notFound } from "next/navigation";

export default async function EditRangePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: range }, { data: brands }] = await Promise.all([
    supabase.from("ranges").select("*").eq("id", id).single() as unknown as Promise<{
      data: Range | null;
    }>,
    supabase.from("brands").select("*").order("name") as unknown as Promise<{
      data: Brand[] | null;
    }>
  ]);

  if (!range) notFound();

  const updateRangeWithId = updateRange.bind(null, id);

  return (
    <main className="p-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Modifier {range.name}</h1>
      <form
        action={updateRangeWithId}
        className="space-y-3 bg-surface border border-line rounded p-6"
      >
        <div>
          <label className="text-sm font-medium block mb-1">Marque</label>
          <select
            name="brand_id"
            required
            defaultValue={range.brand_id}
            className="w-full border border-line rounded px-3 py-2 text-sm bg-white"
          >
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
            defaultValue={range.name}
            className="w-full border border-line rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Slug</label>
          <input
            name="slug"
            required
            defaultValue={range.slug}
            className="w-full border border-line rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">
            Description courte (affichée sur la page marque)
          </label>
          <textarea
            name="description"
            rows={2}
            defaultValue={range.description ?? ""}
            className="w-full border border-line rounded px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="bg-jade text-white text-sm font-medium px-4 py-2 rounded"
        >
          Enregistrer
        </button>
      </form>
    </main>
  );
}
