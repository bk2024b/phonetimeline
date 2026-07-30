import { createClient } from "@/lib/supabase/server";
import { createPhone } from "../../../actions";
import PhoneForm from "@/components/admin/PhoneForm";
import type { Brand } from "@/lib/types";

export default async function NewPhonePage() {
  const supabase = await createClient();
  const { data: brands } = (await supabase
    .from("brands")
    .select("*")
    .order("name")) as { data: Brand[] | null };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Ajouter un téléphone</h1>
      <PhoneForm brands={brands ?? []} action={createPhone} />
    </main>
  );
}
