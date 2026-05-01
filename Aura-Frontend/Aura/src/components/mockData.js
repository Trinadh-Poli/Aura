import { Clock, Heart, Home as HomeIcon, Radio, Search, Users } from 'lucide-react';

// --- Mock Data ---
export const trendingData = [
    { id: 1, title: "STAY", artist: "the kid laroi", type: "track", img: "https://placehold.co/150x150/222222/FFFFFF?text=STAY" },
    { id: 2, title: "Woman", artist: "Doja Cat", type: "track", img: "https://placehold.co/150x150/4B0082/FFFFFF?text=Woman" },
    { id: 3, title: "Beggin'", artist: "Maneskin", type: "track", img: "https://placehold.co/150x150/191970/FFFFFF?text=Beggin" },
    { id: 4, title: "Shivers", artist: "Ed Sheeran", type: "track", img: "https://placehold.co/150x150/8B0000/FFFFFF?text=Shivers" },
    { id: 5, title: "Todo De Ti", artist: "Rauw Alejandro", type: "track", img: "https://placehold.co/150x150/483D8B/FFFFFF?text=Todo" },
    { id: 6, title: "Heat Waves", artist: "Glass Animals", type: "track", img: "https://placehold.co/150x150/9400D3/FFFFFF?text=Heat" },
    { id: 7, title: "INDUSTRY BABY", artist: "Lil Nas X", type: "track", img: "https://placehold.co/150x150/000000/FFFFFF?text=LNX" },
    { id: 8, title: "Pepas", artist: "Farruko", type: "track", img: "https://placehold.co/150x150/FFD700/000000?text=Pepas!%20%E2%98%BA" },
    { id: 9, title: "Bad Habits", artist: "Ed Sheeran", type: "track", img: "https://placehold.co/150x150/FF4500/FFFFFF?text=Bad" },
    { id: 10, title: "Stay High", artist: "The Kid Laroi", type: "track", img: "https://placehold.co/150x150/222222/FFFFFF?text=High" },
];

export const madeForYouData = [
    { id: 11, title: "Pepas", artist: "Farruko", type: "mix", img: "https://placehold.co/150x150/FFD700/000000?text=Pepas!%20%E2%98%BA" },
    { id: 12, title: "ElGrandetoto Radio", artist: "Farruko", type: "radio", img: "https://placehold.co/150x150/1C1C1C/ADFF2F?text=Radio%20%E2%99%AA" },
    { id: 13, title: "The Weeknd Mix", artist: "Farruko", type: "mix", img: "https://placehold.co/150x150/8B0000/FFFFFF?text=Weeknd" },
    { id: 14, title: "Mood Booster", artist: "Farruko", type: "mix", img: "https://placehold.co/150x150/FFB6C1/333333?text=Mood%20Booster" },
    { id: 15, title: "Michael Jackson", artist: "Farruko", type: "artist", img: "https://placehold.co/150x150/36454F/FFFFFF?text=MJ%20Hits" },
    { id: 16, title: "Workout Playlist", artist: "Various Artists", type: "playlist", img: "https://placehold.co/150x150/2F4F4F/FFFFFF?text=Gym%20Time" },
];

// --- Navigation Data ---
export const mainNav = [
    { name: 'HOME', icon: HomeIcon, route: '/home' },
    { name: 'BROWSE', icon: Search, route: '/browse' }
];

export const libraryNav = [
    { name: 'RECENTLY PLAYED', icon: Clock, route: '/recent' },
    { name: 'ARTISTS', icon: Users, route: '/artists' },
    { name: 'DASHBOARD', icon: Radio, route: '/artist/dashboard' },
];

export const playlists = [
    { name: 'Your Top Songs 2024', route: '/playlists' },
    { name: 'Discover Weekly', route: '/playlists' },
    { name: 'Chill Vibes Mix', route: '/playlists' },
];