import { createClient } from "@/lib/supabase/server";
import { updatePhone } from "../../../actions";
import PhoneForm from "@/components/admin/PhoneForm";
import PhoneImages from "@/components/admin/PhoneImages";
import type { Brand, Phone, PhoneImage, Range } from "@/lib/types";
import { notFound } from "next/navigation";

export default async function EditPhonePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: brands }, { data: ranges }, { data: phone }, { data: images }] =
    await Promise.all([
      supabase.from("brands").select("*").order("name") as unknown as Promise<{
        data: Brand[] | null;
      }>,
      supabase.from("ranges").select("*").order("name") as unknown as Promise<{
        data: Range[] | null;
      }>,
      supabase.from("phones").select("*").eq("id", id).single() as unknown as Promise<{
        data: Phone | null;
      }>,
      supabase
        .from("phone_images")
        .select("*")
        .eq("phone_id", id)
        .order("sort_order") as unknown as Promise<{ data: PhoneImage[] | null }>
    ]);

  if (!phone) notFound();

  const updatePhoneWithId = updatePhone.bind(null, id);

  return (
    <main className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Modifier {phone.name}</h1>
      <PhoneForm
        brands={brands ?? []}
        ranges={ranges ?? []}
        phone={phone}
        action={updatePhoneWithId}
      />
      <PhoneImages phoneId={phone.id} images={images ?? []} />
    </main>
  );
}
