const trendingTopics = [
  { topic: "Time Management", percent: 40 },
  { topic: "Study Tips", percent: 30 },
  { topic: "Career Guidance", percent: 20 },
  { topic: "Stress Management", percent: 10 },
];

const TopTopicsCard = () => {
  return (
    <div className="glass rounded-xl p-6 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <p className="text-xs uppercase tracking-widest text-slate-400">
          Top Topics
        </p>
        <span className="h-6 w-6 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">
          📊
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {trendingTopics.map((item) => (
          <div key={item.topic}>
            <div className="flex justify-between text-xs text-slate-400">
              <span>{item.topic}</span>
              <span>{item.percent}%</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-white/10">
              <div
                className="h-full bg-blue-400 rounded-full shadow-[0_0_16px_rgba(59,130,246,0.6)]"
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopTopicsCard;
