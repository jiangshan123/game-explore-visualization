import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import type { Game } from '../data/gameData';

interface SearchBarProps {
  games: Game[];
  onGameSelect: (game: Game) => void;
}

export default function SearchBar({ games, onGameSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    return games
      .filter(game => game.name.toLowerCase().includes(lowerQuery))
      .slice(0, 10)
      .sort((a, b) => {
        // Prioritize exact matches and higher ratings
        const aExact = a.name.toLowerCase().startsWith(lowerQuery);
        const bExact = b.name.toLowerCase().startsWith(lowerQuery);
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        return b.rating - a.rating;
      });
  }, [query, games]);

  const handleSelect = (game: Game) => {
    onGameSelect(game);
    setQuery('');
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search games..."
          className="w-64 bg-white border-2 border-slate-300 rounded-lg pl-10 pr-10 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Results */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-300 rounded-lg shadow-2xl max-h-96 overflow-y-auto z-50">
            <div className="p-2 space-y-1">
              {results.map((game) => (
                <button
                  key={game.id}
                  onClick={() => handleSelect(game)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-sky-50 border-2 border-transparent hover:border-sky-300 transition-all group text-left"
                >
                  <div className="flex-shrink-0">
                    <img
                      src={game.cover}
                      alt={game.name}
                      className="w-10 h-10 object-cover rounded border-2 border-slate-300"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-800 truncate group-hover:text-sky-700 transition-colors">
                      {game.name}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-600 font-medium">{game.genre}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-amber-600 font-semibold">★ {game.rating}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-600 font-medium">{game.year}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {query && results.length === 0 && (
              <div className="p-4 text-center text-slate-500 text-sm font-medium">
                No games found
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
