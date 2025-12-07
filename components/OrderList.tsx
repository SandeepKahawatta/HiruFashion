'use client'

import { Package, ChevronRight, Clock, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

interface Order {
    id: string
    createdAt: string
    status: string
    total: number
    items: any[]
}

interface OrderListProps {
    orders: Order[]
}

export default function OrderList({ orders }: OrderListProps) {
    if (!orders || orders.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">No orders yet</h3>
                <p className="text-gray-500 text-sm">Start shopping to see your orders here.</p>
                <Link href="/" className="inline-block mt-6 px-6 py-2 bg-black text-white rounded-xl text-sm font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors">
                    Start Shopping
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <div
                    key={order.id}
                    className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-all duration-300 group"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-gray-900">Order #{order.id.slice(-6).toUpperCase()}</span>
                                <StatusBadge status={order.status} />
                            </div>
                            <p className="text-sm text-gray-500">
                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6">
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Total Amount</p>
                                <p className="font-bold text-gray-900">Rs. {(order.total / 100).toFixed(2)}</p>
                            </div>

                            <Link
                                href={`/orders/${order.id}`}
                                className="p-2 rounded-full bg-gray-50 group-hover:bg-black group-hover:text-white transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        pending: 'bg-yellow-100 text-yellow-700',
        processing: 'bg-blue-100 text-blue-700',
        shipped: 'bg-purple-100 text-purple-700',
        delivered: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
    }

    const icons = {
        pending: Clock,
        processing: Package,
        shipped: Package,
        delivered: CheckCircle,
        cancelled: XCircle,
    }

    const style = styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700'
    const Icon = icons[status as keyof typeof styles] || Package

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${style}`}>
            <Icon className="w-3 h-3" />
            {status}
        </span>
    )
}
