import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import { Activity, Building2, Users, IndianRupee } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../../supabase/SupabaseClient";

const growthData = [
  { month: "Aug", institutes: 32,  students: 640,  revenue: 48000  },
  { month: "Sep", institutes: 42,  students: 980,  revenue: 62000  },
  { month: "Oct", institutes: 58,  students: 1340, revenue: 81000  },
  { month: "Nov", institutes: 71,  students: 1820, revenue: 97000  },
  { month: "Dec", institutes: 85,  students: 2200, revenue: 115000 },
  { month: "Jan", institutes: 102, students: 2900, revenue: 134000 },
  { month: "Feb", institutes: 119, students: 3600, revenue: 158000 },
  { month: "Mar", institutes: 138, students: 4400, revenue: 182000 },
];

const TABS = [
  {
    key: "institutes",
    label: "Institutes",
    icon: Building2,
    color: "#22d3ee",
    format: v => v.toLocaleString(),
    yFormat: v => v,
  },
  {
    key: "students",
    label: "Students",
    icon: Users,
    color: "#2dd4bf",
    format: v => v.toLocaleString(),
    yFormat: v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v,
  },
{
  key: "revenue",
  label: "Revenue",
  icon: IndianRupee,
  color: "#a78bfa",
  format: v => v >= 1000 ? `₹${(v / 1000).toFixed(1)}k` : `₹${v}`,
  yFormat: v => v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`,
},
];

const getDelta = (key) => {
  const prev = growthData[growthData.length - 2][key];
  const curr = growthData[growthData.length - 1][key];
  return `+${(((curr - prev) / prev) * 100).toFixed(1)}%`;
};

const getStartDate = (range) => {
  const d = new Date();
  if (range === "1M") d.setMonth(d.getMonth() - 1);
  else if (range === "3M") d.setMonth(d.getMonth() - 3);
  else if (range === "6M") d.setMonth(d.getMonth() - 6);
  else if (range === "1Y") d.setFullYear(d.getFullYear() - 1);
  return d.toISOString();
};

const CustomTooltip = ({ active, payload, label, tab }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgb(15 23 42 / 0.95)", // slate-900 with opacity
      border: `1px solid ${tab.color}44`,
      borderRadius: 10,
      padding: "10px 14px",
      fontSize: 12,
      boxShadow: "0 8px 32px #0008",
    }}>
      <p style={{ color: "#64748b", marginBottom: 6, fontWeight: 600 }}>{label}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: tab.color, display: "inline-block" }} />
        <span style={{ color: "#94a3b8" }}>{tab.label}:</span>
        <span style={{ color: "#f1f5f9", fontWeight: 700 }}>{tab.format(payload[0].value)}</span>
      </div>
    </div>
  );
};

// ── Skeleton ─────────────────────────────────────────────────────────────────
const ChartSkeleton = () => (
  <div className="animate-pulse space-y-4 px-6 pb-6 pt-6">
    <div className="flex gap-8">
      <div className="space-y-2">
        <div className="h-3 w-20 rounded bg-gray-200 dark:bg-slate-700" />
        <div className="h-8 w-28 rounded bg-gray-200 dark:bg-slate-700" />
        <div className="h-4 w-16 rounded-full bg-gray-200 dark:bg-slate-700" />
      </div>
    </div>
    <div className="h-[300px] rounded-xl bg-gray-100 dark:bg-slate-800/60" />
  </div>
);

const GrowthAnalyticsSection = () => {
  const [activeTab, setActiveTab] = useState("institutes");
  const [range, setRange] = useState("6M");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tab = TABS.find(t => t.key === activeTab);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const startDate = getStartDate(range);

      if (activeTab === "revenue") {
        const { data, error } = await supabase.rpc("get_revenue_by_month", {
          p_start: startDate,
        });
        if (error) throw error;
        setChartData((data || []).map(r => ({ month: r.month, revenue: Number(r.revenue) })));

      } else {
        const col = activeTab === "institutes" ? "total_institutes" : "total_students";
        const { data, error } = await supabase.rpc("get_student_institute_growth", {
          p_tab: col,
          p_start: startDate,
        });
        if (error) throw error;
        setChartData((data || []).map(r => ({ month: r.month, [activeTab]: Number(r.value) })));
      }
    } catch (err) {
      console.error("Growth fetch error:", err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [activeTab, range]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const dataKey = activeTab === "revenue" ? "revenue" : activeTab;
  const currentVal = chartData[chartData.length - 1]?.[dataKey];
  const delta = (() => {
    if (chartData.length < 2) return null;
    const curr = chartData[chartData.length - 1]?.[dataKey];
    const prev = chartData[chartData.length - 2]?.[dataKey];
    if (!prev || !curr) return null;
    const pct = (((curr - prev) / prev) * 100).toFixed(1);
    return pct > 0 ? `+${pct}%` : `${pct}%`;
  })();

  return (
    <section className="space-y-6 max-w-7xl mx-auto">

      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-500/10 flex items-center justify-center">
          <Activity size={20} className="text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Growth Analytics</h2>
          <p className="text-sm text-gray-600 dark:text-slate-400">Track platform expansion over time</p>
        </div>
      </div>

      {/* Chart Card */}
      <div className="rounded-2xl border border-gray-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 overflow-hidden shadow-lg dark:shadow-2xl">

        {/* Tab Bar */}
        <div className="flex border-b border-gray-200 dark:border-slate-800">
          {TABS.map(t => {
            const Icon = t.icon;
            const on = activeTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                style={{
                  borderBottom: on ? `2px solid ${t.color}` : "2px solid transparent",
                  color: on ? t.color : undefined,
                  background: on ? t.color + "10" : "transparent",
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold
                  transition-all duration-150 cursor-pointer border-0
                  ${!on ? "text-gray-500 dark:text-slate-600 hover:text-gray-700 dark:hover:text-slate-500" : ""}`}
              >
                <Icon size={15} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Loading */}
        {loading && <ChartSkeleton />}

        {/* Error */}
        {!loading && error && (
          <div className="py-16 flex flex-col items-center gap-3">
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
            <button onClick={fetchData} className="text-xs text-cyan-500 underline cursor-pointer">
              Retry
            </button>
          </div>
        )}

        {/* Chart */}
        {!loading && !error && (
          <>
            {/* Stat + Range Row */}
            <div className="px-6 pt-6 pb-2 flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-end gap-3">
                  <p className="text-4xl font-extrabold text-gray-900 dark:text-white leading-none">
                    {currentVal != null ? tab.format(currentVal) : "—"}
                  </p>
                  {delta && (
                    <span className={`mb-1 text-xs font-bold px-3 py-1 rounded-full
                      ${delta.startsWith("+")
                        ? "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-400/10"
                        : "text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-400/10"}`}>
                      {delta} vs prev month
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-500 mt-2">
                  Latest · {chartData[chartData.length - 1]?.month ?? "—"}
                </p>
              </div>

              {/* Range Pills */}
              <div className="flex gap-1.5 bg-gray-100 dark:bg-slate-800 p-1 rounded-lg border border-gray-200 dark:border-slate-700">
                {["1M", "3M", "6M", "1Y"].map(r => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    style={range === r ? { background: tab.color, color: "#000" } : {}}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer
                      ${range !== r ? "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300" : ""}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Area Chart */}
            <div className="px-4 pb-4 pt-2">
              {chartData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-sm text-gray-400 dark:text-slate-600">No data for this period</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="grad-active" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={tab.color} stopOpacity={0.25} />
                        <stop offset="100%" stopColor={tab.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-slate-800" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: "#6b7280" }} style={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#6b7280" }} style={{ fontSize: 11 }} axisLine={false} tickLine={false} width={48} tickFormatter={tab.yFormat} />
                    <Tooltip content={<CustomTooltip tab={tab} />} />
                    <Area
                      key={`${activeTab}-${range}`}
                      type="monotone"
                      dataKey={dataKey}
                      name={tab.label}
                      stroke={tab.color}
                      strokeWidth={2.5}
                      fill="url(#grad-active)"
                      dot={false}
                      activeDot={{ r: 5, strokeWidth: 0, fill: tab.color }}
                      isAnimationActive={true}
                      animationDuration={400}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/80 flex justify-between items-center">
              <p className="text-xs text-gray-500 dark:text-slate-600">
                {range === "1M" ? "Last month" : range === "3M" ? "Last 3 months" : range === "6M" ? "Last 6 months" : "Last year"} · monthly snapshot
              </p>
              <div className="flex gap-4">
                {TABS.map(t => (
                  <span key={t.key} className="flex items-center gap-1.5 text-xs"
                    style={{ color: activeTab === t.key ? t.color : undefined }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.color, opacity: activeTab === t.key ? 1 : 0.25, display: "inline-block" }} />
                    <span className={activeTab !== t.key ? "text-gray-400 dark:text-slate-700" : ""}>{t.label}</span>
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default GrowthAnalyticsSection;