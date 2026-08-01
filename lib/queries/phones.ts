import { createClient } from "@/lib/supabase/server";
import type { Brand, PhoneWithBrand, Range } from "@/lib/types";

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const supabase = await createClient();
  const { data } = (await supabase
    .from("brands")
    .select("*")
    .eq("slug", slug)
    .single()) as { data: Brand | null };
  return data;
}

export async function getRangesByBrandId(brandId: string): Promise<Range[]> {
  const supabase = await createClient();
  const { data } = (await supabase
    .from("ranges")
    .select("*")
    .eq("brand_id", brandId)
    .order("name")) as { data: Range[] | null };
  return data ?? [];
}

export async function getPhonesByBrandId(brandId: string): Promise<PhoneWithBrand[]> {
  const supabase = await createClient();
  const { data } = (await supabase
    .from("phones")
    .select("*, brands(id, name, slug), ranges(id, name, slug)")
    .eq("brand_id", brandId)
    .order("release_year", { ascending: true })) as { data: PhoneWithBrand[] | null };
  return data ?? [];
}

export async function getPhoneBySlug(slug: string): Promise<PhoneWithBrand | null> {
  const supabase = await createClient();
  const { data } = (await supabase
    .from("phones")
    .select(
      "*, brands(id, name, slug), ranges(id, name, slug), phone_images(id, phone_id, url, alt, sort_order), predecessor:predecessor_id(id, name, slug, release_year)"
    )
    .eq("slug", slug)
    .single()) as { data: PhoneWithBrand | null };

  if (!data) return null;

  const { data: successor } = (await supabase
    .from("phones")
    .select("id, name, slug, release_year")
    .eq("predecessor_id", data.id)
    .maybeSingle()) as { data: PhoneWithBrand["successor"] };

  return { ...data, successor: successor ?? null };
}
