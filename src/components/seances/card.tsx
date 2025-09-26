'use client'
import React, { useState } from 'react';
import {
    MapPin,
    Clock,
    Users,
    Star,
    Calendar,
    Zap,
    Trophy,
    Target,
    Award,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
interface TrainingSessionCardProps {
    session: TrainingSession;
    index: number;
}
export interface TrainingSession {
  id: number;
  title: string;
  coach: string;
  rating: number;
  image: string;
  date: string;
  time: string;
  type: string;
  ageGroup: string;
  location: string;
  price: number;
  status: string;
  difficulty?: string;
  participants?: number;
  maxParticipants?: number;
  features?: string[];
}
export const TrainingSessionCard: React.FC<TrainingSessionCardProps> = ({ session, index }) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const handleBookSession = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        // Handle booking logic
        console.log(`Booking session ${session.id}`);
    };

    return (
        <div
            className={`group bg-card border border-border rounded-xl overflow-hidden shadow-sm transition-all duration-500 ease-in-out transform hover:shadow-xl hover:scale-105 hover:-translate-y-2 cursor-pointer animate-in fade-in slide-in-from-bottom-4 ${isHovered ? 'ring-2 ring-purple-100' : ''
                }`}
            style={{ animationDelay: `${index * 150}ms` }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Section */}
            <div className="relative overflow-hidden">
                <img
                    src={session.image}
                    alt={session.title}
                    className="w-full h-48 object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                />
                <div className="absolute top-3 right-3">
                    <Badge
                        className={`bg-primary text-primary-foreground animate-pulse hover:animate-bounce transition-all duration-300 ${isHovered ? 'scale-110' : ''
                            }`}
                    >
                        ${session.price}
                    </Badge>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Content Section */}
            <div className="p-6 space-y-4">
                {/* Date and Time */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                        <Calendar className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                        <span className="text-sm font-medium">{session.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                        <Clock className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                        <span className="text-sm font-medium">{session.time}</span>
                    </div>
                </div>

                {/* Type and Age Group Badges */}
                <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="transition-all duration-300 hover:scale-105">
                        {session.type}
                    </Badge>
                    <Badge variant="outline" className="transition-all duration-300 hover:scale-105">
                        {session.ageGroup}
                    </Badge>
                </div>

                {/* Coach Info */}
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                        <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-card-foreground transition-colors duration-300 group-hover:text-primary">
                            {session.coach}
                        </p>
                        <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-3 w-3 transition-all duration-300 delay-${i * 50} ${i < Math.floor(session.rating)
                                            ? 'text-yellow-400 fill-current animate-pulse'
                                            : 'text-muted-foreground'
                                        } group-hover:scale-125`}
                                />
                            ))}
                            <span className="text-xs text-muted-foreground ml-1">{session.rating}</span>
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                    <p className="text-sm text-muted-foreground line-clamp-2 transition-colors duration-300 group-hover:text-card-foreground">
                        {session.location}
                    </p>
                </div>

                {/* Action Button */}
                <Button
                    className="w-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg group-hover:animate-pulse"
                    onClick={handleBookSession}
                >
                    Book Session
                </Button>
            </div>
        </div>
    );
};


export const HorizontalCard: React.FC<TrainingSessionCardProps> = ({ session, index }) => {
  return (
    <div className="group bg-card border border-border rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer animate-in fade-in slide-in-from-right-4 flex"
         style={{ animationDelay: `${index * 150}ms` }}>
      
      {/* Image Section */}
      <div className="relative w-64 flex-shrink-0 overflow-hidden">
        <img 
          src={session.image} 
          alt={session.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20"></div>
        <div className="absolute top-4 left-4">
          <Badge className="bg-primary text-primary-foreground font-bold">
            ${session.price}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-card-foreground mb-1 group-hover:text-primary transition-colors">
                {session.title}
              </h3>
              <p className="text-muted-foreground text-sm">{session.type} • {session.ageGroup}</p>
            </div>
            {/* <Badge variant={session.difficulty === 'Expert' ? 'destructive' : 'secondary'}>
              {session.difficulty}
            </Badge> */}
          </div>

          {/* Coach & Rating */}
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={`https://api.dicebear.com/7.x/avatars/svg?seed=${session.coach}`} />
              <AvatarFallback className="text-xs">{session.coach.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium text-sm">{session.coach}</p>
              <div className="flex items-center space-x-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-3 w-3 ${i < Math.floor(session.rating) ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`} />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">({session.rating})</span>
              </div>
            </div>
          </div>

          {/* Features Pills */}
          <div className="flex flex-wrap gap-2">
            {session.features?.map((feature, i) => (
              <div key={i} className="flex items-center space-x-1 bg-accent rounded-full px-3 py-1">
                <Zap className="h-3 w-3 text-primary" />
                <span className="text-xs text-accent-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{session.time}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{session.participants}/{session.maxParticipants}</span>
              </span>
            </div>
          </div>
          <Button className="px-6 py-2 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-medium hover:scale-105 transition-transform">
            Join Session
          </Button>
        </div>
      </div>
    </div>
  );
};

export const CompactCard: React.FC<TrainingSessionCardProps> = ({ session, index }) => {
  return (
    <div className="group bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer animate-in fade-in zoom-in-95 relative backdrop-blur-sm"
         style={{ animationDelay: `${index * 100}ms` }}>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
      
      {/* Header */}
      <div className="relative p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <div>
              <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs px-2 py-1 mb-1">
                {session.difficulty}
              </Badge>
              <h3 className="text-lg font-bold text-card-foreground line-clamp-1 group-hover:text-primary transition-colors">
                {session.title}
              </h3>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">${session.price}</div>
            <div className="text-xs text-muted-foreground">per session</div>
          </div>
        </div>

        {/* Coach Info */}
        <div className="flex items-center space-x-3 bg-accent/50 rounded-2xl p-3">
          <Avatar className="w-10 h-10 ring-2 ring-primary/20">
            <AvatarImage src={`https://api.dicebear.com/7.x/avatars/svg?seed=${session.coach}`} />
            <AvatarFallback>{session.coach.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-card-foreground text-sm">{session.coach}</p>
            <div className="flex items-center space-x-1">
              <Award className="h-3 w-3 text-yellow-500" />
              <span className="text-xs text-muted-foreground">{session.rating} Rating</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-card-foreground">{session.participants}</div>
            <div className="text-xs text-muted-foreground">joined</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-background/50 rounded-xl p-3">
            <Target className="h-5 w-5 text-primary mx-auto mb-1" />
            <div className="text-xs font-semibold text-card-foreground">{session.type}</div>
          </div>
          <div className="bg-background/50 rounded-xl p-3">
            <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
            <div className="text-xs font-semibold text-card-foreground">{session.time.split(' - ')[0]}</div>
          </div>
          <div className="bg-background/50 rounded-xl p-3">
            <Users className="h-5 w-5 text-primary mx-auto mb-1" />
            <div className="text-xs font-semibold text-card-foreground">{session.ageGroup.split(' ')[0]}-{session.ageGroup.split(' ')[2]}</div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-6 pb-6">
        <Button className="w-full bg-gradient-to-r from-primary via-primary to-primary/80 text-primary-foreground font-bold py-3 rounded-2xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
          Reserve Spot
        </Button>
      </div>
    </div>
  );
};