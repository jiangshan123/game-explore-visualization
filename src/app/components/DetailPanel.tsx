import { useMemo } from 'react';
import { Star, Calendar, Monitor, User, X } from 'lucide-react';
import type { Game } from '../data/gameData';
import { genres } from '../data/gameData';

interface DetailPanelProps {
  game: Game;
  allGames: Game[];
  onGameClick: (game: Game) => void;
}

export default function DetailPanel({ game, allGames, onGameClick }: DetailPanelProps) {
  const similarGames = useMemo(() => {
    return game.similar
      .map((id) => allGames.find((g) => g.id === id))
      .filter((g): g is Game => g !== undefined)
      .slice(0, 6);
  }, [game, allGames]);

  const genreColor = useMemo(() => {
    return genres.find((g) => g.name === game.genre)?.color || '#64748b';
  }, [game.genre]);

  return (
    <div className="size-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-purple-500/20 bg-gradient-to-r from-purple-900/20 to-cyan-900/20">
        <div className="flex items-center justify-between mb-2">
          <div className="text-cyan-300 text-xs font-mono tracking-wider">GAME DETAILS</div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Cover Image */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-t from-purple-500/50 to-transparent rounded-lg" />
          <img
            src={game.cover}
            alt={game.name}
            className="w-full h-48 object-cover rounded-lg border border-cyan-500/30"
          />
          <div
            className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-mono font-bold text-white shadow-lg"
            style={{
              backgroundColor: genreColor,
              boxShadow: `0 0 15px ${genreColor}80`,
            }}
          >
            {game.genre}
          </div>
        </div>

        {/* Title */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 leading-tight">{game.name}</h2>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 font-mono font-bold">{game.rating}</span>
            <span className="text-white/40 text-sm">/10</span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="space-y-3 bg-white/5 rounded-lg p-3 border border-cyan-500/20">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-white/60">RELEASE</span>
            <span className="ml-auto text-sm font-mono text-white">{game.year}</span>
          </div>
          <div className="h-px bg-white/10" />
          <div className="flex items-center gap-3">
            <Monitor className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-mono text-white/60">PLATFORM</span>
            <span className="ml-auto text-sm font-mono text-white text-right">{game.platform}</span>
          </div>
          <div className="h-px bg-white/10" />
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-pink-400" />
            <span className="text-xs font-mono text-white/60">DEVELOPER</span>
            <span className="ml-auto text-sm font-mono text-white text-right">{game.developer}</span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white/5 rounded-lg p-3 border border-purple-500/20">
          <div className="text-xs font-mono text-cyan-300 mb-2">DESCRIPTION</div>
          <p className="text-sm text-white/80 leading-relaxed">{game.description}</p>
        </div>

        {/* Similar Games Network */}
        {similarGames.length > 0 && (
          <div className="bg-black/40 rounded-lg p-4 border border-cyan-500/30">
            <div className="text-xs font-mono text-cyan-300 mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              SIMILAR GAMES
            </div>
            <div className="space-y-2">
              {similarGames.map((similar) => {
                const similarGenreColor = genres.find((g) => g.name === similar.genre)?.color || '#64748b';

                return (
                  <button
                    key={similar.id}
                    onClick={() => onGameClick(similar)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 transition-all group"
                  >
                    <div className="flex-shrink-0">
                      <img
                        src={similar.cover}
                        alt={similar.name}
                        className="w-12 h-12 object-cover rounded border border-cyan-500/30"
                      />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-sm font-mono text-white truncate group-hover:text-cyan-300 transition-colors">
                        {similar.name}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: similarGenreColor,
                            boxShadow: `0 0 6px ${similarGenreColor}80`,
                          }}
                        />
                        <span className="text-xs font-mono text-white/60">{similar.genre}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-3 h-3 fill-yellow-400" />
                      <span className="text-xs font-mono">{similar.rating}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Connection Visualization */}
            <div className="mt-4 relative h-24 bg-black/40 rounded border border-cyan-500/20 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="100%" height="100%" className="opacity-40">
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                  {similarGames.slice(0, 4).map((_, index) => {
                    const angle = (index / 4) * Math.PI * 2 - Math.PI / 2;
                    const x = 50 + Math.cos(angle) * 35;
                    const y = 50 + Math.sin(angle) * 35;

                    return (
                      <g key={index}>
                        <line
                          x1="50%"
                          y1="50%"
                          x2={`${x}%`}
                          y2={`${y}%`}
                          stroke="url(#lineGradient)"
                          strokeWidth="1"
                          opacity="0.6"
                        />
                        <circle cx={`${x}%`} cy={`${y}%`} r="3" fill={genreColor} opacity="0.8" />
                      </g>
                    );
                  })}
                  <circle cx="50%" cy="50%" r="5" fill="#f0abfc" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
