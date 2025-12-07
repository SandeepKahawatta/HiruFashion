// app/checkout/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useCart, useCartDetails } from "@/lib/cart";
import Image from "next/image";

export default function CheckoutPage() {
  const { enriched, subtotalCents, updateQty, removeItem, clear, addItem } = useCartDetails();
  const { removeItem: removeStored } = useCart(); // in case we need direct ops
  const router = useRouter();

  const [shipping, setShipping] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [billing, setBilling] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [note, setNote] = useState("");
  const [placing, setPlacing] = useState(false);

  // Change size/color by removing the old line and adding a new one with same qty
  const changeOptions = (rowIdx: number, newSize?: string, newColor?: string) => {
    const row = enriched[rowIdx];
    if (!row) return;
    // remove old line
    removeItem(row.id, row.size, row.color);
    // re-add with new options
    addItem(row.id, row.qty, newSize, newColor);
  };

  const placeOrder = async () => {
    if (!enriched.length) return;
    setPlacing(true);
    try {
      const payload = {
        shippingAddress: shipping,
        billingAddress: billing,
        note,
        items: enriched.map((row) => ({
          productId: row.product.id,
          qty: row.qty,
          size: row.size,
          color: row.color,
        })),
      };

      const res = await apiFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const order = await res.json();
        clear();
        router.push(`/orders/success?orderId=${order.id || order._id}`);
      } else {
        const err = await res.json().catch(() => null);
        alert(err?.error || "Order failed");
      }
    } finally {
      setPlacing(false);
    }
  };

  if (enriched.length === 0) {
    return (
      <div className="px-4 py-10 text-center">
        <h1 className="text-2xl font-semibold mb-2">Your cart is empty</h1>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 rounded-lg border"
        >
          Continue shopping
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 max-w-3xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="sticky top-0 z-10 -mx-4 px-4 py-3 bg-white/90 backdrop-blur border-b">
        <h1 className="text-xl font-semibold">Checkout</h1>
      </div>

      {/* Items (editable) */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium">Your Items</h2>
        {enriched.map((row, idx) => {
          const p = row.product;
          const img = p.images?.[0] || p.image;
          return (
            <div
              key={`${row.id}-${row.size ?? ""}-${row.color ?? ""}-${idx}`}
              className="rounded-2xl border p-3 flex gap-3"
            >
              <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                {img ? (
                  <Image src={img} alt={p.name} fill className="object-cover" />
                ) : (
                  <div className="w-20 h-20 bg-gray-100" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{p.name}</div>
                <div className="text-xs text-gray-500">{p.category}</div>

                {/* Variant pickers */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {/* Size */}
                  {Array.isArray(p.sizes) && p.sizes.length > 0 && (
                    <select
                      className="border rounded-lg px-2 py-1 text-sm"
                      value={row.size ?? ""}
                      onChange={(e) => changeOptions(idx, e.target.value || undefined, row.color)}
                    >
                      <option value="">Select size</option>
                      {p.sizes.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Color */}
                  {Array.isArray(p.colors) && p.colors.length > 0 && (
                    <div className="flex items-center gap-2">
                      {p.colors.map((c) => (
                        <button
                          key={c}
                          title={c}
                          onClick={() => changeOptions(idx, row.size, c)}
                          className={`w-6 h-6 rounded-full border ${row.color === c ? "ring-2 ring-black" : ""}`}
                          style={{ background: c }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Qty */}
                <div className="mt-2 flex items-center gap-2">
                  <button
                    className="px-2 py-1 border rounded"
                    onClick={() => updateQty(row.id, Math.max(1, row.qty - 1), row.size, row.color)}
                  >
                    −
                  </button>
                  <span className="w-6 text-center">{row.qty}</span>
                  <button
                    className="px-2 py-1 border rounded"
                    onClick={() => updateQty(row.id, row.qty + 1, row.size, row.color)}
                  >
                    +
                  </button>

                  <button
                    className="ml-auto px-3 py-1.5 border rounded-lg text-sm"
                    onClick={() => removeItem(row.id, row.size, row.color)}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="text-right font-medium">
                Rs {(p.price * row.qty / 100).toFixed(2)}
              </div>
            </div>
          );
        })}

        <div className="flex justify-between pt-2 text-base">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">Rs {(subtotalCents / 100).toFixed(2)}</span>
        </div>
      </section>

      {/* Addresses */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Shipping Address</h2>
        <div className="grid grid-cols-1 gap-2">
          {Object.keys(shipping).map((key) => (
            <input
              key={key}
              className="border rounded-xl px-3 py-2"
              placeholder={key}
              value={shipping[key as keyof typeof shipping]}
              onChange={(e) => setShipping((s) => ({ ...s, [key]: e.target.value }))}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Billing Address</h2>
        <div className="grid grid-cols-1 gap-2">
          {Object.keys(billing).map((key) => (
            <input
              key={key}
              className="border rounded-xl px-3 py-2"
              placeholder={key}
              value={billing[key as keyof typeof billing]}
              onChange={(e) => setBilling((b) => ({ ...b, [key]: e.target.value }))}
            />
          ))}
        </div>
      </section>

      {/* Note */}
      <section className="space-y-2">
        <h2 className="text-lg font-medium">Order Note</h2>
        <textarea
          className="border rounded-xl px-3 py-2 w-full"
          rows={3}
          placeholder="Note about your order"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </section>

      {/* Sticky place order */}
      <div className="h-20" />
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="ml-auto text-right">
            <div className="text-xs text-gray-600">Total</div>
            <div className="text-lg font-semibold">Rs {(subtotalCents / 100).toFixed(2)}</div>
          </div>
          <button
            disabled={placing}
            onClick={placeOrder}
            className="w-44 py-3 bg-black text-white rounded-xl hover:bg-gray-800 disabled:opacity-60"
          >
            {placing ? "Placing..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
