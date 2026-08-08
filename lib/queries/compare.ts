import { createClient } from "@/lib/supabase/server";

export type ComparablePhone = {
  id: string;
  slug: string;
  name: string;
  brand_name: string;
  release_year: number;
  release_date: string | null;
  cover_url: string | null;
  screen_size: number | null;
  screen_type: string | null;
  refresh_rate: number | null;
  processor: string | null;
  ram_gb: number | null;
  storage_gb: number | null;
  battery_mah: number | null;
  main_camera_mp: number | null;
  weight_g: number | null;
  price_launch: number | null;
};

export async function getAllPhonesForCompare(): Promise<ComparablePhone[]> {
  const supabase = await createClient();
  const { data } = (await supabase
    .from("phones")
    .select(
      "id, slug, name, release_year, release_date, screen_size, screen_type, refresh_rate, processor, ram_gb, storage_gb, battery_mah, main_camera_mp, weight_g, price_launch, brands(name), phone_images(url, sort_order)"
    )
    .not("brand_id", "is", null)
    .order("name")) as {
    data:
      | (Omit<ComparablePhone, "brand_name" | "cover_url"> & {
          brands: { name: string } | null;
          phone_images: { url: string; sort_order: number }[];
        })[]
      | null;
  };

  return (data ?? []).map((p) => ({
    ...p,
    brand_name: p.brands?.name ?? "",
    cover_url: p.phone_images?.[0]?.url ?? null
  }));
}
