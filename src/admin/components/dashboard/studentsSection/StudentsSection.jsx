// src/components/StudentsSection.jsx
import { useState, useEffect, useCallback } from "react";
import {
  Search,
  ArrowLeft,
  ArrowRight,
  User,
  Download,
  Filter,
  Ban,
  Mail,
  Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase/SupabaseClient";
import StudentsTable from "./StudentsTable";
import EditStudentModal from "./EditStudentModal";
import SendNotificationModal from "../../common/sendNotificationModal";
import NotificationService from "../../common/services/NotificationService";
import SendEmailModal from "../../common/SendEmailModal";
import { sendBulkEmails } from "../../common/services/emailService";

const StudentsSection = ({ mode = "full" }) => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("");

  // ─── SELECTION STATE ──────────────────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState([]);
  const [isAllMatchingSelected, setIsAllMatchingSelected] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});
  const [totalMatchingCount, setTotalMatchingCount] = useState(0);
  // ─────────────────────────────────────────────────────────────────────────

  const [page, setPage] = useState(1);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [totalRows, setTotalRows] = useState(0);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);

  const navigate = useNavigate();
  const isPreview = mode === "preview";
  const PAGE_SIZE = isPreview ? 5 : 20;

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [originalStudent, setOriginalStudent] = useState(null);

  // ─── NOTIFICATION STATE ───────────────────────────────────────────────────
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationDescription, setNotificationDescription] = useState("");
  const [notificationType, setNotificationType] = useState("info");
  const [notificationIcon, setNotificationIcon] = useState("");
  const [notificationIconColor, setNotificationIconColor] = useState("");
  const [notificationIconBg, setNotificationIconBg] = useState("");
  const [notificationImportant, setNotificationImportant] = useState(false);
  const [notificationActionUrl, setNotificationActionUrl] = useState("");
  const [notificationRecipients, setNotificationRecipients] = useState([]);

  // ─── EMAIL STATE ──────────────────────────────────────────────────────────
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [selectedEmails, setSelectedEmails] = useState([]);
  // new

const [selectedStudentsData, setSelectedStudentsData] = useState([]);

  // ─── HELPERS ─────────────────────────────────────────────────────────────

  /** Apply the same search/sort filters to any query builder */
  const applyFilters = useCallback(
    (query, filters = {}) => {
      const s = filters.search ?? search;
      const sort = filters.sortOption ?? sortOption;

      if (s) {
        query = query.or(
          `full_name.ilike.%${s}%,email.ilike.%${s}%,qualification.ilike.%${s}%`
        );
      }

      let orderBy = "created_at";
      let ascending = false;
      switch (sort) {
        case "name-asc":   orderBy = "full_name";   ascending = true;  break;
        case "name-desc":  orderBy = "full_name";   ascending = false; break;
        case "newest":     orderBy = "created_at";  ascending = false; break;
        case "oldest":     orderBy = "created_at";  ascending = true;  break;
      }
      return query.order(orderBy, { ascending });
    },
    [search, sortOption]
  );

  /** Reset selection entirely */
  const resetSelection = () => {
    setSelectedIds([]);
    setIsAllMatchingSelected(false);
    setCurrentFilters({});
    setSelectedStudentsData([]);
  };
useEffect(() => {
  setSelectedEmails((prev) => {
    const placeholder = prev.find((r) => r.isSummaryPlaceholder);
    if (!placeholder) return prev;
    const remaining = totalMatchingCount - selectedStudentsData.length;
    if (remaining <= 0) {
      return prev.filter((r) => !r.isSummaryPlaceholder);
    }
    return prev.map((r) =>
      r.isSummaryPlaceholder
        ? { ...r, count: remaining }
        : r
    );
  });
}, [selectedStudentsData, totalMatchingCount]);

