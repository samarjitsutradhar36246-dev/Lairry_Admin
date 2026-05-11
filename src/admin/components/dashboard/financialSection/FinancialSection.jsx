import { useNavigate } from "react-router-dom";
import FinancialHeader from "./FinancialHeader";
import FinancialKpiCard from "./FinancialKpiCard";
import RecentPayoutsTable from "./RecentPayoutsTable";
import { supabase } from "../../../supabase/SupabaseClient"
import {useState, useEffect, useMemo} from 'react'
import Loading from "../../common/Loading";
import { TrendingUp, ArrowRight } from "lucide-react";

const FinancialSection = ({ mode = "full" }) => {
  const navigate = useNavigate();
  const isPreview = mode === "preview";
    const [kpiLoading, setKpiLoading] = useState(true);
const [totals, setTotals] = useState({
  totalRevenue: 0,
  payoutsProcessed: 0,
  pendingPayments: 0,
  totalTransactions: 0,
  prevTotalRevenue: 0,
  prevPayoutsProcessed: 0,
  prevPendingPayments: 0,
  prevTotalTransactions: 0,
});

const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
const [page, setPage] = useState(1);
const [statusFilter, setStatusFilter] = useState("ALL");

const [searchQuery, setSearchQuery] = useState("");



const { periodStart, periodEnd, prevStart, prevEnd } = useMemo(() => {
  if (!dateRange.startDate) {
    return { periodStart: null, periodEnd: null, prevStart: null, prevEnd: null };
  }
  const now = new Date();
  const start = dateRange.startDate;
  const end = dateRange.endDate || now;
  const length = end - start;
  const prevStart = new Date(start - length);
  const prevEnd = start;
  return { periodStart: start, periodEnd: end, prevStart, prevEnd };
}, [dateRange?.startDate, dateRange?.endDate]);


useEffect(() => {
  const fetchKpis = async () => {
    setKpiLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_financial_kpis', {
        start_date: periodStart?.toISOString() || null,
        end_date: periodEnd?.toISOString() || null,
        prev_start: prevStart?.toISOString() || null,
        prev_end: prevEnd?.toISOString() || null,
      });
      if (error) throw error;

      setTotals({
        totalRevenue: data.totalRevenue,
        payoutsProcessed: data.payoutsProcessed,
        pendingPayments: data.pendingPayments,
        totalTransactions: data.totalTransactions,
        prevTotalRevenue: data.prevTotalRevenue,
        prevPayoutsProcessed: data.prevPayoutsProcessed,
        prevPendingPayments: data.prevPendingPayments,
        prevTotalTransactions: data.prevTotalTransactions,
      });
    } catch (err) {
      console.error("Error fetching KPIs:", err.message || err);
    } finally {
      setKpiLoading(false);
    }
  };

  fetchKpis();
}, [periodStart, periodEnd, prevStart, prevEnd]);

const calcDelta = (current, previous) => {
  if (previous === 0 && current === 0) return { value: "—", positive: null };
  if (previous === 0 && current > 0) return { value: "New", positive: true };
  const pct = ((current - previous) / previous) * 100;
  return { value: `${pct > 0 ? "+" : ""}${pct.toFixed(1)}%`, positive: pct >= 0 };
};


const handleDateChange = (range) => {
  setDateRange(range);
  setPage(1);
};
const handleStatusChange = (status) => {
  setStatusFilter(status);
  setPage(1);
};
const handleSearchChange = (query) => {
  setSearchQuery(query);
  setPage(1);
};

