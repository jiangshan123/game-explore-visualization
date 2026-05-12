import { Filter } from 'lucide-react';

interface StatsOverlayProps {
  selectedGenre: string | null;
  selectedLetter: string | null;
  timeRange: [number, number];
}

export default function StatsOverlay({ selectedGenre, selectedLetter, timeRange }: StatsOverlayProps) {
  const activeFilters = [
    timeRange[0] !== 2000 || timeRange[1] !== 2026,
    selectedGenre !== null,
    selectedLetter !== null,
  ].filter(Boolean).length;

  if (activeFilters === 0) return null;

  return (
    <div className="shrink-0 border-b-2 border-slate-300 bg-sky-50 p-3 text-xs">
      <div className="flex items-center gap-2 text-slate-700 mb-1.5">
        <Filter className="w-3.5 h-3.5 shrink-0" />
        <span className="font-semibold tracking-wide">ACTIVE FILTERS</span>
      </div>

      <div className="space-y-1 text-slate-700 font-medium">
        {(timeRange[0] !== 2000 || timeRange[1] !== 2026) && (
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 shrink-0 rounded-full bg-slate-700" />
            <span>
              Timeline: {timeRange[0]}-{timeRange[1]}
            </span>
          </div>
        )}

        {selectedGenre && (
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 shrink-0 rounded-full bg-slate-700" />
            <span>Genre: {selectedGenre}</span>
          </div>
        )}

        {selectedLetter && (
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 shrink-0 rounded-full bg-slate-700" />
            <span>Letter: {selectedLetter}</span>
          </div>
        )}
      </div>
    </div>
  );
}
