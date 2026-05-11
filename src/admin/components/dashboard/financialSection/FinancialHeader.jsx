import { useState, useEffect, useRef } from "react";
import { Download, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "../../../supabase/SupabaseClient";

const FinancialHeader = ({ onDateChange, dateRange, statusFilter, onStatusChange, searchQuery  }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingStart, setSelectingStart] = useState(true);
  const pickerRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  const handleDateClick = (day) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    if (selectingStart || !startDate) {
      setStartDate(newDate);
      setEndDate(null);
      setSelectingStart(false);
    } else {
      if (newDate >= startDate) {
        setEndDate(newDate);
      } else {
        setStartDate(newDate);
        setEndDate(startDate);
      }
      setShowPicker(false);
      onDateChange({ startDate: newDate >= startDate ? startDate : newDate, endDate: newDate >= startDate ? newDate : startDate });
      setSelectingStart(true);
    }
  };

  const handleDownload = async () => {
  setDownloading(true);
  try {
    let query = supabase
      .from("institute_pricing")
      .select(`razorpay_payment_id, institute_name, user_id, total_test_papers, total_price, created_at, status`)
      .order("created_at", { ascending: false });

    if (dateRange?.startDate) query = query.gte("created_at", dateRange.startDate.toISOString());
    if (dateRange?.endDate) query = query.lte("created_at", dateRange.endDate.toISOString());
    if (statusFilter && statusFilter !== "ALL") query = query.ilike("status", statusFilter);
    if (searchQuery) query = query.or(`institute_name.ilike.%${searchQuery}%,razorpay_payment_id.ilike.%${searchQuery}%`);

    const { data, error } = await query;
    if (error) throw error;

    // Convert to CSV
    const headers = ["Transaction ID", "Institute", "Student ID", "Test Papers", "Amount", "Date", "Status"];
    const rows = data.map(row => [
      row.razorpay_payment_id,
      row.institute_name,
      row.user_id,
      row.total_test_papers,
      row.total_price,
      new Date(row.created_at).toLocaleDateString(),
      row.status
    ]);

    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financial-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Download error:", err);
  } finally {
    setDownloading(false);
  }
};

  const isInRange = (day) => {
    if (!startDate) return false;
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    const end = endDate || new Date();
    return date >= startDate && date <= end;
  };

  const isStartOrEnd = (day) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return (
      (startDate && date.toDateString() === startDate.toDateString()) ||
      (endDate && date.toDateString() === endDate.toDateString())
    );
  };

  const formatDateDisplay = () => {
    if (!startDate) return "Select date range";
    if (!endDate) return `${startDate.toLocaleDateString()} - Present`;
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 flex justify-between items-start shadow-xl border border-gray-200 dark:border-slate-700/50 transition-colors">
      <div>
        <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
          <span className="h-3 w-3 rounded bg-cyan-500 dark:bg-cyan-400" />
          Financial Analytics
        </h3>
        <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">
          Audit-grade financial reporting and payout tracking.
        </p>
      </div>


      <div className="flex flex-row gap-2 sm:gap-3 items-center relative" ref={pickerRef}>
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition px-4 py-2 rounded-lg text-xs flex items-center justify-center gap-2 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700"
        >
          <Calendar size={14} />
          <span className="hidden sm:inline truncate">{formatDateDisplay()}</span>
        </button>
        {(dateRange?.startDate || dateRange?.endDate) && (
  <button
onClick={() => {
  setStartDate(null);
  setEndDate(null);
  setSelectingStart(true);
  onDateChange({ startDate: null, endDate: null });
}}    className="text-xs text-gray-500 dark:text-slate-400 hover:text-red-500 transition px-2"
  >
    Clear
  </button>
)}

        {showPicker && (
          <div
            className="absolute top-12 right-0 sm:left-auto sm:right-24 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-2xl border border-gray-200 dark:border-slate-700 z-50"
            style={{ minWidth: "280px" }}
          >
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() - 1
                    )
                  )
                }
                className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {monthNames[currentMonth.getMonth()]}{" "}
                {currentMonth.getFullYear()}
              </div>
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() + 1
                    )
                  )
                }
                className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div
                  key={day}
                  className="text-xs text-gray-500 dark:text-slate-500 text-center py-1 font-medium"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`text-xs py-2 rounded transition ${
                      isStartOrEnd(day)
                        ? "bg-teal-500 text-white font-semibold"
                        : isInRange(day)
                        ? "bg-teal-500/30 text-gray-900 dark:text-white"
                        : "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        )}

<button
  onClick={handleDownload}
  disabled={downloading}
  className="bg-teal-500 hover:bg-teal-400 disabled:opacity-50 transition px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 text-white"
>
  {downloading ? (
    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
  ) : (
    <Download size={14} />
  )}
  <span className="hidden sm:inline">{downloading ? "Downloading..." : "Download Report"}</span>
</button>
      </div>
    </div>
  );
};

export default FinancialHeader;