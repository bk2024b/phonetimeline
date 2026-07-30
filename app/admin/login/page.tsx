import { login } from "../actions";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center bg-dark px-6">
      <form
        action={login}
        className="w-full max-w-sm bg-surface rounded p-8 space-y-5"
      >
        <div>
          <h1 className="font-bold text-xl mb-1">PhoneTimeline — Admin</h1>
          <p className="text-sm text-inksoft">
            Connecte-toi pour gérer les marques et les téléphones.
          </p>
        </div>

        {error && (
          <p className="text-sm bg-red-50 text-red-700 rounded px-3 py-2">
            {error}
          </p>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium block" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full border border-line rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium block" htmlFor="password">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full border border-line rounded px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-jade text-white rounded py-2 text-sm font-semibold"
        >
          Se connecter
        </button>
      </form>
    </main>
  );
}
