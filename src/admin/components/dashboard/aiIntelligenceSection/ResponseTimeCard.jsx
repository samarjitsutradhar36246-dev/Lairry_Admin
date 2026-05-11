const ResponseTimeCard = () => {
  return (
    <div className="glass rounded-xl p-6 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <p className="text-xs uppercase tracking-widest text-slate-400">
          Response Time
        </p>
        <span className="h-6 w-6 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">
          ⏱
        </span>
      </div>

      <div className="mt-4">
        <h4 className="text-3xl font-bold text-indigo-400">0.8s</h4>
        <p className="text-xs text-slate-400 mt-1">
          Avg. response time per message
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Messages handled: <span className="text-white">320 / min</span>
        </p>

        {/* Progress bar for throughput */}
        <div className="mt-4 h-2 rounded-full bg-white/10">
          <div
            className="h-full w-[80%] bg-indigo-400 rounded-full shadow-[0_0_18px_rgba(99,102,241,0.6)]"
          />
        </div>
      </div>
    </div>
  );
};

export default ResponseTimeCard;
