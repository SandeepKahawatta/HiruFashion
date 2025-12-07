'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Package,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

type OrderItem = {
  productId: string;
  name: string;
  unitPrice: number;
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
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
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
        if (res.status === 401) return setError('Please log in.');
        if (res.status === 403) return setError('You do not have access to this order.');
        if (!res.ok) throw new Error(await res.text());
        const data: Order = await res.json();
        setOrder(data);
      } catch (e: any) {
        setError(e?.message || 'Failed to load order');
      }
    })();
  }, [id]);

  if (error)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Order</h1>
        <p className="text-gray-500 mb-6">{error}</p>
        <Link
          href="/orders"
          className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-all"
        >
          Back to Orders
        </Link>
      </div>
    );

  if (!order)
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-8 w-32 bg-gray-100 rounded mb-8 animate-pulse" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-40 bg-gray-100 rounded-3xl animate-pulse" />
            <div className="h-96 bg-gray-100 rounded-3xl animate-pulse" />
          </div>
          <div className="space-y-6">
            <div className="h-64 bg-gray-100 rounded-3xl animate-pulse" />
          </div>
        </div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Breadcrumb & Back */}
      <div className="mb-8">
        <Link href="/orders" className="inline-flex items-center text-sm text-gray-500 hover:text-black transition-colors mb-4">
          <ChevronLeft size={16} className="mr-1" />
          Back to Orders
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Order #{order.id.slice(-8).toUpperCase()}</h1>
            <p className="text-gray-500 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <StatusBadge status={order.status} size="lg" />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Timeline & Items */}
        <div className="lg:col-span-2 space-y-8">
          {/* Status Timeline */}
          <section className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Order Status</h2>
            <OrderTimeline status={order.status} />
          </section>

          {/* Order Items */}
          <section className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm overflow-hidden">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Items ({order.items.length})</h2>
            <div className="space-y-6">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 sm:gap-6 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="w-20 h-24 sm:w-24 sm:h-32 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Package size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-2">{item.name}</h3>
                        <div className="mt-1 flex flex-wrap gap-3 text-sm text-gray-500">
                          {item.size && <span className="bg-gray-50 px-2 py-0.5 rounded text-xs font-medium border border-gray-100">Size: {item.size}</span>}
                          {item.color && (
                            <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded text-xs font-medium border border-gray-100">
                              Color:
                              <span className="w-3 h-3 rounded-full border border-gray-200" style={{ background: item.color }} />
                              {item.color}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="font-bold text-gray-900 whitespace-nowrap">Rs. {(item.unitPrice / 100).toFixed(2)}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                      <p className="text-sm font-medium text-gray-900">Total: Rs. {(item.unitPrice * item.qty / 100).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Summary & Addresses */}
        <div className="space-y-8">
          {/* Order Summary */}
          <section className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>Rs. {(order.subtotal / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between items-center">
                <span className="font-bold text-gray-900 text-base">Total</span>
                <span className="font-bold text-gray-900 text-xl">Rs. {(order.subtotal / 100).toFixed(2)}</span>
              </div>
            </div>

            {order.note && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Order Note</p>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">{order.note}</p>
              </div>
            )}
          </section>

          {/* Addresses */}
          <section className="space-y-6">
            {order.shippingAddress && (
              <AddressCard title="Shipping Address" address={order.shippingAddress} icon={<Truck size={18} />} />
            )}
            {order.billingAddress && (
              <AddressCard title="Billing Address" address={order.billingAddress} icon={<CreditCard size={18} />} />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status, size = 'md' }: { status: Order['status'], size?: 'md' | 'lg' }) {
  const config = {
    pending: { color: 'bg-yellow-50 text-yellow-700 border-yellow-100', icon: Clock, label: 'Processing' },
    paid: { color: 'bg-blue-50 text-blue-700 border-blue-100', icon: CheckCircle, label: 'Paid' },
    shipped: { color: 'bg-green-50 text-green-700 border-green-100', icon: Truck, label: 'Shipped' },
    cancelled: { color: 'bg-red-50 text-red-700 border-red-100', icon: XCircle, label: 'Cancelled' },
  };

  const { color, icon: Icon, label } = config[status] || config.pending;
  const sizeClasses = size === 'lg' ? 'px-4 py-2 text-sm' : 'px-3 py-1.5 text-xs';

  return (
    <span className={`inline-flex items-center gap-2 rounded-full font-bold border ${color} ${sizeClasses}`}>
      <Icon size={size === 'lg' ? 18 : 14} />
      {label}
    </span>
  );
}

function OrderTimeline({ status }: { status: Order['status'] }) {
  const steps = [
    { id: 'pending', label: 'Order Placed', icon: ShoppingBag },
    { id: 'paid', label: 'Processing', icon: Clock },
    { id: 'shipped', label: 'Shipped', icon: Truck },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle },
  ];

  // Determine current step index
  let currentStepIndex = 0;
  if (status === 'paid') currentStepIndex = 1;
  if (status === 'shipped') currentStepIndex = 2;
  // Note: 'delivered' status isn't in the type definition yet, but handling it for future proofing

  if (status === 'cancelled') {
    return (
      <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3 text-red-700">
        <XCircle size={24} />
        <div>
          <p className="font-bold">Order Cancelled</p>
          <p className="text-sm opacity-80">This order has been cancelled.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Mobile Vertical Timeline */}
      <div className="sm:hidden space-y-6">
        {steps.map((step, idx) => {
          const isCompleted = idx <= currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 ${isCompleted ? 'bg-black border-black text-white' : 'bg-white border-gray-200 text-gray-300'
                  }`}>
                  <Icon size={14} />
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-0.5 flex-1 my-1 ${idx < currentStepIndex ? 'bg-black' : 'bg-gray-100'}`} />
                )}
              </div>
              <div className={`pb-6 ${isCurrent ? 'opacity-100' : isCompleted ? 'opacity-80' : 'opacity-40'}`}>
                <p className="font-bold text-sm">{step.label}</p>
                {isCurrent && <p className="text-xs text-gray-500 mt-0.5">Current Status</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Horizontal Timeline */}
      <div className="hidden sm:flex items-center justify-between relative">
        {/* Connecting Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-100 -z-0" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-black -z-0 transition-all duration-500"
          style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx <= currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center bg-white px-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCompleted ? 'bg-black border-black text-white shadow-lg' : 'bg-white border-gray-200 text-gray-300'
                }`}>
                <Icon size={18} />
              </div>
              <p className={`mt-3 text-xs font-bold uppercase tracking-wider ${isCompleted ? 'text-black' : 'text-gray-400'
                }`}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AddressCard({ title, address, icon }: { title: string; address: Address; icon: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-600">
          {icon}
        </div>
        <h3 className="font-bold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-1 text-sm text-gray-600 pl-11">
        {address.name && <p className="font-medium text-gray-900">{address.name}</p>}
        {address.line1 && <p>{address.line1}</p>}
        {address.line2 && <p>{address.line2}</p>}
        {(address.city || address.postalCode) && (
          <p>{[address.city, address.postalCode].filter(Boolean).join(', ')}</p>
        )}
        {address.country && <p>{address.country}</p>}
        {address.phone && <p className="mt-2 text-gray-500">{address.phone}</p>}
      </div>
    </div>
  );
}
