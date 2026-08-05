import { createClient } from "@/lib/supabase/server";
import { updateBrand, uploadBrandLogo, removeBrandLogo } from "../../../actions";
import type { Brand } from "@/lib/types";
import { notFound } from "next/navigation";
import DeleteButton from "@/components/admin/DeleteButton";

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
  const uploadLogoWithId = uploadBrandLogo.bind(null, id);
  const removeLogoWithId = removeBrandLogo.bind(null, id);

  return (
    <main className="p-8 max-w-md space-y-8">
      <div>
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
            <label className="text-sm font-medium block mb-1">
              URL du logo (si tu en as déjà une)
            </label>
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
      </div>

      <div className="bg-surface border border-line rounded p-6">
        <h2 className="font-semibold mb-4">Logo (upload)</h2>

        {brand.logo_url && (
          <div className="flex items-center gap-4 mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={brand.logo_url}
              alt={brand.name}
              className="w-16 h-16 object-contain bg-bg rounded border border-line p-2"
            />
            <form action={removeLogoWithId}>
              <DeleteButton
                confirmText="Retirer le logo actuel ?"
                label="Retirer le logo"
                className="text-xs text-red-600 font-medium"
              />
            </form>
          </div>
        )}

        <form action={uploadLogoWithId} className="flex items-end gap-3">
          <div className="flex-1">
            <label className="text-sm font-medium block mb-1">
              {brand.logo_url ? "Remplacer par un nouveau fichier" : "Envoyer un fichier"}
            </label>
            <input
              type="file"
              name="logo"
              accept="image/*"
              required
              className="w-full border border-line rounded px-3 py-2 text-sm bg-white"
            />
          </div>
          <button
            type="submit"
            className="bg-jade text-white text-sm font-medium px-4 py-2 rounded"
          >
            Envoyer
          </button>
        </form>
      </div>
    </main>
  );
}
