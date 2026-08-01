export type Brand = {
  id: string;
  slug: string;
  name: string;
  founded_year: number | null;
  logo_url: string | null;
  created_at: string;
};

export type Range = {
  id: string;
  brand_id: string;
  slug: string;
  name: string;
  created_at: string;
};

export type Phone = {
  id: string;
  brand_id: string;
  range_id: string | null;
  predecessor_id: string | null;
  slug: string;
  name: string;
  release_year: number;
  release_date: string | null;
  is_milestone: boolean;
  milestone_note: string | null;
  screen_size: number | null;
  screen_type: string | null;
  refresh_rate: number | null;
  processor: string | null;
  ram_gb: number | null;
  storage_gb: number | null;
  battery_mah: number | null;
  main_camera_mp: number | null;
  weight_g: number | null;
  price_launch: number | null;
  extra_specs: Record<string, string>;
  created_at: string;
};

export type PhoneChangeType = "added" | "removed" | "unchanged";

export type PhoneChange = {
  id: string;
  phone_id: string;
  type: PhoneChangeType;
  description: string;
  sort_order: number;
};

export type PhoneImage = {
  id: string;
  phone_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
};

export type PhoneRef = Pick<Phone, "id" | "name" | "slug" | "release_year">;

export type PhoneWithBrand = Phone & {
  brands: Pick<Brand, "id" | "name" | "slug">;
  ranges?: Pick<Range, "id" | "name" | "slug"> | null;
  phone_images?: PhoneImage[];
  predecessor?: PhoneRef | null;
  successor?: PhoneRef | null;
  phone_changes?: PhoneChange[];
};
