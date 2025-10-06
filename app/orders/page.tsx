'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  size?: string;
  color?: string;
  image?: string;
};

type Order = {
  id: string;
  _id?: string;
  status: 'pending'|'paid'|'shipped'|'cancelled';
  subtotal: number;
  createdAt: string;
  items: OrderItem[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/orders/mine', { credentials: 'include' });
        if (res.status === 401) {
          setError('Please log in to view your orders.');
          return;
        }
        if (!res.ok) throw new Error(await res.text());
        const data: Order[] = await res.json();
        setOrders(data);
      } catch (e: any) {
        setError(e?.message || 'Failed to load orders');
      }
    })();
  }, []);

  if (error) {
    return (
      <div className="px-4 py-8 text-center">
        <h1 className="text-xl font-semibold mb-2">Orders</h1>
        <p className="text-gray-600">{error}</p>
        <div className="mt-4">
          <Link href="/api/auth/login" className="underline">Log in</Link>
        </div>
      </div>
    );
  }

  if (!orders) {
    return <div className="px-4 py-8 text-center text-gray-500">Loading…</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <h1 className="text-xl font-semibold mb-2">Your Orders</h1>
        <p className="text-gray-600">No orders yet.</p>
        <div className="mt-4">
          <Link href="/" className="underline">Start shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-xl font-semibold mb-4">Your Orders</h1>

      <div className="space-y-3">
        {orders.map((o) => {
          const thumb = o.items?.[0]?.image;
          const totalQty = o.items?.reduce((n, it) => n + (it.qty || 0), 0);
          return (
            <Link
              key={o.id}
              href={`/orders/${o.id}`}
              className="block border rounded-lg p-3 bg-white active:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                  {thumb ? (
                    // Use <img> here to avoid next/image domain config friction on mobile
                    <img src={thumb} alt="" className="w-full h-full object-cover" />
                  ) : null}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-500">Order #{o.id.slice(-6)}</div>
                  <div className="text-sm text-gray-700 truncate">
                    {new Date(o.createdAt).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {totalQty} item{o.items.length > 1 ? 's' : ''} · Rs {(o.subtotal / 100).toFixed(2)}
                  </div>
                </div>

                <StatusBadge status={o.status} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Order['status'] }) {
  const map: Record<Order['status'], string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-green-100 text-green-700',
    shipped: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`text-xs px-2 py-1 rounded ${map[status]}`}>
      {status.toUpperCase()}
    </span>
  );
}
