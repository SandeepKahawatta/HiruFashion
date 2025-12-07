'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

const CATEGORIES = ['Slippers', 'Frocks', 'Blouses', 'Skirts', 'Pants', 'Bags'];
const COLORS = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Beige', 'Brown'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function FilterSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [priceRange, setPriceRange] = useState<{ min: string, max: string }>({ min: '', max: '' });
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

    useEffect(() => {
        // Sync local state with URL
        setSelectedCategories(searchParams.get('category')?.split(',') || []);
        setSelectedColors(searchParams.get('color')?.split(',') || []);
        setSelectedSizes(searchParams.get('size')?.split(',') || []);
        setPriceRange({
            min: searchParams.get('minPrice') || '',
            max: searchParams.get('maxPrice') || ''
        });
    }, [searchParams]);

    const updateFilters = (
        newCategories: string[],
        newColors: string[],
        newSizes: string[],
        newPrice: { min: string, max: string }
    ) => {
        const params = new URLSearchParams(searchParams.toString());

        if (newCategories.length > 0) params.set('category', newCategories.join(','));
        else params.delete('category');

        if (newColors.length > 0) params.set('color', newColors.join(','));
        else params.delete('color');

        if (newSizes.length > 0) params.set('size', newSizes.join(','));
        else params.delete('size');

        if (newPrice.min) params.set('minPrice', newPrice.min);
        else params.delete('minPrice');

        if (newPrice.max) params.set('maxPrice', newPrice.max);
        else params.delete('maxPrice');

        params.delete('page'); // Reset pagination

        router.push(`/shop?${params.toString()}`);
    };

    const toggleFilter = (item: string, current: string[], setter: (val: string[]) => void, type: 'category' | 'color' | 'size') => {
        // For colors/sizes/categories, we might want case-insensitive matching or just stick to the values
        const newItem = item;
        const newSelection = current.includes(newItem)
            ? current.filter(c => c !== newItem)
            : [...current, newItem];

        setter(newSelection);

        // Pass latest state for others
        if (type === 'category') updateFilters(newSelection, selectedColors, selectedSizes, priceRange);
        if (type === 'color') updateFilters(selectedCategories, newSelection, selectedSizes, priceRange);
        if (type === 'size') updateFilters(selectedCategories, selectedColors, newSelection, priceRange);
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
        const val = e.target.value;
        const newPrice = { ...priceRange, [type]: val };
        setPriceRange(newPrice);
    };

    const applyPrice = () => {
        updateFilters(selectedCategories, selectedColors, selectedSizes, priceRange);
    };

    const resetFilters = () => {
        setSelectedCategories([]);
        setSelectedColors([]);
        setSelectedSizes([]);
        setPriceRange({ min: '', max: '' });
        router.push('/shop');
    };

    return (
        <div className="space-y-8 pb-24 lg:pb-0">
            <div className="flex justify-between items-center">
                <h2 className="font-bold text-xl">Filters</h2>
                <button
                    onClick={resetFilters}
                    className="text-sm text-gray-500 hover:text-black underline"
                >
                    Reset
                </button>
            </div>
            {/* Categories */}
            <div>
                <h3 className="font-bold text-lg mb-4">Categories</h3>
                <div className="space-y-2">
                    {CATEGORIES.map((cat) => (
                        <label key={cat} className="flex items-center space-x-3 cursor-pointer group">
                            <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${selectedCategories.includes(cat) ? 'bg-black border-black' : 'border-gray-300 group-hover:border-gray-400'}`}>
                                {selectedCategories.includes(cat) && (
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={selectedCategories.includes(cat)}
                                onChange={() => toggleFilter(cat, selectedCategories, setSelectedCategories, 'category')}
                            />
                            <span className="text-gray-600 group-hover:text-black transition-colors">{cat}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Colors */}
            <div>
                <h3 className="font-bold text-lg mb-4">Colors</h3>
                <div className="flex flex-wrap gap-3">
                    {COLORS.map((color) => (
                        <button
                            key={color}
                            onClick={() => toggleFilter(color, selectedColors, setSelectedColors, 'color')}
                            className={`w-8 h-8 rounded-full border-2 shadow-sm transition-transform hover:scale-110 ${selectedColors.includes(color) ? 'ring-2 ring-offset-2 ring-black border-transparent' : 'border-gray-200'}`}
                            style={{ backgroundColor: color.toLowerCase() }}
                            title={color}
                        />
                    ))}
                </div>
            </div>

            {/* Sizes */}
            <div>
                <h3 className="font-bold text-lg mb-4">Sizes</h3>
                <div className="flex flex-wrap gap-2">
                    {SIZES.map((size) => (
                        <button
                            key={size}
                            onClick={() => toggleFilter(size, selectedSizes, setSelectedSizes, 'size')}
                            className={`px-3 py-1 border rounded-md text-sm font-medium transition-colors ${selectedSizes.includes(size) ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'}`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="font-bold text-lg mb-4">Price Range</h3>
                <div className="flex items-center space-x-2 mb-4">
                    <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => handlePriceChange(e, 'min')}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => handlePriceChange(e, 'max')}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                    />
                </div>
                <button
                    onClick={applyPrice}
                    className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                    Apply Price
                </button>
            </div>
        </div>
    );
}
