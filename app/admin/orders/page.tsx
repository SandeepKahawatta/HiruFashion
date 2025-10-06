'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  size?: string;
  color?: string;
  image?: string;
};

type Address = {
  name?: string; phone?: string; line1?: string; line2?: string;
  city?: string; postalCode?: string; country?: string;
};

type Order = {
  id: string;
  _id?: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  status: 'pending'|'paid'|'shipped'|'cancelled';
  note?: string;
  shippingAddress?: Address;
  billingAddress?: Address;
  createdAt: string;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<'all' | Order['status']>('all');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/orders', { credentials: 'include' });
        if (res.status === 401 || res.status === 403) {
          setError('Admin access required.');
          return;
        }
        if (!res.ok) throw new Error(await res.text());
        const data: Order[] = await res.json();
        // normalize id
        setOrders(data.map(o => ({ ...o, id: (o as any).id || (o as any)._id })));
      } catch (e: any) {
        setError(e?.message || 'Failed to load orders');
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!orders) return [];
    return orders.filter(o => {
      const matchStatus = status === 'all' ? true : o.status === status;
      const s = q.trim().toLowerCase();
      const matchQ =
        !s ||
        o.id?.toLowerCase().includes(s) ||
        o.items.some(it => it.name?.toLowerCase().includes(s));
      return matchStatus && matchQ;
    });
  }, [orders, q, status]);

  if (error) {
    return (
      <div className="px-4 py-6">
        <h1 className="text-xl font-semibold mb-4">Admin · Orders</h1>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }
  if (!orders) return <div className="px-4 py-6 text-gray-500">Loading…</div>;

  return (
    <div className="px-4 py-6 space-y-4">
      <h1 className="text-xl font-semibold">Admin · Orders</h1>

      {/* Filters (mobile-first) */}
      <div className="flex gap-2">
        <input
          value={q}
          onChange={e=>setQ(e.target.value)}
          placeholder="Search by id/item"
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
        />
        <select
          value={status}
          onChange={e=>setStatus(e.target.value as any)}
          className="border rounded-lg px-2 py-2 text-sm"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="shipped">Shipped</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map((o) => {
          const thumb = o.items?.[0]?.image;
          const totalQty = o.items?.reduce((n, it) => n + (it.qty || 0), 0);
          return (
            <Link
              key={o.id}
              href={`/admin/orders/${o.id}`}
              className="block border rounded-lg p-3 bg-white active:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                  {thumb ? <img src={thumb} alt="" className="w-full h-full object-cover" /> : null}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-500">#{o.id.slice(-6)}</div>
                  <div className="text-sm text-gray-700 truncate">
                    {new Date(o.createdAt).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {totalQty} item{o.items.length > 1 ? 's' : ''} · Rs {(o.subtotal / 100).toFixed(2)}
                  </div>
                </div>
                <Badge status={o.status} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function Badge({ status }: { status: Order['status'] }) {
  const map: Record<Order['status'], string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-green-100 text-green-700',
    shipped: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return <span className={`text-xs px-2 py-1 rounded ${map[status]}`}>{status.toUpperCase()}</span>;
}
