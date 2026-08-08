import { createClient } from "@/lib/supabase/server";
import { createPhone } from "../../../actions";
import PhoneForm from "@/components/admin/PhoneForm";
import type { Brand, ModelLine, PhoneRef, Range } from "@/lib/types";

export default async function NewPhonePage() {
  const supabase = await createClient();

  const [{ data: brands }, { data: ranges }, { data: modelLines }, { data: allPhones }] =
    await Promise.all([
      supabase.from("brands").select("*").order("name") as unknown as Promise<{
        data: Brand[] | null;
      }>,
      supabase.from("ranges").select("*").order("name") as unknown as Promise<{
        data: Range[] | null;
      }>,
      supabase.from("model_lines").select("*").order("name") as unknown as Promise<{
        data: ModelLine[] | null;
      }>,
      supabase
        .from("phones")
        .select("id, name, slug, release_year, brand_id")
        .order("release_year") as unknown as Promise<{ data: PhoneRef[] | null }>
    ]);

  return (
    <main className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Nouveau téléphone</h1>
      <p className="text-sm text-inksoft max-w-2xl -mt-4">
        Rien n&apos;est enregistré tant que tu n&apos;as pas cliqué sur
        &laquo;&nbsp;Créer le téléphone&nbsp;&raquo;. Tu pourras ajouter des
        photos et des changements juste après.
      </p>
      <PhoneForm
        brands={brands ?? []}
        ranges={ranges ?? []}
        modelLines={modelLines ?? []}
        allPhones={allPhones ?? []}
        action={createPhone}
      />
    </main>
  );
}
