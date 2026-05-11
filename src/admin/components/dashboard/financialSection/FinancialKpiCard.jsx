// src/admin/components/dashboard/FinancialKpiCard.jsx

const FinancialKpiCard = ({ title, value, delta, note, color = "cyan",compareLabel }) => {
  // Mapping the rich color scales from your first component
  const colorClasses = {
    cyan: {
      light: "from-cyan-50 to-blue-50 border-cyan-200",
      dark: "dark:from-cyan-900/20 dark:to-blue-900/20 dark:border-cyan-700/50",
    },
    yellow: {
      light: "from-yellow-50 to-orange-50 border-yellow-200",
      dark: "dark:from-yellow-900/20 dark:to-orange-900/20 dark:border-yellow-700/50",
    },
    purple: {
      light: "from-purple-50 to-pink-50 border-purple-200",
      dark: "dark:from-purple-900/20 dark:to-pink-900/20 dark:border-purple-700/50",
    },
    green: {
      light: "from-green-50 to-emerald-50 border-green-200",
      dark: "dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-700/50",
    },
    blue: {
      light: "from-blue-50 to-indigo-50 border-blue-200",
      dark: "dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-700/50",
    },
    red: {
      light: "from-red-50 to-pink-50 border-red-200",
      dark: "dark:from-red-900/20 dark:to-pink-900/20 dark:border-red-700/50",
    },
  };

  const colorClass = colorClasses[color] || colorClasses.cyan;

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl border
        bg-gradient-to-br ${colorClass.light} ${colorClass.dark}
        p-5 transition-all duration-300
        hover:shadow-lg dark:hover:shadow-none
        hover:scale-[1.02]
      `}
    >
      {/* Background soft glow pattern from first design */}
      <div className="absolute top-0 right-0 opacity-5 dark:opacity-10 pointer-events-none">
        <div className="h-24 w-24 rounded-full bg-current blur-2xl" />
      </div>

      <div className="relative z-10">
        <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-slate-400 font-medium">
          {title}
        </p>

        <h4 className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">
          {value}
        </h4>

        <div className="flex items-center gap-2 mt-1">
          {/* Glass-style badge for the delta */}
<span className={`
  text-xs font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm
  ${delta?.positive === true ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
  : delta?.positive === false ? "bg-red-500/10 text-red-500 dark:text-red-400"
  : "bg-white/60 dark:bg-gray-800/60 text-gray-500 dark:text-slate-400"}
`}>
  {delta?.value || "—"}
</span>
{compareLabel && (
  <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
    {compareLabel}
  </p>
)}
        </div>

        <p className="text-xs text-gray-500 dark:text-slate-500 mt-3 italic">
          {note}
        </p>
      </div>
    </div>
  );
};

export default FinancialKpiCard;