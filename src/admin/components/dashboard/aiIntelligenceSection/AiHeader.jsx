import { Sliders, RefreshCw, Cpu } from "lucide-react";

const AiHeader = () => {
  return (
    <div className="glass rounded-xl p-6 flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-purple-400" />
          AI Model Intelligence
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Real-time inference monitoring and prediction confidence distribution.
        </p>
      </div>

      <div className="flex gap-3 items-center">
        {/* Model Version */}
        <span className="px-3 py-1 rounded-full text-xs bg-purple-500/10 text-purple-400">
          Model v4.2 Active
        </span>

        {/* Switch Model Button */}
        <button className="glass px-4 py-2 rounded-lg text-xs flex items-center gap-2">
          <Cpu size={14} />
          Switch Model
        </button>

        {/* Refresh Button */}
        <button className="glass px-4 py-2 rounded-lg text-xs flex items-center gap-2">
          <RefreshCw size={14} />
          Refresh
        </button>

        {/* Calibrate Button */}
        <button className="glass px-4 py-2 rounded-lg text-xs flex items-center gap-2">
          <Sliders size={14} />
          Calibrate
        </button>
      </div>
    </div>
  );
};

export default AiHeader;
