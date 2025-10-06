"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get("orderId");
    if (id) setOrderId(id);
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4 text-center">
      <CheckCircle className="text-green-500 w-20 h-20 mb-6" />
      <h1 className="text-4xl font-bold mb-4">🎉 Order Placed Successfully!</h1>
      <p className="text-lg text-gray-700 max-w-xl mb-6">
        Thank you for your order! We’ve received your request and our team will
        contact you shortly with payment details, shipping information, and any
        other steps needed to complete your order.
      </p>

      {orderId && (
        <p className="text-sm text-gray-500 mb-6">
          Your order reference: <span className="font-semibold">{orderId}</span>
        </p>
      )}

      <p className="text-base text-gray-600 mb-10">
        📞 If we need any additional details, we’ll reach out to you via the
        email or phone number associated with your account.
      </p>

      <div className="flex flex-col md:flex-row gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          🛍️ Continue Shopping
        </Link>
        <Link
          href="/orders"
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
        >
          📦 View My Orders
        </Link>
      </div>
    </div>
  );
}
