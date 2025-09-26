'use client';

import { useState, useEffect } from 'react';

interface UseMediaQueryOptions {
  defaultValue?: boolean;
  initializeWithValue?: boolean;
}

/**
 * Custom hook that tracks the state of a media query using the Match Media API
 * @param query - The media query string to track (e.g., "(min-width: 768px)")
 * @param options - Optional configuration object
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(
  query: string,
  options: UseMediaQueryOptions = {}
): boolean {
  const {
    defaultValue = false,
    initializeWithValue = true
  } = options;

  const [matches, setMatches] = useState<boolean>(() => {
    if (!initializeWithValue) {
      return defaultValue;
    }

    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    // Ensure we're in browser environment
    if (typeof window === 'undefined') {
      return;
    }

    const media = window.matchMedia(query);

    // Update state if current value doesn't match media query
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    // Create event listener function
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add event listener
    media.addEventListener('change', handleChange);

    // Cleanup function to remove event listener
    return () => {
      media.removeEventListener('change', handleChange);
    };
  }, [query, matches]);

  return matches;
}

// Export additional utility hooks for common breakpoints
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
export const useIsLargeDesktop = () => useMediaQuery('(min-width: 1440px)');

// Responsive breakpoint utilities
export const useBreakpoint = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  const isLargeDesktop = useIsLargeDesktop();

  if (isLargeDesktop) return 'xl';
  if (isDesktop) return 'lg';
  if (isTablet) return 'md';
  if (isMobile) return 'sm';
  return 'xs';
};

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
