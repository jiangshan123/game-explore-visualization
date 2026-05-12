import { ArrowUpDown, Star, Calendar, Type } from 'lucide-react';

export type SortOption = 'rating' | 'year-new' | 'year-old' | 'name';

interface SortControlsProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export default function SortControls({ currentSort, onSortChange }: SortControlsProps) {
  const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
    { value: 'rating', label: 'Rating', icon: <Star className="w-3 h-3" /> },
    { value: 'year-new', label: 'Newest', icon: <Calendar className="w-3 h-3" /> },
    { value: 'year-old', label: 'Oldest', icon: <Calendar className="w-3 h-3" /> },
    { value: 'name', label: 'A-Z', icon: <Type className="w-3 h-3" /> },
  ];

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
        <ArrowUpDown className="w-4 h-4" />
        <span>SORT:</span>
      </div>

      <div className="flex gap-1.5 bg-white rounded-lg p-1 border-2 border-slate-300 shadow-sm">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onSortChange(option.value)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all
              ${
                currentSort === option.value
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
              }
            `}
          >
            {option.icon}
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
