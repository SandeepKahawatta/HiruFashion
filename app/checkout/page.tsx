"use client";
import { useCartDetails } from "@/lib/cart";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function CheckoutPage() {
  const { enriched, subtotalCents, clear } = useCartDetails();
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

  const placeOrder = async () => {
    const payload = {
      shippingAddress: shipping,
      billingAddress: billing,
      note,
      subtotal: subtotalCents,
      items: enriched.map(row => ({
        productId: row.product.id,
        name: row.product.name,
        price: row.product.price,
        qty: row.qty,
        size: row.size,
        color: row.color || null,
        image: row.product.images?.[0] || row.product.image,
      })),
    };

    const res = await apiFetch("/api/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const order = await res.json();
      clear();
      router.push(`/orders/success?orderId=${order._id}`);
    } else {
      const err = await res.json();
      alert(err.error || "Order failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-semibold">Checkout</h1>

      <section>
        <h2 className="text-xl font-medium mb-2">Shipping Address</h2>
        {Object.keys(shipping).map(key => (
          <input
            key={key}
            className="border p-2 w-full mb-2"
            placeholder={key}
            value={shipping[key as keyof typeof shipping]}
            onChange={e =>
              setShipping(s => ({ ...s, [key]: e.target.value }))
            }
          />
        ))}
      </section>

      <section>
        <h2 className="text-xl font-medium mb-2">Billing Address</h2>
        {Object.keys(billing).map(key => (
          <input
            key={key}
            className="border p-2 w-full mb-2"
            placeholder={key}
            value={billing[key as keyof typeof billing]}
            onChange={e =>
              setBilling(b => ({ ...b, [key]: e.target.value }))
            }
          />
        ))}
      </section>

      <section>
        <h2 className="text-xl font-medium mb-2">Order Note</h2>
        <textarea
          className="border p-2 w-full"
          placeholder="Note about your order"
          value={note}
          onChange={e => setNote(e.target.value)}
        />
      </section>

      <section>
        <h2 className="text-xl font-medium mb-2">Your Items</h2>
        <div className="space-y-2">
          {enriched.map(row => (
            <div key={row.id} className="border p-2 rounded flex justify-between">
              <div>
                <div>{row.product.name}</div>
                <div className="text-sm text-gray-600">
                  Size: {row.size || "N/A"} · Qty: {row.qty}
                </div>
              </div>
              <div>Rs {(row.product.price * row.qty / 100).toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div className="text-right font-semibold mt-4">
          Total: Rs {(subtotalCents / 100).toFixed(2)}
        </div>
      </section>

      <button
        onClick={placeOrder}
        className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800"
      >
        Place Order
      </button>
    </div>
  );
}