useEffect(() => {
  setNotificationRecipients((prev) => {
    const placeholder = prev.find((r) => r.isSummaryPlaceholder);
    if (!placeholder) return prev;
    return prev.map((r) =>
      r.isSummaryPlaceholder
        ? { ...r, count: totalMatchingCount - selectedStudentsData.length }
        : r
    );
  });
}, [selectedStudentsData, totalMatchingCount]);

  useEffect(() => {
  setSelectedStudentsData((prev) => {
    const prevMap = new Map(prev.map((s) => [s.id, s]));
    students.forEach((s) => {
      if (selectedIds.includes(s.id)) {
        prevMap.set(s.id, s);
      }
    });
    for (const key of prevMap.keys()) {
      if (!selectedIds.includes(key)) prevMap.delete(key);
    }
    return Array.from(prevMap.values());
  });
}, [selectedIds, students]);

  // ─── FETCH PAGINATED STUDENTS + MATCHING COUNT ────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingStudents(true);
      try {
        const from = (page - 1) * PAGE_SIZE;
        const to   = from + PAGE_SIZE - 1;

        // 1. Rows
        let q = supabase.from("users").select(
          `id, full_name, email, phone_number, qualification, created_at`
        );
        q = applyFilters(q);
        const { data, error } = await q.range(from, to);
        if (error) throw error;

        setStudents(
          data.map((s) => ({
            id:            s.id,
            full_name:     s.full_name     || "",
            email:         s.email         || "",
            phone_number:  s.phone_number  || "",
            qualification: s.qualification || "",
            created_at:    s.created_at    || "",
          }))
        );

        // 2. Count
        if (!search) {
          const { data: kpi } = await supabase
            .from("kpi_totals")
            .select("total_students")
            .eq("id", 1)
            .single();
          const total = kpi?.total_students || 0;
          setTotalRows(total);
          setTotalMatchingCount(total);
        } else {
          let cq = supabase
            .from("users")
            .select("id", { count: "exact", head: true });
          cq = applyFilters(cq);
          const { count } = await cq;
          setTotalMatchingCount(count ?? 0);
        }
      } catch (err) {
        console.error("Error fetching students:", err.message);
      } finally {
        setIsLoadingStudents(false);
      }
    };

    const timeout = setTimeout(fetchData, 500);
    return () => clearTimeout(timeout);
  }, [page, isPreview, PAGE_SIZE, sortOption, search]); // eslint-disable-line

  // ─── SELECTION HANDLERS ──────────────────────────────────────────────────

  /** Header checkbox: select / deselect current page */
