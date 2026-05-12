export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-20 h-20">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20" />

        {/* Spinning gradient ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 border-r-purple-400 animate-spin" />

        {/* Inner pulsing dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)] animate-pulse" />
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-xl animate-pulse" />
      </div>

      <div className="mt-6 text-cyan-300 font-mono text-sm animate-pulse">
        LOADING GAME UNIVERSE...
      </div>

      <div className="mt-2 flex gap-1">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0.1s' }} />
        <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
      </div>
    </div>
  );
}
