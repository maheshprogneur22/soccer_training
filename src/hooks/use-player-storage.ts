'use client';

import { useState, useEffect } from 'react';

export interface PlayerProfile {
  id: string;
  firstName: string;
  lastName: string;
  birthday: string;
  position: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
  licensed: 'yes' | 'no';
  clubCategory?: string;
  genderCategory: string;
  previousExperience?: string;
  medicalConditions?: string;
  emergencyContact: string;
  emergencyPhone: string;
  avatar?: string;
  createdDate: string;
  gamesPlayed: number;
  goals: number;
  assists: number;
  isActive: boolean;
}

const PLAYERS_STORAGE_KEY = 'playerProfiles';

export const usePlayerStorage = () => {
  const [players, setPlayers] = useState<PlayerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load players from localStorage on mount
  useEffect(() => {
    try {
      const storedPlayers = localStorage.getItem(PLAYERS_STORAGE_KEY);
      if (storedPlayers) {
        const parsedPlayers = JSON.parse(storedPlayers);
        setPlayers(parsedPlayers);
      }
    } catch (error) {
      console.error('Error loading players from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save players to localStorage whenever players change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(players));
      } catch (error) {
        console.error('Error saving players to localStorage:', error);
      }
    }
  }, [players, isLoading]);

  const addPlayer = (playerData: Omit<PlayerProfile, 'id' | 'createdDate' | 'gamesPlayed' | 'goals' | 'assists' | 'isActive'>) => {
    const newPlayer: PlayerProfile = {
      ...playerData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdDate: new Date().toISOString(),
      gamesPlayed: 0,
      goals: 0,
      assists: 0,
      isActive: true,
    };

    setPlayers(prev => [newPlayer, ...prev]);
    return newPlayer;
  };

  const removePlayer = (playerId: string) => {
    setPlayers(prev => prev.filter(player => player.id !== playerId));
  };

  const updatePlayer = (playerId: string, updates: Partial<PlayerProfile>) => {
    setPlayers(prev => 
      prev.map(player => 
        player.id === playerId 
          ? { ...player, ...updates }
          : player
      )
    );
  };

  const getPlayer = (playerId: string) => {
    return players.find(player => player.id === playerId);
  };

  const clearAllPlayers = () => {
    setPlayers([]);
    localStorage.removeItem(PLAYERS_STORAGE_KEY);
  };

  return {
    players,
    isLoading,
    addPlayer,
    removePlayer,
    updatePlayer,
    getPlayer,
    clearAllPlayers,
  };
};
