import Link from "next/link";
import ImportForm from "@/components/admin/ImportForm";

export default function ImportPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-2">Import en masse (CSV)</h1>
      <p className="text-sm text-inksoft mb-6 max-w-2xl">
        Un téléphone par ligne. Les marques, gammes et lignes de modèle qui
        n&apos;existent pas encore sont créées automatiquement à partir de{" "}
        <code className="font-mono text-xs bg-bg px-1 py-0.5 rounded">
          brand_slug
        </code>
        ,{" "}
        <code className="font-mono text-xs bg-bg px-1 py-0.5 rounded">
          range_slug
        </code>{" "}
        et{" "}
        <code className="font-mono text-xs bg-bg px-1 py-0.5 rounded">
          model_line_slug
        </code>
        . Si un téléphone existe déjà (même{" "}
        <code className="font-mono text-xs bg-bg px-1 py-0.5 rounded">slug</code>),
        il est mis à jour plutôt que dupliqué.
      </p>

      <div className="bg-surface border border-line rounded p-5 mb-6 max-w-2xl text-sm">
        <div className="font-semibold mb-2">Colonnes attendues</div>
        <div className="font-mono text-xs text-inksoft leading-relaxed break-all">
          brand_slug, brand_name, range_slug, range_name, model_line_slug,
          model_line_name, predecessor_slug, slug, name, release_year,
          release_date, is_milestone, milestone_note, screen_size,
          screen_type, refresh_rate, processor, ram_gb, storage_gb,
          battery_mah, main_camera_mp, weight_g, price_launch
        </div>
        <p className="text-inksoft mt-3">
          Seuls <code className="font-mono">brand_slug</code>,{" "}
          <code className="font-mono">slug</code>,{" "}
          <code className="font-mono">name</code> et{" "}
          <code className="font-mono">release_year</code> sont obligatoires —
          laisse les autres colonnes vides si tu n&apos;as pas la donnée.
        </p>
        <p className="text-inksoft mt-3">
          <code className="font-mono">model_line_slug</code> /{" "}
          <code className="font-mono">model_line_name</code> renseignent la
          ligne de modèle (ex: &laquo;&nbsp;iPhone Pro&nbsp;&raquo;, qui suit
          un palier à travers les années) — distincte de la gamme, qui
          regroupe les variantes d&apos;une même génération.{" "}
          <code className="font-mono">predecessor_slug</code> indique le{" "}
          <code className="font-mono">slug</code> du modèle remplacé : il
          doit déjà exister en base (import précédent) ou plus haut dans le
          même fichier. S&apos;il est introuvable, la ligne est quand même
          importée, avec un avertissement plutôt qu&apos;une erreur.
        </p>
        <Link
          href="/telephones-modele-import.csv"
          className="text-jade underline text-xs font-mono inline-block mt-3"
        >
          Télécharger un modèle CSV
        </Link>
      </div>

      <ImportForm />
    </main>
  );
}
