'use client';

import { useState, useEffect } from 'react';

interface UseLocalStorageOptions<T> {
  defaultValue?: T;
  serializer?: {
    serialize: (value: T) => string;
    deserialize: (value: string) => T;
  };
}

export function useLocalStorage<T>(
  key: string,
  options: UseLocalStorageOptions<T> = {}
) {
  const {
    defaultValue,
    serializer = {
      serialize: JSON.stringify,
      deserialize: JSON.parse,
    }
  } = options;

  const [data, setData] = useState<T[]>(() => {
    if (typeof window === 'undefined') {
      return defaultValue as T[] || [];
    }

    try {
      const storedData = localStorage.getItem(key);
      if (storedData) {
        return serializer.deserialize(storedData);
      }
      return defaultValue as T[] || [];
    } catch (error) {
      console.error(`Error loading data from localStorage (${key}):`, error);
      return defaultValue as T[] || [];
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(key, serializer.serialize(data));
      } catch (error) {
        console.error(`Error saving data to localStorage (${key}):`, error);
      }
    }
  }, [data, isLoading, key, serializer]);

  const addItem = (newItem: Omit<T, 'id' | 'createdDate'>) => {
    const itemWithMeta = {
      ...newItem,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdDate: new Date().toISOString(),
    } as T;

    setData(prev => [itemWithMeta, ...prev]);
    return itemWithMeta;
  };

  const removeItem = (itemId: string) => {
    setData(prev => prev.filter((item: any) => item.id !== itemId));
  };

  const updateItem = (itemId: string, updates: Partial<T>) => {
    setData(prev => 
      prev.map((item: any) => 
        item.id === itemId 
          ? { ...item, ...updates }
          : item
      )
    );
  };

  const getItem = (itemId: string) => {
    return data.find((item: any) => item.id === itemId);
  };

  const clearAll = () => {
    setData([]);
    localStorage.removeItem(key);
  };

  const findItems = (predicate: (item: T) => boolean) => {
    return data.filter(predicate);
  };

  const searchItems = (searchQuery: string, searchFields: (keyof T)[]) => {
    if (!searchQuery.trim()) return data;
    
    return data.filter(item => 
      searchFields.some(field => {
        const fieldValue = item[field];
        if (typeof fieldValue === 'string') {
          return fieldValue.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return false;
      })
    );
  };

  return {
    data,
    isLoading,
    addItem,
    removeItem,
    updateItem,
    getItem,
    clearAll,
    findItems,
    searchItems,
    setData
  };
}
