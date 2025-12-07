import Navbar from '@/components/Navbar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main className="flex-1 container py-8 pt-24">{children}</main>
            <footer className="border-t py-6 text-center text-sm text-gray-500">© {new Date().getFullYear()} Fashion Store</footer>
        </>
    )
}
