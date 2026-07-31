import { createClient } from "@/lib/supabase/server";
import type { Brand, Phone } from "@/lib/types";

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const supabase = await createClient();
  const { data } = (await supabase
    .from("brands")
    .select("*")
    .eq("slug", slug)
    .single()) as { data: Brand | null };
  return data;
}

export async function getPhonesByBrandId(brandId: string): Promise<Phone[]> {
  const supabase = await createClient();
  const { data } = (await supabase
    .from("phones")
    .select("*")
    .eq("brand_id", brandId)
    .order("release_year", { ascending: true })) as { data: Phone[] | null };
  return data ?? [];
}
