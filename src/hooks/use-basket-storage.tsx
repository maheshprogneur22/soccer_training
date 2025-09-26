'use client';

import { useState, useEffect } from 'react';

export interface BasketItem {
  id: string;
  title: string;
  coach: string;
  image: string;
  date: string;
  time: string;
  location: string;
  price: number;
  type: string;
  ageGroup: string;
  rating: number;
  addedDate: string;
}

const BASKET_STORAGE_KEY = 'basketItems';

export const useBasketStorage = () => {
  const [basketItems, setBasketItems] = useState<BasketItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load basket items from localStorage on mount
  useEffect(() => {
    try {
      const storedItems = localStorage.getItem(BASKET_STORAGE_KEY);
      if (storedItems) {
        const parsedItems = JSON.parse(storedItems);
        setBasketItems(parsedItems);
      }
    } catch (error) {
      console.error('Error loading basket items from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save basket items to localStorage whenever items change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(basketItems));
      } catch (error) {
        console.error('Error saving basket items to localStorage:', error);
      }
    }
  }, [basketItems, isLoading]);

  const addToBasket = (item: Omit<BasketItem, 'addedDate'>) => {
    // Check if item already exists
    const existingItem = basketItems.find(basketItem => basketItem.id === item.id);
    
    if (existingItem) {
      // Item already in basket, don't add again
      return false;
    }

    const newItem: BasketItem = {
      ...item,
      addedDate: new Date().toISOString(),
    };

    setBasketItems(prev => [newItem, ...prev]);
    return true;
  };

  const removeFromBasket = (itemId: string) => {
    setBasketItems(prev => prev.filter(item => item.id !== itemId));
  };

  const clearBasket = () => {
    setBasketItems([]);
    localStorage.removeItem(BASKET_STORAGE_KEY);
  };

  const isInBasket = (itemId: string) => {
    return basketItems.some(item => item.id === itemId);
  };

  const getBasketTotal = () => {
    return basketItems.reduce((total, item) => total + item.price, 0);
  };

  const getBasketCount = () => {
    return basketItems.length;
  };

  return {
    basketItems,
    isLoading,
    addToBasket,
    removeFromBasket,
    clearBasket,
    isInBasket,
    getBasketTotal,
    getBasketCount,
  };
};