const handleSelectAll = () => {
  if (isAllMatchingSelected) {
    resetSelection();
    const allPageIds = students.map((s) => s.id);
    setSelectedIds(allPageIds);
    return;
  }

    const allPageIds = students.map((s) => s.id);
    const allPageSelected = allPageIds.every((id) => selectedIds.includes(id));

    if (allPageSelected) {
      setSelectedIds((prev) => prev.filter((id) => !allPageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...allPageIds])));
    }

    setIsAllMatchingSelected(false);
  };

  /** Individual row checkbox */
  const handleSelectStudent = (id) => {
    if (isAllMatchingSelected) {
      setIsAllMatchingSelected(false);
      setSelectedIds(students.map((s) => s.id).filter((sid) => sid !== id));
      return;
    }
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  /** Banner: "Select all X matching students" */
  const handleSelectAllMatching = () => {
    setIsAllMatchingSelected(true);
    setSelectedIds([]);
    setCurrentFilters({ search, sortOption });
  };

  // Derived helpers for the table checkbox state
  const allPageIds = students.map((s) => s.id);
  const isHeaderChecked =
    isAllMatchingSelected ||
    (allPageIds.length > 0 && allPageIds.every((id) => selectedIds.includes(id)));

  const hasCrossPageSelection = selectedIds.some(
  (id) => !allPageIds.includes(id)
);
  const isHeaderIndeterminate =
    !isAllMatchingSelected &&
    selectedIds.some((id) => allPageIds.includes(id)) &&
    !isHeaderChecked;
  const selectionCount = isAllMatchingSelected ? totalMatchingCount : selectedIds.length;

  // ─── EMAIL HANDLERS ───────────────────────────────────────────────────────
const openEmailModal = () => {
  if (isAllMatchingSelected) {
    setSelectedEmails([{
      name: `All ${totalMatchingCount.toLocaleString()} matching students`,
      email: '__all_matching__',
      isSummaryPlaceholder: true,
      count: totalMatchingCount,
    }]);
    setEmailModalOpen(true);
    return;
  }



  const newRecipients = selectedStudentsData
    .map((s) => ({ name: s.full_name, email: s.email }));

  setSelectedEmails((prev) => {
    const placeholder = prev.find((r) => r.isSummaryPlaceholder);
    const prevReal = prev.filter((r) => !r.isSummaryPlaceholder);
    const existingEmails = new Set(prevReal.map((r) => r.email));
    const merged = [...prevReal, ...newRecipients.filter((r) => !existingEmails.has(r.email))];
    return placeholder ? [...merged, placeholder] : merged;
  });

  setEmailModalOpen(true);
};
  const openNotificationModal = () => {
  if (isAllMatchingSelected) {
    setNotificationRecipients([{
      name: `All ${totalMatchingCount.toLocaleString()} matching students`,
      email: '__all_matching__',
      isSummaryPlaceholder: true,
      count: totalMatchingCount,
    }]);
    setNotificationModalOpen(true);
    return;
  }

  const newRecipients = selectedStudentsData.map((s) => ({
    name: s.full_name,
    email: s.email,
    id: s.id,
  }));
  setNotificationRecipients((prev) => {
    const placeholder = prev.find((r) => r.isSummaryPlaceholder);
    const prevReal = prev.filter((r) => !r.isSummaryPlaceholder);
    const existingEmails = new Set(prevReal.map((r) => r.email));
    const merged = [...prevReal, ...newRecipients.filter((r) => !existingEmails.has(r.email))];
    return placeholder ? [...merged, placeholder] : merged;
  });
  setNotificationModalOpen(true);
};
  const handleDiscardEmail = () => {
    setSelectedEmails([]);
    setEmailSubject("");
    setEmailBody("");
    setEmailModalOpen(false);
  };

  const handleSendBulkEmail = async (emails, subject, body) => {
    const resolvedEmails = (emails || []).filter((r) => !r.isSummaryPlaceholder);
    if (!resolvedEmails.length)
      return NotificationService.error("No recipients found!");

    try {
      await sendBulkEmails(resolvedEmails, subject, body);
      NotificationService.success(
        `Email sent to ${resolvedEmails.length} recipient(s)`
      );
      setEmailModalOpen(false);
      resetSelection();
      setSelectedEmails([]);
      setEmailSubject("");
      setEmailBody("");
    } catch (err) {
      NotificationService.error("Error sending emails: " + err.message);
    }
  };

  // ─── BULK ACTIONS ─────────────────────────────────────────────────────────

  /** Block — local only, DB not implemented */
  const blockSelected = () => {
    setStudents((prev) =>
      prev.map((s) =>
        selectedIds.includes(s.id) ? { ...s, status: "Blocked" } : s
      )
    );
    resetSelection();
    NotificationService.success(
      `${selectionCount} student${selectionCount !== 1 ? "s" : ""} blocked (local only)!`
    );
  };

  /** Send Notifications */
  const handleSendNotifications = async () => {
    try {
      let notifRows = [];

      if (isAllMatchingSelected) {
        let q = supabase.from("users").select("id");
        if (currentFilters.search) {
          q = q.or(
            `full_name.ilike.%${currentFilters.search}%,email.ilike.%${currentFilters.search}%,phone_number.ilike.%${currentFilters.search}%,qualification.ilike.%${currentFilters.search}%`
          );
        }
        const { data, error } = await q;
        if (error) throw error;
        notifRows = data.map((r) => r.id).filter(Boolean);
     } else {
  notifRows = notificationRecipients
    .filter((r) => !r.isSummaryPlaceholder)
    .map((r) => r.id)
    .filter(Boolean);

  if (!notifRows.length) {
    NotificationService.error("No valid recipients!");
    return;
  }
}

      if (!notifRows.length) {
        NotificationService.error("No valid recipients!");
        return;
      }

      const notifications = notifRows.map((userId) => ({
        user_id:      userId,
        title:        notificationTitle,
        description:  notificationDescription,
        icon:         notificationIcon,
        icon_color:   notificationIconColor,
        icon_bg:      notificationIconBg,
        type:         notificationType,
        is_important: notificationImportant,
        is_read:      false,
        action_url:   notificationActionUrl || null,
      }));

      const { error } = await supabase
        .from("user_notifications")
        .insert(notifications);
      if (error) throw error;

      setNotificationModalOpen(false);
      setNotificationTitle("");
      setNotificationDescription("");
      setNotificationType("info");
      setNotificationIcon("");
      setNotificationIconColor("#38bdf8");
      setNotificationIconBg("#0f172a");
      setNotificationImportant(false);
      setNotificationActionUrl("");
      resetSelection();
      setNotificationRecipients([]); 

      NotificationService.success(
        `Notifications sent to ${notifRows.length} student${notifRows.length !== 1 ? "s" : ""}!`
      );
    } catch (err) {
      NotificationService.error("Failed to send notifications: " + err.message);
    }
  };

  // ─── EXPORT ───────────────────────────────────────────────────────────────

  const exportCSV = () => {
    if (!students.length) {
      NotificationService.error("No students to export!");
      return;
    }
    const headers = ["ID", "Name", "Email", "Phone", "Qualification", "Joined"];
    const sanitize = (v) => String(v ?? "").replace(/\r?\n|\r/g, " ");
    const rows = students.map((s) => [
      sanitize(s.id),
      sanitize(s.full_name),
      sanitize(s.email),
      sanitize(s.phone_number),
      sanitize(s.qualification),
      sanitize(s.created_at),
    ]);
    const csv =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", "students_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    NotificationService.success("CSV exported successfully!");
  };

  // ─── EDIT HANDLERS ────────────────────────────────────────────────────────

  const openEdit = (student) => {
    setSelectedStudent({ ...student });
    setOriginalStudent({ ...student });
    setEditModalOpen(true);
  };

  const handleEditStudent = (field, value) => {
    setSelectedStudent((prev) => ({
      ...prev,
      [field]: value !== undefined ? value : prev[field],
    }));
  };

  const handleSaveStudent = async (updatedStudent) => {
    if (!originalStudent) return;

    const keysToCheck = ["full_name", "qualification", "email", "phone_number"];
    const changes = {};
    keysToCheck.forEach((key) => {
      if (
        updatedStudent[key] !== undefined &&
        updatedStudent[key] !== originalStudent[key]
      ) {
        changes[key] = updatedStudent[key];
      }
    });

    if (Object.keys(changes).length === 0) {
      NotificationService.error("No changes detected!");
      return;
    }

    try {
      const { error } = await supabase
        .from("users")
        .update(changes)
        .eq("id", updatedStudent.id);
      if (error) throw error;

      setStudents((prev) =>
        prev.map((s) => (s.id === updatedStudent.id ? { ...s, ...changes } : s))
      );
      setEditModalOpen(false);
      setOriginalStudent(null);
      NotificationService.success("Student updated successfully!");
    } catch (err) {
      console.error(err);
      NotificationService.error("Failed to save student!");
    }
  };

  const getChangedFields = () => {
    if (!selectedStudent || !originalStudent) return {};
    const keysToCheck = ["full_name", "qualification", "email", "phone_number"];
    const changes = {};
    keysToCheck.forEach((key) => {
      if (selectedStudent[key] !== originalStudent[key]) changes[key] = true;
    });
    return changes;
  };

  const changedFields = getChangedFields();
  const hasChanges = Object.keys(changedFields).length > 0;

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <section>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header in preview only */}
        {isPreview && (
          <div className="flex justify-between items-center p-6 rounded-2xl 
            bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
            backdrop-blur-xl 
            border border-gray-200 dark:border-slate-700/50
            shadow-lg dark:shadow-xl
            transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl 
                bg-gradient-to-br from-cyan-100 to-purple-100 dark:from-cyan-500/20 dark:to-purple-500/20 
                flex items-center justify-center">
                <User size={20} className="text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Students Overview
              </h3>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate("/admin/students-management");
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
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform duration-200" />
            </button>
          </div>
        )}

        {/* HEADER */}
        {!isPreview && (
          <div className="relative overflow-hidden rounded-2xl 
            bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
            backdrop-blur-xl 
            border border-gray-200 dark:border-slate-700/50 
            shadow-lg dark:shadow-xl 
            p-6
            transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-3">
                <button
                  onClick={() => navigate(-1)}
                  className="group flex items-center gap-2 text-sm 
                    text-gray-600 dark:text-slate-400 
                    hover:text-cyan-500 dark:hover:text-cyan-400 
                    transition-all duration-200 cursor-pointer"
                >
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
                  <span className="font-medium">Back</span>
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl 
                    bg-gradient-to-br from-cyan-100 to-purple-100 dark:from-cyan-500/20 dark:to-purple-500/20 
                    flex items-center justify-center">
                    <User size={24} className="text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Students Management
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-slate-400 mt-0.5">
                      Monitor student activity, readiness, and performance metrics
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEARCH + SORT + EXPORT */}
        <div className="relative overflow-hidden rounded-2xl 
          bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
          backdrop-blur-xl 
          border border-gray-200 dark:border-slate-700/50 
          shadow-lg dark:shadow-xl 
          p-3 sm:p-4 lg:p-5
          transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
          <div className="relative flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch lg:items-center lg:justify-between">
            <div className="relative flex-1 max-w-full lg:max-w-md">
              <Search size={18} className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by name, email, phone or qualification..."
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl 
                  bg-gray-50 dark:bg-slate-800/50 
                  border border-gray-200 dark:border-slate-700/50 
                  text-gray-900 dark:text-white 
                  placeholder-gray-400 dark:placeholder-slate-500 
                  focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 
                  transition-all duration-200 outline-none"
              />
            </div>

            <div className="flex gap-2 sm:gap-3 items-center overflow-x-auto pb-2 lg:pb-0 -mx-3 px-3 sm:mx-0 sm:px-0 lg:overflow-visible scrollbar-hide">
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl 
                bg-gray-50 dark:bg-slate-800/50 
                border border-gray-200 dark:border-slate-700/50 flex-shrink-0">
                <Filter size={14} className="sm:w-4 sm:h-4 text-purple-500 dark:text-purple-400" />
                <label htmlFor="sort" className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 font-medium whitespace-nowrap">Sort:</label>
                <select
                  id="sort"
                  value={sortOption}
                  onChange={(e) => { setSortOption(e.target.value); setPage(1); }}
                  className="bg-transparent text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none cursor-pointer pr-2"
                >
                  <option value="" className="bg-white dark:bg-slate-800">None</option>
                  <option value="name-asc" className="bg-white dark:bg-slate-800">Name A-Z</option>
                  <option value="name-desc" className="bg-white dark:bg-slate-800">Name Z-A</option>
                  <option value="newest" className="bg-white dark:bg-slate-800">Newest Joined</option>
                  <option value="oldest" className="bg-white dark:bg-slate-800">Oldest Joined</option>
                </select>
              </div>

              {isPreview && (
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className={`px-2.5 sm:px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 text-gray-600 dark:text-slate-300 font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-slate-700/50 disabled:opacity-40 disabled:cursor-not-allowed ${page === 1 ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <div className="px-3 sm:px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 text-xs sm:text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    Page {page}
                  </div>
                  <button
                    disabled={page === Math.ceil(totalMatchingCount / PAGE_SIZE)}
                    onClick={() => setPage((p) => Math.min(Math.ceil(totalMatchingCount / PAGE_SIZE), p + 1))}
                    className={`px-2.5 sm:px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 text-gray-600 dark:text-slate-300 font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-slate-700/50 disabled:opacity-40 disabled:cursor-not-allowed ${page === Math.ceil(totalMatchingCount / PAGE_SIZE) ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}

              <button
                onClick={exportCSV}
                className="group flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl 
                  bg-green-50 dark:bg-green-500/10 
                  border border-green-200 dark:border-green-500/20 
                  text-green-700 dark:text-green-400 
                  hover:bg-green-100 dark:hover:bg-green-500/20 
                  hover:border-green-300 dark:hover:border-green-500/30 
                  transition-all duration-200 font-medium cursor-pointer flex-shrink-0"
              >
                <Download size={14} className="sm:w-4 sm:h-4 group-hover:translate-y-0.5 transition-transform duration-200" />
                <span className="text-xs sm:text-sm whitespace-nowrap">Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── SELECTION BANNER ──────────────────────────────────────────────── */}
        {(selectedIds.length > 0 || isAllMatchingSelected) && (
          <div className="relative overflow-hidden rounded-2xl 
            bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
            backdrop-blur-xl border border-gray-200 dark:border-slate-700/50 shadow-xl">

            {/* Count bar */}
            <div className="relative p-4 border-b border-gray-200 dark:border-slate-700/50">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
              <div className="relative flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
{isAllMatchingSelected ? (
  <span className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">
    All {totalMatchingCount.toLocaleString()} matching students selected
  </span>
) : hasCrossPageSelection ? (
  <span className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">
    {selectedIds.length} selected across multiple pages
  </span>
) : (
  <span className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">
    {selectedIds.length} of {students.length} on this page selected
  </span>
)}
                  </div>

                    {/* Clear cross-page selection — ← ADD THIS BLOCK */}
  {!isAllMatchingSelected && hasCrossPageSelection && (
    <button
      onClick={resetSelection}
      className="text-sm font-medium text-gray-500 dark:text-slate-400 
        underline underline-offset-2 hover:text-gray-700 dark:hover:text-slate-200 
        transition-colors duration-150 cursor-pointer whitespace-nowrap"
    >
      Clear selection
    </button>
  )}

                  {/* "Select all matching" prompt */}
                  {!isAllMatchingSelected &&
                    allPageIds.every((id) => selectedIds.includes(id)) &&
                    totalMatchingCount > selectedIds.length && (
                    <button
                      onClick={handleSelectAllMatching}
                      className="text-sm font-medium text-cyan-600 dark:text-cyan-400 
                        underline underline-offset-2 hover:text-cyan-700 dark:hover:text-cyan-300 
                        transition-colors duration-150 cursor-pointer whitespace-nowrap"
                    >
                      Select all {totalMatchingCount.toLocaleString()} students
                    </button>
                  )}

                  {/* Clear selection */}
                  {isAllMatchingSelected && (
                    <button
                      onClick={resetSelection}
                      className="text-sm font-medium text-gray-500 dark:text-slate-400 
                        underline underline-offset-2 hover:text-gray-700 dark:hover:text-slate-200 
                        transition-colors duration-150 cursor-pointer whitespace-nowrap"
                    >
                      Clear selection
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Bulk action buttons */}
            <div className="relative p-4">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
              <div className="relative flex flex-wrap gap-3 items-center">
                <button
                  onClick={blockSelected}
                  className="group flex items-center gap-2 px-4 py-2 rounded-xl 
                    bg-red-500/10 border border-red-500/20 
                    text-red-600 dark:text-red-400 
                    hover:bg-red-500/20 hover:border-red-500/30 
                    transition-all duration-200 font-medium cursor-pointer"
                >
                  <Ban size={16} />
                  <span className="text-sm">
                    Block {isAllMatchingSelected ? `All ${totalMatchingCount.toLocaleString()}` : selectedIds.length}
                  </span>
                </button>

<div className="relative inline-flex items-center group/container">
  {/* Original Button */}
  <button
    onClick={openEmailModal}
    className="group flex items-center gap-2 px-4 py-2 rounded-xl 
      bg-cyan-500/10 border border-cyan-500/20 
      text-cyan-600 dark:text-cyan-400 
      hover:bg-cyan-500/20 hover:border-cyan-500/30 
      transition-all duration-200 font-medium cursor-pointer"
  >
    <Mail size={16} />
    <span className="text-sm">Send Email</span>
  </button>

  {/* Floating Badge - Amber Color */}
  {!emailModalOpen && (() => {
    try {
      const d = JSON.parse(localStorage.getItem("email_draft_students") || "{}");
      return d.subject || d.body; 
    } catch { return false; }
  })() && (
    <div 
      onClick={openEmailModal}
      className="absolute -top-2 -right-2 flex items-center gap-1.5 px-2 py-0.5 
        rounded-full bg-amber-500 shadow-lg shadow-amber-500/40
        border-2 border-white dark:border-slate-900
        cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 
        z-10 select-none animate-in zoom-in duration-300"
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
      </span>
      <span className="text-[9px] font-black uppercase text-white tracking-wider">
        Draft
      </span>
    </div>
  )}
</div>

                <div className="relative inline-flex items-center group/container">
  {/* Original Button */}
  <button
    onClick={openNotificationModal}
    className="group flex items-center gap-2 px-4 py-2 rounded-xl 
      bg-yellow-500/10 border border-yellow-500/20 
      text-yellow-600 dark:text-yellow-400 
      hover:bg-yellow-500/20 hover:border-yellow-500/30 
      transition-all duration-200 font-medium cursor-pointer"
  >
    <Bell size={16} />
    <span className="text-sm">Send Notification</span>
  </button>

  {/* Floating Badge - Amber Color */}
  {!notificationModalOpen && (() => {
    try {
      const d = JSON.parse(localStorage.getItem("notification_draft_students") || "{}");
      return d.title || d.description || d.actionUrl;
    } catch { return false; }
  })() && (
    <div 
      onClick={() => setNotificationModalOpen(true)}
      className="absolute -top-2 -right-2 flex items-center gap-1.5 px-2 py-0.5 
        rounded-full bg-amber-500 shadow-lg shadow-amber-500/40
        border-2 border-white dark:border-slate-900
        cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 
        z-10 select-none animate-in zoom-in duration-300"
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
      </span>
      <span className="text-[9px] font-black uppercase text-white tracking-wider">
        Draft
      </span>
    </div>
  )}
</div>
              </div>
            </div>
          </div>
        )}

        {/* TABLE */}
        <StudentsTable
          students={students}
          selectedStudents={selectedIds}
          isAllMatchingSelected={isAllMatchingSelected}
          isHeaderChecked={isHeaderChecked}
          isHeaderIndeterminate={isHeaderIndeterminate}
          onSelectStudent={handleSelectStudent}
          onSelectAll={handleSelectAll}
          onEdit={openEdit}
          menuOpenId={menuOpenId}
          setMenuOpenId={setMenuOpenId}
          isPreview={isPreview}
          page={page}
          setPage={setPage}
          totalRows={totalMatchingCount}
          PAGE_SIZE={PAGE_SIZE}
          isLoadingStudents={isLoadingStudents}
        />

        {/* EDIT MODAL */}
        {editModalOpen && selectedStudent && (
          <EditStudentModal
            open={editModalOpen}
            student={selectedStudent}
            hasChanges={hasChanges}
            changedFields={changedFields}
            onClose={() => {
              setEditModalOpen(false);
              setOriginalStudent(null);
            }}
            onChange={handleEditStudent}
            onSave={handleSaveStudent}
          />
        )}

        {/* SEND NOTIFICATION MODAL */}
        <SendNotificationModal
          open={notificationModalOpen}
          onClose={() => setNotificationModalOpen(false)}
          title={notificationTitle}
          setTitle={setNotificationTitle}
          description={notificationDescription}
          setDescription={setNotificationDescription}
          type={notificationType}
          setType={setNotificationType}
          icon={notificationIcon}
          setIcon={setNotificationIcon}
          iconColor={notificationIconColor}
          setIconColor={setNotificationIconColor}
          iconBg={notificationIconBg}
          setIconBg={setNotificationIconBg}
          isImportant={notificationImportant}
          setIsImportant={setNotificationImportant}
          actionUrl={notificationActionUrl}
          setActionUrl={setNotificationActionUrl}
selectedRecipients={notificationRecipients}

          recipientLabel="Students"
          recipientSingular="Student"
getRecipientName={(s) => s.name}
getRecipientSubtext={(s) => s.email}
getRecipientInitial={(s) => s.name?.[0]?.toUpperCase()}
          onSend={handleSendNotifications}
          onDiscard={() => {
  setNotificationTitle("");
  setNotificationDescription("");
  setNotificationType("info");
  setNotificationIcon("");
  setNotificationIconColor("#38bdf8");
  setNotificationIconBg("#0f172a");
  setNotificationImportant(false);
  setNotificationActionUrl("");
  setNotificationModalOpen(false);
  setNotificationRecipients([]);
}}
// AFTER:
activeEmailSet={
  isAllMatchingSelected
    ? new Set(['__all_matching__'])
    : new Set(selectedStudentsData.map((s) => s.email))
}
onChangeRecipients={setNotificationRecipients}

draftKey="notification_draft_students"
        />

        {/* SEND EMAIL MODAL */}
        <SendEmailModal
          isOpen={emailModalOpen}
          onClose={() => setEmailModalOpen(false)}
          recipients={selectedEmails}
          onChangeRecipients={setSelectedEmails}
          subject={emailSubject}
          setSubject={setEmailSubject}
          body={emailBody}
          setBody={setEmailBody}
          onSend={handleSendBulkEmail}
          recipientLabel="Students"
          recipientSingular="Student"
          getRecipientName={(r) => r.name || r.email}
getRecipientSubtext={(r) => r.isSummaryPlaceholder ? null : r.email}
          getRecipientInitial={(r) =>
            r.name?.[0]?.toUpperCase() || r.email?.[0]?.toUpperCase() || "S"
          }
          onDiscard={handleDiscardEmail}

          draftKey="email_draft_students"
activeEmailSet={new Set(selectedStudentsData.map((s) => s.email))}
        />
      </div>
    </section>
  );
};

export default StudentsSection;