const getCompareLabel = () => {
  if (!prevStart || !prevEnd) return null;
  return `vs ${prevStart.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} – ${prevEnd.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}`;
};

    // Helper to format currency
  const formatINR = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);

  // if (loading) return <p className="p-6 text-slate-400">Loading Financial Section...</p>;

  return (
    <section
      className="space-y-6 max-w-7xl mx-auto"
      onClick={isPreview ? () => navigate("/admin/financial-analytics") : undefined}
    >
      
        {/* ── PREVIEW HEADER ─────────────────────────────────────────────── */}
        {isPreview && (
          <div
            className="flex justify-between items-center p-6 rounded-2xl
              bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90
              backdrop-blur-xl
              border border-gray-200 dark:border-slate-700/50
              shadow-lg dark:shadow-xl
              transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl
                  bg-gradient-to-br from-cyan-100 to-teal-100 dark:from-cyan-500/20 dark:to-teal-500/20
                  flex items-center justify-center"
              >
                <TrendingUp size={20} className="text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Financial Overview
              </h3>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate("/admin/financial-analytics");
              }}
              className="group flex items-center gap-2 px-4 py-2 rounded-xl
                bg-cyan-50 dark:bg-cyan-500/10
                border border-cyan-200 dark:border-cyan-500/20
                text-cyan-600 dark:text-cyan-400
                hover:bg-cyan-100 dark:hover:bg-cyan-500/20
                hover:border-cyan-300 dark:hover:border-cyan-500/30
                transition-all duration-200 text-sm font-medium cursor-pointer"
            >
              <span>View Full</span>
              <ArrowRight
                size={16}
                className="group-hover:translate-x-0.5 transition-transform duration-200"
              />
            </button>
          </div>
        )}
{!isPreview && <FinancialHeader onDateChange={handleDateChange} dateRange={dateRange}   statusFilter={statusFilter}
  onStatusChange={handleStatusChange}
  searchQuery={searchQuery}/>}
      {/* KPI Grid — horizontal scroll on mobile, grid on desktop/tablet */}
{kpiLoading ? (
  <div className="overflow-x-auto md:overflow-visible scrollbar-hide">
    <div className="flex md:grid md:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="min-w-[60vw] md:min-w-0 rounded-xl border border-gray-200 dark:border-slate-700/50 p-5 space-y-3 animate-pulse"
        >
          <div className="h-3 w-24 rounded bg-gray-200 dark:bg-slate-700" />
          <div className="h-7 w-32 rounded bg-gray-200 dark:bg-slate-700" />
          <div className="h-4 w-16 rounded-full bg-gray-200 dark:bg-slate-700" />
          <div className="h-3 w-28 rounded bg-gray-200 dark:bg-slate-700" />
        </div>
      ))}
    </div>
  </div>
) : (
    <div className="overflow-x-auto md:overflow-visible scrollbar-hide">
      <div className="flex md:grid md:grid-cols-4 gap-4 md:gap-6 snap-x snap-mandatory md:snap-none md:px-0">
        <div className="min-w-[60vw] md:min-w-0 snap-start">
          <FinancialKpiCard
            title="Total Revenue"
            value={formatINR(totals.totalRevenue)}
            delta={calcDelta(totals.totalRevenue, totals.prevTotalRevenue)}
             compareLabel={getCompareLabel()}
            note="From successful payments"
            color="cyan"
          />
        </div>
        <div className="min-w-[60vw] md:min-w-0 snap-start">
          <FinancialKpiCard
            title="Payouts Processed"
            value={totals.payoutsProcessed}
             delta={calcDelta(totals.payoutsProcessed, totals.prevPayoutsProcessed)}
              compareLabel={getCompareLabel()}
            note="Completed transactions"
            color="green"
          />
        </div>
        <div className="min-w-[60vw] md:min-w-0 snap-start">
          <FinancialKpiCard
            title="Pending Payments"
            value={formatINR(totals.pendingPayments)}
              delta={calcDelta(totals.pendingPayments, totals.prevPendingPayments)}
               compareLabel={getCompareLabel()}
            note="Awaiting settlement"
            color="yellow"
          />
        </div>
        <div className="min-w-[60vw] md:min-w-0 snap-start">
          <FinancialKpiCard
            title="Total Transactions"
            value={totals.totalTransactions}
              delta={calcDelta(totals.totalTransactions, totals.prevTotalTransactions)}
               compareLabel={getCompareLabel()}
            note="All payments"
            color="teal"
          />
        </div>
      </div>
    </div>
    )}

      {/* Recent Payouts Table — show only in full mode */}
      {!isPreview && <RecentPayoutsTable dateRange={dateRange} page={page} setPage={setPage} totalCount={totals.totalTransactions}     statusFilter={statusFilter} onStatusChange={handleStatusChange}    searchQuery={searchQuery}
  onSearchChange={handleSearchChange}/>}
    </section>
  );
};

export default FinancialSection;