import { createClient } from "@/lib/supabase/server";
import type { PhoneChange, PhoneWithBrand, Range } from "@/lib/types";

export async function getRangeBySlug(
  brandId: string,
  rangeSlug: string
): Promise<Range | null> {
  const supabase = await createClient();
  const { data } = (await supabase
    .from("ranges")
    .select("*")
    .eq("brand_id", brandId)
    .eq("slug", rangeSlug)
    .single()) as { data: Range | null };
  return data;
}

export type PhoneWithChanges = PhoneWithBrand & { phone_changes: PhoneChange[] };

// Tous les modèles d'une gamme, triés par année, avec leurs changements
// déjà saisis par rapport à leur prédécesseur (étape 10) — c'est ce qui
// permet d'afficher l'évolution complète sans ressaisir quoi que ce soit.
export async function getPhonesByRangeId(rangeId: string): Promise<PhoneWithChanges[]> {
  const supabase = await createClient();
  const { data } = (await supabase
    .from("phones")
    .select(
      "*, brands(id, name, slug), ranges(id, name, slug), phone_changes(id, phone_id, type, description, sort_order)"
    )
    .eq("range_id", rangeId)
    .order("release_year", { ascending: true })) as { data: PhoneWithChanges[] | null };
  return data ?? [];
}
