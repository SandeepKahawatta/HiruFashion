import { Star } from 'lucide-react'

const testimonials = [
    {
        id: 1,
        name: "Sarah M.",
        role: "Fashion Blogger",
        content: "The quality of the clothes is absolutely amazing. I've never felt more confident in my outfits. Highly recommend!",
        rating: 5,
    },
    {
        id: 2,
        name: "James L.",
        role: "Verified Buyer",
        content: "Fast shipping and great customer service. The fit was perfect, exactly as described in the size chart.",
        rating: 5,
    },
    {
        id: 3,
        name: "Emily R.",
        role: "Stylist",
        content: "A curated collection that truly speaks to modern trends. I love the variety and the premium feel of the fabrics.",
        rating: 4,
    },
]

export default function TestimonialSection() {
    return (
        <section className="py-16 bg-white">
            <div className="w-full lg:w-[80%] mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Don't just take our word for it. Here's what our community has to say about their experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex gap-1 mb-4 text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={20} fill={i < testimonial.rating ? "currentColor" : "none"} className={i < testimonial.rating ? "" : "text-gray-300"} />
                                ))}
                            </div>
                            <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                                    {testimonial.name[0]}
                                </div>
                                <div>
                                    <h4 className="font-semibold">{testimonial.name}</h4>
                                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
