const ActiveUsersCard = () => {
  return (
    <div className="glass rounded-xl p-6 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <p className="text-xs uppercase tracking-widest text-slate-400">
          Active Users
        </p>
        <span className="h-6 w-6 rounded bg-green-500/20 text-green-400 flex items-center justify-center text-xs">
          👥
        </span>
      </div>

      <div className="mt-4">
        <h4 className="text-3xl font-bold text-green-400">128</h4>
        <p className="text-xs text-slate-400 mt-1">
          Messages in last hour: <span className="text-white">452</span>
        </p>
        <p className="text-xs text-slate-400 mt-1">
          New users today: <span className="text-white">24</span>
        </p>

        {/* Mini progress bar for engagement */}
        <div className="mt-4 h-2 rounded-full bg-white/10">
          <div className="h-full w-[80%] bg-green-500 rounded-full shadow-[0_0_18px_rgba(72,187,120,0.6)]" />
        </div>
      </div>
    </div>
  );
};

export default ActiveUsersCard;
