import { Metadata } from 'next';
import ShopPageClient from '@/components/shop/ShopPageClient';

export const metadata: Metadata = {
  title: 'Shop - HiruFashion',
  description: 'Browse our latest collection of fashion items.',
};

async function getProducts(searchParams: { [key: string]: string | string[] | undefined }) {
  const params = new URLSearchParams();
  
  if (searchParams.q) params.set('q', searchParams.q as string);
  if (searchParams.category) params.set('category', searchParams.category as string);
  if (searchParams.minPrice) params.set('minPrice', searchParams.minPrice as string);
  if (searchParams.maxPrice) params.set('maxPrice', searchParams.maxPrice as string);
  if (searchParams.sort) params.set('sort', searchParams.sort as string);
  
  // Use absolute URL for server-side fetch
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/products?${params.toString()}`, { 
    cache: 'no-store' 
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  
  return res.json();
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const products = await getProducts(searchParams);

  return <ShopPageClient products={products} />;
}
