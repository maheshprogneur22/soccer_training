'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface PageHeaderConfig {
  title: string;
  subtitle: string;
  showBackButton?: boolean;
  backButtonPath?: string;
  actionButton?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'ghost';
    icon?: React.ReactNode;
  };
  customActions?: React.ReactNode;
}

export interface SearchConfig {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  showFilter?: boolean;
  onFilterClick?: () => void;
}

export interface EmptyStateConfig {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  features?: Array<{
    icon: React.ReactNode;
    title: string;
  }>;
  showDiscoverButton?: boolean;
  discoverButtonText?: string;
  onDiscoverClick?: () => void;
}

interface PageLayoutProps {
  headerConfig: PageHeaderConfig;
  searchConfig?: SearchConfig;
  emptyStateConfig?: EmptyStateConfig;
  showSearch?: boolean;
  isEmpty?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
  customEmptyState?: React.ReactNode;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  headerConfig,
  searchConfig,
  emptyStateConfig,
  showSearch = false,
  isEmpty = false,
  isLoading = false,
  children,
  customEmptyState,
  className = ""
}) => {
  const router = useRouter();

  const handleBackClick = () => {
    if (headerConfig.backButtonPath) {
      router.push(headerConfig.backButtonPath);
    } else {
      router.back();
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Empty State Component
  const EmptyStateComponent = () => {
    if (customEmptyState) {
      return <div>{customEmptyState}</div>;
    }

    if (!emptyStateConfig) return null;

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="relative mb-8">
          {/* Animated background circles */}
          <div className="absolute inset-0 -m-8">
            <div className="w-32 h-32 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full absolute top-0 left-0 animate-pulse"></div>
            <div className="w-24 h-24 bg-gradient-to-r from-primary/15 to-primary/5 rounded-full absolute top-8 right-0 animate-pulse delay-300"></div>
            <div className="w-20 h-20 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full absolute bottom-0 left-8 animate-pulse delay-700"></div>
          </div>
          
          {/* Main illustration */}
          <div className="relative z-10 w-32 h-32 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-full flex items-center justify-center backdrop-blur-sm border border-primary/20 transition-all duration-500 hover:scale-110 hover:shadow-xl hover:shadow-primary/20">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110">
              {emptyStateConfig.icon}
            </div>
          </div>
        </div>
        
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-bold text-foreground animate-in slide-in-from-bottom-2 duration-700 delay-300">
            {emptyStateConfig.title}
          </h2>
          <p className="text-muted-foreground leading-relaxed animate-in slide-in-from-bottom-2 duration-700 delay-500">
            {emptyStateConfig.description}
          </p>
          
          {/* Feature highlights */}
          {emptyStateConfig.features && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 animate-in slide-in-from-bottom-2 duration-700 delay-700">
              {emptyStateConfig.features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-center p-4 rounded-lg bg-accent/50 transition-all duration-300 hover:bg-accent hover:scale-105"
                >
                  <div className="h-6 w-6 text-primary mb-2">{feature.icon}</div>
                  <p className="text-sm font-medium text-center">{feature.title}</p>
                </div>
              ))}
            </div>
          )}
          
          {/* Action Button */}
          {emptyStateConfig.actionButton && (
            <Button 
              onClick={emptyStateConfig.actionButton.onClick}
              className="mt-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-primary/25 animate-in slide-in-from-bottom-2 "
              size="lg"
            >
              {emptyStateConfig.actionButton.icon}
              {emptyStateConfig.actionButton.label}
            </Button>
          )}

          {/* Discover Button */}
          {emptyStateConfig.showDiscoverButton && emptyStateConfig.onDiscoverClick && (
            <Button 
              onClick={emptyStateConfig.onDiscoverClick}
              variant="outline"
              className="mt-4 px-6 py-2 transition-all duration-300 hover:scale-105"
            >
              {emptyStateConfig.discoverButtonText || 'Discover More'}
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {headerConfig.showBackButton && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleBackClick}
                  className="transition-all duration-300 hover:scale-110 hover:bg-accent"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-foreground">{headerConfig.title}</h1>
                <p className="text-sm text-muted-foreground">{headerConfig.subtitle}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {headerConfig.customActions}
              {headerConfig.actionButton && (
                <Button 
                  variant={headerConfig.actionButton.variant || 'default'}
                  onClick={headerConfig.actionButton.onClick}
                  className="transition-all duration-300 transform hover:scale-105"
                >
                  {headerConfig.actionButton.icon}
                  {headerConfig.actionButton.label}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      {showSearch && searchConfig && (
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Input
                placeholder={searchConfig.placeholder}
                value={searchConfig.value}
                onChange={(e) => searchConfig.onChange(e.target.value)}
                className="transition-all duration-300 focus:scale-105 focus:shadow-lg"
              />
            </div>
            {searchConfig.showFilter && searchConfig.onFilterClick && (
              <Button 
                variant="outline" 
                onClick={searchConfig.onFilterClick}
                className="transition-all duration-300 hover:scale-105"
              >
                Filter
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {isEmpty ? (
          <EmptyStateComponent />
        ) : (
          children
        )}
      </div>
    </div>
  );
};
