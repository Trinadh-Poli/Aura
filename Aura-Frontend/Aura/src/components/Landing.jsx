import { Music2, Radio, Sparkles } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import authService from '../services/authService';

export default function Landing() {
    if (authService.isAuthenticated()) {
        return <Navigate to="/home" replace />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-black flex flex-col">
            {/* Header */}
            <header className="p-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Music2 className="w-8 h-8 text-purple-500" />
                        <h1 className="text-3xl font-bold text-white">Aura</h1>
                    </div>
                    <Link
                        to="/login"
                        className="text-white hover:text-purple-400 transition-colors font-medium"
                    >
                        Sign In
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 flex items-center justify-center px-6">
                <div className="max-w-6xl mx-auto text-center">
                    {/* Main Heading */}
                    <div className="mb-8">
                        <h2 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Aura</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-gray-300 mb-4">
                            Your personal music streaming experience
                        </p>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                            Discover millions of songs, create playlists, and enjoy unlimited streaming
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <Link
                            to="/register"
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/50"
                        >
                            Get Started Free
                        </Link>
                        <Link
                            to="/login"
                            className="border-2 border-white hover:bg-white hover:text-black text-white font-bold py-4 px-8 rounded-full transition-all duration-200 transform hover:scale-105"
                        >
                            Log In
                        </Link>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {/* Feature 1 */}
                        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-purple-500 transition-colors">
                            <div className="bg-purple-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                                <Music2 className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">Unlimited Music</h3>
                            <p className="text-gray-400 text-sm">
                                Stream millions of songs from your favorite artists
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-purple-500 transition-colors">
                            <div className="bg-purple-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                                <Sparkles className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">Personalized</h3>
                            <p className="text-gray-400 text-sm">
                                Get recommendations tailored just for you
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-purple-500 transition-colors">
                            <div className="bg-purple-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                                <Radio className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">Always On</h3>
                            <p className="text-gray-400 text-sm">
                                Listen anywhere, anytime, on any device
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="p-6 text-center text-gray-500 text-sm">
                <p>© 2025 Aura. All rights reserved.</p>
            </footer>
        </div>
    );
}
