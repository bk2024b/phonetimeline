import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function NewPhonePage() {
  const supabase = await createClient();

  const draftSlug = `brouillon-${crypto.randomUUID().slice(0, 8)}`;

  const { data, error } = await supabase
    .from("phones")
    .insert({
      slug: draftSlug,
      name: "Nouveau téléphone",
      release_year: new Date().getFullYear()
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Impossible de créer le brouillon de téléphone");
  }

  redirect(`/admin/telephones/${data.id}`);
}
