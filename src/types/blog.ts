export type PostStatus = "draft" | "published" | "archived";

export interface PostFormValues {
  title: string;
  slug: string;
  is_manual_slug: boolean;
  excerpt?: string;
  content: string;
  featured_image?: string;
  publishing: {
    status: PostStatus;
    published_at?: string | null;
    author_id: string;
  };
  seo: {
    meta_title?: string;
    meta_description?: string;
    canonical_url?: string;
  };
}