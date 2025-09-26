'use client';

import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Clock,
  Users,
  Star,
  Calendar,
  Filter,
  Search,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TrainingSession, TrainingSessionCard } from '@/components/seances/card';
import { FilterModal } from '@/components/filters/FilterModal';

// Mock data
const trainingSessionsData: TrainingSession[] = [
  {
    id: 1,
    title: "Football Training Session",
    coach: "Boubacar Kebe",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    date: "Mon, 09/29",
    time: "18:00 - 19:00",
    type: "Collective US",
    ageGroup: "6 to 14 years old",
    location: "15600 NW 32nd Ave, Miami Gardens, FL 33054, Miami",
    price: 45.00,
    status: "available"
  },
  {
    id: 2,
    title: "Advanced Football Training",
    coach: "Boubacar Kebe",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    date: "Mon, 09/29",
    time: "19:00 - 20:00",
    type: "Collective US",
    ageGroup: "8 to 14 years old",
    location: "15600 NW 32nd Ave, Miami Gardens, FL 33054, Miami",
    price: 45.00,
    status: "available"
  },
  {
    id: 3,
    title: "Youth Football Development",
    coach: "Sarah Johnson",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=1593&q=80",
    date: "Tue, 09/30",
    time: "17:00 - 18:30",
    type: "Collective US",
    ageGroup: "5 to 12 years old",
    location: "Miami Sports Complex, Downtown Miami",
    price: 40.00,
    status: "available"
  },
  {
    id: 4,
    title: "Professional Football Camp",
    coach: "Marcus Rodriguez",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1466&q=80",
    date: "Wed, 10/01",
    time: "16:00 - 18:00",
    type: "Individual Training",
    ageGroup: "10 to 16 years old",
    location: "Elite Sports Academy, Coral Gables",
    price: 65.00,
    status: "available"
  },
  {
    id: 5,
    title: "Soccer Skills Workshop",
    coach: "Isabella Chen",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    date: "Thu, 10/02",
    time: "15:30 - 17:00",
    type: "Group Session",
    ageGroup: "7 to 13 years old",
    location: "Bayfront Park Soccer Complex, Miami",
    price: 35.00,
    status: "available"
  },
  {
    id: 6,
    title: "Elite Football Bootcamp",
    coach: "David Wilson",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1527871454777-132ad9c91a28?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80",
    date: "Fri, 10/03",
    time: "17:00 - 19:30",
    type: "Intensive Training",
    ageGroup: "12 to 18 years old",
    location: "Miami United Training Facility, Miami",
    price: 75.00,
    status: "available"
  },
  {
    id: 7,
    title: "Youth Soccer Academy",
    coach: "Elena Rodriguez",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    date: "Sat, 10/04",
    time: "09:00 - 11:00",
    type: "Academy Training",
    ageGroup: "8 to 15 years old",
    location: "Soccer Land Park, Los Angeles",
    price: 50.00,
    status: "available"
  },
  {
    id: 8,
    title: "Advanced Goalkeeper Training",
    coach: "Alex Thompson",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    date: "Sun, 10/05",
    time: "14:00 - 16:00",
    type: "Specialized Training",
    ageGroup: "12 to 18 years old",
    location: "Next Level Performance Facility, Los Angeles",
    price: 80.00,
    status: "available"
  }
];

// Dynamic filter generation utility functions
const extractUniqueValues = (array: any[], key: string): string[] => {
  return [...new Set(array.map(item => item[key]).filter(Boolean))];
};

const extractCitiesFromLocation = (sessions: TrainingSession[]): string[] => {
  const cities = sessions.map(session => {
    const locationParts = session.location.split(',').map(part => part.trim());
    return locationParts[locationParts.length - 1]; // Get last part as city
  });
  return [...new Set(cities)].filter(Boolean);
};

const extractPlacesFromLocation = (sessions: TrainingSession[]): string[] => {
  const places = sessions.map(session => {
    const locationParts = session.location.split(',');
    return locationParts[0]?.trim(); // Get first part as place name
  });
  return [...new Set(places)].filter(Boolean);
};

// Generate coaches with avatar data
const generateCoachesWithAvatars = (sessions: TrainingSession[]) => {
  const uniqueCoaches = extractUniqueValues(sessions, 'coach');
  return uniqueCoaches.map(coach => ({
    id: coach,
    name: coach,
    avatar: `https://api.dicebear.com/7.x/avatars/svg?seed=${encodeURIComponent(coach)}`
  }));
};

interface FilterData {
  coaches: { id: string; name: string; avatar: string; }[];
  ages: string[];
  places: string[];
  cities: string[];
  dates: string[];
}

