"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { parseCSV } from "@/lib/csv";

// ---------- AUTH ----------

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent("Identifiants incorrects")}`);
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------- BRANDS ----------

export async function createBrand(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("brands").insert({
    slug: String(formData.get("slug")),
    name: String(formData.get("name")),
    founded_year: formData.get("founded_year")
      ? Number(formData.get("founded_year"))
      : null,
    logo_url: String(formData.get("logo_url") || "") || null
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/marques");
  redirect("/admin/marques");
}

export async function updateBrand(id: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("brands")
    .update({
      slug: String(formData.get("slug")),
      name: String(formData.get("name")),
      founded_year: formData.get("founded_year")
        ? Number(formData.get("founded_year"))
        : null,
      logo_url: String(formData.get("logo_url") || "") || null
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/marques");
  redirect("/admin/marques");
}

export async function deleteBrand(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("brands").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/marques");
}

// ---------- BRAND LOGO ----------

export async function uploadBrandLogo(brandId: string, formData: FormData) {
  const supabase = await createClient();

  const file = formData.get("logo") as File | null;
  if (!file || file.size === 0) return;

  const ext = file.name.split(".").pop() || "png";
  // Chemin fixe (pas d'uuid) + upsert: un nouvel upload remplace l'ancien
  // logo au lieu d'accumuler des fichiers orphelins dans le bucket.
  const path = `${brandId}/logo.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("brand-logos")
    .upload(path, file, { upsert: true });

  if (uploadError) throw new Error(uploadError.message);

  const {
    data: { publicUrl }
  } = supabase.storage.from("brand-logos").getPublicUrl(path);

  // Un parametre anti-cache pour que le navigateur recharge bien la nouvelle
  // image apres un remplacement (meme chemin de fichier -> meme URL sinon).
  const cacheBustedUrl = `${publicUrl}?v=${Date.now()}`;

  const { error: updateError } = await supabase
    .from("brands")
    .update({ logo_url: cacheBustedUrl })
    .eq("id", brandId);

  if (updateError) throw new Error(updateError.message);

  revalidatePath("/admin/marques");
  revalidatePath(`/admin/marques/${brandId}`);
}

