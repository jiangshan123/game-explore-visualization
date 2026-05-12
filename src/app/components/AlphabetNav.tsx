interface AlphabetNavProps {
  selectedLetter: string | null;
  onLetterClick: (letter: string | null) => void;
}

export default function AlphabetNav({ selectedLetter, onLetterClick }: AlphabetNavProps) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="p-4 border-b-2 border-slate-300">
      <div className="text-slate-700 text-sm font-semibold tracking-wider mb-3">A-Z NAVIGATOR</div>
      <div className="grid grid-cols-7 gap-1.5">
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => onLetterClick(selectedLetter === letter ? null : letter)}
            className={`
              relative h-9 flex items-center justify-center text-sm font-semibold rounded transition-all
              ${
                selectedLetter === letter
                  ? 'bg-slate-700 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
              }
            `}
          >
            {letter}
          </button>
        ))}
      </div>
      {selectedLetter && (
        <button
          onClick={() => onLetterClick(null)}
          className="w-full mt-2 px-2 py-1.5 text-xs font-semibold bg-slate-200 border border-slate-300 rounded hover:bg-slate-300 transition-colors text-slate-700"
        >
          CLEAR
        </button>
      )}
    </div>
  );
}
