'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/lib/types';
import FilterSidebar from './FilterSidebar';
import ShopHeader from './ShopHeader';
import ProductGrid from './ProductGrid';
import { X } from 'lucide-react';

export default function ShopPageClient({ products }: { products: Product[] }) {
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isMobileFilterOpen) {
            setIsAnimating(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setIsAnimating(false), 300); // Match transition duration
            document.body.style.overflow = '';
            return () => clearTimeout(timer);
        }
    }, [isMobileFilterOpen]);

    return (
        <div className="w-full lg:w-[80%] mx-auto px-4 py-8">
            {/* Mobile Filter Drawer */}
            {(isMobileFilterOpen || isAnimating) && (
                <div className={`fixed inset-0 z-50 lg:hidden`}>
                    {/* Backdrop */}
                    <div
                        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isMobileFilterOpen ? 'opacity-100' : 'opacity-0'}`}
                        onClick={() => setIsMobileFilterOpen(false)}
                    />

                    {/* Drawer */}
                    <div
                        className={`absolute inset-y-0 left-0 w-[85%] max-w-xs bg-white p-6 shadow-xl overflow-y-auto transition-transform duration-300 ease-in-out transform ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Filters</h2>
                            <button
                                onClick={() => setIsMobileFilterOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <FilterSidebar />
                    </div>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-64 flex-shrink-0">
                    <div className="sticky top-24">
                        <FilterSidebar />
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    <ShopHeader onMobileFilterClick={() => setIsMobileFilterOpen(true)} />
                    <ProductGrid products={products} />
                </main>
            </div>
        </div>
    );
}
