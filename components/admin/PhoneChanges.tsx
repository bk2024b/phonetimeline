import type { PhoneChange } from "@/lib/types";
import { createPhoneChange, deletePhoneChange } from "@/app/admin/actions";
import DeleteButton from "@/components/admin/DeleteButton";

const LABELS: Record<PhoneChange["type"], { label: string; icon: string; color: string }> = {
  added: { label: "Ajouté", icon: "✓", color: "text-jade" },
  removed: { label: "Supprimé", icon: "✗", color: "text-red-600" },
  unchanged: { label: "Inchangé", icon: "=", color: "text-inksoft" }
};

export default function PhoneChanges({
  phoneId,
  changes
}: {
  phoneId: string;
  changes: PhoneChange[];
}) {
  const createWithId = createPhoneChange.bind(null, phoneId);

  return (
    <section className="bg-surface border border-line rounded p-6 space-y-4 max-w-2xl">
      <h2 className="font-semibold text-sm uppercase tracking-wide text-inksoft">
        Ce qui change par rapport au prédécesseur
      </h2>

      {changes.length > 0 && (
        <ul className="space-y-2">
          {changes.map((change) => {
            const meta = LABELS[change.type];
            return (
              <li
                key={change.id}
                className="flex items-center justify-between text-sm border border-line rounded px-3 py-2"
              >
                <span>
                  <span className={`font-mono font-bold mr-2 ${meta.color}`}>
                    {meta.icon}
                  </span>
                  {change.description}
                </span>
                <form action={deletePhoneChange.bind(null, change.id, phoneId)}>
                  <DeleteButton
                    confirmText="Supprimer ce changement ?"
                    className="text-xs text-red-600 font-medium"
                  />
                </form>
              </li>
            );
          })}
        </ul>
      )}

      <form action={createWithId} className="flex items-end gap-3">
        <div>
          <label className="text-sm font-medium block mb-1">Type</label>
          <select
            name="type"
            required
            className="border border-line rounded px-3 py-2 text-sm bg-white"
          >
            <option value="added">✓ Ajouté</option>
            <option value="removed">✗ Supprimé</option>
            <option value="unchanged">= Inchangé</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium block mb-1">Description</label>
          <input
            name="description"
            required
            placeholder="Châssis en titane"
            className="w-full border border-line rounded px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="bg-jade text-white text-sm font-medium px-4 py-2 rounded"
        >
          Ajouter
        </button>
      </form>
    </section>
  );
}
