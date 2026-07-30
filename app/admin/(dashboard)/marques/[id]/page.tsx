import { createClient } from "@/lib/supabase/server";
import { updateBrand } from "../../../actions";
import type { Brand } from "@/lib/types";
import { notFound } from "next/navigation";

export default async function EditBrandPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: brand } = (await supabase
    .from("brands")
    .select("*")
    .eq("id", id)
    .single()) as { data: Brand | null };

  if (!brand) notFound();

  const updateBrandWithId = updateBrand.bind(null, id);

  return (
    <main className="p-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Modifier {brand.name}</h1>
      <form action={updateBrandWithId} className="space-y-3 bg-surface border border-line rounded p-6">
        <div>
          <label className="text-sm font-medium block mb-1">Nom</label>
          <input
            name="name"
            required
            defaultValue={brand.name}
            className="w-full border border-line rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Slug</label>
          <input
            name="slug"
            required
            defaultValue={brand.slug}
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
            defaultValue={brand.founded_year ?? ""}
            className="w-full border border-line rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">URL du logo</label>
          <input
            name="logo_url"
            defaultValue={brand.logo_url ?? ""}
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
