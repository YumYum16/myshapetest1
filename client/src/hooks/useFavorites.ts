import { useState, useEffect, useCallback } from 'react';

export interface FavoriteGlasses {
  id: string;
  name: string;
  brand: string;
  price: string;
  rating?: number;
  savedAt: number;
}

const STORAGE_KEY = 'myshape_favorite_glasses';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteGlasses[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavorites(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Failed to load favorites from localStorage:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error('Failed to save favorites to localStorage:', error);
      }
    }
  }, [favorites, isLoaded]);

  const addFavorite = useCallback((glasses: Omit<FavoriteGlasses, 'savedAt'>) => {
    setFavorites((prev) => {
      // Check if already in favorites
      if (prev.some((fav) => fav.id === glasses.id)) {
        return prev;
      }
      return [
        ...prev,
        {
          ...glasses,
          savedAt: Date.now(),
        },
      ];
    });
  }, []);

  const removeFavorite = useCallback((glassesId: string) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== glassesId));
  }, []);

  const isFavorite = useCallback((glassesId: string) => {
    return favorites.some((fav) => fav.id === glassesId);
  }, [favorites]);

  const clearAllFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  const rateFavorite = useCallback((glassesId: string, rating: number) => {
    setFavorites((prev) =>
      prev.map((fav) =>
        fav.id === glassesId ? { ...fav, rating: Math.max(0, Math.min(5, rating)) } : fav
      )
    );
  }, []);

  return {
    favorites,
    isLoaded,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearAllFavorites,
    rateFavorite,
    favoriteCount: favorites.length,
  };
};
