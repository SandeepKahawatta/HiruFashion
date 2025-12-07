import Image from 'next/image'
import Link from 'next/link'

// Simple sample images per category (fallback provided)
const CATEGORY_IMAGES: Record<string, string> = {
  dresses: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f',
  shirts: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10',
  pants: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246',
  frock: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c',
  slippers: 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33',
  bags: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
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
      className="group relative block rounded-2xl overflow-hidden aspect-[3/4] md:aspect-[2/3]"
    >
      <Image
        src={img}
        alt={`${name} category`}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        sizes="(min-width:768px) 25vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
      <div className="absolute bottom-0 left-0 p-6 w-full">
        <h3 className="text-white text-xl font-bold capitalize tracking-wide group-hover:translate-x-2 transition-transform duration-300">
          {name}
        </h3>
        <p className="text-gray-300 text-sm mt-1 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          Shop Now &rarr;
        </p>
      </div>
    </Link>
  )
}
