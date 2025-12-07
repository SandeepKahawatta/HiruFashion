import Link from 'next/link'
import { Facebook, Instagram, Twitter, Linkedin, CreditCard, Truck, ShieldCheck } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-black text-white pt-20 pb-10 border-t border-gray-800">
            <div className="w-full lg:w-[80%] mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand & About */}
                    <div className="space-y-6">
                        <h3 className="text-3xl font-bold tracking-tighter">HiruFashion</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Redefining modern elegance. We curate the finest collections to help you express your unique style with confidence and grace.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <Link href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all duration-300"><Facebook size={18} /></Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all duration-300"><Instagram size={18} /></Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all duration-300"><Twitter size={18} /></Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all duration-300"><Linkedin size={18} /></Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 border-b border-gray-800 pb-2 inline-block">Shop</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><Link href="/new-arrivals" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">New Arrivals</Link></li>
                            <li><Link href="/collections" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">Collections</Link></li>
                            <li><Link href="/shop" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">All Products</Link></li>
                            <li><Link href="/sale" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block text-red-400">Sale & Offers</Link></li>
                        </ul>
                    </div>

                    {/* Customer Care */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 border-b border-gray-800 pb-2 inline-block">Customer Care</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><Link href="/contact" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">Contact Us</Link></li>
                            <li><Link href="/shipping" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">Shipping & Returns</Link></li>
                            <li><Link href="/faq" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">FAQs</Link></li>
                            <li><Link href="/size-guide" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">Size Guide</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 border-b border-gray-800 pb-2 inline-block">Stay Updated</h4>
                        <p className="text-gray-400 mb-4">Subscribe to our newsletter for exclusive offers and style tips.</p>
                        <form className="flex flex-col gap-3">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="bg-gray-900 border border-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-gray-600 transition-colors"
                            />
                            <button className="bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 transition-colors">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} HiruFashion. All rights reserved.
                    </p>

                    <div className="flex gap-6 text-gray-500">
                        <div className="flex items-center gap-2" title="Secure Payment">
                            <ShieldCheck size={18} /> <span className="text-xs">Secure Payment</span>
                        </div>
                        <div className="flex items-center gap-2" title="Fast Delivery">
                            <Truck size={18} /> <span className="text-xs">Fast Delivery</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
