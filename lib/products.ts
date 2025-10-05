import { products } from '@/data/products'

export type Product = typeof products[number]

export async function getAllProducts(): Promise<Product[]> {
  // In a real app, fetch from DB or API.
  return products as unknown as Product[]
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return (products as unknown as Product[]).find(p => p.slug === slug)
}