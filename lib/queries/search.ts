import { createClient } from "@/lib/supabase/server";

export type SearchResult = {
  id: string;
  slug: string;
  name: string;
  brand_name: string;
  release_year: number;
  cover_url: string | null;
  screen_size: number | null;
  ram_gb: number | null;
  storage_gb: number | null;
};

export async function searchPhones(query: string): Promise<SearchResult[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const supabase = await createClient();
  const { data } = (await supabase
    .from("phones")
    .select(
      "id, slug, name, release_year, screen_size, ram_gb, storage_gb, brands(name), phone_images(url, sort_order)"
    )
    .not("brand_id", "is", null)) as {
    data:
      | {
          id: string;
          slug: string;
          name: string;
          release_year: number;
          screen_size: number | null;
          ram_gb: number | null;
          storage_gb: number | null;
          brands: { name: string } | null;
          phone_images: { url: string; sort_order: number }[];
        }[]
      | null;
  };

  return (data ?? [])
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      brand_name: p.brands?.name ?? "",
      release_year: p.release_year,
      cover_url: p.phone_images?.[0]?.url ?? null,
      screen_size: p.screen_size,
      ram_gb: p.ram_gb,
      storage_gb: p.storage_gb
    }))
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.brand_name.toLowerCase().includes(q)
    )
    .sort((a, b) => b.release_year - a.release_year);
}
