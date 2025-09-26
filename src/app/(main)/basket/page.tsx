'use client';

import React from 'react';
import { 
  ShoppingBag, 
  Sparkles, 
  Calendar, 
  Star, 
  Gift, 
  Plus,
  Search,
  MapPin,
  Clock,
  ExternalLink,
  Trash2,
  CreditCard,
  Shield,
  Truck
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { usePageLogic } from '@/hooks/use-page-logic';
import { EmptyStateConfig, PageHeaderConfig, PageLayout, SearchConfig } from '@/components/placeholder/page-layout';

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
  participants?: number;
}

const BasketPage: React.FC = () => {
  const { 
    data: basketItems, 
    isLoading, 
    removeItem: removeFromBasket,
    clearAll: clearBasket 
  } = useLocalStorage<BasketItem>('basketItems');

  const {
    filteredData: filteredItems,
    isEmpty,
    hasResults,
    searchQuery,
    handleSearchChange,
    navigate
  } = usePageLogic({
    data: basketItems,
    searchFields: ['title', 'coach', 'location', 'type']
  });

  const getTotalPrice = () => {
    return basketItems.reduce((total, item) => total + item.price, 0);
  };

  const getSubtotal = () => {
    return getTotalPrice();
  };

  const getShippingCost = () => {
    return basketItems.length > 0 ? 5.99 : 0; // Flat shipping rate
  };

  const getTaxes = () => {
    return getTotalPrice() * 0.08; // 8% tax rate
  };

  const getFinalTotal = () => {
    return getSubtotal() + getShippingCost() + getTaxes();
  };

  const handleRemoveItem = (itemId: string, itemTitle: string) => {
    if (confirm(`Remove "${itemTitle}" from your basket?`)) {
      removeFromBasket(itemId);
    }
  };

  const handleClearBasket = () => {
    if (confirm('Clear all items from your basket?')) {
      clearBasket();
    }
  };

  const handleCheckout = () => {
    // Implement checkout logic
    alert(`Processing checkout for $${getFinalTotal().toFixed(2)}`);
  };

  // Page Configuration
  const headerConfig: PageHeaderConfig = {
    title: "My Basket",
    subtitle: basketItems.length > 0 
      ? `${filteredItems.length} session${filteredItems.length !== 1 ? 's' : ''}${searchQuery ? ' found' : ''}`
      : 'Your training session basket',
    showBackButton: true,
    backButtonPath: '/training-sessions',
    customActions: basketItems.length > 0 ? (
      <div className="flex items-center space-x-3">
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-xl font-bold text-primary">${getFinalTotal().toFixed(2)}</p>
        </div>
        <Button 
          onClick={handleCheckout}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-6 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Checkout
        </Button>
      </div>
    ) : undefined
  };

  const searchConfig: SearchConfig = {
    placeholder: "Search in your basket...",
    value: searchQuery,
    onChange: handleSearchChange
  };

  const emptyStateConfig: EmptyStateConfig = {
    icon: <ShoppingBag className="h-8 w-8 text-primary-foreground animate-bounce" />,
    title: "Your Basket is Empty",
    description: "Start exploring amazing training sessions and add them to your basket. Don't miss out on great opportunities to improve your skills!",
    actionButton: {
      label: 'Discover Sessions',
      icon: <Sparkles className="mr-2 h-5 w-5" />,
      onClick: () => navigate('/training-sessions')
    },
    features: [
      { icon: <Calendar />, title: "Book Sessions" },
      { icon: <Star />, title: "Top Rated" },
      { icon: <Gift />, title: "Special Offers" }
    ]
  };

  // Basket Item Card Component
  const BasketItemCard = ({ item, index }: { item: BasketItem; index: number }) => (
    <Card className="group relative overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.02] border-border/50 hover:border-primary/20">
      <div className="flex">
        {/* Session Image */}
        <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden rounded-l-lg">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 group-hover:to-black/40 transition-all duration-500"></div>
          
          {/* Price Badge */}
          <div className="absolute top-2 right-2">
            <Badge className="bg-primary text-primary-foreground font-bold px-2 py-1 text-sm shadow-lg">
              ${item.price}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 relative z-10">
          <div className="space-y-3">
            {/* Title and Coach */}
            <div>
              <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
                {item.title}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avatars/svg?seed=${item.coach}`} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {item.coach.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm text-muted-foreground font-medium">{item.coach}</p>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(item.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">({item.rating})</span>
                </div>
              </div>
            </div>

            {/* Session Details */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{item.date}</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{item.time}</span>
              </div>
            </div>

            <div className="flex items-start space-x-1 text-xs">
              <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground line-clamp-2">{item.location}</span>
            </div>

            {/* Badges */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {item.type}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {item.ageGroup}
                </Badge>
                {item.participants && (
                  <Badge variant="outline" className="text-xs">
                    {item.participants} spots
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Added {new Date(item.addedDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col justify-between p-4 border-l border-border/50">
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-110"
              onClick={() => navigate(`/training-sessions/${item.id}`)}
              title="View Details"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all duration-300 hover:scale-110"
              onClick={() => handleRemoveItem(item.id, item.title)}
              title="Remove from Basket"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  // Order Summary Component
  const OrderSummary = () => (
    <Card className="sticky top-24 bg-gradient-to-br from-card/50 to-card border-primary/20 shadow-xl backdrop-blur-sm">
      <CardHeader>
        <h3 className="text-lg font-bold text-foreground flex items-center">
          <ShoppingBag className="mr-2 h-5 w-5 text-primary" />
          Order Summary
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal ({basketItems.length} items)</span>
            <span className="font-medium">${getSubtotal().toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center">
              <Truck className="h-3 w-3 mr-1" />
              Shipping
            </span>
            <span className="font-medium">${getShippingCost().toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Estimated Tax</span>
            <span className="font-medium">${getTaxes().toFixed(2)}</span>
          </div>
        </div>

        <Separator />
        
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">Total</span>
          <span className="text-xl font-bold text-primary">${getFinalTotal().toFixed(2)}</span>
        </div>

        <div className="space-y-3 pt-2">
          <Button 
            onClick={handleCheckout}
            className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-green-200"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Proceed to Checkout
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate('/training-sessions')}
            className="w-full transition-all duration-300 hover:scale-[1.02]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
        </div>

        {/* Security Badges */}
        <div className="pt-4 border-t border-border/50">
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center">
              <Shield className="h-3 w-3 mr-1 text-green-600" />
              Secure Payment
            </div>
            <div className="flex items-center">
              <Truck className="h-3 w-3 mr-1 text-blue-600" />
              Free Cancellation
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <PageLayout
      headerConfig={headerConfig}
      searchConfig={searchConfig}
      emptyStateConfig={emptyStateConfig}
      showSearch={!isEmpty}
      isEmpty={isEmpty}
      isLoading={isLoading}
    >
      {hasResults && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Basket Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Info */}
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-foreground">
                      {basketItems.length} Session{basketItems.length !== 1 ? 's' : ''} in Basket
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Ready to book your training sessions
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">${getTotalPrice().toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">Sessions Total</p>
                    </div>
                    {basketItems.length > 1 && (
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={handleClearBasket}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 transition-all duration-300 hover:scale-105"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Clear All
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Basket Items List */}
            <div className="space-y-4">
              {filteredItems.map((item, index) => (
                <div 
                  key={item.id}
                  className="animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <BasketItemCard item={item} index={index} />
                </div>
              ))}
            </div>

            {/* Mobile Order Summary */}
            <div className="lg:hidden">
              <OrderSummary />
            </div>
          </div>

          {/* Desktop Order Summary */}
          <div className="hidden lg:block">
            <OrderSummary />
          </div>
        </div>
      )}

      {/* No Results State */}
      {!hasResults && !isEmpty && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No sessions found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search terms to find more sessions.
          </p>
          <Button 
            onClick={() => handleSearchChange('')}
            variant="outline"
          >
            Clear Search
          </Button>
        </div>
      )}
    </PageLayout>
  );
};

export default BasketPage;
