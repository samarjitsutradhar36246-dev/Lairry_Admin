const ReadinessScoreCard = () => {
  return (
    <div className="glass rounded-xl p-6 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <p className="text-xs uppercase tracking-widest text-slate-400">
          Readiness Score
        </p>
        <span className="h-6 w-6 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs">
          ✓
        </span>
      </div>

      <div className="mt-4">
        <h4 className="text-3xl font-bold text-purple-400">98.4%</h4>

        {/* Progress */}
        <div className="mt-4 h-2 rounded-full bg-white/10">
          <div className="h-full w-[98%] bg-purple-500 rounded-full shadow-[0_0_18px_rgba(168,85,247,0.6)]" />
        </div>

        <p className="text-xs text-slate-400 mt-4">
          Latency: <span className="text-white">12ms</span> · Throughput:
          <span className="text-white"> 4.2k req/s</span>
        </p>
      </div>
    </div>
  );
};

export default ReadinessScoreCard;
