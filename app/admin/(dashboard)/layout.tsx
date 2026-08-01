import Link from "next/link";
import { logout } from "./actions";

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-bg">
      <aside className="w-56 bg-dark text-white flex flex-col shrink-0">
        <div className="px-5 py-5 font-bold border-b border-white/10">
          PhoneTimeline
          <div className="text-xs font-normal text-white/50">Administration</div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
          <Link
            href="/admin"
            className="block px-3 py-2 rounded hover:bg-white/10"
          >
            Tableau de bord
          </Link>
          <Link
            href="/admin/marques"
            className="block px-3 py-2 rounded hover:bg-white/10"
          >
            Marques
          </Link>
          <Link
            href="/admin/gammes"
            className="block px-3 py-2 rounded hover:bg-white/10"
          >
            Gammes
          </Link>
          <Link
            href="/admin/telephones"
            className="block px-3 py-2 rounded hover:bg-white/10"
          >
            Téléphones
          </Link>
        </nav>
        <form action={logout} className="p-3 border-t border-white/10">
          <button
            type="submit"
            className="w-full text-left px-3 py-2 rounded text-sm text-white/60 hover:bg-white/10 hover:text-white"
          >
            Se déconnecter
          </button>
        </form>
      </aside>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
