import type { Brand, Phone, Range } from "@/lib/types";

export default function PhoneForm({
  brands,
  ranges,
  phone,
  action
}: {
  brands: Brand[];
  ranges: Range[];
  phone?: Phone;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="space-y-8 max-w-2xl">
      <section className="bg-surface border border-line rounded p-6 space-y-3">
        <h2 className="font-semibold text-sm uppercase tracking-wide text-inksoft">
          Général
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium block mb-1">Marque</label>
            <select
              name="brand_id"
              required
              defaultValue={phone?.brand_id}
              className="w-full border border-line rounded px-3 py-2 text-sm bg-white"
            >
              <option value="" disabled>
                Choisir...
              </option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">
              Gamme (optionnel)
            </label>
            <select
              name="range_id"
              defaultValue={phone?.range_id ?? ""}
              className="w-full border border-line rounded px-3 py-2 text-sm bg-white"
            >
              <option value="">Aucune</option>
              {ranges.map((r) => {
                const brandName = brands.find((b) => b.id === r.brand_id)?.name;
                return (
                  <option key={r.id} value={r.id}>
                    {brandName ? `${brandName} — ${r.name}` : r.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Nom du modèle</label>
            <input
              name="name"
              required
              defaultValue={phone?.name}
              placeholder="iPhone 15 Pro"
              className="w-full border border-line rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">
              Slug (URL)
            </label>
            <input
              name="slug"
              required
              defaultValue={phone?.slug}
              placeholder="iphone-15-pro"
              className="w-full border border-line rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">
              Année de sortie
            </label>
            <input
              name="release_year"
              type="number"
              required
              defaultValue={phone?.release_year}
              placeholder="2023"
              className="w-full border border-line rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">
              Date de sortie exacte
            </label>
            <input
              name="release_date"
              type="date"
              defaultValue={phone?.release_date ?? ""}
              className="w-full border border-line rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">
              Prix au lancement
            </label>
            <input
              name="price_launch"
              type="number"
              step="0.01"
              defaultValue={phone?.price_launch ?? ""}
              className="w-full border border-line rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            id="is_milestone"
            name="is_milestone"
            type="checkbox"
            defaultChecked={phone?.is_milestone}
          />
          <label htmlFor="is_milestone" className="text-sm">
            Modèle marquant (affiché avec ★ sur la frise)
          </label>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">
            Note du tournant (ex: &quot;Passage à l&apos;USB-C&quot;)
          </label>
          <input
            name="milestone_note"
            defaultValue={phone?.milestone_note ?? ""}
            className="w-full border border-line rounded px-3 py-2 text-sm"
          />
        </div>
      </section>

      <section className="bg-surface border border-line rounded p-6 space-y-3">
        <h2 className="font-semibold text-sm uppercase tracking-wide text-inksoft">
          Caractéristiques
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium block mb-1">
              Taille d&apos;écran (pouces)
            </label>
            <input
              name="screen_size"
              type="number"
              step="0.1"
              defaultValue={phone?.screen_size ?? ""}
              className="w-full border border-line rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">
              Type de dalle
            </label>
            <input
              name="screen_type"
              placeholder="AMOLED, LCD, OLED..."
              defaultValue={phone?.screen_type ?? ""}
              className="w-full border border-line rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">
              Taux de rafraîchissement (Hz)
            </label>
            <input
              name="refresh_rate"
              type="number"
              defaultValue={phone?.refresh_rate ?? ""}
              className="w-full border border-line rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">
              Processeur
            </label>
            <input
              name="processor"
              defaultValue={phone?.processor ?? ""}
              className="w-full border border-line rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">RAM (Go)</label>
            <input
              name="ram_gb"
              type="number"
              defaultValue={phone?.ram_gb ?? ""}
              className="w-full border border-line rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">
              Stockage (Go)
            </label>
            <input
              name="storage_gb"
              type="number"
              defaultValue={phone?.storage_gb ?? ""}
              className="w-full border border-line rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">
              Batterie (mAh)
            </label>
            <input
              name="battery_mah"
              type="number"
              defaultValue={phone?.battery_mah ?? ""}
              className="w-full border border-line rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">
              Caméra principale (MP)
            </label>
            <input
              name="main_camera_mp"
              type="number"
              defaultValue={phone?.main_camera_mp ?? ""}
              className="w-full border border-line rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Poids (g)</label>
            <input
              name="weight_g"
              type="number"
              defaultValue={phone?.weight_g ?? ""}
              className="w-full border border-line rounded px-3 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      <button
        type="submit"
        className="bg-jade text-white text-sm font-medium px-5 py-2.5 rounded"
      >
        {phone ? "Enregistrer les modifications" : "Créer le téléphone"}
      </button>
    </form>
  );
}
