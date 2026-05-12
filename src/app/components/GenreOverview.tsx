import { useMemo } from 'react';
import type { Game } from '../data/gameData';

interface GenreOverviewProps {
  genres: { name: string; count: number; color: string }[];
  selectedGenre: string | null;
  onGenreClick: (genre: string | null) => void;
  games: Game[];
  timeRange: [number, number];
}

export default function GenreOverview({
  genres,
  selectedGenre,
  onGenreClick,
  games,
  timeRange,
}: GenreOverviewProps) {
  const genreCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    genres.forEach((g) => (counts[g.name] = 0));

    games
      .filter((game) => game.year >= timeRange[0] && game.year <= timeRange[1])
      .forEach((game) => {
        if (counts[game.genre] !== undefined) {
          counts[game.genre]++;
        }
      });

    return counts;
  }, [games, genres, timeRange]);

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="text-slate-700 text-sm font-semibold tracking-wider mb-4">GENRE CLUSTERS</div>
      <div className="space-y-2">
        {genres.map((genre) => {
          const isSelected = selectedGenre === genre.name;
          const count = genreCounts[genre.name] || 0;

          return (
            <button
              key={genre.name}
              onClick={() => onGenreClick(isSelected ? null : genre.name)}
              className={`
                w-full p-3 rounded-lg border-2 transition-all relative overflow-hidden group
                ${
                  isSelected
                    ? 'bg-slate-700 border-slate-700 shadow-md'
                    : 'bg-slate-50 border-slate-300 hover:border-slate-400 hover:bg-slate-100'
                }
              `}
            >
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Genre color indicator */}
                  <div
                    className="w-4 h-4 rounded-full shadow-md border-2 border-white"
                    style={{
                      backgroundColor: genre.color,
                    }}
                  />
                  <span className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-700'}`}>{genre.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-700'}`}>{count}</span>
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse shadow-md" />
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-2.5 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(count / 50) * 100}%`,
                    backgroundColor: genre.color,
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {selectedGenre && (
        <button
          onClick={() => onGenreClick(null)}
          className="w-full mt-4 px-3 py-2 text-sm font-semibold bg-slate-200 border border-slate-300 rounded hover:bg-slate-300 transition-colors text-slate-700"
        >
          CLEAR FILTER
        </button>
      )}
    </div>
  );
}
