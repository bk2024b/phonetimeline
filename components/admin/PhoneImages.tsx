import type { PhoneImage } from "@/lib/types";
import { uploadPhoneImage, deletePhoneImage } from "@/app/admin/actions";

export default function PhoneImages({
  phoneId,
  images
}: {
  phoneId: string;
  images: PhoneImage[];
}) {
  const uploadWithId = uploadPhoneImage.bind(null, phoneId);

  return (
    <section className="bg-surface border border-line rounded p-6 space-y-4 max-w-2xl">
      <h2 className="font-semibold text-sm uppercase tracking-wide text-inksoft">
        Photos
      </h2>

      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img) => (
            <div key={img.id} className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt ?? ""}
                className="w-full h-24 object-cover rounded border border-line"
              />
              <form
                action={deletePhoneImage.bind(null, img.id, img.url, phoneId)}
                className="absolute top-1 right-1"
              >
                <button
                  type="submit"
                  className="bg-dark/80 text-white text-[10px] rounded px-1.5 py-0.5"
                >
                  Suppr.
                </button>
              </form>
            </div>
          ))}
        </div>
      )}

      <form action={uploadWithId} className="flex items-end gap-3">
        <div className="flex-1">
          <label className="text-sm font-medium block mb-1">
            Ajouter une photo
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            required
            className="w-full border border-line rounded px-3 py-2 text-sm bg-white"
          />
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium block mb-1">
            Texte alternatif
          </label>
          <input
            name="alt"
            placeholder="iPhone 15 face avant"
            className="w-full border border-line rounded px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="bg-jade text-white text-sm font-medium px-4 py-2 rounded"
        >
          Envoyer
        </button>
      </form>
    </section>
  );
}
