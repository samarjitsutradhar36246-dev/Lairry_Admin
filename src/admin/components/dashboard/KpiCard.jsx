// Example KpiCard component with light/dark mode support
// src/admin/components/dashboard/KpiCard.jsx

const KpiCard = ({ title, value, delta, color = "cyan" }) => {
  // Color mappings for both light and dark modes
  const colorClasses = {
    cyan: {
      light: "from-cyan-50 to-blue-50 border-cyan-200",
      dark: "dark:from-cyan-900/20 dark:to-blue-900/20 dark:border-cyan-700/50",
      text: "text-cyan-600 dark:text-cyan-400",
      icon: "bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400",
    },
    yellow: {
      light: "from-yellow-50 to-orange-50 border-yellow-200",
      dark: "dark:from-yellow-900/20 dark:to-orange-900/20 dark:border-yellow-700/50",
      text: "text-yellow-600 dark:text-yellow-400",
      icon: "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400",
    },
    purple: {
      light: "from-purple-50 to-pink-50 border-purple-200",
      dark: "dark:from-purple-900/20 dark:to-pink-900/20 dark:border-purple-700/50",
      text: "text-purple-600 dark:text-purple-400",
      icon: "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400",
    },
    green: {
      light: "from-green-50 to-emerald-50 border-green-200",
      dark: "dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-700/50",
      text: "text-green-600 dark:text-green-400",
      icon: "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400",
    },
    blue: {
      light: "from-blue-50 to-indigo-50 border-blue-200",
      dark: "dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-700/50",
      text: "text-blue-600 dark:text-blue-400",
      icon: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400",
    },
    red: {
      light: "from-red-50 to-pink-50 border-red-200",
      dark: "dark:from-red-900/20 dark:to-pink-900/20 dark:border-red-700/50",
      text: "text-red-600 dark:text-red-400",
      icon: "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400",
    },
  };

  const colorClass = colorClasses[color] || colorClasses.cyan;

  const getDeltaColor = (delta) => {
    if (delta === "stable" || delta === "0%") 
      return "text-gray-600 dark:text-gray-400";
    if (delta.startsWith("+")) 
      return "text-green-600 dark:text-green-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl border
        bg-gradient-to-br ${colorClass.light} ${colorClass.dark}
        p-6 transition-all duration-300
        hover:shadow-lg dark:hover:shadow-none
        hover:scale-[1.02]
      `}
    >
      {/* Background pattern */}
      <div className="absolute top-0 right-0 opacity-5 dark:opacity-10">
        <div className="h-32 w-32 rounded-full bg-current blur-2xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-4">
        {/* Title */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {title}
          </h3>
          <div className={`rounded-lg p-2 ${colorClass.icon} transition-colors duration-300`}>
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
        </div>

        {/* Value */}
        <div className="flex items-end justify-between">
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          
          {/* Delta badge */}
          {delta && (
            <div
              className={`
                flex items-center gap-1 rounded-full 
                bg-white/80 dark:bg-gray-800/80 
                px-2 py-1 text-xs font-semibold
                ${getDeltaColor(delta)}
                backdrop-blur-sm
              `}
            >
              {delta !== "stable" && delta !== "0%" && (
                <span>{delta.startsWith("+") ? "↑" : "↓"}</span>
              )}
              <span>{delta === "stable" ? "—" : delta}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KpiCard;