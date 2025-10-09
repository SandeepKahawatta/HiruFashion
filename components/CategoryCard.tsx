import Image from 'next/image'
import Link from 'next/link'

// Simple sample images per category (fallback provided)
const CATEGORY_IMAGES: Record<string, string> = {
  dresses: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f',
  shirts:  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f',
  pants:   'https://images.unsplash.com/photo-1519741497674-611481863552',
  frock:   'https://images.unsplash.com/photo-1541099649105-f69ad21f3246',
  slippers:'https://images.unsplash.com/photo-1519741497674-611481863552',
  bags:     'https://images.unsplash.com/photo-1514996937319-344454492b37',
};
const DEFAULT_CAT_IMG =
  'https://images.unsplash.com/photo-1519741497674-611481863552';

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/\s+/g, '-')
}

export default function CategoryCard({ name }: { name: string }) {
  const key = name.toLowerCase().trim()
  const img = CATEGORY_IMAGES[key] || DEFAULT_CAT_IMG
  const href = `/category/${slugify(name)}`

  return (
    <Link
      href={href}
      className="block rounded-xl overflow-hidden border hover:shadow-sm transition"
    >
      <div className="relative w-full aspect-[4/3]">
        <Image
          src={img}
          alt={`${name} category`}
          fill
          className="object-cover"
          sizes="(min-width:768px) 20vw, 50vw"
        />
      </div>
      <div className="p-3 text-sm font-medium text-center">{name}</div>
    </Link>
  )
}
