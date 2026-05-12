import { useState } from 'react';
import { HelpCircle, X, Clock, Filter, MousePointer, Network, Zap } from 'lucide-react';

export default function HelpPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Help Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 z-30 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 rounded-full p-3 transition-all hover:scale-110 group"
      >
        <HelpCircle className="w-5 h-5 text-cyan-300" />
        <div className="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping opacity-0 group-hover:opacity-100" />
      </button>

      {/* Help Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative bg-[#0a0e27] border border-cyan-500/30 rounded-2xl p-6 max-w-2xl max-h-[80vh] overflow-y-auto shadow-[0_0_60px_rgba(34,211,238,0.3)]">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded-full p-2 transition-all"
            >
              <X className="w-4 h-4 text-red-300" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                GAME UNIVERSE NAVIGATOR
              </h2>
              <p className="text-cyan-300/60 text-sm font-mono">
                Information Visualization System - User Guide
              </p>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {/* Timeline Section */}
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-cyan-500/20 p-2 rounded-lg">
                    <Clock className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-bold text-cyan-300">Timeline Navigation</h3>
                </div>
                <ul className="space-y-2 text-sm text-white/80">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                    <span>View game density by year (2000-2026)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                    <span>Click bars to select specific years</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                    <span>Use sliders to adjust time range</span>
                  </li>
                </ul>
              </div>

              {/* Filters Section */}
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-purple-500/20 p-2 rounded-lg">
                    <Filter className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-bold text-purple-300">Filtering Options</h3>
                </div>
                <ul className="space-y-2 text-sm text-white/80">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5" />
                    <span><strong className="text-purple-300">A-Z Navigator:</strong> Click letters to filter by game name</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5" />
                    <span><strong className="text-purple-300">Genre Clusters:</strong> Select genres to highlight specific types</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5" />
                    <span><strong className="text-purple-300">Combined:</strong> Use multiple filters simultaneously</span>
                  </li>
                </ul>
              </div>

              {/* Grid Interaction */}
              <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-pink-500/20 p-2 rounded-lg">
                    <MousePointer className="w-5 h-5 text-pink-400" />
                  </div>
                  <h3 className="text-lg font-bold text-pink-300">Game Grid Navigation</h3>
                </div>
                <ul className="space-y-2 text-sm text-white/80">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5" />
                    <span><strong className="text-pink-300">Hover:</strong> Preview game info and see platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5" />
                    <span><strong className="text-pink-300">Click:</strong> Select game to view full details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5" />
                    <span><strong className="text-pink-300">Scroll:</strong> Browse through game collection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5" />
                    <span><strong className="text-pink-300">Related games:</strong> Auto-highlighted with cyan glow</span>
                  </li>
                </ul>
              </div>

              {/* Relationships */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-500/20 p-2 rounded-lg">
                    <Network className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-300">Visual Indicators</h3>
                </div>
                <ul className="space-y-2 text-sm text-white/80">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                    <span>Genre badges show game category</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                    <span>Star rating displayed on each card</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                    <span>Year badge shows release date</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                    <span>Cards sorted by rating (highest first)</span>
                  </li>
                </ul>
              </div>

              {/* Quick Tips */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-yellow-500/20 p-2 rounded-lg">
                    <Zap className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h3 className="text-lg font-bold text-yellow-300">Quick Tips</h3>
                </div>
                <ul className="space-y-2 text-sm text-white/80">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5" />
                    <span>Use the detail panel to navigate between similar games</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5" />
                    <span>Check bottom-left stats to see filter impact</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5" />
                    <span>Clear filters anytime to reset view</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-cyan-500/20">
              <p className="text-center text-xs text-cyan-300/40 font-mono">
                Information Visualization Course Project • 2026
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
