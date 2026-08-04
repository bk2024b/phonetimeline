import { createClient } from "@/lib/supabase/server";

export type TimelinePhone = {
  id: string;
  name: string;
  slug: string;
  release_year: number;
  is_milestone: boolean;
  cover_url: string | null;
};

export type TimelineBrand = {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  phones: TimelinePhone[];
};

export async function getTimelineData(): Promise<TimelineBrand[]> {
  const supabase = await createClient();

  const [{ data: brands }, { data: phones }] = await Promise.all([
    supabase.from("brands").select("id, slug, name, logo_url").order("name"),
    supabase
      .from("phones")
      .select(
        "id, name, slug, release_year, is_milestone, brand_id, phone_images(url, sort_order)"
      )
      .not("brand_id", "is", null)
      .order("release_year", { ascending: true })
  ]);

  type RawPhone = {
    id: string;
    name: string;
    slug: string;
    release_year: number;
    is_milestone: boolean;
    brand_id: string;
    phone_images: { url: string; sort_order: number }[] | null;
  };

  return (brands ?? []).map((brand) => ({
    ...brand,
    phones: ((phones ?? []) as RawPhone[])
      .filter((p) => p.brand_id === brand.id)
      .map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        release_year: p.release_year,
        is_milestone: p.is_milestone,
        cover_url: p.phone_images?.[0]?.url ?? null
      }))
  }));
}
