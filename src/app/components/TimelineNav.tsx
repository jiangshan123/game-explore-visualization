import { useState, useRef, useEffect } from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';

interface TimelineNavProps {
  yearDensity: { year: number; count: number }[];
  timeRange: [number, number];
  onTimeRangeChange: (range: [number, number]) => void;
}

export default function TimelineNav({ yearDensity, timeRange, onTimeRangeChange }: TimelineNavProps) {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleBarClick = (data: any) => {
    if (data && data.year) {
      onTimeRangeChange([data.year, data.year]);
    }
  };

  const handleReset = () => {
    onTimeRangeChange([2000, 2026]);
  };

  return (
    <div ref={containerRef} className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-slate-700 text-sm font-semibold tracking-wider">TIMELINE</div>
          <div className="h-4 w-px bg-slate-400" />
          <div className="text-slate-700 text-sm font-semibold">
            {timeRange[0]} - {timeRange[1]}
          </div>
        </div>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 text-xs font-semibold bg-slate-200 border border-slate-300 rounded hover:bg-slate-300 transition-colors text-slate-700"
        >
          RESET
        </button>
      </div>

      <ResponsiveContainer width="100%" height={80}>
        <BarChart
          data={yearDensity}
          onClick={handleBarClick}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <XAxis
            dataKey="year"
            tick={{ fill: '#475569', fontSize: 10, fontFamily: 'sans-serif', fontWeight: '600' }}
            tickLine={false}
            axisLine={{ stroke: '#94a3b8', strokeWidth: 1.5 }}
            interval={2}
          />
          <Bar
            dataKey="count"
            radius={[4, 4, 0, 0]}
            cursor="pointer"
          >
            {yearDensity.map((entry, index) => {
              const isInRange = entry.year >= timeRange[0] && entry.year <= timeRange[1];
              const isSelected = timeRange[0] === timeRange[1] && entry.year === timeRange[0];

              return (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    isSelected
                      ? '#334155'
                      : isInRange
                      ? '#475569'
                      : '#cbd5e1'
                  }
                  opacity={isInRange ? 1 : 0.6}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Range Slider */}
      <div className="flex items-center gap-4 mt-4">
        <div className="flex-1">
          <input
            type="range"
            min={2000}
            max={2026}
            value={timeRange[0]}
            onChange={(e) => {
              const newStart = parseInt(e.target.value);
              if (newStart <= timeRange[1]) {
                onTimeRangeChange([newStart, timeRange[1]]);
              }
            }}
            className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-slate-700 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
          />
        </div>
        <div className="flex-1">
          <input
            type="range"
            min={2000}
            max={2026}
            value={timeRange[1]}
            onChange={(e) => {
              const newEnd = parseInt(e.target.value);
              if (newEnd >= timeRange[0]) {
                onTimeRangeChange([timeRange[0], newEnd]);
              }
            }}
            className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-slate-700 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
          />
        </div>
      </div>
    </div>
  );
}
