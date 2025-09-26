'use client';

import React from 'react';
import { Plus, Users, Trophy, Target, Zap, Search, Calendar, ChevronRight, Trash2 } from 'lucide-react';
// import { useLocalStorage } from '@/hooks/useLocalStorage';
// import { usePageLogic } from '@/hooks/usePageLogic';
// import { PlayerProfile } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { usePageLogic } from '@/hooks/use-page-logic';
import { PlayerProfile } from '@/hooks/use-player-storage';
import { EmptyStateConfig, PageHeaderConfig, PageLayout, SearchConfig } from '@/components/placeholder/page-layout';

const PlayersPage: React.FC = () => {
  const { 
    data: players, 
    isLoading, 
    removeItem: removePlayer 
  } = useLocalStorage<PlayerProfile>('playerProfiles');

  const {
    filteredData: filteredPlayers,
    isEmpty,
    hasResults,
    searchQuery,
    handleSearchChange,
    navigate
  } = usePageLogic({
    data: players,
    searchFields: ['firstName', 'lastName', 'position', 'skillLevel']
  });

  const handleDeletePlayer = (playerId: string, playerName: string) => {
    if (confirm(`Are you sure you want to remove ${playerName} from the team?`)) {
      removePlayer(playerId);
    }
  };

  const calculateAge = (birthday: string) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'Professional': return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'Advanced': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'Intermediate': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white';
    }
  };

  // Page Configuration
  const headerConfig: PageHeaderConfig = {
    title: "My Player Profiles",
    subtitle: players.length > 0 
      ? `${filteredPlayers.length} player${filteredPlayers.length !== 1 ? 's' : ''}${searchQuery ? ' found' : ''}`
      : 'Manage your team members',
    showBackButton: true,
    backButtonPath: '/dashboard',
    actionButton: {
      label: 'Add Profile',
      icon: <Plus className="mr-2 h-4 w-4" />,
      onClick: () => navigate('/players/new')
    }
  };

  const searchConfig: SearchConfig = {
    placeholder: "Search players by name, position, or skill level...",
    value: searchQuery,
    onChange: handleSearchChange,
    showFilter: true,
    onFilterClick: () => console.log('Filter clicked')
  };

  const emptyStateConfig: EmptyStateConfig = {
    icon: <Users className="h-8 w-8 text-primary-foreground animate-bounce" />,
    title: "Create Your First Player Profile",
    description: "Start building your team by creating player profiles. Track performance, manage details, and organize your squad effectively.",
    actionButton: {
      label: 'Create Player Profile',
      icon: <Plus className="mr-2 h-5 w-5" />,
      onClick: () => navigate('/players/new')
    },
    features: [
      { icon: <Trophy className="h-6 w-6" />, title: "Track Performance" },
      { icon: <Target className="h-6 w-6" />, title: "Set Goals" },
      { icon: <Zap className="h-6 w-6" />, title: "Manage Teams" }
    ]
  };

  // Player Profile Card Component
  const PlayerProfileCard = ({ player, index }: { player: PlayerProfile; index: number }) => (
    <Card className="group relative overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 hover:scale-105 hover:-translate-y-2 cursor-pointer border-border/50 hover:border-primary/30">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <CardHeader className="relative z-10 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16 ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40 group-hover:scale-110">
              <AvatarImage src={player.avatar} alt={`${player.firstName} ${player.lastName}`} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                {player.firstName[0]}{player.lastName[0]}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                {player.firstName} {player.lastName}
              </h3>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  Age {calculateAge(player.birthday)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {player.position}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            <Badge className={`${getSkillLevelColor(player.skillLevel)} font-semibold px-3 py-1 transition-all duration-300 group-hover:scale-110`}>
              {player.skillLevel}
            </Badge>
            {player.isActive && (
              <div className="flex items-center space-x-1 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium">Active</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 pt-0">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-accent/30 rounded-lg transition-all duration-300 group-hover:bg-accent/50">
            <p className="text-2xl font-bold text-foreground">{player.gamesPlayed}</p>
            <p className="text-xs text-muted-foreground">Games</p>
          </div>
          <div className="text-center p-3 bg-accent/30 rounded-lg transition-all duration-300 group-hover:bg-accent/50">
            <p className="text-2xl font-bold text-foreground">{player.goals}</p>
            <p className="text-xs text-muted-foreground">Goals</p>
          </div>
          <div className="text-center p-3 bg-accent/30 rounded-lg transition-all duration-300 group-hover:bg-accent/50">
            <p className="text-2xl font-bold text-foreground">{player.assists}</p>
            <p className="text-xs text-muted-foreground">Assists</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Created {new Date(player.createdDate).toLocaleDateString()}</span>
          </span>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={(e) => {
                e.stopPropagation();
                handleDeletePlayer(player.id, `${player.firstName} ${player.lastName}`);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
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
      {hasResults ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlayers.map((player, index) => (
            <div 
              key={player.id}
              className="animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <PlayerProfileCard player={player} index={index} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No players found</h3>
          <p className="text-muted-foreground">Try adjusting your search terms</p>
        </div>
      )}
    </PageLayout>
  );
};

export default PlayersPage;
