import { useState, useEffect } from 'react';
import { Rocket, Sparkles } from 'lucide-react';

export default function WelcomeScreen() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show welcome screen on first visit
    const hasVisited = localStorage.getItem('hasVisitedGameNavigator');
    if (!hasVisited) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('hasVisitedGameNavigator', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg animate-in fade-in duration-500">
      <div className="relative max-w-3xl mx-4">
        {/* Glow effects */}
        <div className="absolute -inset-20 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" />

        <div className="relative bg-[#0a0e27] border-2 border-cyan-500/40 rounded-3xl p-10 shadow-[0_0_80px_rgba(34,211,238,0.4)]">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="relative bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full p-6">
                <Rocket className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Welcome to the Game Universe
          </h1>

          {/* Subtitle */}
          <p className="text-center text-cyan-300/80 text-lg mb-8 font-mono">
            Explore 100 Curated Games Through Space & Time
          </p>

          {/* Description */}
          <div className="bg-white/5 border border-cyan-500/20 rounded-xl p-6 mb-8">
            <p className="text-white/80 text-center leading-relaxed mb-4">
              Navigate through a vast universe of gaming history using our interactive visualization system.
              Discover relationships between games, explore genres, and journey through decades of gaming evolution.
            </p>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-1">100</div>
                <div className="text-xs text-cyan-300/60 font-mono">GAMES</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-1">8</div>
                <div className="text-xs text-purple-300/60 font-mono">GENRES</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400 mb-1">27</div>
                <div className="text-xs text-pink-300/60 font-mono">YEARS</div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-cyan-300 text-sm">Timeline Navigation</h3>
              </div>
              <p className="text-xs text-white/60">
                Explore games across 2000-2026
              </p>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-purple-300 text-sm">Genre Clusters</h3>
              </div>
              <p className="text-xs text-white/60">
                Filter by RPG, FPS, Horror & more
              </p>
            </div>

            <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <h3 className="font-bold text-pink-300 text-sm">Relationship Graph</h3>
              </div>
              <p className="text-xs text-white/60">
                Interactive network visualization
              </p>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-blue-300 text-sm">A-Z Navigator</h3>
              </div>
              <p className="text-xs text-white/60">
                Jump to games by letter
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(34,211,238,0.5)] relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center justify-center gap-2 text-lg">
              <Rocket className="w-5 h-5" />
              BEGIN EXPLORATION
            </span>
          </button>

          {/* Help hint */}
          <p className="text-center text-cyan-300/40 text-xs mt-4 font-mono">
            Click the ? icon anytime for help
          </p>
        </div>
      </div>
    </div>
  );
}
