import CollectionCard from '@/components/CollectionCard'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Collections | Hiru Fashion',
    description: 'Explore our exclusive collections of premium fashion.',
}

import { COLLECTIONS } from '@/lib/data'

export default function CollectionsPage() {
    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-fixed"
                />
                <div className="absolute inset-0 bg-black/50" />

                <div className="relative z-10 text-center text-white px-4 animate-fade-in-up">
                    <span className="block text-sm md:text-base font-medium tracking-[0.2em] mb-4 uppercase text-yellow-400">
                        Curated for You
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold font-serif mb-6">
                        Our Collections
                    </h1>
                    <p className="max-w-2xl mx-auto text-gray-200 text-lg font-light">
                        Explore our exclusive range of premium fashion, designed to elevate your style and confidence.
                    </p>
                </div>
            </section>

            {/* Collections Grid */}
            <section className="w-full lg:w-[80%] mx-auto px-4 -mt-20 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {COLLECTIONS.map((collection, index) => (
                        <CollectionCard
                            key={collection.name}
                            index={index}
                            {...collection}
                        />
                    ))}
                </div>
            </section>
        </div>
    )
}
