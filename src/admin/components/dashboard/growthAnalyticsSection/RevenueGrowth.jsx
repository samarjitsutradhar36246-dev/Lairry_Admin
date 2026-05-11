import { useState } from "react";

const RevenueGrowth = () => {
  const [range, setRange] = useState("6M");

  return (
    <div className="glass rounded-xl p-6 h-full">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg">Revenue Growth</h3>
          <p className="text-xs text-slate-400">
            ARR performance vs Target
          </p>
        </div>

        <div className="flex gap-2 text-xs">
          {["1M", "3M", "6M", "1Y"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-md transition ${
                range === r
                  ? "bg-cyan-400 text-black"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-64">
        <svg viewBox="0 0 500 200" className="w-full h-full">
          {/* Grid */}
          <g stroke="rgba(255,255,255,0.05)">
            <line x1="0" y1="40" x2="500" y2="40" />
            <line x1="0" y1="100" x2="500" y2="100" />
            <line x1="0" y1="160" x2="500" y2="160" />
          </g>

          {/* Projected */}
          <path
            d="M20 150 C 120 140, 220 120, 320 90, 420 70"
            stroke="rgba(148,163,184,0.4)"
            strokeWidth="3"
            fill="none"
            strokeDasharray="6 6"
          />

          {/* Current (animated) */}
          <path
            d="M20 150 C 120 145, 220 100, 320 70, 420 55"
            stroke="#22d3ee"
            strokeWidth="3"
            fill="none"
            style={{
              strokeDasharray: 1000,
              strokeDashoffset: 1000,
              animation: "draw 1.4s ease-out forwards",
            }}
          />

          <circle cx="420" cy="55" r="5" fill="#22d3ee" />
        </svg>

        {/* X-axis */}
        <div className="flex justify-between text-xs text-slate-500 mt-2">
          {["JAN", "FEB", "MAR", "APR", "MAY", "JUN"].map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueGrowth;
