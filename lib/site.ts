// URL canonique du site, utilisee pour metadataBase, le sitemap, robots.txt
// et les URLs canoniques/OG de chaque page. A definir en variable d'env sur
// Vercel (NEXT_PUBLIC_SITE_URL) si le domaine change (ex: domaine personnalise).
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://phonetimeline.vercel.app";
