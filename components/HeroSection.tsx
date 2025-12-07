import Link from 'next/link'
import Image from 'next/image'

export default function HeroSection() {
    return (
        <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/hero-bg.png"
                    alt="Fashion Collection"
                    fill
                    className="object-cover object-center"
                    priority
                />
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center text-white px-4 w-full lg:w-[80%] mx-auto animate-fade-in-up">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight">
                    Redefine Your <span className="text-yellow-400">Style</span>
                </h1>
                <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-100">
                    Discover the latest trends in fashion. curated collections for the modern individual. Elevate your wardrobe today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/shop"
                        className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-transform transform hover:scale-105 shadow-lg"
                    >
                        Shop Now
                    </Link>
                    <Link
                        href="/collections"
                        className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-transform transform hover:scale-105"
                    >
                        View Collections
                    </Link>
                </div>
            </div>
        </section>
    )
}
