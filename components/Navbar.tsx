'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/lib/cart';
import { useAuthClient } from '@/lib/auth-client';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const { count } = useCart();
  const { user, loading, logout } = useAuthClient();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Close drawer whenever route changes
  // (prevents the drawer staying open after navigation)
  // no need for useEffect; simple onClick close on links does the job

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    // optional: send to login page
    router.push('/login');
  };

  return (
    <>
      {/* Top nav */}
      <header className="fixed top-0 left-0 w-full bg-white border-b z-50 shadow-sm">
        <div className="container flex items-center justify-between h-16">
          {/* Hamburger */}
          <button
            aria-label="Open menu"
            aria-controls="sidebar"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="p-2 -ml-2 rounded hover:bg-gray-100 focus:outline-none focus:ring"
          >
            {/* simple hamburger icon */}
            <div className="w-6 h-0.5 bg-black mb-1" />
            <div className="w-6 h-0.5 bg-black mb-1" />
            <div className="w-6 h-0.5 bg-black" />
          </button>

          {/* Brand */}
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Fashion Store
          </Link>

          {/* Right-side quick links */}
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/">Home</Link>
            <Link href="/cart">Cart ({count})</Link>
          </nav>
        </div>
      </header>

      {/* Backdrop */}
      {open && (
        <button
          aria-label="Close menu backdrop"
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* Side drawer */}
      <aside
        id="sidebar"
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 border-r shadow-xl transform transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
      >
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <h2 id="sidebar-title" className="text-base font-semibold">
            Menu
          </h2>
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-1">
          {/* Auth block */}
          {!loading && (
            <div className="mb-3 p-3 rounded-lg bg-gray-50">
              {user ? (
                <>
                  <div className="text-sm text-gray-700">Signed in as</div>
                  <div className="font-medium truncate">{user.name || user.email}</div>
                </>
              ) : (
                <div className="text-sm text-gray-700">You are not signed in</div>
              )}
            </div>
          )}

          {/* Links */}
          <NavItem href="/" label="Home" onClick={() => setOpen(false)} active={pathname === '/'} />
          <NavItem href="/cart" label={`Cart (${count})`} onClick={() => setOpen(false)} active={pathname === '/cart'} />
          <NavItem href="/orders" label="My Orders" onClick={() => setOpen(false)} active={pathname?.startsWith('/orders') ?? false} />
          <NavItem href="/profile" label="Profile" onClick={() => setOpen(false)} active={pathname === '/profile'} />

          <div className="pt-3 border-t mt-3">
            {user ? (
              <button
                className="w-full text-left px-3 py-2 rounded hover:bg-gray-100"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  className="flex-1 text-center px-3 py-2 rounded border hover:bg-gray-50"
                  onClick={() => setOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex-1 text-center px-3 py-2 rounded bg-black text-white hover:bg-gray-800"
                  onClick={() => setOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

function NavItem({
  href,
  label,
  onClick,
  active,
}: {
  href: string;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block px-3 py-2 rounded hover:bg-gray-100 ${
        active ? 'bg-gray-100 font-medium' : ''
      }`}
    >
      {label}
    </Link>
  );
}
