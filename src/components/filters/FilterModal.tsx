'use client';

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface FilterData {
  coaches: { id: string; name: string; avatar: string; }[];
  ages: string[];
  places: string[];
  cities: string[];
  dates: string[];
}

interface FilterModalProps {
  filterType: string;
  filterData: FilterData;
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: string[]) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({ 
  filterType, 
  filterData,
  isOpen, 
  onClose, 
  onApply 
}) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const getFilterOptions = () => {
    switch (filterType) {
      case 'Coach name':
        return filterData.coaches;
      case 'Age':
        return filterData.ages.map(age => ({ id: age, name: age }));
      case 'Places':
        return filterData.places.map(place => ({ id: place, name: place }));
      case 'City':
        return filterData.cities.map(city => ({ id: city, name: city }));
      case 'Date':
        return filterData.dates.map(date => ({ id: date, name: date }));
      default:
        return [];
    }
  };

  const handleFilterToggle = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const handleApply = () => {
    onApply(selectedFilters);
    onClose();
    // Reset state after applying
    setSelectedFilters([]);
    setSearchQuery('');
  };

  const handleReset = () => {
    setSelectedFilters([]);
    setSearchQuery('');
  };

  const handleClose = () => {
    onClose();
    setSelectedFilters([]);
    setSearchQuery('');
  };

  const filteredOptions = getFilterOptions().filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const FilterContent = () => (
    <div className="space-y-4">
      {/* Search Input */}
      {(filterType === 'Coach name' || filterType === 'Places' || filterType === 'City') && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${filterType.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 focus:ring-2 focus:ring-purple-200"
          />
        </div>
      )}

      {/* Filter Options */}
      <div className="max-h-80 overflow-y-auto space-y-3">
        {filteredOptions.length > 0 ? (
          filteredOptions.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center space-x-3 p-3 hover:bg-accent rounded-xl transition-all duration-300 cursor-pointer group"
              onClick={() => handleFilterToggle(item.id.toString())}
            >
              <Checkbox
                id={item.id.toString()}
                checked={selectedFilters.includes(item.id.toString())}
                onChange={() => handleFilterToggle(item.id.toString())}
                className="transition-all duration-300 group-hover:scale-110"
              />
              
              {filterType === 'Coach name' && 'avatar' in item && (
                <Avatar className="w-10 h-10 ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40 group-hover:scale-110">
                  <AvatarImage src={item.avatar as string} alt={item.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                    {item.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <label 
                htmlFor={item.id.toString()}
                className="flex-1 text-sm font-medium cursor-pointer transition-colors duration-300 group-hover:text-primary"
              >
                {item.name}
              </label>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No {filterType.toLowerCase()} found</p>
            {searchQuery && (
              <p className="text-xs mt-1">Try a different search term</p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-xl font-bold text-foreground">
              Filter by {filterType.toLowerCase()}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Select the {filterType.toLowerCase()} options you want to filter by.
              {filteredOptions.length > 0 && (
                <span className="block mt-1 text-xs">
                  {filteredOptions.length} option{filteredOptions.length !== 1 ? 's' : ''} available
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden">
            <FilterContent />
          </div>
          
          <div className="flex justify-between pt-4 flex-shrink-0 border-t">
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="transition-all duration-300 hover:scale-105"
            >
              Reset
            </Button>
            <Button 
              onClick={handleApply} 
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-6 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Apply {selectedFilters.length > 0 && `(${selectedFilters.length})`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent className="max-h-[90vh] flex flex-col">
        <DrawerHeader className="text-left border-b flex-shrink-0 pb-4">
          <DrawerTitle className="text-xl font-bold text-foreground">
            Filter by {filterType.toLowerCase()}
          </DrawerTitle>
          <DrawerDescription className="text-muted-foreground">
            Select the {filterType.toLowerCase()} options you want to filter by.
            {filteredOptions.length > 0 && (
              <span className="block mt-1 text-xs">
                {filteredOptions.length} option{filteredOptions.length !== 1 ? 's' : ''} available
              </span>
            )}
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="px-4 py-6 flex-1 overflow-hidden">
          <FilterContent />
        </div>
        
        <DrawerFooter className="flex-row justify-between border-t pt-4 flex-shrink-0">
          <Button 
            variant="outline" 
            onClick={handleReset} 
            className="flex-1 mr-2 transition-all duration-300 hover:scale-105"
          >
            Reset
          </Button>
          <DrawerClose asChild>
            <Button 
              onClick={handleApply} 
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Apply {selectedFilters.length > 0 && `(${selectedFilters.length})`}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
