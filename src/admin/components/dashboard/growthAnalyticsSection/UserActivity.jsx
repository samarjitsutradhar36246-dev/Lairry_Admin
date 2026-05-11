const data = [40, 65, 35, 80, 55, 45, 70];
const days = ["M", "T", "W", "T", "F", "S", "S"];
const todayIndex = new Date().getDay() - 1;

const UserActivity = () => {
  return (
    <div className="glass rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">User Activity</h3>
        <span className="text-xs text-cyan-400">+12%</span>
      </div>

      <div className="flex items-end justify-between h-32 gap-2">
        {data.map((value, index) => (
          <div key={index} className="relative group flex flex-col items-center">
            
            {/* Tooltip */}
            <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition text-xs bg-black px-2 py-1 rounded">
              {value} users
            </div>

            {/* Bar */}
            <div
              className={`w-8 rounded-md transition-all ${
                index === todayIndex
                  ? "bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.6)]"
                  : "bg-cyan-400/50 group-hover:bg-cyan-400"
              }`}
              style={{ height: `${value}px` }}
            />

            <span className="text-xs text-slate-400 mt-2">
              {days[index]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserActivity;
