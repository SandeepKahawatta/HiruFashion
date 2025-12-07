'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

type OrderItem = {
  productId: string;
  name: string;
  unitPrice: number;
  qty: number;
  size?: string;
  color?: string;
  image?: string;
};

type Order = {
  id: string;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
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
        const res = await fetch('/api/orders', { credentials: 'include' });
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-6">{error}</p>
        <Link 
            href="/login" 
            className="px-8 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          Log in
        </Link>
      </div>
    );
  }

  if (!orders) {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="h-10 w-48 bg-gray-100 rounded-lg mb-8 animate-pulse" />
            <div className="grid gap-6 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-3xl p-6 h-64 animate-pulse shadow-sm">
                        <div className="flex justify-between mb-4">
                            <div className="h-6 w-24 bg-gray-100 rounded" />
                            <div className="h-6 w-20 bg-gray-100 rounded-full" />
                        </div>
                        <div className="space-y-3">
                            <div className="h-4 w-full bg-gray-100 rounded" />
                            <div className="h-4 w-3/4 bg-gray-100 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">No orders yet</h1>
        <p className="text-gray-500 mb-8 max-w-md">
          You haven't placed any orders yet. Start shopping to fill your wardrobe with premium styles.
        </p>
        <Link 
          href="/" 
          className="px-8 py-4 bg-black text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 md:mb-12">My Orders</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        {orders.map((order, index) => (
            <OrderCard key={order.id} order={order} index={index} />
        ))}
      </div>
    </div>
  );
}

function OrderCard({ order, index }: { order: Order; index: number }) {
    const totalQty = order.items?.reduce((n, it) => n + (it.qty || 0), 0);
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
        >
            <Link
                href={`/orders/${order.id}`}
                className="block bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all group h-full flex flex-col"
            >
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Order ID</p>
                        <p className="text-lg font-bold text-gray-900">#{order.id.slice(-8).toUpperCase()}</p>
                    </div>
                    <StatusBadge status={order.status} />
                </div>

                <div className="flex-1">
                    <div className="flex gap-3 mb-6 overflow-hidden">
                        {order.items.slice(0, 4).map((item, i) => (
                            <div key={i} className="relative w-16 h-20 rounded-xl bg-gray-50 overflow-hidden border border-gray-100 flex-shrink-0">
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <Package size={16} />
                                    </div>
                                )}
                                {i === 3 && order.items.length > 4 && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold">
                                        +{order.items.length - 3}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-6 flex justify-between items-end">
                    <div>
                        <p className="text-xs text-gray-500 mb-1">{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p className="text-sm font-medium text-gray-900">{totalQty} Item{totalQty !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-gray-900">Rs. {(order.subtotal / 100).toFixed(2)}</span>
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

function StatusBadge({ status }: { status: Order['status'] }) {
  const config = {
    pending: { color: 'bg-yellow-50 text-yellow-700 border-yellow-100', icon: Clock, label: 'Processing' },
    paid: { color: 'bg-blue-50 text-blue-700 border-blue-100', icon: CheckCircle, label: 'Paid' },
    shipped: { color: 'bg-green-50 text-green-700 border-green-100', icon: Truck, label: 'Shipped' },
    cancelled: { color: 'bg-red-50 text-red-700 border-red-100', icon: XCircle, label: 'Cancelled' },
  };

  const { color, icon: Icon, label } = config[status] || config.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${color}`}>
      <Icon size={14} />
      {label}
    </span>
  );
}
