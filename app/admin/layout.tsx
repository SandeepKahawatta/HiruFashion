import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container py-8">
      <nav className="flex gap-4 mb-6 text-sm">
        <Link href="/admin/products">Products</Link>
        <Link href="/admin/users">Users</Link>
        <Link href="/admin/orders">Orders</Link>
      </nav>
      {children}
    </div>
  );
}
