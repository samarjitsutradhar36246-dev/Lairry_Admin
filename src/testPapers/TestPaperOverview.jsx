import { useState, useEffect } from "react";
import {
  FileText,
  Clock,
  Users,
  Target,
  AlertCircle,
  Plus,
  BookOpen,
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";
// Supabase client import
import { supabase } from "../admin/supabase/SupabaseClient";

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function fmtDateTime(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) +
    ", " +
    d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  );
}

// ── KEY LOGIC ──────────────────────────────────────────────────────────────────
function getDisplayStatus(paper) {
  if (paper.test_end_at) {
    const now = new Date();
    const endTime = new Date(paper.test_end_at);
    if (endTime < now) {
      return "Expired";
    }
  }
  return paper.test_paper_status;
}

// ── Stat Card ──────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, color }) => {
  const colorMap = {
    cyan: {
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      icon: "text-cyan-400",
      value: "text-cyan-300",
    },
    teal: {
      bg: "bg-teal-500/10",
      border: "border-teal-500/20",
      icon: "text-teal-400",
      value: "text-teal-300",
    },
    violet: {
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
      icon: "text-violet-400",
      value: "text-violet-300",
    },
    amber: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      icon: "text-amber-400",
      value: "text-amber-300",
    },
  };
  const c = colorMap[color] || colorMap.cyan;

  return (
    <div
      className={`relative flex items-center gap-4 rounded-xl border ${c.border} ${c.bg} px-5 py-4 backdrop-blur-sm overflow-hidden`}>
      <div
        className={`pointer-events-none absolute -top-6 -left-6 h-20 w-20 rounded-full opacity-20 blur-2xl ${c.bg}`}
      />
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border ${c.border} bg-white/5`}>
        <Icon size={20} className={c.icon} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-widest text-slate-400">
          {label}
        </p>
        <p className={`text-2xl font-semibold leading-none mt-0.5 ${c.value}`}>
          {value}
        </p>
        {sub && (
          <p className="text-[11px] text-slate-500 mt-0.5 truncate">{sub}</p>
        )}
      </div>
    </div>
  );
};

// ── Status Badge ───────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    deactivate: "bg-slate-500/15 text-slate-400 border-slate-500/30",
    archived: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    expired: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  };
  if (!status) return <span className="text-slate-600">—</span>;
  const key = status.toLowerCase();
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${map[key] || map.deactivate}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
};

// ── Delete Confirm Modal ───────────────────────────────────────────────────────
const DeleteModal = ({ paper, onConfirm, onCancel }) => {
  if (!paper) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl mx-4">
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors">
          <X size={16} />
        </button>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/15 border border-rose-500/30 mb-4">
          <AlertTriangle size={22} className="text-rose-400" />
        </div>
        <h2 className="text-white font-semibold text-base mb-1">
          Delete test paper?
        </h2>
        <p className="text-slate-400 text-[13px] leading-relaxed">
          Are you sure you want to delete{" "}
          <span className="text-white font-medium">
            "{paper.test_paper_name}"
          </span>
          ? This action cannot be undone.
        </p>
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-white/10 bg-white/5 py-2 text-[13px] font-medium text-slate-300 hover:bg-white/10 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(paper.id)}
            className="flex-1 rounded-lg border border-rose-500/40 bg-rose-500/15 py-2 text-[13px] font-medium text-rose-400 hover:bg-rose-500/25 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const TestPaperOverview = () => {
  const [papers, setPapers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 10;

  // 👇 REAL DATA FETCHING LOGIC - UNCOMMENTED!
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setIsLoading(true);

        // Yahan se `//` hata diye gaye hain
        const { data, error } = await supabase
          .from("subject_test_paper_data")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data) setPapers(data);
      } catch (error) {
        console.error("Error fetching papers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPapers();
  }, []);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const totalPapers = papers.length;
  const totalAttempts = 0; // Replace with actual logic if attempts are tracked in DB

  const activeCount = papers.filter(
    (p) => getDisplayStatus(p)?.toLowerCase() === "active",
  ).length;
  const expiredCount = papers.filter(
    (p) => getDisplayStatus(p)?.toLowerCase() === "expired",
  ).length;

  // ── Filtering ──────────────────────────────────────────────────────────────
  const filtered = papers.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      p.test_paper_name?.toLowerCase().includes(q) ||
      p.subject?.toLowerCase().includes(q);
    const displayStatus = getDisplayStatus(p);
    const matchStatus =
      statusFilter === "All" ||
      displayStatus?.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pageData = filtered.slice(
    (safePage - 1) * PER_PAGE,
    safePage * PER_PAGE,
  );

  // ── Delete handlers ────────────────────────────────────────────────────────
  const handleDeleteConfirm = async (id) => {
    try {
      // Yahan se bhi `//` hata diye gaye hain, ab DB se delete ho jayega
      await supabase.from("subject_test_paper_data").delete().eq("id", id);

      setPapers((prev) => prev.filter((p) => p.id !== id));
      setDeleteTarget(null);
    } catch (error) {
      console.error("Error deleting paper:", error);
    }
  };

  const STATUS_FILTERS = ["All", "Active", "Expired", "Deactivate"];

  return (
    <>
      <DeleteModal
        paper={deleteTarget}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10">
              <BookOpen size={18} className="text-cyan-400" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white leading-none">
                Test Papers Overview
              </h1>
              <p className="text-[12px] text-slate-400 mt-0.5">
                Manage and monitor all test papers
              </p>
            </div>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard
            icon={FileText}
            label="Total Papers"
            value={totalPapers}
            sub={`${activeCount} active`}
            color="cyan"
          />
          <StatCard
            icon={Users}
            label="Total Attempts"
            value={totalAttempts}
            sub="across all papers"
            color="teal"
          />
          <StatCard
            icon={Target}
            label="Active Papers"
            value={activeCount}
            sub={`${expiredCount} expired`}
            color="violet"
          />
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search by title or subject..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-4 text-[13px] text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/40 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatusFilter(s);
                  setCurrentPage(1);
                }}
                className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors duration-150 ${
                  statusFilter === s
                    ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300"
                    : "border border-white/10 bg-white/5 text-slate-400 hover:text-slate-200 hover:border-white/20"
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table ── */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-white/10">
                  {[
                    "Test Paper",
                    "Created",
                    "Start",
                    "End",
                    "Attempts",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-slate-500 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-10 text-center text-slate-400">
                      Loading data from Supabase...
                    </td>
                  </tr>
                ) : pageData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-10 text-center text-slate-500">
                      <AlertCircle
                        size={28}
                        className="mx-auto mb-2 opacity-40"
                      />
                      No papers found
                    </td>
                  </tr>
                ) : (
                  pageData.map((p) => {
                    const displayStatus = getDisplayStatus(p);
                    const startDt = fmtDateTime(p.test_start_at);
                    const endDt = fmtDateTime(p.test_end_at);
                    const isExpired =
                      displayStatus?.toLowerCase() === "expired";
                    return (
                      <tr
                        key={p.id}
                        className="group hover:bg-white/[0.03] transition-colors duration-100">
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-200 group-hover:text-white transition-colors">
                            {p.test_paper_name}
                          </p>
                          {p.subject && (
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {p.subject}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-[12px] whitespace-nowrap">
                          {fmtDate(p.created_at)}
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-[12px] whitespace-nowrap">
                          {startDt ? (
                            <span className="flex items-center gap-1">
                              <Clock
                                size={11}
                                className="text-slate-600 shrink-0"
                              />
                              {startDt}
                            </span>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-[12px] whitespace-nowrap">
                          {endDt ? (
                            <span
                              className={`flex items-center gap-1 ${isExpired ? "text-amber-400" : ""}`}>
                              <Clock
                                size={11}
                                className="shrink-0 opacity-70"
                              />
                              {endDt}
                            </span>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-600 tabular-nums">
                          {p.attempts?.toLocaleString() || 0}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={displayStatus} />
                        </td>
                        <td className="px-4 py-3">
                          <button
                            title="Delete"
                            onClick={() => setDeleteTarget(p)}
                            className="rounded-lg p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer / Pagination */}
          <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-[12px] text-slate-500">
            <span>
              Showing {pageData.length} of {filtered.length} papers
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 hover:border-white/20 hover:text-slate-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                ← Prev
              </button>
              <span className="px-3 py-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
                Page {safePage} of {totalPages}
              </span>
              <button
                disabled={safePage >= totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 hover:border-white/20 hover:text-slate-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestPaperOverview;
