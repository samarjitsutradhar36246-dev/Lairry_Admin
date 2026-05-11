const notifications = [
  { id: "#NT-101", message: "Spike in login attempts", time: "5m ago", level: "high" },
  { id: "#NT-102", message: "Slow response detected", time: "20m ago", level: "medium" },
  { id: "#NT-103", message: "New feature usage spike", time: "1h ago", level: "low" },
];

const NotificationsCard = () => {
  return (
    <div className="glass rounded-xl p-6 flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <p className="text-xs uppercase tracking-widest text-slate-400">
          Notifications
        </p>
        <span className="px-2 py-1 rounded text-xs bg-indigo-500/10 text-indigo-400">
          {notifications.length} new
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {notifications.map((note) => (
          <div key={note.id} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  note.level === "high"
                    ? "bg-red-400"
                    : note.level === "medium"
                    ? "bg-yellow-400"
                    : "bg-green-400"
                }`}
              />
              <span className="text-slate-300">{note.message}</span>
            </div>
            <span className="text-xs text-slate-500">{note.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsCard;
