"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useCartDetails } from "@/lib/cart";
import Image from "next/image";
import { toast } from "sonner";
import { ArrowRight, ShieldCheck, Truck, CreditCard, MapPin, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const { enriched, subtotalCents, clear } = useCartDetails();
  const router = useRouter();

  const [shipping, setShipping] = useState({
    line1: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  const [note, setNote] = useState("");
  const [placing, setPlacing] = useState(false);

  const placeOrder = async () => {
    if (!enriched.length) return;

    // Basic validation
    if (!shipping.line1 || !shipping.city || !shipping.phone) {
      toast.error("Please fill in all required shipping details");
      return;
    }

    setPlacing(true);
    try {
      const payload = {
        shippingAddress: { ...shipping, country: "Sri Lanka" }, // Defaulting country for now
        billingAddress: { ...shipping, country: "Sri Lanka" }, // Using shipping as billing for simplicity
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
        toast.success("Order placed successfully!");
        router.push(`/orders/success?orderId=${order.id || order._id}`);
      } else {
        const err = await res.json().catch(() => null);
        toast.error(err?.error || "Failed to place order");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (enriched.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Checkout</h1>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
        {/* LEFT COLUMN: Forms */}
        <div className="lg:col-span-7 space-y-8">

          {/* Shipping Address */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-gray-900" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Shipping Details</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 ml-1">Address</label>
                <input
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-gray-50/50 focus:bg-white"
                  placeholder="Street address, Apartment, etc."
                  value={shipping.line1}
                  onChange={(e) => setShipping((s) => ({ ...s, line1: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 ml-1">City</label>
                  <input
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-gray-50/50 focus:bg-white"
                    placeholder="City"
                    value={shipping.city}
                    onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 ml-1">Postal Code</label>
                  <input
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-gray-50/50 focus:bg-white"
                    placeholder="ZIP Code"
                    value={shipping.postalCode}
                    onChange={(e) => setShipping((s) => ({ ...s, postalCode: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 ml-1">Phone Number</label>
                <input
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-gray-50/50 focus:bg-white"
                  placeholder="Contact number for delivery"
                  value={shipping.phone}
                  onChange={(e) => setShipping((s) => ({ ...s, phone: e.target.value }))}
                />
              </div>
            </div>
          </section>

          {/* Payment Method (Visual Only for now) */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm opacity-60 pointer-events-none relative overflow-hidden">
            <div className="absolute inset-0 bg-gray-50/50 z-10 flex items-center justify-center">
              <span className="bg-white px-4 py-2 rounded-full text-xs font-bold shadow-sm border border-gray-100">Cash on Delivery Only</span>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-gray-900" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Payment</h2>
            </div>
            <div className="p-4 border border-gray-200 rounded-xl flex items-center gap-4 bg-gray-50">
              <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-500">CARD</div>
              <span className="text-sm font-medium text-gray-500">Credit / Debit Card</span>
            </div>
          </section>

          {/* Order Note */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-gray-900" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Order Note</h2>
            </div>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-gray-50/50 focus:bg-white resize-none"
              rows={3}
              placeholder="Special instructions for delivery..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </section>
        </div>

        {/* RIGHT COLUMN: Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-6">
            <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Items Scrollable Area */}
              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar">
                {enriched.map((row, idx) => {
                  const p = row.product;
                  const img = p.images?.[0] || p.image;
                  return (
                    <div key={`${row.id}-${idx}`} className="flex gap-4 items-center">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-200 shrink-0">
                        {img && <Image src={img} alt={p.name} fill className="object-cover" />}
                        <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-bl-lg">
                          x{row.qty}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{p.name}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {row.size && `Size: ${row.size}`} {row.color && `• ${row.color}`}
                        </p>
                      </div>
                      <div className="text-sm font-bold text-gray-900">
                        Rs. {((p.price * row.qty) / 100).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3 mb-8">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">Rs. {(subtotalCents / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between items-end pt-2">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">Rs. {(subtotalCents / 100).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={placeOrder}
                disabled={placing}
                className="w-full py-4 rounded-xl bg-black text-white font-bold text-sm uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {placing ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  <>
                    Place Order
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-500 mt-4">
                By placing this order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>

            {/* Security Badges */}
            <div className="flex items-center justify-center gap-6 text-gray-400 grayscale opacity-70">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-medium">Secure SSL</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                <span className="text-xs font-medium">Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