export async function removeBrandLogo(brandId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("brands")
    .update({ logo_url: null })
    .eq("id", brandId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/marques");
  revalidatePath(`/admin/marques/${brandId}`);
}

// ---------- RANGES ----------

export async function createRange(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("ranges").insert({
    brand_id: String(formData.get("brand_id")),
    slug: String(formData.get("slug")),
    name: String(formData.get("name"))
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/gammes");
  redirect("/admin/gammes");
}

export async function updateRange(id: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("ranges")
    .update({
      brand_id: String(formData.get("brand_id")),
      slug: String(formData.get("slug")),
      name: String(formData.get("name"))
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/gammes");
  redirect("/admin/gammes");
}

export async function deleteRange(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("ranges").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/gammes");
}

// ---------- MODEL LINES (paliers de produit a travers les annees) ----------

export async function createModelLine(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("model_lines").insert({
    brand_id: String(formData.get("brand_id")),
    slug: String(formData.get("slug")),
    name: String(formData.get("name"))
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/lignes");
  redirect("/admin/lignes");
}

export async function updateModelLine(id: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("model_lines")
    .update({
      brand_id: String(formData.get("brand_id")),
      slug: String(formData.get("slug")),
      name: String(formData.get("name"))
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/lignes");
  redirect("/admin/lignes");
}

export async function deleteModelLine(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("model_lines").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/lignes");
}

// ---------- IMPORT EN MASSE (CSV) ----------

export type ImportResult = {
  total: number;
  created: number;
  updated: number;
  errors: { line: number; message: string }[];
  warnings: { line: number; message: string }[];
};

function toNumberOrNull(v: string | undefined) {
  if (!v || v.trim() === "") return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

export async function importPhonesFromCSV(formData: FormData): Promise<ImportResult> {
  const file = formData.get("csv") as File | null;
  const result: ImportResult = { total: 0, created: 0, updated: 0, errors: [], warnings: [] };
  if (!file || file.size === 0) {
    result.errors.push({ line: 0, message: "Aucun fichier fourni." });
    return result;
  }

  const text = await file.text();
  const rows = parseCSV(text);
  result.total = rows.length;

  const supabase = await createClient();

  // Cache local des marques/gammes/lignes déjà résolues ou créées pendant cet
  // import, pour éviter une requête par ligne.
  const brandCache = new Map<string, string>(); // slug -> id
  const rangeCache = new Map<string, string>(); // `${brandId}:${slug}` -> id
  const modelLineCache = new Map<string, string>(); // `${brandId}:${slug}` -> id
  // slug de téléphone -> id, alimenté au fur et à mesure : permet de résoudre
  // un predecessor_slug qui pointe vers un téléphone créé plus haut dans le
  // même fichier, sans attendre un aller-retour DB.
  const phoneSlugCache = new Map<string, string>();

  for (let i = 0; i < rows.length; i++) {
    const line = i + 2; // +1 pour l'en-tête, +1 pour l'index 0-based
    const row = rows[i];

    try {
      const brandSlug = row.brand_slug?.trim();
      const brandName = row.brand_name?.trim() || brandSlug;
      if (!brandSlug) throw new Error("brand_slug manquant");

      let brandId = brandCache.get(brandSlug);
      if (!brandId) {
        const { data: existing } = await supabase
          .from("brands")
          .select("id")
          .eq("slug", brandSlug)
          .maybeSingle();
        if (existing) {
          brandId = existing.id;
        } else {
          const { data: created, error } = await supabase
            .from("brands")
            .insert({ slug: brandSlug, name: brandName })
            .select("id")
            .single();
          if (error) throw new Error(`création marque : ${error.message}`);
          brandId = created.id;
        }
        brandCache.set(brandSlug, brandId!);
      }

      let rangeId: string | null = null;
      const rangeSlug = row.range_slug?.trim();
      if (rangeSlug) {
        const rangeName = row.range_name?.trim() || rangeSlug;
        const cacheKey = `${brandId}:${rangeSlug}`;
        rangeId = rangeCache.get(cacheKey) ?? null;
        if (!rangeId) {
          const { data: existing } = await supabase
            .from("ranges")
            .select("id")
            .eq("brand_id", brandId)
            .eq("slug", rangeSlug)
            .maybeSingle();
          if (existing) {
            rangeId = existing.id;
          } else {
            const { data: created, error } = await supabase
              .from("ranges")
              .insert({ brand_id: brandId, slug: rangeSlug, name: rangeName })
              .select("id")
              .single();
            if (error) throw new Error(`création gamme : ${error.message}`);
            rangeId = created.id;
          }
          rangeCache.set(cacheKey, rangeId!);
        }
      }

      // --- Ligne de modèle (ex: "iPhone Pro") : même logique que la gamme,
      // mais suit un palier à travers les années plutôt qu'une génération.
      let modelLineId: string | null = null;
      const modelLineSlug = row.model_line_slug?.trim();
      if (modelLineSlug) {
        const modelLineName = row.model_line_name?.trim() || modelLineSlug;
        const cacheKey = `${brandId}:${modelLineSlug}`;
        modelLineId = modelLineCache.get(cacheKey) ?? null;
        if (!modelLineId) {
          const { data: existing } = await supabase
            .from("model_lines")
            .select("id")
            .eq("brand_id", brandId)
            .eq("slug", modelLineSlug)
            .maybeSingle();
          if (existing) {
            modelLineId = existing.id;
          } else {
            const { data: created, error } = await supabase
              .from("model_lines")
              .insert({ brand_id: brandId, slug: modelLineSlug, name: modelLineName })
              .select("id")
              .single();
            if (error) throw new Error(`création ligne de modèle : ${error.message}`);
            modelLineId = created.id;
          }
          modelLineCache.set(cacheKey, modelLineId!);
        }
      }

      if (!row.slug) throw new Error("slug manquant");
      if (!row.name) throw new Error("name manquant");
      if (!row.release_year) throw new Error("release_year manquant");

      const phoneSlug = row.slug.trim();

      // --- Modèle remplacé (predecessor) : résolu par slug, d'abord dans le
      // cache de cet import (téléphone créé plus haut dans le même fichier),
      // sinon en base (import précédent). Si introuvable, on n'échoue pas la
      // ligne : le téléphone est quand même créé/mis à jour, sans predecessor,
      // et un avertissement est remonté pour que ce soit corrigé à la main.
      let predecessorId: string | null = null;
      const predecessorSlug = row.predecessor_slug?.trim();
      if (predecessorSlug) {
        if (predecessorSlug === phoneSlug) {
          result.warnings.push({
            line,
            message: `predecessor_slug identique au slug du téléphone lui-même, ignoré.`
          });
        } else {
          predecessorId = phoneSlugCache.get(predecessorSlug) ?? null;
          if (!predecessorId) {
            const { data: existingPredecessor } = await supabase
              .from("phones")
              .select("id")
              .eq("slug", predecessorSlug)
              .maybeSingle();
            predecessorId = existingPredecessor?.id ?? null;
          }
          if (!predecessorId) {
            result.warnings.push({
              line,
              message: `predecessor_slug "${predecessorSlug}" introuvable (pas encore importé ?) — laissé vide.`
            });
          }
        }
      }

      const payload = {
        brand_id: brandId,
        range_id: rangeId,
        model_line_id: modelLineId,
        predecessor_id: predecessorId,
        slug: phoneSlug,
        name: row.name.trim(),
        release_year: Number(row.release_year),
        release_date: row.release_date?.trim() || null,
        is_milestone: ["true", "1", "oui", "vrai"].includes(
          (row.is_milestone ?? "").trim().toLowerCase()
        ),
        milestone_note: row.milestone_note?.trim() || null,
        screen_size: toNumberOrNull(row.screen_size),
        screen_type: row.screen_type?.trim() || null,
        refresh_rate: toNumberOrNull(row.refresh_rate),
        processor: row.processor?.trim() || null,
        ram_gb: toNumberOrNull(row.ram_gb),
        storage_gb: toNumberOrNull(row.storage_gb),
        battery_mah: toNumberOrNull(row.battery_mah),
        main_camera_mp: toNumberOrNull(row.main_camera_mp),
        weight_g: toNumberOrNull(row.weight_g),
        price_launch: toNumberOrNull(row.price_launch)
      };

      const { data: existingPhone } = await supabase
        .from("phones")
        .select("id")
        .eq("slug", payload.slug)
        .maybeSingle();

      if (existingPhone) {
        const { error } = await supabase
          .from("phones")
          .update(payload)
          .eq("id", existingPhone.id);
        if (error) throw new Error(error.message);
        phoneSlugCache.set(phoneSlug, existingPhone.id);
        result.updated++;
      } else {
        const { data: createdPhone, error } = await supabase
          .from("phones")
          .insert(payload)
          .select("id")
          .single();
        if (error) throw new Error(error.message);
        phoneSlugCache.set(phoneSlug, createdPhone.id);
        result.created++;
      }
    } catch (err) {
      result.errors.push({
        line,
        message: err instanceof Error ? err.message : "Erreur inconnue"
      });
    }
  }

  revalidatePath("/admin/telephones");
  revalidatePath("/admin/marques");
  revalidatePath("/admin/gammes");
  revalidatePath("/admin/lignes");

  return result;
}

// ---------- PHONES ----------

function numOrNull(formData: FormData, key: string) {
  const v = formData.get(key);
  return v && String(v).trim() !== "" ? Number(v) : null;
}

const SCORE_CATEGORIES = ["design", "ecran", "photo", "autonomie", "performances"] as const;

function scoresPayload(formData: FormData) {
  const scores: Record<string, number> = {};
  for (const category of SCORE_CATEGORIES) {
    const raw = formData.get(`score_${category}`);
    if (raw && String(raw).trim() !== "") {
      scores[category] = Number(raw);
    }
  }
  return scores;
}

function sourcesPayload(formData: FormData) {
  const raw = String(formData.get("sources") || "");
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.length > 0 ? lines : null;
}

function phonePayload(formData: FormData) {
  const predecessorId = String(formData.get("predecessor_id") || "") || null;
  const id = String(formData.get("id") || "") || null;

  return {
    brand_id: String(formData.get("brand_id")),
    range_id: String(formData.get("range_id") || "") || null,
    model_line_id: String(formData.get("model_line_id") || "") || null,
    // Un modèle ne peut pas être son propre prédécesseur.
    predecessor_id: predecessorId && predecessorId !== id ? predecessorId : null,
    scores: scoresPayload(formData),
    slug: String(formData.get("slug")),
    name: String(formData.get("name")),
    release_year: Number(formData.get("release_year")),
    release_date: String(formData.get("release_date") || "") || null,
    is_milestone: formData.get("is_milestone") === "on",
    milestone_note: String(formData.get("milestone_note") || "") || null,
    screen_size: numOrNull(formData, "screen_size"),
    screen_type: String(formData.get("screen_type") || "") || null,
    refresh_rate: numOrNull(formData, "refresh_rate"),
    processor: String(formData.get("processor") || "") || null,
    ram_gb: numOrNull(formData, "ram_gb"),
    storage_gb: numOrNull(formData, "storage_gb"),
    battery_mah: numOrNull(formData, "battery_mah"),
    main_camera_mp: numOrNull(formData, "main_camera_mp"),
    weight_g: numOrNull(formData, "weight_g"),
    price_launch: numOrNull(formData, "price_launch"),
    data_status: String(formData.get("data_status") || "unverified"),
    sources: sourcesPayload(formData)
  };
}

export async function createPhone(formData: FormData) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("phones")
    .insert(phonePayload(formData))
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/admin/telephones");
  redirect(`/admin/telephones/${data.id}?created=1`);
}

export async function updatePhone(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("phones")
    .update(phonePayload(formData))
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/telephones");
  revalidatePath(`/admin/telephones/${id}`);
  redirect(`/admin/telephones/${id}?saved=1`);
}

export async function deletePhone(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("phones").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/telephones");
}

// ---------- PHONE IMAGES ----------

export async function uploadPhoneImage(phoneId: string, formData: FormData) {
  const supabase = await createClient();

  const file = formData.get("image") as File | null;
  if (!file || file.size === 0) return;

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${phoneId}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("phone-images")
    .upload(path, file);

  if (uploadError) throw new Error(uploadError.message);

  const {
    data: { publicUrl }
  } = supabase.storage.from("phone-images").getPublicUrl(path);

  const { error: insertError } = await supabase.from("phone_images").insert({
    phone_id: phoneId,
    url: publicUrl,
    alt: String(formData.get("alt") || "") || null
  });

  if (insertError) throw new Error(insertError.message);

  revalidatePath(`/admin/telephones/${phoneId}`);
}

export async function deletePhoneImage(
  id: string,
  url: string,
  phoneId: string
) {
  const supabase = await createClient();

  const marker = "/phone-images/";
  const idx = url.indexOf(marker);
  if (idx !== -1) {
    const path = url.slice(idx + marker.length);
    await supabase.storage.from("phone-images").remove([path]);
  }

  const { error } = await supabase.from("phone_images").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/telephones/${phoneId}`);
}

// ---------- PHONE CHANGES ----------

export async function createPhoneChange(phoneId: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("phone_changes").insert({
    phone_id: phoneId,
    type: String(formData.get("type")),
    description: String(formData.get("description"))
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/telephones/${phoneId}`);
}

export async function deletePhoneChange(id: string, phoneId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("phone_changes").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/telephones/${phoneId}`);
}
