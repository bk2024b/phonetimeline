import { createClient } from "@/lib/supabase/server";

export type SitemapEntry = { path: string; updatedAt: string | null };

// Toutes les URLs publiques generees dynamiquement (marques, gammes, lignes,
// fiches telephone), avec leur date de derniere mise a jour pour le sitemap.
export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const supabase = await createClient();

  const [{ data: brands }, { data: ranges }, { data: modelLines }, { data: phones }] =
    await Promise.all([
      supabase.from("brands").select("slug, created_at") as unknown as Promise<{
        data: { slug: string; created_at: string }[] | null;
      }>,
      supabase
        .from("ranges")
        .select("slug, created_at, brands(slug)") as unknown as Promise<{
        data: { slug: string; created_at: string; brands: { slug: string } | null }[] | null;
      }>,
      supabase
        .from("model_lines")
        .select("slug, created_at, brands(slug)") as unknown as Promise<{
        data: { slug: string; created_at: string; brands: { slug: string } | null }[] | null;
      }>,
      // Exclut les brouillons sans marque assignee (memes regles que la homepage).
      supabase
        .from("phones")
        .select("slug, created_at")
        .not("brand_id", "is", null) as unknown as Promise<{
        data: { slug: string; created_at: string }[] | null;
      }>
    ]);

  const entries: SitemapEntry[] = [];

  for (const b of brands ?? []) {
    entries.push({ path: `/marques/${b.slug}`, updatedAt: b.created_at });
  }
  for (const r of ranges ?? []) {
    if (!r.brands) continue;
    entries.push({
      path: `/marques/${r.brands.slug}/${r.slug}`,
      updatedAt: r.created_at
    });
  }
  for (const l of modelLines ?? []) {
    if (!l.brands) continue;
    entries.push({
      path: `/marques/${l.brands.slug}/ligne/${l.slug}`,
      updatedAt: l.created_at
    });
  }
  for (const p of phones ?? []) {
    entries.push({ path: `/smartphones/${p.slug}`, updatedAt: p.created_at });
  }

  return entries;
}
