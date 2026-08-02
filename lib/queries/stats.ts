import { createClient } from "@/lib/supabase/server";
import type { PhoneWithBrand } from "@/lib/types";

export type SiteStats = {
  totalPhones: number;
  totalBrands: number;
  minYear: number | null;
  maxYear: number | null;
};

export async function getSiteStats(): Promise<SiteStats> {
  const supabase = await createClient();

  const [{ count: totalPhones }, { count: totalBrands }, { data: years }] =
    await Promise.all([
      supabase
        .from("phones")
        .select("*", { count: "exact", head: true })
        .not("brand_id", "is", null),
      supabase.from("brands").select("*", { count: "exact", head: true }),
      supabase.from("phones").select("release_year").not("brand_id", "is", null)
    ]);

  const yearValues = (years ?? []).map((y) => y.release_year);

  return {
    totalPhones: totalPhones ?? 0,
    totalBrands: totalBrands ?? 0,
    minYear: yearValues.length ? Math.min(...yearValues) : null,
    maxYear: yearValues.length ? Math.max(...yearValues) : null
  };
}

export async function getLatestPhones(limit = 6): Promise<PhoneWithBrand[]> {
  const supabase = await createClient();
  const { data } = (await supabase
    .from("phones")
    .select("*, brands(id, name, slug), phone_images(id, phone_id, url, alt, sort_order)")
    // Exclut les brouillons créés dans l'admin mais jamais complétés
    // (sans marque assignée, ils n'ont rien à faire dans les pages publiques).
    .not("brand_id", "is", null)
    .order("created_at", { ascending: false })
    .limit(limit)) as { data: PhoneWithBrand[] | null };
  return data ?? [];
}

export type YearCount = { year: number; count: number };

export async function getPhoneCountsByYear(): Promise<YearCount[]> {
  const supabase = await createClient();
  const { data } = (await supabase
    .from("phones")
    .select("release_year")
    .not("brand_id", "is", null)) as {
    data: { release_year: number }[] | null;
  };

  const counts = new Map<number, number>();
  for (const row of data ?? []) {
    counts.set(row.release_year, (counts.get(row.release_year) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year - b.year);
}
