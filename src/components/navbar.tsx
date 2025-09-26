'use client';

import { useState, useRef, useEffect } from 'react';
import {
    Search,
    User,
    Menu,
    X,
    ChevronDown,
    Settings,
    Star,
    Receipt,
    Calendar,
    Users,
    HelpCircle,
    Shield,
    Mail,
    LogOut,
    Bell,
    ShoppingBag
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import Link from 'next/link';

interface NavbarProps {
    user?: {
        name: string;
        email: string;
        avatar?: string;
    };
}

export const Navbar = ({ user = {
    name: "Sahil Khan",
    email: "sahilk@progneur.com",
    // avatar: "/path/to/avatar.jpg" // Optional
} }: NavbarProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const navigationItems = [
        { name: 'Subscriptions', href: '/subscriptions' },
        { name: 'Support', href: '/support' },
    ];

    const profileMenuItems = [
        {
            section: 'SUBSCRIPTIONS',
            items: [
                { name: 'Subscription offers', icon: Star, href: '/subscription-offers' },
                { name: 'My subscriptions', icon: Calendar, href: '/my-subscriptions' },
            ]
        },
        {
            section: 'COMPTE',
            items: [
                { name: 'General information', icon: Settings, href: '/general-info' },
                { name: 'My player profiles', icon: Users, href: '/players' },
                { name: 'Referral', icon: Star, href: '/referral' },
                { name: 'My favorites', icon: Star, href: '/favorites' },
                { name: 'My receipts', icon: Receipt, href: '/receipts' },
                { name: 'My sessions', icon: Calendar, href: '/sessions' },
            ]
        },
        {
            section: 'GENERAL',
            items: [
                { name: 'Legal notices', icon: Shield, href: '/legal' },
                { name: 'Privacy policy', icon: Shield, href: '/privacy' },
                { name: 'Contact us', icon: Mail, href: '/contact' },
            ]
        }
    ];

    return (
        <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-sm transition-all duration-300 ease-in-out">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo with hover animation */}
                    <div className="flex items-center group">
                        <div className="flex-shrink-0 flex items-center">
                            <div className="w-8 h-8 bg-purple-700 rounded-lg flex items-center justify-center transition-all duration-300 ease-in-out group-hover:bg-purple-700/90 group-hover:scale-110 group-hover:rotate-6">
                                <span className="text-primary-foreground font-bold text-lg transition-transform duration-300 ease-in-out group-hover:scale-110">P</span>
                            </div>
                            <span className="ml-2 text-xl font-bold text-foreground transition-colors duration-300 ease-in-out group-hover:text-purple-700">Playse</span>
                        </div>
                    </div>

                    {/* Desktop Navigation with hover effects */}
                    <nav className="hidden md:block">
                        <div className="flex items-center space-x-8">
                            {navigationItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="relative text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-0.5 group"
                                >
                                    <span className="relative z-10">{item.name}</span>
                                    <div className="absolute inset-0 bg-accent rounded-md scale-0 group-hover:scale-100 transition-transform duration-300 ease-out origin-center"></div>
                                </Link>
                            ))}
                        </div>
                    </nav>

                    {/* Search Bar with Shadcn Input - Purple ring kept */}
                    <div className="hidden md:block flex-1 max-w-md mx-8">
                        <div className="relative">
                            <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all duration-300 ${isSearchFocused ? 'text-primary' : 'text-muted-foreground'}`}>
                                <Search className={`h-4 w-4 transition-all duration-300 ${isSearchFocused ? 'scale-110' : 'scale-100'}`} />
                            </div>
                            <Input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                placeholder="Search by city, place or coach"
                                className={`pl-10 transition-all duration-300 ease-in-out ${isSearchFocused
                                    ? 'ring-2 ring-purple-200 shadow-lg scale-105'
                                    : 'hover:border-primary/50'
                                    }`}
                            />
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center space-x-4">

                        {/* Language Selector with hover effect */}
                        <div className="hidden md:block">
                            <Select defaultValue="en">
                                <SelectTrigger className="w-[80px] text-sm">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">EN</SelectItem>
                                    <SelectItem value="fr">FR</SelectItem>
                                    <SelectItem value="es">ES</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Notifications with Shadcn Button and Badge */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hidden md:flex relative transition-all duration-300 ease-in-out transform hover:scale-110 hover:rotate-12"
                        >
                            <Bell className="h-4 w-4" />
                            <Badge
                                variant="destructive"
                                className="absolute -top-1 -right-1 w-2 h-2 p-0 animate-pulse hover:animate-bounce"
                            />
                        </Button>
                        <Link
                            href={'/basket'}
                            // variant="ghost"
                            // size="icon"
                            className="hidden md:flex relative transition-all duration-300 ease-in-out transform hover:scale-110 hover:rotate-12"
                        >
                            <ShoppingBag className="h-4 w-4" />

                        </Link>

                        {/* Profile Dropdown with Shadcn DropdownMenu - Purple ring kept */}
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="flex items-center space-x-3 h-auto p-1 transition-all duration-300 ease-in-out transform hover:scale-105 focus:ring-2 focus:ring-purple-200"
                                    >
                                        <Avatar className="w-8 h-8 transition-all duration-300 ease-in-out hover:scale-110">
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                            <AvatarFallback className="bg-primary/10 text-primary">
                                                <User className="h-4 w-4" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="hidden md:block text-foreground font-medium">My account</span>
                                        <ChevronDown className="hidden md:block h-4 w-4 text-muted-foreground transition-transform duration-300 data-[state=open]:rotate-180" />
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent
                                    className="w-80 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 ring-1 ring-purple-200 ring-opacity-5"
                                    align="end"
                                >
                                    {/* User Info */}
                                    <div className="flex items-center space-x-3 p-4">
                                        <Avatar className="w-10 h-10">
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                            <AvatarFallback className="bg-primary/10 text-primary">
                                                <User className="h-5 w-5" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">{user.name}</p>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>

                                    <DropdownMenuSeparator />

                                    {/* Menu Sections */}
                                    {profileMenuItems.map((section, sectionIndex) => (
                                        <div key={sectionIndex}>
                                            <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                                {section.section}
                                            </DropdownMenuLabel>
                                            <DropdownMenuGroup>
                                                {section.items.map((item) => (
                                                    <DropdownMenuItem
                                                        key={item.name}
                                                        asChild
                                                        className="transition-all duration-200 ease-in-out transform hover:translate-x-1"
                                                    >
                                                        <Link href={item.href} className="flex items-center">
                                                            <item.icon className="mr-3 h-4 w-4 text-muted-foreground transition-all duration-200 group-hover:text-primary group-hover:scale-110" />
                                                            {item.name}
                                                        </Link>
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                        </div>
                                    ))}

                                    {/* Logout */}
                                    <DropdownMenuItem className="text-destructive focus:text-destructive transition-all duration-200 ease-in-out transform hover:translate-x-1">
                                        <LogOut className="mr-3 h-4 w-4 transition-all duration-200 group-hover:scale-110 group-hover:rotate-12" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Button variant="ghost" className="transition-all duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-0.5">
                                    Sign In
                                </Button>
                                <Button className="transition-all duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg">
                                    Sign Up
                                </Button>
                            </div>
                        )}

                        {/* Mobile Menu Button with animated hamburger */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden transition-all duration-300 ease-in-out transform hover:scale-110 focus:ring-2 focus:ring-purple-200"
                        >
                            <div className="relative w-6 h-6">
                                <Menu className={`h-6 w-6 absolute transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'}`} />
                                <X className={`h-6 w-6 absolute transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'}`} />
                            </div>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu with slide-down animation */}
            <div className={`md:hidden bg-card border-t border-border transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen
                ? 'max-h-screen opacity-100 translate-y-0'
                : 'max-h-0 opacity-0 -translate-y-4'
                }`}>
                <div className="px-4 pt-2 pb-3 space-y-1">

                    {/* Mobile Search with Shadcn Input - Purple ring kept */}
                    <div className={`mb-4 transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} style={{ transitionDelay: '100ms' }}>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-muted-foreground transition-all duration-300" />
                            </div>
                            <Input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by city, place or coach"
                                className="pl-10 focus:ring-2 focus:ring-purple-200"
                            />
                        </div>
                    </div>

                    {/* Mobile Navigation with staggered animations */}
                    {navigationItems.map((item, index) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ease-in-out transform hover:translate-x-2 hover:bg-accent ${isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                                }`}
                            style={{ transitionDelay: `${150 + index * 50}ms` }}
                        >
                            {item.name}
                        </Link>
                    ))}

                    {/* Mobile User Section with fade-in */}
                    {user && (
                        <div className={`pt-4 border-t border-border transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                            }`} style={{ transitionDelay: '300ms' }}>
                            <div className="flex items-center px-3 py-2 hover:bg-accent rounded-lg transition-all duration-200">
                                <Avatar className="w-10 h-10 transition-all duration-300 hover:scale-110">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                        <User className="h-5 w-5" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="ml-3">
                                    <p className="text-base font-medium text-foreground">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
