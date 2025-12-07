'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProductCard from './ProductCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Product = {
    id?: string
    _id?: string
    name: string
    slug: string
    category?: string
    price: number
    image?: string
    images?: string[]
}

export default function FeaturedCarousel({ products, title }: { products: Product[], title: string }) {
    const [width, setWidth] = useState(0)
    const carousel = useRef<HTMLDivElement>(null)
    const innerCarousel = useRef<HTMLDivElement>(null)
    const [x, setX] = useState(0)

    useEffect(() => {
        if (carousel.current && innerCarousel.current) {
            setWidth(innerCarousel.current.scrollWidth - carousel.current.offsetWidth)
        }
    }, [products])

    const scrollLeft = () => {
        const newX = x + 300
        setX(Math.min(newX, 0))
    }

    const scrollRight = () => {
        const newX = x - 300
        setX(Math.max(newX, -width))
    }

    return (
        <section className="py-12 bg-gray-50 relative group">
            <div className="w-full lg:w-[80%] mx-auto px-4">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
                        <div className="h-1 w-20 bg-black rounded-full"></div>
                    </div>
                    <div className="hidden md:flex gap-2">
                        <button
                            onClick={scrollLeft}
                            disabled={x === 0}
                            className="p-2 rounded-full border border-gray-300 hover:bg-black hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={scrollRight}
                            disabled={x <= -width}
                            className="p-2 rounded-full border border-gray-300 hover:bg-black hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                <motion.div
                    ref={carousel}
                    className="cursor-grab overflow-hidden"
                    whileTap={{ cursor: "grabbing" }}
                >
                    <motion.div
                        ref={innerCarousel}
                        drag="x"
                        dragConstraints={{ right: 0, left: -width }}
                        className="flex gap-6"
                        animate={{ x }}
                        onDragEnd={(e, info) => {
                            setX(Math.min(0, Math.max(x + info.offset.x, -width)))
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        {products.map((product) => (
                            <motion.div
                                key={product.id || product._id}
                                className="min-w-[280px] md:min-w-[320px]"
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
