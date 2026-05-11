import { useEffect, useState } from "react";
import { supabase } from "../../supabase/SupabaseClient";
import GlassContainer from "../common/GlassContainer";

const RecentLoginCard = () => {
  const [logins, setLogins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentLogins = async () => {
      const { data, error } = await supabase
        .from("admin_login_activity")
        .select("admin_name, device_info, login_time")
        .order("login_time", { ascending: false })
        .limit(2);

      if (error) {
        console.log("Error fetching recent logins:", error);
        setLoading(false);
        return;
      }
      setLogins(data || []);
      setLoading(false);
    };

    fetchRecentLogins();
  }, []);

  // Helper to format time nicely
  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  return (
    <GlassContainer>
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-5 h-5 text-blue-500 dark:text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
          Recent Logins
        </h3>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 dark:border-blue-400"></div>
        </div>
      ) : logins.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
          No recent login activity
        </p>
      ) : (
        <div className="space-y-2">
          {logins.map((login, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] ${
                index === 0
                  ? "bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-500/10 dark:to-yellow-600/5 border border-yellow-300 dark:border-yellow-500/20"
                  : index === 1
                  ? "bg-gradient-to-r from-orange-100 to-orange-50 dark:from-orange-500/10 dark:to-orange-600/5 border border-orange-300 dark:border-orange-500/20"
                  : "bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        index === 0
                          ? "bg-yellow-500 dark:bg-yellow-400 shadow-lg shadow-yellow-500/50 dark:shadow-yellow-400/50"
                          : index === 1
                          ? "bg-orange-500 dark:bg-orange-400 shadow-lg shadow-orange-500/50 dark:shadow-orange-400/50"
                          : "bg-blue-500 dark:bg-blue-400 shadow-lg shadow-blue-500/50 dark:shadow-blue-400/50"
                      }`}
                    ></div>
                    <p
                      className={`font-medium truncate ${
                        index === 0
                          ? "text-yellow-700 dark:text-yellow-400"
                          : index === 1
                          ? "text-orange-700 dark:text-orange-400"
                          : "text-blue-700 dark:text-blue-400"
                      }`}
                    >
                      {login.admin_name}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {login.device_info?.browser || "Unknown"}
                    </span>
                    <span className="text-gray-400 dark:text-gray-500">•</span>
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                        />
                      </svg>
                      {login.device_info?.os || "Unknown"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {formatTime(login.login_time)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassContainer>
  );
};

export default RecentLoginCard;