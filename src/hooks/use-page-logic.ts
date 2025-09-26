'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

interface UsePageLogicProps<T> {
  data: T[];
  searchFields: (keyof T)[];
  defaultEmpty?: boolean;
}

export function usePageLogic<T>({ 
  data, 
  searchFields,
  defaultEmpty = false 
}: UsePageLogicProps<T>) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<{[key: string]: string[]}>({});

  const filteredData = useMemo(() => {
    let filtered = data;

    // Apply search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(item => 
        searchFields.some(field => {
          const fieldValue = item[field];
          if (typeof fieldValue === 'string') {
            return fieldValue.toLowerCase().includes(searchQuery.toLowerCase());
          }
          return false;
        })
      );
    }

    // Apply filters (extend this based on your needs)
    Object.entries(appliedFilters).forEach(([filterType, filterValues]) => {
      if (filterValues.length === 0) return;
      // Add filter logic here based on your requirements
    });

    return filtered;
  }, [data, searchQuery, appliedFilters, searchFields]);

  const isEmpty = defaultEmpty || data.length === 0;
  const hasResults = filteredData.length > 0;

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterClick = (filterType: string) => {
    setActiveFilter(filterType);
  };

  const handleFilterApply = (selectedFilters: string[]) => {
    if (activeFilter) {
      setAppliedFilters(prev => ({
        ...prev,
        [activeFilter]: selectedFilters
      }));
    }
  };

  const handleRemoveFilter = (filterType: string, filter: string) => {
    setAppliedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType]?.filter(f => f !== filter) || []
    }));
  };

  const handleClearAllFilters = () => {
    setAppliedFilters({});
    setSearchQuery('');
  };

  const getActiveFilterCount = (filterType: string) => {
    return appliedFilters[filterType]?.length || 0;
  };

  const getTotalActiveFilters = () => {
    return Object.values(appliedFilters).reduce((total, filters) => total + filters.length, 0);
  };

  const navigate = (path: string) => {
    router.push(path);
  };

  return {
    // Data
    filteredData,
    isEmpty,
    hasResults,
    
    // Search & Filter
    searchQuery,
    handleSearchChange,
    activeFilter,
    setActiveFilter,
    handleFilterClick,
    appliedFilters,
    handleFilterApply,
    handleRemoveFilter,
    handleClearAllFilters,
    getActiveFilterCount,
    getTotalActiveFilters,
    
    // Navigation
    navigate,
    router
  };
}
