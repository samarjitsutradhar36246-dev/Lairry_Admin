import { useEffect, useState } from "react";
import { supabase } from "../../../supabase/SupabaseClient"; 
import { Eye, ChevronLeft, ChevronRight, TrendingUp, CreditCard, Calendar, Building2, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 20;

const statusStyles = {
  SUCCESS: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
  PENDING: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20",
};

const formatINR = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const RecentPayoutsTable = ({ dateRange, page, setPage, totalCount, statusFilter, onStatusChange, searchQuery, onSearchChange }) => {
  const [rows, setRows] = useState([]);
  const [rowsLoading, setRowsLoading] = useState(true);
  const [error, setError] = useState(null);

const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
const [searchCount, setSearchCount] = useState(0);
  const navigate = useNavigate();

  const hasSearch = !!debouncedSearch;
  const hasFilter = statusFilter !== "ALL";
  const needsCount = hasSearch || hasFilter;
const displayCount = needsCount ? searchCount : totalCount;

  useEffect(() => {
  const timer = setTimeout(() => setDebouncedSearch(searchQuery), 1000);
  return () => clearTimeout(timer);
}, [searchQuery]);



  useEffect(() => {
    const fetchTransactions = async () => {
      setRowsLoading(true);
      setError(null);

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      let query = supabase
        .from("institute_pricing")
        .select(
          `
          razorpay_payment_id,
          institute_name,
          user_id,
          total_test_papers,
          total_price,
          created_at,
          status
        `,
        needsCount ? { count: "exact" } : undefined
        )
        .order("created_at", { ascending: false })
        .range(from, to);
        if (dateRange?.startDate) query = query.gte("created_at", dateRange.startDate.toISOString());
if (dateRange?.endDate) query = query.lte("created_at", dateRange.endDate.toISOString());
if (statusFilter && statusFilter !== "ALL") query = query.ilike("status", statusFilter); 
if (debouncedSearch) query = query.or(`institute_name.ilike.%${debouncedSearch}%,razorpay_payment_id.ilike.%${debouncedSearch}%`);

const { data, error, count } = await query;

      if (error) {
        setError(error.message);
      } else {
        setRows(data || []);
          if (needsCount) setSearchCount(count || 0);
      }

      setRowsLoading(false);
    };

    fetchTransactions();
    
  }, [page, dateRange?.startDate, dateRange?.endDate,statusFilter, debouncedSearch, hasSearch,needsCount]);

  
const totalPages = Math.ceil(displayCount / PAGE_SIZE);
  

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-slate-800/50 overflow-hidden shadow-xl">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-slate-800/50 bg-gradient-to-r from-gray-50 to-transparent dark:from-slate-900/50 dark:to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <TrendingUp className="text-cyan-600 dark:text-cyan-400" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-lg text-gray-900 dark:text-white">Student Payment Transactions</h4>
                <p className="text-xs text-gray-600 dark:text-slate-400 mt-0.5">
                  {displayCount > 0 ? `${displayCount} total transactions` : 'Recent payment history'}
                </p>
              </div>
            </div>

                  <input
  type="text"
  value={searchQuery}
  onChange={(e) => onSearchChange(e.target.value)}
  placeholder="Search institute or ID..."
  className="bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition w-70"
/>
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 rounded-lg p-1 border border-gray-300 dark:border-slate-700">
{["ALL", "SUCCESS", "PENDING"].map((s) => (
  <button
    key={s}
    onClick={() => onStatusChange(s)}
    
    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
      statusFilter === s
        ? s === "ALL"
          ? "bg-cyan-500 text-white shadow-sm"
          : s === "SUCCESS"
          ? "bg-emerald-500 text-white shadow-sm"
          : "bg-yellow-500 text-white shadow-sm"
        : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
    } `}
    
  >
    {s}
  </button>
))}

</div>
            
            {/* Summary Stats */}
            {(
              <div className="hidden md:flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-slate-500 uppercase tracking-wide">Page Total</p>
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatINR(rows.reduce((sum, row) => sum + (row.total_price || 0), 0))}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-slate-500 uppercase tracking-wide">Showing</p>
                  <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">
                    {Math.min((page - 1) * PAGE_SIZE + 1, displayCount)}-{Math.min(page * PAGE_SIZE, displayCount)} of {displayCount}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
{rowsLoading && (
  <div className="p-6 space-y-3 animate-pulse">
    {/* Table header skeleton */}
    <div className="grid grid-cols-8 gap-4 pb-3 border-b border-gray-200 dark:border-slate-800/50">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-3 rounded bg-gray-200 dark:bg-slate-700" />
      ))}
    </div>
    {/* Row skeletons */}
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="grid grid-cols-8 gap-4 py-2">
        <div className="h-6 rounded bg-gray-200 dark:bg-slate-700 col-span-1" />
        <div className="h-6 rounded bg-gray-200 dark:bg-slate-700 col-span-1" />
        <div className="h-6 rounded bg-gray-200 dark:bg-slate-700 col-span-1" />
        <div className="h-6 w-10 rounded bg-gray-200 dark:bg-slate-700 mx-auto" />
        <div className="h-6 w-20 rounded bg-gray-200 dark:bg-slate-700 ml-auto" />
        <div className="h-6 w-16 rounded bg-gray-200 dark:bg-slate-700 mx-auto" />
        <div className="h-6 w-16 rounded-full bg-gray-200 dark:bg-slate-700 mx-auto" />
        <div className="h-6 w-8 rounded bg-gray-200 dark:bg-slate-700 mx-auto" />
      </div>
    ))}
  </div>
)}

        {/* Error State */}
        {error && (
          <div className="py-16 px-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-red-600 dark:text-red-400 font-medium">Error Loading Transactions</p>
                <p className="text-gray-500 dark:text-slate-500 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!rowsLoading && !error && rows.length === 0 && (
          <div className="py-16 px-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 flex items-center justify-center">
                <CreditCard className="text-gray-400 dark:text-slate-500" size={32} />
              </div>
              <div className="text-center">
                <p className="text-gray-600 dark:text-slate-400 font-medium">No Transactions Found</p>
                <p className="text-gray-500 dark:text-slate-500 text-sm mt-1">Payment transactions will appear here</p>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        {!rowsLoading && !error && rows.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 dark:bg-slate-900/30 border-b border-gray-200 dark:border-slate-800/50">
                  <th className="py-4 px-6 text-left">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                      <CreditCard size={14} />
                      <span>Transaction ID</span>
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                      <Building2 size={14} />
                      <span>Institute</span>
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                      <User size={14} />
                      <span>Student</span>
                    </div>
                  </th>
                  <th className="py-4 px-6 text-center">
                    <span className="text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">Test Papers</span>
                  </th>
                  <th className="py-4 px-6 text-right">
                    <span className="text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">Amount</span>
                  </th>
                  <th className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                      <Calendar size={14} />
                      <span>Date</span>
                    </div>
                  </th>
                  <th className="py-4 px-6 text-center">
                    <span className="text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">Status</span>
                  </th>
                  <th className="py-4 px-6 text-center">
                    <span className="text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">Action</span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-slate-800/30">
                {rows.map((row, idx) => (
                  <tr
                    key={row.razorpay_payment_id}
                    className="group hover:bg-gray-50 dark:hover:bg-slate-800/20 transition-colors duration-150"
                  >
                    <td className="py-4 px-6">
                      <code className="text-xs font-mono text-gray-600 dark:text-slate-400 group-hover:text-gray-900 dark:group-hover:text-slate-300 transition-colors bg-gray-100 dark:bg-slate-900/50 px-2 py-1 rounded">
                        {row.razorpay_payment_id}
                      </code>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-700 dark:text-slate-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors font-medium">
                        {row.institute_name}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-600 dark:text-cyan-400">
                          {row.user_id?.[0]?.toUpperCase() || "U"}
                        </div>
                        <code className="text-xs font-mono text-gray-600 dark:text-slate-400 group-hover:text-gray-900 dark:group-hover:text-slate-300 transition-colors">
                          {row.user_id}
                        </code>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center justify-center min-w-[2rem] px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-slate-800/50 text-sm font-semibold text-gray-700 dark:text-slate-300 group-hover:bg-gray-200 dark:group-hover:bg-slate-700/50 transition-colors">
                        {row.total_test_papers}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                        {formatINR(row.total_price)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-xs text-gray-600 dark:text-slate-400 group-hover:text-gray-900 dark:group-hover:text-slate-300 transition-colors">
                        {formatDate(row.created_at)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          statusStyles[row.status] ||
                          "bg-green-100 dark:bg-green-700 text-green-700 dark:text-white border border-green-300 dark:border-green-600"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() =>
                          navigate(
                            `/admin/financial-analytics/${row.razorpay_payment_id}`
                          )
                        }
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg 
                          bg-gray-100 dark:bg-slate-800/50 
                          hover:bg-cyan-500/20 
                          border border-transparent hover:border-cyan-500/30 
                          text-gray-600 dark:text-slate-400 
                          hover:text-cyan-600 dark:hover:text-cyan-400 
                          transition-all duration-200 group/btn"
                        title="View Details"
                      >
                        <Eye size={16} className="group-hover/btn:scale-110 transition-transform" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!rowsLoading && !error && rows.length > 0 && (
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-slate-800/50 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Page Info */}
            <div className="text-sm text-gray-600 dark:text-slate-400">
              Showing <span className="font-semibold text-gray-900 dark:text-slate-300">{Math.min((page - 1) * PAGE_SIZE + 1, displayCount)}</span> to{" "}
              <span className="font-semibold text-gray-900 dark:text-slate-300">{Math.min(page * PAGE_SIZE, displayCount)}</span> of{" "}
              <span className="font-semibold text-gray-900 dark:text-slate-300">{displayCount}</span> transactions
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="
                  group flex items-center gap-2 px-4 py-2 rounded-lg
                  bg-gray-100 dark:bg-slate-800/50 
                  hover:bg-gray-200 dark:hover:bg-slate-700/50
                  border border-gray-300 dark:border-slate-700/50 
                  hover:border-gray-400 dark:hover:border-slate-600/50
                  text-gray-600 dark:text-slate-400 
                  hover:text-gray-900 dark:hover:text-white
                  disabled:opacity-40 disabled:cursor-not-allowed 
                  disabled:hover:bg-gray-100 dark:disabled:hover:bg-slate-800/50 
                  disabled:hover:border-gray-300 dark:disabled:hover:border-slate-700/50 
                  disabled:hover:text-gray-600 dark:disabled:hover:text-slate-400
                  transition-all duration-200
                "
              >
                <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-sm font-medium">Previous</span>
              </button>

              {/* Page Numbers */}
              <div className="hidden sm:flex items-center gap-2 px-4">
                {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = idx + 1;
                  } else if (page <= 3) {
                    pageNum = idx + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + idx;
                  } else {
                    pageNum = page - 2 + idx;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`
                        w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200
                        ${
                          page === pageNum
                            ? "bg-cyan-500/20 border border-cyan-500/50 text-cyan-600 dark:text-cyan-400 shadow-lg shadow-cyan-500/20"
                            : "bg-gray-100 dark:bg-slate-800/30 border border-gray-300 dark:border-slate-700/30 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700/50 hover:border-gray-400 dark:hover:border-slate-600/50 hover:text-gray-900 dark:hover:text-slate-300"
                        }
                      `}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={page === totalPages || totalPages <= 1}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="
                  group flex items-center gap-2 px-4 py-2 rounded-lg
                  bg-gray-100 dark:bg-slate-800/50 
                  hover:bg-gray-200 dark:hover:bg-slate-700/50
                  border border-gray-300 dark:border-slate-700/50 
                  hover:border-gray-400 dark:hover:border-slate-600/50
                  text-gray-600 dark:text-slate-400 
                  hover:text-gray-900 dark:hover:text-white
                  disabled:opacity-40 disabled:cursor-not-allowed 
                  disabled:hover:bg-gray-100 dark:disabled:hover:bg-slate-800/50 
                  disabled:hover:border-gray-300 dark:disabled:hover:border-slate-700/50 
                  disabled:hover:text-gray-600 dark:disabled:hover:text-slate-400
                  transition-all duration-200
                "
              >
                <span className="text-sm font-medium">Next</span>
                <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentPayoutsTable;