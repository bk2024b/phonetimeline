import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ count: brandsCount }, { count: phonesCount }] = await Promise.all([
    supabase.from("brands").select("*", { count: "exact", head: true }),
    supabase.from("phones").select("*", { count: "exact", head: true })
  ]);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>

      <div className="grid grid-cols-2 gap-4 max-w-lg mb-8">
        <div className="bg-surface border border-line rounded p-5">
          <div className="text-3xl font-bold">{brandsCount ?? 0}</div>
          <div className="text-sm text-inksoft">Marques</div>
        </div>
        <div className="bg-surface border border-line rounded p-5">
          <div className="text-3xl font-bold">{phonesCount ?? 0}</div>
          <div className="text-sm text-inksoft">Téléphones</div>
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          href="/admin/marques"
          className="bg-jade text-white text-sm font-medium px-4 py-2 rounded"
        >
          Gérer les marques
        </Link>
        <Link
          href="/admin/telephones/nouveau"
          className="border border-line text-sm font-medium px-4 py-2 rounded"
        >
          Ajouter un téléphone
        </Link>
      </div>
    </main>
  );
}
