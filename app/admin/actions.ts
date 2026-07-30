"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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

// ---------- PHONES ----------

function numOrNull(formData: FormData, key: string) {
  const v = formData.get(key);
  return v && String(v).trim() !== "" ? Number(v) : null;
}

function phonePayload(formData: FormData) {
  return {
    brand_id: String(formData.get("brand_id")),
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
    price_launch: numOrNull(formData, "price_launch")
  };
}

export async function createPhone(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("phones").insert(phonePayload(formData));
  if (error) throw new Error(error.message);
  revalidatePath("/admin/telephones");
  redirect("/admin/telephones");
}

export async function updatePhone(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("phones")
    .update(phonePayload(formData))
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/telephones");
  redirect("/admin/telephones");
}

export async function deletePhone(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("phones").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/telephones");
}
