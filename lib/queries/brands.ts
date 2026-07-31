import { createClient } from "@/lib/supabase/server";
import type { Brand } from "@/lib/types";

export type BrandWithStats = Brand & {
  phone_count: number;
  min_year: number | null;
  max_year: number | null;
};

// Une marque + le nombre de téléphones + la plage d'années couverte,
// pour l'affichage de la grille de marques sur la page d'accueil.
export async function getBrandsWithStats(): Promise<BrandWithStats[]> {
  const supabase = await createClient();

  const { data: brands } = (await supabase
    .from("brands")
    .select("*")
    .order("name")) as { data: Brand[] | null };

  if (!brands || brands.length === 0) return [];

  const { data: phones } = (await supabase
    .from("phones")
    .select("brand_id, release_year")) as {
    data: { brand_id: string; release_year: number }[] | null;
  };

  return brands.map((brand) => {
    const brandPhones = (phones ?? []).filter((p) => p.brand_id === brand.id);
    const years = brandPhones.map((p) => p.release_year);
    return {
      ...brand,
      phone_count: brandPhones.length,
      min_year: years.length ? Math.min(...years) : brand.founded_year,
      max_year: years.length ? Math.max(...years) : null
    };
  });
}
