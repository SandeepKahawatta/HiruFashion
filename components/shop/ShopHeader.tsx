'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Filter } from 'lucide-react';

export default function ShopHeader({ onMobileFilterClick }: { onMobileFilterClick: () => void }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get('sort') || 'newest';

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', e.target.value);
        router.push(`/shop?${params.toString()}`);
    };

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold">Shop All</h1>

            <div className="flex items-center gap-4 w-full sm:w-auto">
                <button
                    onClick={onMobileFilterClick}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 flex-1 sm:flex-none justify-center"
                >
                    <Filter size={20} />
                    Filters
                </button>

                <div className="relative flex-1 sm:flex-none">
                    <select
                        value={currentSort}
                        onChange={handleSortChange}
                        className="w-full sm:w-48 appearance-none px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
                    >
                        <option value="newest">Newest Arrivals</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
