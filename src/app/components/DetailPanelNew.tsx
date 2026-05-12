import { useMemo } from 'react';
import { Star, Calendar, Monitor, User } from 'lucide-react';
import type { Game } from '../data/gameData';
import { genres } from '../data/gameData';
import RelationshipGraph from './RelationshipGraph';

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
      .slice(0, 8);
  }, [game, allGames]);

  const genreColor = useMemo(() => {
    return genres.find((g) => g.name === game.genre)?.color || '#64748b';
  }, [game.genre]);

  return (
    <div className="size-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-purple-500/20 bg-gradient-to-r from-purple-900/20 to-cyan-900/20">
        <div className="text-cyan-300 text-xs font-mono tracking-wider flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          GAME DETAILS
        </div>
      </div>

      {/* Top Section: Game Details */}
      <div className="flex-shrink-0 overflow-y-auto custom-scrollbar">
        <div className="p-4 space-y-4">
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

          {/* Title & Rating */}
          <div>
            <h2 className="text-xl font-bold text-white mb-2 leading-tight">{game.name}</h2>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 font-mono font-bold text-lg">{game.rating}</span>
              <span className="text-white/40 text-sm">/10</span>
            </div>
          </div>

          {/* Info Grid */}
          <div className="space-y-2 bg-white/5 rounded-lg p-3 border border-cyan-500/20">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span className="text-xs font-mono text-white/60">RELEASE</span>
              <span className="ml-auto text-sm font-mono text-white">{game.year}</span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex items-center gap-3">
              <Monitor className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span className="text-xs font-mono text-white/60">PLATFORM</span>
              <span className="ml-auto text-sm font-mono text-white text-right truncate max-w-[180px]">
                {game.platform}
              </span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-pink-400 flex-shrink-0" />
              <span className="text-xs font-mono text-white/60">DEVELOPER</span>
              <span className="ml-auto text-sm font-mono text-white text-right truncate max-w-[180px]">
                {game.developer}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white/5 rounded-lg p-3 border border-purple-500/20">
            <div className="text-xs font-mono text-cyan-300 mb-2">DESCRIPTION</div>
            <p className="text-sm text-white/80 leading-relaxed">{game.description}</p>
          </div>
        </div>
      </div>

      {/* Bottom Section: Relationship Graph */}
      <div className="flex-1 min-h-0 p-4 pt-2">
        <div className="size-full">
          {similarGames.length > 0 ? (
            <RelationshipGraph
              centerGame={game}
              similarGames={similarGames}
              onGameClick={onGameClick}
            />
          ) : (
            <div className="size-full bg-black/40 rounded-lg border border-cyan-500/20 flex items-center justify-center">
              <div className="text-center p-4">
                <div className="text-cyan-300/60 text-sm font-mono mb-2">No similar games found</div>
                <div className="text-white/40 text-xs">
                  This game has no relationship data
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
