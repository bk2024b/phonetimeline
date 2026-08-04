import { createClient } from "@/lib/supabase/server";
import type { ModelLine, PhoneChange, PhoneWithBrand } from "@/lib/types";

export async function getModelLinesByBrandId(brandId: string): Promise<ModelLine[]> {
  const supabase = await createClient();
  const { data } = (await supabase
    .from("model_lines")
    .select("*")
    .eq("brand_id", brandId)
    .order("name")) as { data: ModelLine[] | null };
  return data ?? [];
}

export async function getModelLineBySlug(
  brandId: string,
  lineSlug: string
): Promise<ModelLine | null> {
  const supabase = await createClient();
  const { data } = (await supabase
    .from("model_lines")
    .select("*")
    .eq("brand_id", brandId)
    .eq("slug", lineSlug)
    .single()) as { data: ModelLine | null };
  return data;
}

export type PhoneWithChanges = PhoneWithBrand & { phone_changes: PhoneChange[] };

// Tous les modeles d'une ligne (ex: "iPhone Pro"), tries par annee, avec
// leurs changements deja saisis par rapport a leur predecesseur — meme
// logique que pour les gammes, mais suit un palier a travers les annees
// plutot qu'une generation.
export async function getPhonesByModelLineId(lineId: string): Promise<PhoneWithChanges[]> {
  const supabase = await createClient();
  const { data } = (await supabase
    .from("phones")
    .select(
      "*, brands(id, name, slug), model_lines(id, name, slug), phone_changes(id, phone_id, type, description, sort_order)"
    )
    .eq("model_line_id", lineId)
    .order("release_year", { ascending: true })) as { data: PhoneWithChanges[] | null };
  return data ?? [];
}