const Page: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<{ [key: string]: string[] }>({});

  // Generate filter data dynamically from trainingSessionsData
  const filterData: FilterData = useMemo(() => {
    return {
      coaches: generateCoachesWithAvatars(trainingSessionsData),
      ages: extractUniqueValues(trainingSessionsData, 'ageGroup').sort(),
      places: extractPlacesFromLocation(trainingSessionsData).sort(),
      cities: extractCitiesFromLocation(trainingSessionsData).sort(),
      dates: extractUniqueValues(trainingSessionsData, 'date').sort()
    };
  }, []);

  // Generate filter tags dynamically based on available data
  const filterTags: string[] = useMemo(() => {
    const availableFilters: string[] = [];

    if (filterData.cities.length > 0) availableFilters.push("City");
    if (filterData.coaches.length > 0) availableFilters.push("Coach name");
    if (filterData.ages.length > 0) availableFilters.push("Age");
    if (filterData.places.length > 0) availableFilters.push("Places");
    if (filterData.dates.length > 0) availableFilters.push("Date");

    return availableFilters;
  }, [filterData]);

  // Filter the sessions based on applied filters
  const filteredSessions = useMemo(() => {
    let filtered = trainingSessionsData;

    // Apply search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(session =>
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.coach.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    Object.entries(appliedFilters).forEach(([filterType, filterValues]) => {
      if (filterValues.length === 0) return;

      filtered = filtered.filter(session => {
        switch (filterType) {
          case 'Coach name':
            return filterValues.includes(session.coach);
          case 'Age':
            return filterValues.includes(session.ageGroup);
          case 'City':
            const sessionCity = extractCitiesFromLocation([session])[0];
            return filterValues.includes(sessionCity);
          case 'Places':
            const sessionPlace = extractPlacesFromLocation([session])[0];
            return filterValues.includes(sessionPlace);
          case 'Date':
            return filterValues.includes(session.date);
          default:
            return true;
        }
      });
    });

    return filtered;
  }, [searchQuery, appliedFilters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterClick = (tag: string) => {
    setActiveFilter(tag);
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-6 animate-in fade-in slide-in-from-top-4 duration-1000">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
            Find a{" "}
            <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text animate-pulse">
              training session
            </span>{" "}
            near you
          </h1>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            <div className="relative group focus-within:scale-105 transition-all duration-300">
              {/* Search Icon */}
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground transition-all duration-300 group-focus-within:left-4"
              />

              {/* Input */}
              <Input
                type="text"
                placeholder="Search by city, coach, or location..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-12 pr-4 py-3 text-lg rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:ring-purple-200 hover:border-primary/50"
              />
            </div>
          </div>


          {/* Filter Tags */}
          <div className="flex flex-wrap justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
            {filterTags.map((tag, index) => {
              const filterCount = getActiveFilterCount(tag);
              return (
                <Button
                  key={tag}
                  variant="outline"
                  className="rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-1 relative hover:shadow-lg hover:border-purple-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleFilterClick(tag)}
                >
                  {tag}
                  {filterCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs bg-purple-600 text-white animate-pulse">
                      {filterCount}
                    </Badge>
                  )}
                </Button>
              );
            })}

            {/* Clear All Filters Button */}
            {getTotalActiveFilters() > 0 && (
              <Button
                variant="ghost"
                onClick={handleClearAllFilters}
                className="rounded-full text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-300 transform hover:scale-105"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All ({getTotalActiveFilters()})
              </Button>
            )}
          </div>

          {/* Active Filters Display */}
          {Object.keys(appliedFilters).length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {Object.entries(appliedFilters).map(([filterType, filters]) =>
                filters.map((filter, index) => (
                  <Badge
                    key={`${filterType}-${index}`}
                    variant="secondary"
                    className="bg-purple-100 text-purple-800 hover:bg-purple-200 transition-all duration-300 hover:scale-105 px-3 py-1 text-sm font-medium"
                  >
                    <span className="mr-2">{filterType}: {filter}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-4 w-4 p-0 hover:bg-purple-200 rounded-full transition-all duration-200"
                      onClick={() => handleRemoveFilter(filterType, filter)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))
              )}
            </div>
          )}

          {/* Results Count */}
          {/* <div className="text-center">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredSessions.length}</span> of{" "}
              <span className="font-semibold text-foreground">{trainingSessionsData.length}</span> training sessions
            </p>
          </div> */}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="container mx-auto px-4 pb-12">
        {filteredSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSessions.map((session, index) => (
              <TrainingSessionCard
                key={session.id}
                session={session}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No sessions found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters to find more training sessions.
              </p>
              <Button onClick={handleClearAllFilters} variant="outline">
                Clear all filters
              </Button>
            </div>
          </div>
        )}

        {/* Load More Button - only show if there are results */}
        {filteredSessions.length > 0 && (
          <div className="text-center mt-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1000">
            <Button
              variant="outline"
              size="lg"
              className="transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg px-8 py-3"
            >
              Load More Sessions
            </Button>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {activeFilter && (
        <FilterModal
          filterType={activeFilter}
          filterData={filterData}
          isOpen={!!activeFilter}
          onClose={() => setActiveFilter(null)}
          onApply={handleFilterApply}
        />
      )}
    </div>
  );
};

export default Page;
