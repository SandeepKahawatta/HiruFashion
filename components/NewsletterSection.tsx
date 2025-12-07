export default function NewsletterSection() {
    return (
        <section className="py-20 bg-black text-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Newsletter</h2>
                <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                    Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
                </p>
                <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                        required
                    />
                    <button
                        type="submit"
                        className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-colors"
                    >
                        Subscribe
                    </button>
                </form>
            </div>
        </section>
    )
}
