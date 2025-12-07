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
  name?: string; phone?: string; line1?: string; line2?: string;
  city?: string; postalCode?: string; country?: string;
};

type Order = {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  status: 'pending'|'paid'|'shipped'|'cancelled';
  note?: string;
  shippingAddress?: Address;
  billingAddress?: Address;
  createdAt: string;
};

export default function AdminOrderEditPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/orders/${id}`, { credentials: 'include' });
        if (res.status === 401 || res.status === 403) {
          setError('Admin access required.'); return;
        }
        if (!res.ok) throw new Error(await res.text());
        const data: Order = await res.json();
        setOrder({ ...data, id: (data as any).id || (data as any)._id });
      } catch (e: any) {
        setError(e?.message || 'Failed to load order');
      }
    })();
  }, [id]);

  function update<K extends keyof Order>(key: K, value: Order[K]) {
    setOrder(o => (o ? { ...o, [key]: value } : o));
  }

  function updateAddr(which: 'shippingAddress' | 'billingAddress', field: keyof Address, value: string) {
    setOrder(o => {
      if (!o) return o;
      const curr = o[which] || {};
      return { ...o, [which]: { ...curr, [field]: value } };
    });
  }

  function updateItem(idx: number, patch: Partial<OrderItem>) {
    setOrder(o => {
      if (!o) return o;
      const next = [...o.items];
      next[idx] = { ...next[idx], ...patch };
      return { ...o, items: next };
    });
  }

  async function save() {
    if (!order) return;
    try {
      setSaving(true);
      const body = JSON.stringify({
        status: order.status,
        note: order.note ?? '',
        shippingAddress: order.shippingAddress ?? {},
        billingAddress: order.billingAddress ?? {},
        items: order.items,
        // server will recompute subtotal, but you can pass it if you want:
        // subtotal: order.items.reduce((n,it)=>n + it.price*it.qty, 0)
      });
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setOrder({ ...data, id: (data as any).id || (data as any)._id });
      alert('Saved');
    } catch (e: any) {
      alert(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (error) {
    return (
      <div className="px-4 py-6">
        <h1 className="text-xl font-semibold mb-2">Admin · Order</h1>
        <p className="text-red-600 text-sm">{error}</p>
        <div className="mt-3"><Link className="underline" href="/admin/orders">Back</Link></div>
      </div>
    );
  }
  if (!order) return <div className="px-4 py-6 text-gray-500">Loading…</div>;

  return (
    <div className="px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Order #{order.id.slice(-6)}</h1>
          <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
        </div>
        <Link className="underline text-sm" href="/admin/orders">Back</Link>
      </div>

      {/* Status + Note (mobile friendly) */}
      <div className="grid grid-cols-1 gap-3">
        <div className="border rounded-lg p-3 bg-white">
          <div className="text-sm font-medium mb-2">Status</div>
          <select
            className="w-full border rounded px-3 py-2 text-sm"
            value={order.status}
            onChange={e=>update('status', e.target.value as Order['status'])}
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="border rounded-lg p-3 bg-white">
          <div className="text-sm font-medium mb-2">Admin Note</div>
          <textarea
            className="w-full border rounded px-3 py-2 text-sm"
            value={order.note || ''}
            onChange={e=>update('note', e.target.value)}
            rows={3}
            placeholder="Internal note for this order…"
          />
        </div>
      </div>

      {/* Addresses (stacked) */}
      <div className="grid grid-cols-1 gap-3">
        <AddressEditor
          title="Shipping Address"
          value={order.shippingAddress || {}}
          onChange={(k,v)=>updateAddr('shippingAddress', k, v)}
        />
        <AddressEditor
          title="Billing Address"
          value={order.billingAddress || {}}
          onChange={(k,v)=>updateAddr('billingAddress', k, v)}
        />
      </div>

      {/* Items editor */}
      <div className="border rounded-lg bg-white overflow-hidden">
        <div className="px-3 py-2 text-sm font-medium border-b">Items</div>
        <div className="divide-y">
          {order.items.map((it, idx) => (
            <div key={idx} className="p-3">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                  {it.image ? <img src={it.image} alt="" className="w-full h-full object-cover" /> : null}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{it.name}</div>
                  <div className="text-xs text-gray-500 break-all">{it.productId}</div>
                </div>
                <div className="text-sm font-semibold whitespace-nowrap">
                  Rs {(it.price / 100).toFixed(2)}
                </div>
              </div>

              {/* Mobile-friendly controls */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Qty</label>
                  <input
                    type="number"
                    min={1}
                    className="w-full border rounded px-2 py-2 text-sm"
                    value={it.qty}
                    onChange={e=>updateItem(idx, { qty: Math.max(1, Number(e.target.value || 1)) })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Size</label>
                  <input
                    className="w-full border rounded px-2 py-2 text-sm"
                    value={it.size || ''}
                    onChange={e=>updateItem(idx, { size: e.target.value })}
                    placeholder="L / XL / …"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Color</label>
                  <input
                    className="w-full border rounded px-2 py-2 text-sm"
                    value={it.color || ''}
                    onChange={e=>updateItem(idx, { color: e.target.value })}
                    placeholder="Black / Red / …"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="px-3 py-2 flex justify-between text-sm border-t">
          <span>Subtotal</span>
          <span className="font-semibold">
            Rs { (order.items.reduce((n,it)=> n + it.price*it.qty, 0) / 100).toFixed(2) }
          </span>
        </div>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="w-full py-3 rounded-lg bg-black text-white active:bg-gray-800"
      >
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
  );
}

function AddressEditor({
  title, value, onChange
}: {
  title: string;
  value: Address;
  onChange: (k: keyof Address, v: string) => void;
}) {
  return (
    <div className="border rounded-lg p-3 bg-white">
      <div className="text-sm font-medium mb-2">{title}</div>
      <div className="grid grid-cols-1 gap-2">
        <input className="border rounded px-3 py-2 text-sm" placeholder="Name"
               value={value.name || ''} onChange={e=>onChange('name', e.target.value)} />
        <input className="border rounded px-3 py-2 text-sm" placeholder="Phone"
               value={value.phone || ''} onChange={e=>onChange('phone', e.target.value)} />
        <input className="border rounded px-3 py-2 text-sm" placeholder="Address line 1"
               value={value.line1 || ''} onChange={e=>onChange('line1', e.target.value)} />
        <input className="border rounded px-3 py-2 text-sm" placeholder="Address line 2"
               value={value.line2 || ''} onChange={e=>onChange('line2', e.target.value)} />
        <div className="flex gap-2">
          <input className="border rounded px-3 py-2 text-sm flex-1" placeholder="City"
                 value={value.city || ''} onChange={e=>onChange('city', e.target.value)} />
          <input className="border rounded px-3 py-2 text-sm w-28" placeholder="Postal code"
                 value={value.postalCode || ''} onChange={e=>onChange('postalCode', e.target.value)} />
        </div>
        <input className="border rounded px-3 py-2 text-sm" placeholder="Country"
               value={value.country || ''} onChange={e=>onChange('country', e.target.value)} />
      </div>
    </div>
  );
}
