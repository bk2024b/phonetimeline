"use client";

import { useFormState, useFormStatus } from "react-dom";
import { importPhonesFromCSV, type ImportResult } from "@/app/admin/actions";

const initialState: ImportResult = {
  total: 0,
  created: 0,
  updated: 0,
  errors: [],
  warnings: []
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-jade text-white text-sm font-medium px-4 py-2 rounded disabled:opacity-50"
    >
      {pending ? "Import en cours..." : "Importer"}
    </button>
  );
}

export default function ImportForm() {
  const [state, formAction] = useFormState(
    async (_state: ImportResult, formData: FormData) => importPhonesFromCSV(formData),
    initialState
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <form action={formAction} className="bg-surface border border-line rounded p-6 space-y-4">
        <div>
          <label className="text-sm font-medium block mb-1">Fichier CSV</label>
          <input
            type="file"
            name="csv"
            accept=".csv,text/csv"
            required
            className="w-full border border-line rounded px-3 py-2 text-sm bg-white"
          />
        </div>
        <SubmitButton />
      </form>

      {state.total > 0 && (
        <div className="bg-surface border border-line rounded p-6">
          <h2 className="font-semibold mb-3">Résultat</h2>
          <div className="flex gap-6 text-sm mb-4">
            <div>
              <span className="font-mono font-bold text-jade">{state.created}</span> créés
            </div>
            <div>
              <span className="font-mono font-bold text-amber">{state.updated}</span> mis à
              jour
            </div>
            <div>
              <span className="font-mono font-bold text-red-600">
                {state.errors.length}
              </span>{" "}
              erreurs
            </div>
            <div className="text-inksoft">sur {state.total} lignes</div>
          </div>

          {state.errors.length > 0 && (
            <ul className="space-y-1 text-sm mb-4">
              {state.errors.map((e, i) => (
                <li key={i} className="text-red-600 font-mono text-xs">
                  Ligne {e.line} : {e.message}
                </li>
              ))}
            </ul>
          )}

          {state.warnings.length > 0 && (
            <div>
              <div className="font-semibold text-sm mb-2">
                Avertissements ({state.warnings.length})
              </div>
              <ul className="space-y-1 text-sm">
                {state.warnings.map((w, i) => (
                  <li key={i} className="text-amber font-mono text-xs">
                    Ligne {w.line} : {w.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
