'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useCart, AddToCartButton } from '@/lib/cart';
import { useAuthClient } from '@/lib/auth-client';
import { useRouter, usePathname } from 'next/navigation';
import { Search, ShoppingBag, Heart, User, Menu, X, LogOut, Package, ChevronDown, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Product = {
  id: string;
  name: string;
  price: number;
  images: string[];
  slug: string;
  category: string;
};

export default function Navbar() {
  const { count } = useCart();
  const { user, loading, logout } = useAuthClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        try {
          const res = await fetch(`/api/products?q=${encodeURIComponent(searchQuery)}&limit=5`);
          if (res.ok) {
            const data = await res.json();
            setSuggestions(data);
            setShowSuggestions(true);
          }
        } catch (error) {
          console.error("Search error", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setShowSuggestions(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    router.push('/login');
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled || isMenuOpen ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
          }`}
      >
        <div className="w-full lg:w-[80%] mx-auto px-4 h-20 flex items-center justify-between">

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-tighter">
            HiruFashion
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8 relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-gray-100 border-transparent focus:bg-white focus:border-gray-300 focus:ring-0 transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              {isSearching && (
                <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" size={16} />
              )}
            </form>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                >
                  <div className="max-h-[400px] overflow-y-auto">
                    {suggestions.map((product) => (
                      <div key={product.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                        <div className="w-12 h-12 relative flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                          <img src={product.images?.[0] || '/placeholder.png'} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${product.slug}`}
                            onClick={() => setShowSuggestions(false)}
                            className="text-sm font-medium text-gray-900 hover:text-black truncate block"
                          >
                            {product.name}
                          </Link>
                          <p className="text-xs text-gray-500">${(product.price / 100).toFixed(2)}</p>
                        </div>
                        <AddToCartButton id={product.id} size="sm" className="!px-3 !py-1.5 !text-xs" />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleSearch}
                    className="w-full p-3 text-sm font-medium text-center text-gray-600 hover:bg-gray-50 hover:text-black transition-colors border-t border-gray-100"
                  >
                    View all results for "{searchQuery}"
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Search Toggle */}
            <button
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search size={22} />
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" className="hidden sm:flex p-2 hover:bg-gray-100 rounded-full transition-colors relative group">
              <Heart size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
              <ShoppingBag size={22} />
              {count > 0 && (
                <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {count}
                </span>
              )}
            </Link>

            {/* Profile Dropdown (Desktop) */}
            <div className="hidden lg:block relative" ref={profileRef}>
              {user ? (
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 hover:bg-gray-100 rounded-full transition-colors border border-transparent hover:border-gray-200"
                >
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={16} />
                    )}
                  </div>
                  <span className="text-sm font-medium max-w-[100px] truncate">{user.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <Link
                  href="/login"
                  className="px-5 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
                >
                  Login
                </Link>
              )}

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isProfileOpen && user && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <User size={16} /> Profile
                    </Link>
                    <Link href="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Package size={16} /> My Orders
                    </Link>
                    <Link href="/wishlist" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Heart size={16} /> Wishlist
                    </Link>
                    <div className="border-t border-gray-50 mt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar (Expandable) */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-gray-100 bg-white overflow-hidden"
            >
              <form onSubmit={handleSearch} className="p-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 border-none focus:ring-2 focus:ring-black/5"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[80%] max-w-sm bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-5 flex items-center justify-between border-b border-gray-100">
                <h2 className="text-xl font-bold">Menu</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-3">
                  <MobileNavLink href="/" icon={<ShoppingBag size={20} />} label="Shop" onClick={() => setIsMenuOpen(false)} />
                  <MobileNavLink href="/new-arrivals" icon={<Package size={20} />} label="New Arrivals" onClick={() => setIsMenuOpen(false)} />
                  <MobileNavLink href="/collections" icon={<Menu size={20} />} label="Collections" onClick={() => setIsMenuOpen(false)} />
                  <div className="my-4 border-t border-gray-100"></div>
                  <MobileNavLink href="/wishlist" icon={<Heart size={20} />} label="Wishlist" onClick={() => setIsMenuOpen(false)} />
                  {user && (
                    <>
                      <MobileNavLink href="/orders" icon={<Package size={20} />} label="My Orders" onClick={() => setIsMenuOpen(false)} />
                      <MobileNavLink href="/profile" icon={<User size={20} />} label="Profile" onClick={() => setIsMenuOpen(false)} />
                    </>
                  )}
                </nav>
              </div>

              <div className="p-5 border-t border-gray-100 bg-gray-50">
                {user ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {user.image ? (
                          <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <User size={20} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <LogOut size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center py-2.5 rounded-xl border border-gray-200 font-medium hover:bg-white transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center py-2.5 rounded-xl bg-black text-white font-medium hover:bg-gray-800 transition-colors"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function MobileNavLink({ href, icon, label, onClick }: { href: string; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-4 px-4 py-3.5 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors font-medium"
    >
      <span className="text-gray-400">{icon}</span>
      {label}
    </Link>
  )
}
