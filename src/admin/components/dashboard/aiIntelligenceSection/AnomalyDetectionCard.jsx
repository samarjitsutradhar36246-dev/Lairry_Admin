const anomalies = [
  { id: "#AX-992", time: "2m ago", level: "high" },
  { id: "#AX-991", time: "15m ago", level: "medium" },
];

const AnomalyDetectionCard = () => {
  return (
    <div className="glass rounded-xl p-6 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center">
          <p className="text-xs uppercase tracking-widest text-slate-400">
            Anomaly Detections
          </p>
          <span className="px-2 py-1 rounded text-xs bg-red-500/10 text-red-400">
            4 new
          </span>
        </div>

        <h4 className="text-3xl font-bold mt-4">24</h4>
        <p className="text-xs text-slate-400 mt-1">
          Unusual patterns in login vectors detected.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {anomalies.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  item.level === "high"
                    ? "bg-red-400"
                    : "bg-orange-400"
                }`}
              />
              <span className="text-slate-300">ID: {item.id}</span>
            </div>
            <span className="text-xs text-slate-500">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnomalyDetectionCard;
