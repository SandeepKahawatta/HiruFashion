'use client';

import { useEffect, useState } from 'react';
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
  name?: string;
  phone?: string;
  line1?: string;
  line2?: string;
  city?: string;
  postalCode?: string;
  country?: string;
};

type Order = {
  id: string;
  status: 'pending'|'paid'|'shipped'|'cancelled';
  createdAt: string;
  subtotal: number;
  note?: string;
  shippingAddress?: Address;
  billingAddress?: Address;
  items: OrderItem[];
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const id = params.id;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/orders/${id}`, { credentials: 'include' });
        if (res.status === 401) { setError('Please log in.'); return; }
        if (res.status === 403) { setError('You do not have access to this order.'); return; }
        if (!res.ok) throw new Error(await res.text());
        const data: Order = await res.json();
        setOrder(data);
      } catch (e: any) {
        setError(e?.message || 'Failed to load order');
      }
    })();
  }, [id]);

  if (error) {
    return (
      <div className="px-4 py-8 text-center">
        <h1 className="text-xl font-semibold mb-2">Order</h1>
        <p className="text-gray-600">{error}</p>
        <div className="mt-4">
          <Link href="/orders" className="underline">Back to Orders</Link>
        </div>
      </div>
    );
  }

  if (!order) return <div className="px-4 py-8 text-center text-gray-500">Loading…</div>;

  return (
    <div className="px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Order #{order.id.slice(-6)}</h1>
          <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Progress bar (mobile-friendly) */}
      <Progress status={order.status} />

      {/* Addresses */}
      <div className="grid grid-cols-1 gap-3">
        {order.shippingAddress && (
          <AddressCard title="Shipping Address" a={order.shippingAddress} />
        )}
        {order.billingAddress && (
          <AddressCard title="Billing Address" a={order.billingAddress} />
        )}
      </div>

      {/* Note */}
      {order.note ? (
        <div className="border rounded-lg p-3 bg-white">
          <div className="text-sm font-medium mb-1">Order Note</div>
          <div className="text-sm text-gray-700">{order.note}</div>
        </div>
      ) : null}

      {/* Items */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="px-3 py-2 text-sm font-medium border-b">Items</div>
        <div className="divide-y">
          {order.items.map((it, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3">
              <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                {it.image ? <img src={it.image} alt="" className="w-full h-full object-cover" /> : null}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{it.name}</div>
                <div className="text-xs text-gray-500">
                  {it.size ? `Size: ${it.size}` : ''}{it.size && it.color ? ' · ' : ''}{it.color ? `Color: ${it.color}` : ''}
                </div>
                <div className="text-xs text-gray-500">Qty: {it.qty}</div>
              </div>
              <div className="text-sm font-semibold whitespace-nowrap">Rs {(it.price / 100).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="px-3 py-2 flex justify-between text-sm">
          <span>Subtotal</span>
          <span className="font-semibold">Rs {(order.subtotal / 100).toFixed(2)}</span>
        </div>
      </div>

      <div className="pt-2">
        <Link href="/orders" className="underline text-sm">← Back to Orders</Link>
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
  return <span className={`text-xs px-2 py-1 rounded ${map[status]}`}>{status.toUpperCase()}</span>;
}

function Progress({ status }: { status: Order['status'] }) {
  const steps: Order['status'][] = ['pending', 'paid', 'shipped'];
  const idx = steps.indexOf(status);
  const pct = status === 'cancelled' ? 0 : ((idx + 1) / steps.length) * 100;

  return (
    <div className="bg-white border rounded-lg p-3">
      <div className="flex justify-between text-xs text-gray-600 mb-2">
        <span>Pending</span><span>Paid</span><span>Shipped</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${status === 'cancelled' ? 'bg-red-400' : 'bg-black'}`} style={{ width: `${pct}%` }} />
      </div>
      {status === 'cancelled' && (
        <div className="text-xs text-red-600 mt-2">This order was cancelled.</div>
      )}
    </div>
  );
}

function AddressCard({ title, a }: { title: string; a: Address }) {
  return (
    <div className="border rounded-lg p-3 bg-white">
      <div className="text-sm font-medium mb-1">{title}</div>
      <div className="text-sm text-gray-700 space-y-0.5">
        {a.name && <div>{a.name}</div>}
        {a.phone && <div>{a.phone}</div>}
        {a.line1 && <div>{a.line1}</div>}
        {a.line2 && <div>{a.line2}</div>}
        {(a.city || a.postalCode) && <div>{[a.city, a.postalCode].filter(Boolean).join(' ')}</div>}
        {a.country && <div>{a.country}</div>}
      </div>
    </div>
  );
}
