'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

interface CollectionCardProps {
    name: string
    image: string
    description: string
    itemCount?: string
    index: number
    compact?: boolean
}

export default function CollectionCard({ name, image, description, itemCount, index, compact = false }: CollectionCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`group relative w-full overflow-hidden rounded-[24px] cursor-pointer ${compact ? 'h-[250px] md:h-[300px]' : 'h-[300px] md:h-[400px]'}`}
        >
            <Link href={`/category/${name.toLowerCase()}`}>
                {/* Background Image */}
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                {/* Content */}
                <div className={`absolute inset-0 flex flex-col justify-end ${compact ? 'p-4' : 'p-8'}`}>
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        {/* Header Row */}
                        <div className="flex justify-between items-end mb-2">
                            <h3 className={`${compact ? 'text-xl md:text-2xl' : 'text-3xl md:text-4xl'} font-bold text-white font-serif tracking-wide`}>
                                {name}
                            </h3>
                            {!compact && (
                                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
                                    <ArrowUpRight size={24} />
                                </div>
                            )}
                        </div>

                        {/* Description & Meta */}
                        <div className="overflow-hidden max-h-0 group-hover:max-h-[100px] transition-all duration-500 ease-in-out">
                            <p className="text-gray-300 text-sm md:text-base mb-4 line-clamp-2">
                                {description}
                            </p>
                            {itemCount && (
                                <span className="inline-block px-3 py-1 rounded-full border border-white/30 text-xs text-white/80">
                                    {itemCount} Items
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}
