const bars = [10, 20, 30, 45, 70, 90, 65];

const ConfidenceDistributionCard = () => {
  return (
    <div className="glass rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <p className="text-xs uppercase tracking-widest text-slate-400">
          Confidence Distribution
        </p>
        <span className="text-xs text-slate-500">Last 1h</span>
      </div>

      <div className="flex items-end justify-between h-36 gap-2">
        {bars.map((value, index) => (
          <div
            key={index}
            className={`w-8 rounded-md ${
              index >= 4
                ? "bg-purple-400 shadow-[0_0_16px_rgba(168,85,247,0.6)]"
                : "bg-purple-400/40"
            }`}
            style={{ height: `${value}%` }}
          />
        ))}
      </div>

      <div className="flex justify-between text-xs text-slate-500 mt-3">
        <span>0.4</span>
        <span>0.6</span>
        <span>0.8</span>
        <span>0.95+</span>
      </div>
    </div>
  );
};

export default ConfidenceDistributionCard;
