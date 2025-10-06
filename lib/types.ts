// lib/types.ts
export interface Product {
  id?: string;
  _id?: string;
  name: string;
  slug: string;
  category?: string;
  description?: string;
  price: number;         // cents
  image?: string;        // legacy cover
  images?: string[];     // preferred
}
