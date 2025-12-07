'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProfileHeader from '@/components/ProfileHeader'
import OrderList from '@/components/OrderList'
import { User, Package, Settings, MapPin, LogOut } from 'lucide-react'
import { useAuthClient } from '@/lib/auth-client'

export default function ProfilePage() {
    const router = useRouter()
    const { user, logout } = useAuthClient()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'settings'>('overview')

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/orders/mine')
                if (res.ok) {
                    const data = await res.json()
                    setOrders(data)
                }
            } catch (error) {
                console.error('Failed to fetch orders:', error)
            } finally {
                setLoading(false)
            }
        }

        if (user) {
            fetchData()
        } else {
            // If auth client is still loading, wait. If no user after load, redirect.
            // For now, assuming auth-client handles redirect or we do it here:
            // router.push('/login')
        }
    }, [user, router])

    const handleLogout = async () => {
        await logout()
        router.push('/login')
    }

    if (!user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                <ProfileHeader user={user} orderCount={orders.length} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-3">
                        <nav className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 sticky top-24">
                            <div className="space-y-1">
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'overview'
                                            ? 'bg-black text-white'
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <User className="w-4 h-4" />
                                    Overview
                                </button>
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'orders'
                                            ? 'bg-black text-white'
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Package className="w-4 h-4" />
                                    Orders
                                </button>
                                <button
                                    onClick={() => setActiveTab('settings')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'settings'
                                            ? 'bg-black text-white'
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Settings className="w-4 h-4" />
                                    Settings
                                </button>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-9 space-y-6">
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                    <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h2>
                                    {loading ? (
                                        <div className="space-y-4">
                                            {[1, 2].map(i => (
                                                <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
                                            ))}
                                        </div>
                                    ) : (
                                        <OrderList orders={orders.slice(0, 3)} />
                                    )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-lg font-bold text-gray-900">Default Address</h2>
                                            <button className="text-sm font-bold text-black underline">Edit</button>
                                        </div>
                                        <div className="flex items-start gap-3 text-gray-600 text-sm">
                                            <MapPin className="w-5 h-5 shrink-0" />
                                            <p>
                                                No default address set.<br />
                                                Add an address to speed up checkout.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Order History</h2>
                                {loading ? (
                                    <div className="space-y-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
                                        ))}
                                    </div>
                                ) : (
                                    <OrderList orders={orders} />
                                )}
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Account Settings</h2>
                                <div className="max-w-xl space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            defaultValue={user.name}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-black transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            defaultValue={user.email}
                                            disabled
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                                        />
                                    </div>
                                    <button className="px-6 py-3 bg-black text-white rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-gray-800 transition-colors">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
