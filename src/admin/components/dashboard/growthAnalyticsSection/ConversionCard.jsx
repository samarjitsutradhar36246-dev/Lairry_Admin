import { useEffect, useState } from "react";

const ConversionCard = () => {
  const [progress, setProgress] = useState(0);
  const conversion = 38; // 3.8%

  useEffect(() => {
    setTimeout(() => setProgress(conversion), 300);
  }, []);

  return (
    <div className="glass rounded-xl p-6 flex justify-between items-center group">
      
      <div>
        <h3 className="font-semibold">Conversion</h3>
        <p className="text-xs text-slate-400 mb-3">
          Visit to Signup
        </p>

        <p className="text-3xl font-bold">5%</p>
        <p className="text-xs text-cyan-400 mt-1">
          ↑ +0.4% this week
        </p>
      </div>

      {/* Radial */}
      <div className="relative w-20 h-20">
        <svg viewBox="0 0 36 36" className="w-full h-full">
          <path
            d="M18 2 a 16 16 0 0 1 0 32 a 16 16 0 0 1 0 -32"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="3"
          />
          <path
            d="M18 2 a 16 16 0 0 1 0 32 a 16 16 0 0 1 0 -32"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="3"
            strokeDasharray={`${progress} 100`}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center text-cyan-400 text-sm">
          ⚡
        </div>

        {/* Hover info */}
        <div className="absolute top-full mt-2 opacity-0 group-hover:opacity-100 transition text-xs bg-black px-2 py-1 rounded">
          Based on last 7 days
        </div>
      </div>
    </div>
  );
};

export default ConversionCard;
