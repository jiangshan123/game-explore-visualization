import { useMemo, useState, useEffect, useRef } from 'react';
import { Star, Calendar, Sparkles, ArrowUp } from 'lucide-react';
import type { Game } from '../data/gameData';
import { genres } from '../data/gameData';
import type { SortOption } from './SortControls';

interface GameGridProps {
  games: Game[];
  selectedGame: Game | null;
  selectedGenre: string | null;
  hoveredGame: string | null;
  sortBy: SortOption;
  onGameClick: (game: Game) => void;
  onGameHover: (gameId: string | null) => void;
}

export default function GameGrid({
  games,
  selectedGame,
  selectedGenre,
  hoveredGame,
  sortBy,
  onGameClick,
  onGameHover,
}: GameGridProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const genreColorMap = useMemo(() => {
    const map: { [key: string]: string } = {};
    genres.forEach((g) => (map[g.name] = g.color));
    return map;
  }, []);

  // Sort games based on selected option
  const sortedGames = useMemo(() => {
    const sorted = [...games];

    switch (sortBy) {
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'year-new':
        return sorted.sort((a, b) => b.year - a.year);
      case 'year-old':
        return sorted.sort((a, b) => a.year - b.year);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  }, [games, sortBy]);

  // Handle scroll to show/hide back to top button
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setShowScrollTop(container.scrollTop > 500);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div ref={scrollContainerRef} className="size-full overflow-y-auto overflow-x-hidden custom-scrollbar relative bg-slate-100">
      {/* Grid Container */}
      <div className="px-4 py-6 grid grid-cols-8 gap-3">
        {sortedGames.map((game) => {
          const genreColor = genreColorMap[game.genre] || '#64748b';
          const isSelected = selectedGame?.id === game.id;
          const isRelated = selectedGame && selectedGame.similar.includes(game.id);
          const isHovered = hoveredGame === game.id;
          const shouldDim = selectedGame && !isSelected && !isRelated;

          return (
            <button
              key={game.id}
              onClick={() => onGameClick(game)}
              onMouseEnter={() => onGameHover(game.id)}
              onMouseLeave={() => onGameHover(null)}
              className={`
                group relative bg-white rounded-xl overflow-hidden
                border-2 transition-all duration-300 transform shadow-md
                ${isSelected
                  ? 'border-slate-900 shadow-xl scale-105 z-20'
                  : isRelated
                  ? 'border-sky-500 shadow-lg scale-102'
                  : isHovered
                  ? 'border-slate-700 shadow-lg scale-105'
                  : 'border-slate-300 hover:border-slate-500 hover:shadow-lg'
                }
                ${shouldDim ? 'opacity-30' : 'opacity-100'}
                hover:scale-105 hover:z-10
              `}
            >
              {/* Game Cover */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={game.cover}
                  alt={game.name}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                {/* Rating Badge */}
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-amber-500 rounded-full px-2 py-1 shadow-lg">
                  <Star className="w-3 h-3 text-white fill-white" />
                  <span className="text-xs font-black text-white">{game.rating}</span>
                </div>

                {/* Genre Badge */}
                <div
                  className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold shadow-lg"
                  style={{
                    backgroundColor: genreColor,
                    color: '#fff',
                  }}
                >
                  {game.genre}
                </div>

                {/* Year Badge */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-slate-900 rounded px-2 py-1 shadow-lg">
                  <Calendar className="w-3 h-3 text-white" />
                  <span className="text-xs font-bold text-white">{game.year}</span>
                </div>
              </div>

              {/* Game Info */}
              <div className="p-2.5 relative bg-white">
                <h3 className="font-bold text-sm text-slate-900 line-clamp-2 mb-1 leading-tight">
                  {game.name}
                </h3>

                <p className="text-xs text-slate-700 font-semibold truncate">
                  {game.developer}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {sortedGames.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="w-24 h-24 rounded-full bg-slate-200 border-4 border-slate-400 flex items-center justify-center mb-4">
            <Sparkles className="w-12 h-12 text-slate-700" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">No Games Found</h3>
          <p className="text-slate-700 text-base font-bold">
            Try adjusting your filters to see more games
          </p>
        </div>
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-20 bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* Scroll Indicator */}
      {sortedGames.length > 20 && !showScrollTop && (
        <div className="sticky bottom-4 left-0 right-0 flex justify-center pointer-events-none">
          <div className="bg-slate-900 rounded-full px-5 py-2 text-sm font-bold text-white animate-bounce shadow-lg">
            ↓ SCROLL FOR MORE ↓
          </div>
        </div>
      )}
    </div>
  );
}
