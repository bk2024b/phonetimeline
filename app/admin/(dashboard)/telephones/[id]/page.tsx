import { createClient } from "@/lib/supabase/server";
import { updatePhone } from "../../../actions";
import PhoneForm from "@/components/admin/PhoneForm";
import type { Brand, Phone } from "@/lib/types";
import { notFound } from "next/navigation";

export default async function EditPhonePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: brands }, { data: phone }] = await Promise.all([
    supabase.from("brands").select("*").order("name") as unknown as Promise<{
      data: Brand[] | null;
    }>,
    supabase.from("phones").select("*").eq("id", id).single() as unknown as Promise<{
      data: Phone | null;
    }>
  ]);

  if (!phone) notFound();

  const updatePhoneWithId = updatePhone.bind(null, id);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Modifier {phone.name}</h1>
      <PhoneForm brands={brands ?? []} phone={phone} action={updatePhoneWithId} />
    </main>
  );
}
