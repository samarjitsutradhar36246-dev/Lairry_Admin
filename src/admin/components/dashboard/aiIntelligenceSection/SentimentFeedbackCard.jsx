const sentimentData = [
  { label: "Positive", value: 70, color: "bg-green-400" },
  { label: "Neutral", value: 20, color: "bg-yellow-400" },
  { label: "Negative", value: 10, color: "bg-red-400" },
];

const SentimentFeedbackCard = () => {
  return (
    <div className="glass rounded-xl p-6 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <p className="text-xs uppercase tracking-widest text-slate-400">
          Student Feedback
        </p>
        <span className="h-6 w-6 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs">
          ⭐
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <h4 className="text-3xl font-bold text-white">4.5 / 5</h4>
        {sentimentData.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between text-xs text-slate-400">
              <span>{item.label}</span>
              <span>{item.value}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div
                className={`h-full ${item.color} rounded-full shadow-[0_0_16px_rgba(255,255,255,0.2)]`}
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SentimentFeedbackCard;
