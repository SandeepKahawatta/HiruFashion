'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuthClient } from './auth-client';
import { toast } from 'sonner';

type WishlistContextType = {
    wishlist: string[];
    addToWishlist: (productId: string) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
    loading: boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuthClient();

    const fetchWishlist = useCallback(async () => {
        if (!user) {
            setWishlist([]);
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('/api/user/wishlist');
            if (res.ok) {
                const products = await res.json();
                setWishlist(products.map((p: any) => p.id));
            }
        } catch (error) {
            console.error('Failed to fetch wishlist', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const addToWishlist = async (productId: string) => {
        if (!user) {
            toast.error('Please login', { description: 'You need to be logged in to add items to your wishlist.' });
            return;
        }

        // Optimistic update
        setWishlist(prev => [...prev, productId]);
        toast.success('Added to wishlist');

        try {
            await fetch('/api/user/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId }),
            });
        } catch (error) {
            console.error('Failed to add to wishlist', error);
            // Revert on error
            setWishlist(prev => prev.filter(id => id !== productId));
            toast.error('Failed to add to wishlist');
        }
    };

    const removeFromWishlist = async (productId: string) => {
        if (!user) return;

        // Optimistic update
        setWishlist(prev => prev.filter(id => id !== productId));
        toast.info('Removed from wishlist');

        try {
            await fetch('/api/user/wishlist', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId }),
            });
        } catch (error) {
            console.error('Failed to remove from wishlist', error);
            // Revert
            setWishlist(prev => [...prev, productId]);
            toast.error('Failed to remove from wishlist');
        }
    };

    const isInWishlist = (productId: string) => wishlist.includes(productId);

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, loading }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
