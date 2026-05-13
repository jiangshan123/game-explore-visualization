import { useState, useCallback, useMemo } from 'react';
import { extendedGames, genres, generateYearDensity } from './data/gameData';
import TimelineNav from './components/TimelineNav';
import AlphabetNav from './components/AlphabetNav';
import GenreOverview from './components/GenreOverview';
import GameGrid from './components/GameGrid';
import GameDetailView from './components/GameDetailView';
import CosmicBackground from './components/CosmicBackground';
import StatsOverlay from './components/StatsOverlay';
import HelpPanel from './components/HelpPanel';
import SearchBar from './components/SearchBar';
import SortControls, { type SortOption } from './components/SortControls';
import type { Game } from './data/gameData';

export default function App() {
  const [timeRange, setTimeRange] = useState<[number, number]>([2000, 2026]);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');

  const filteredGames = useMemo(() => {
    return extendedGames.filter(game => {
      const yearMatch = game.year >= timeRange[0] && game.year <= timeRange[1];
      const letterMatch = !selectedLetter || game.name.charAt(0).toUpperCase() === selectedLetter;
      const genreMatch = !selectedGenre || game.genre === selectedGenre;
      return yearMatch && letterMatch && genreMatch;
    });
  }, [timeRange, selectedLetter, selectedGenre]);

  const handleGameClick = useCallback((game: Game) => {
    setSelectedGame(game);
    setViewMode('detail');
  }, []);

  const handleBackToGrid = useCallback(() => {
    setViewMode('grid');
  }, []);

  const handleGenreClick = useCallback((genre: string | null) => {
    setSelectedGenre(genre);
    setSelectedGame(null);
  }, []);

  const handleLetterClick = useCallback((letter: string | null) => {
    setSelectedLetter(letter);
    setSelectedGame(null);
  }, []);

  const yearDensity = useMemo(() => generateYearDensity(), []);

  // Detail View Mode
  if (viewMode === 'detail' && selectedGame) {
    return (
      <div className="size-full bg-slate-100 text-slate-900 overflow-hidden min-h-0 min-w-0">
        <GameDetailView
          game={selectedGame}
          allGames={extendedGames}
          onGameClick={handleGameClick}
          onBack={handleBackToGrid}
        />
      </div>
    );
  }

  // Grid View Mode
  return (
    <div className="size-full bg-slate-100 text-slate-900 overflow-hidden flex flex-col relative">
      {/* Help Panel */}
      <HelpPanel />

      {/* Header */}
      <div className="relative z-10 px-8 py-6 border-b border-slate-300 bg-gradient-to-r from-sky-50 to-blue-50 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-sky-500 shadow-lg animate-pulse" />
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
            GAME UNIVERSE NAVIGATOR
          </h1>
          <div className="ml-auto flex items-center gap-4">
            <SearchBar games={extendedGames} onGameSelect={handleGameClick} />
            <div className="text-slate-700 text-sm font-semibold">
              {filteredGames.length} GAMES
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-slate-600 text-xs font-medium tracking-wide">
            Information Visualization System v2.0
          </div>
          <SortControls currentSort={sortBy} onSortChange={setSortBy} />
        </div>
      </div>

      {/* Timeline Navigation */}
      <div className="relative z-10 px-8 py-4 border-b border-slate-400 bg-white">
        <TimelineNav
          yearDensity={yearDensity}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />
      </div>

      {/* Main Content Area */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Left Sidebar: Alphabet + Genre */}
        <div className="relative z-10 w-64 border-r border-slate-400 bg-white flex flex-col">
          <StatsOverlay
            selectedGenre={selectedGenre}
            selectedLetter={selectedLetter}
            timeRange={timeRange}
          />
          <AlphabetNav
            selectedLetter={selectedLetter}
            onLetterClick={handleLetterClick}
          />
          <GenreOverview
            genres={genres}
            selectedGenre={selectedGenre}
            onGenreClick={handleGenreClick}
            games={extendedGames}
            timeRange={timeRange}
          />
        </div>

        {/* Center: Game Grid */}
        <div className="relative flex-1">
          <GameGrid
            games={filteredGames}
            selectedGame={null}
            selectedGenre={selectedGenre}
            hoveredGame={hoveredGame}
            sortBy={sortBy}
            onGameClick={handleGameClick}
            onGameHover={setHoveredGame}
          />
        </div>
      </div>
    </div>
  );
}
