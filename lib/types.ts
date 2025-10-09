// lib/types.ts
// lib/types.ts
export type Product = {
  id?: string
  _id?: string
  name: string
  slug: string
  category: 'slippers' | 'frocks' | 'blouses' | 'skirts' | 'pants' | 'bags'
  price: number // cents
  description?: string
  image?: string      // legacy
  images: string[]

  colors?: string[]   // e.g. ['#000000', 'Red']
  sizes?: string[]    // e.g. ['XS','S','M'] or ['38','39'] for slippers
}

