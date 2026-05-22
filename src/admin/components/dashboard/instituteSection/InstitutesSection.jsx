// src/components/InstitutesSection.jsx
import { useState, useEffect, useCallback } from "react";
import {
  Search,
  ArrowLeft,
  ArrowRight,
  Plus,
  Download,
  Mail,
  Ban,
  Building2,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import InstitutesTable from "./InstitutesTable";
import AddInstituteModal from "./AddInstituteModal";
import EditInstituteModal from "../EditInstituteModal";
import { validateInstitute, initialInstituteState } from "./validateInstitute";
import { supabase } from "../../../supabase/SupabaseClient";
import { useSupabase } from "../../../supabase/SupabaseProvider";
import NotificationService from "../../common/services/NotificationService";
import Loading from "../../common/Loading";
import SendEmailModal from "../../common/SendEmailModal";
import SendNotificationModal from "../../common/sendNotificationModal";
import {
  sendWelcomeEmail,
  sendBulkEmails,
} from "../../common/services/emailService";

const InstitutesSection = ({ mode = "full" }) => {
  const [institutes, setInstitutes] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("");

  // ─── SELECTION STATE ──────────────────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState([]); // IDs visible on current page that are checked
  const [isAllMatchingSelected, setIsAllMatchingSelected] = useState(false); // "Select all X" banner clicked
  const [currentFilters, setCurrentFilters] = useState({}); // snapshot of filters at time of "Select all"
  const [totalMatchingCount, setTotalMatchingCount] = useState(0); // count for current search/filter combo
  // ─────────────────────────────────────────────────────────────────────────

  const [addOpen, setAddOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);

  const [newInstitute, setNewInstitute] = useState(initialInstituteState);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const isPreview = mode === "preview";
  const [totalRows, setTotalRows] = useState(0);
  const PAGE_SIZE = isPreview ? 5 : 20;
  const [isLoadingInstitutes, setIsLoadingInstitutes] = useState(true);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [selectedEmails, setSelectedEmails] = useState([]);

  // Notification modal state
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationDescription, setNotificationDescription] = useState("");
  const [notificationType, setNotificationType] = useState("info");
  const [notificationIcon, setNotificationIcon] = useState("");
  const [notificationIconColor, setNotificationIconColor] = useState("#38bdf8");
  const [notificationIconBg, setNotificationIconBg] = useState("#0f172a");
  const [notificationImportant, setNotificationImportant] = useState(false);
  const [notificationActionUrl, setNotificationActionUrl] = useState("");

  const [originalInstitute, setOriginalInstitute] = useState(null);
  const [suspendConfirmOpen, setSuspendConfirmOpen] = useState(false);

  const [selectedInstitutesData, setSelectedInstitutesData] = useState([]);

  const [notificationRecipients, setNotificationRecipients] = useState([]);

  const { user: currentAdmin } = useSupabase();

  // ─── HELPERS ─────────────────────────────────────────────────────────────

  /** Apply the same search/sort filters to any query builder */
  const applyFilters = useCallback(
    (query, filters = {}) => {
      const s = filters.search ?? search;
      const sort = filters.sortOption ?? sortOption;

      if (s) {
        query = query.or(
          `institute_name.ilike.%${s}%,location_city.ilike.%${s}%,account_status.ilike.%${s}%,institute_email.ilike.%${s}%`,
        );
      }

      let orderBy = "activated_at";
      let ascending = false;
      switch (sort) {
        case "name-asc":
          orderBy = "institute_name";
          ascending = true;
          break;
        case "name-desc":
          orderBy = "institute_name";
          ascending = false;
          break;
        case "revenue-asc":
          orderBy = "revenue";
          ascending = true;
          break;
        case "revenue-desc":
          orderBy = "revenue";
          ascending = false;
          break;
      }
      return query.order(orderBy, { ascending });
    },
    [search, sortOption],
  );

  /** Reset selection entirely */
  const resetSelection = () => {
    setSelectedIds([]);
    setIsAllMatchingSelected(false);
    setCurrentFilters({});
    setSelectedInstitutesData([]);
  };
  useEffect(() => {
    setSelectedInstitutesData((prev) => {
      const prevMap = new Map(prev.map((i) => [i.institute_id, i]));
      institutes.forEach((i) => {
        if (selectedIds.includes(i.institute_id)) {
          prevMap.set(i.institute_id, i);
        }
      });
      for (const key of prevMap.keys()) {
        if (!selectedIds.includes(key)) prevMap.delete(key);
      }
      return Array.from(prevMap.values());
    });
  }, [selectedIds, institutes]);

  // ─── FETCH PAGINATED INSTITUTES + MATCHING COUNT ─────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingInstitutes(true);
      try {
        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        // 1. Rows
        let q = supabase.from("institutes").select(`
        id, institute_name, institute_type, location_city,
        account_status, revenue, admin_notes, institute_email,
        password, activated_at, auth_user_id
      `);
        q = applyFilters(q);
        const { data, error } = await q.range(from, to);
        if (error) throw error;

        setInstitutes(
          data.map((inst) => ({
            institute_id: inst.id,
            institute_name: inst.institute_name || "",
            institute_type: inst.institute_type || "",
            location_city: inst.location_city || "",
            account_status: inst.account_status || "Pending",
            institute_email: inst.institute_email || "",
            revenue: inst.revenue || "0",
            admin_notes: inst.admin_notes || "",
            password: inst.password || "",
            auth_user_id: inst.auth_user_id || null,
          })),
        );

        // 2. Count
        if (!search) {
          const { data: kpi } = await supabase
            .from("kpi_totals")
            .select("total_institutes")
            .eq("id", 1)
            .single();
          const total = kpi?.total_institutes || 0;
          setTotalRows(total);
          setTotalMatchingCount(total);
        } else {
          let cq = supabase
            .from("institutes")
            .select("id", { count: "exact", head: true });
          cq = applyFilters(cq);
          const { count } = await cq;
          setTotalMatchingCount(count ?? 0);
        }
      } catch (err) {
        console.error("Error fetching institutes:", err.message);
      } finally {
        setIsLoadingInstitutes(false);
      }
    };

    const timeout = setTimeout(fetchData, 500);
    return () => clearTimeout(timeout);
  }, [page, isPreview, PAGE_SIZE, sortOption, search]); // eslint-disable-line
  // Add this separately — only syncs count, no row fetch

  // ─── SELECTION HANDLERS ──────────────────────────────────────────────────

  /** Header checkbox: select / deselect current page */
  const handleSelectAll = () => {
    if (isAllMatchingSelected) {
      resetSelection();
      const allPageIds = institutes.map((i) => i.institute_id);
      setSelectedIds(allPageIds);
      return;
    }

    const allPageIds = institutes.map((i) => i.institute_id);
    const allPageSelected = allPageIds.every((id) => selectedIds.includes(id));

    if (allPageSelected) {
      // Deselect current page
      setSelectedIds((prev) => prev.filter((id) => !allPageIds.includes(id)));
    } else {
      // Select current page (merge with any cross-page selections)
      setSelectedIds((prev) => Array.from(new Set([...prev, ...allPageIds])));
    }

    setIsAllMatchingSelected(false);
  };

  /** Individual row checkbox */
  const handleSelectInstitute = (id) => {
    if (isAllMatchingSelected) {
      // Exit "all matching" mode, switch to explicit page selection
      setIsAllMatchingSelected(false);
      setSelectedIds(
        institutes.map((i) => i.institute_id).filter((iid) => iid !== id),
      );
      return;
    }
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  /** Banner: "Select all X matching institutes" */
  const handleSelectAllMatching = () => {
    setIsAllMatchingSelected(true);
    setSelectedIds([]);
    setCurrentFilters({ search, sortOption }); // snapshot
  };

  // Derived helpers for the table checkbox state
  const allPageIds = institutes.map((i) => i.institute_id);
  const isHeaderChecked =
    isAllMatchingSelected ||
    (allPageIds.length > 0 &&
      allPageIds.every((id) => selectedIds.includes(id)));
  const isHeaderIndeterminate =
    !isAllMatchingSelected &&
    selectedIds.some((id) => allPageIds.includes(id)) &&
    !isHeaderChecked;

  const hasCrossPageSelection = selectedIds.some(
    (id) => !allPageIds.includes(id),
  );

  const selectionCount = isAllMatchingSelected
    ? totalMatchingCount
    : selectedIds.length;

  // ─── EMAIL MODAL OPENER ───────────────────────────────────────────────────
  // AFTER:
  const openEmailModal = () => {
    if (isAllMatchingSelected) {
      setSelectedEmails([
        {
          name: `All ${totalMatchingCount.toLocaleString()} matching institutes`,
          email: "__all_matching__",
          isSummaryPlaceholder: true,
          count: totalMatchingCount,
        },
      ]);
      setEmailModalOpen(true);
      return;
    }

    const newRecipients = selectedInstitutesData.map((i) => ({
      name: i.institute_name,
      email: i.institute_email,
    }));

    setSelectedEmails((prev) => {
      // Keep placeholder if exists (update its count), strip nothing
      const placeholder = prev.find((r) => r.isSummaryPlaceholder);
      const prevReal = prev.filter((r) => !r.isSummaryPlaceholder);
      const existingEmails = new Set(prevReal.map((r) => r.email));
      const merged = [
        ...prevReal,
        ...newRecipients.filter((r) => !existingEmails.has(r.email)),
      ];
      // Put placeholder at end if it existed
      return placeholder ? [...merged, placeholder] : merged;
    });

    setEmailModalOpen(true);
  };

  const handleDiscardEmail = () => {
    setSelectedEmails([]);
    setEmailSubject("");
    setEmailBody("");
    setEmailModalOpen(false);
  };

  // ─── BULK ACTIONS ─────────────────────────────────────────────────────────

  /** 1. Suspend */
  const blockSelected = async () => {
    try {
      if (isAllMatchingSelected) {
        // Filter-based update — no ID list needed
        let q = supabase
          .from("institutes")
          .update({ account_status: "Suspended" });
        if (currentFilters.search) {
          q = q.or(
            `institute_name.ilike.%${currentFilters.search}%,location_city.ilike.%${currentFilters.search}%,account_status.ilike.%${currentFilters.search}%,institute_email.ilike.%${currentFilters.search}%`,
          );
        }
        const { error } = await q;
        if (error) throw error;
        // Refresh local rows
        setInstitutes((prev) =>
          prev.map((inst) => ({ ...inst, account_status: "Suspended" })),
        );
      } else {
        if (!selectedIds.length) return;
        const { error } = await supabase
          .from("institutes")
          .update({ account_status: "Suspended" })
          .in("id", selectedIds);
        if (error) throw error;
        setInstitutes((prev) =>
          prev.map((inst) =>
            selectedIds.includes(inst.institute_id)
              ? { ...inst, account_status: "Suspended" }
              : inst,
          ),
        );
      }

      resetSelection();
      NotificationService.success(
        `${selectionCount} institute${selectionCount !== 1 ? "s" : ""} suspended!`,
      );
    } catch (err) {
      NotificationService.error("Error suspending institutes: " + err.message);
    }
  };

  /** 2. Send Email — resolves recipients then opens modal */
  const handleSendBulkEmail = async (emails, subject, body) => {
    let resolvedEmails = emails;

    if (isAllMatchingSelected) {
      try {
        let q = supabase
          .from("institutes")
          .select("institute_name, institute_email");
        if (currentFilters.search) {
          q = q.or(
            `institute_name.ilike.%${currentFilters.search}%,location_city.ilike.%${currentFilters.search}%,account_status.ilike.%${currentFilters.search}%,institute_email.ilike.%${currentFilters.search}%`,
          );
        }
        const { data, error } = await q;
        if (error) throw error;
        resolvedEmails = data.map((i) => ({
          name: i.institute_name,
          email: i.institute_email,
        }));
      } catch (err) {
        NotificationService.error(
          "Could not resolve recipients: " + err.message,
        );
        return;
      }
    } else {
      // Strip placeholder if it somehow slipped through
      resolvedEmails = (emails || []).filter((r) => !r.isSummaryPlaceholder);
    }

    if (!resolvedEmails?.length) {
      return NotificationService.error("No recipients found!");
    }

    try {
      await sendBulkEmails(resolvedEmails, subject, body);
      NotificationService.success(
        `Email sent to ${resolvedEmails.length} recipient(s)`,
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

  /** 3. Send Notifications */
  const handleSendInstituteNotifications = async () => {
    try {
      let notifRows = [];

      if (isAllMatchingSelected) {
        // Fetch only auth_user_id for matching rows
        let q = supabase.from("institutes").select("auth_user_id");
        if (currentFilters.search) {
          q = q.or(
            `institute_name.ilike.%${currentFilters.search}%,location_city.ilike.%${currentFilters.search}%,account_status.ilike.%${currentFilters.search}%,institute_email.ilike.%${currentFilters.search}%`,
          );
        }
        const { data, error } = await q;
        if (error) throw error;
        notifRows = data.map((r) => r.auth_user_id).filter(Boolean);
        // NEW
      } else {
        notifRows = notificationRecipients
          .filter((r) => !r.isSummaryPlaceholder)
          .map((r) => r.auth_user_id)
          .filter(Boolean);

        if (!notifRows.length) {
          NotificationService.error("No valid recipients!");
          return;
        }
      }

      const notifications = notifRows.map((userId) => ({
        user_id: userId,
        title: notificationTitle,
        description: notificationDescription,
        icon: notificationIcon,
        icon_color: notificationIconColor,
        icon_bg: notificationIconBg,
        type: notificationType,
        is_important: notificationImportant,
        is_read: false,
        action_url: notificationActionUrl || null,
      }));

      const { error } = await supabase
        .from("institute_notification")
        .insert(notifications);
      if (error) throw error;

      setNotificationModalOpen(false);
      setNotificationRecipients([]);
      setNotificationTitle("");
      setNotificationDescription("");
      setNotificationType("info");
      setNotificationIcon("");
      setNotificationIconColor("#38bdf8");
      setNotificationIconBg("#0f172a");
      setNotificationImportant(false);
      setNotificationActionUrl("");
      resetSelection();

      NotificationService.success(
        `Notifications sent to ${notifRows.length} institute${notifRows.length !== 1 ? "s" : ""}!`,
      );
    } catch (err) {
      NotificationService.error("Failed to send notifications: " + err.message);
    }
  };

  const openNotificationModal = () => {
    if (isAllMatchingSelected) {
      setNotificationRecipients([
        {
          name: `All ${totalMatchingCount.toLocaleString()} matching institutes`,
          email: "__all_matching__",
          isSummaryPlaceholder: true,
          count: totalMatchingCount,
        },
      ]);
      setNotificationModalOpen(true);
      return;
    }

    const newRecipients = selectedInstitutesData.map((i) => ({
      name: i.institute_name,
      email: i.institute_email,
      id: i.institute_id,
      auth_user_id: i.auth_user_id,
    }));
    setNotificationRecipients((prev) => {
      const placeholder = prev.find((r) => r.isSummaryPlaceholder);
      const prevReal = prev.filter((r) => !r.isSummaryPlaceholder);
      const existingEmails = new Set(prevReal.map((r) => r.email));
      const merged = [
        ...prevReal,
        ...newRecipients.filter((r) => !existingEmails.has(r.email)),
      ];
      return placeholder ? [...merged, placeholder] : merged;
    });
    setNotificationModalOpen(true);
  };

  // ─── OTHER HANDLERS ───────────────────────────────────────────────────────

  const exportCSV = () => {
    if (!institutes.length) {
      NotificationService.error("No institutes to export!");
      return;
    }
    const headers = [
      "ID",
      "Name",
      "City",
      "Revenue",
      "Status",
      "Email",
      "Notes",
    ];
    const sanitize = (v) => String(v ?? "").replace(/\r?\n|\r/g, " ");
    const rows = institutes.map((i) => [
      sanitize(i.institute_id),
      sanitize(i.institute_name),
      sanitize(i.location_city),
      sanitize(i.revenue),
      sanitize(i.account_status),
      sanitize(i.institute_email),
      sanitize(i.admin_notes),
    ]);
    const csv =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((r) => r.map((v) => `"${v}"`).join(","))
        .join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", "institutes_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    NotificationService.success("CSV exported successfully!");
  };

  const resetForm = () => {
    setNewInstitute(initialInstituteState);
    setErrors({});
  };

  const openEdit = (inst) => {
    setSelected({ ...inst });
    setOriginalInstitute({ ...inst });
    setModalOpen(true);
  };

  // ─── SAVE NEW INSTITUTE ───────────────────────────────────────────────────
  const handleSaveNewInstitute = async () => {
    if (isSaving) return;
    setIsSaving(true);
    const validationErrors = validateInstitute(newInstitute);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSaving(false);
      return;
    }
    const emailExists = institutes.some(
      (inst) => inst.institute_email === newInstitute.institute_email,
    );
    if (emailExists) {
      setErrors({ institute_email: "This email is already used" });
      setIsSaving(false);
      return;
    }

    try {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
      const tempPassword = Array.from(
        { length: 10 },
        () => chars[Math.floor(Math.random() * chars.length)],
      ).join("");

      const { data, error } = await supabase
        .from("institutes")
        .insert([
          {
            institute_name: newInstitute.institute_name,
            institute_display_name: newInstitute.institute_display_name,
            institute_email: newInstitute.institute_email,
            support_email: newInstitute.support_email,
            contact_person_name: newInstitute.contact_person_name,
            contact_person_designation: newInstitute.contact_person_designation,
            contact_phone: newInstitute.contact_phone,
            contact_phone_alt: newInstitute.contact_phone_alt,
            institute_type: newInstitute.institute_type,
            location_city: newInstitute.location_city,
            location_state: newInstitute.location_state,
            location_country: newInstitute.location_country,
            location_pin: newInstitute.location_pin,
            latitude: newInstitute.latitude,
            longitude: newInstitute.longitude,
            account_status: "Invited",
            password: tempPassword,
            revenue: newInstitute.revenue || "0",
            admin_notes: newInstitute.admin_notes || "",
            created_by_admin_uid: currentAdmin?.id || null,
            created_by_admin_name: currentAdmin?.full_name || null,
          },
        ])
        .select();

      if (error) throw error;

      await supabase.rpc("update_kpi", {
        kpi_name: "total_institutes",
        delta: 1,
      });

      const inst = data[0];
      setInstitutes((prev) => [
        ...prev,
        {
          institute_id: inst.id,
          institute_name: inst.institute_name,
          location_city: inst.location_city,
          account_status: inst.account_status,
          institute_email: inst.institute_email,
          revenue: inst.revenue || "0",
          admin_notes: inst.admin_notes || "",
          password: inst.password,
        },
      ]);

      NotificationService.payload("Institute added successfully", tempPassword);
      sendWelcomeEmail(
        newInstitute.institute_email,
        newInstitute.institute_display_name || newInstitute.institute_name,
        tempPassword,
      );
      resetForm();
      setAddOpen(false);
    } catch (err) {
      NotificationService.error("Error adding institute: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // ─── EDIT INSTITUTE ───────────────────────────────────────────────────────
  const handleSaveEdit = async (updatedInstitute) => {
    if (!originalInstitute) return;
    const keysToCheck = [
      "institute_name",
      "institute_display_name",
      "institute_type",
      "institute_email",
      "support_email",
      "contact_person_name",
      "contact_person_designation",
      "contact_phone",
      "contact_phone_alt",
      "location_city",
      "location_state",
      "location_country",
      "location_pin",
      "account_status",
      "revenue",
      "admin_notes",
    ];
    const changes = {};
    keysToCheck.forEach((key) => {
      if (
        updatedInstitute[key] !== undefined &&
        updatedInstitute[key] !== originalInstitute[key]
      )
        changes[key] = updatedInstitute[key];
    });
    if (!Object.keys(changes).length) {
      NotificationService.error("No changes detected!");
      return;
    }

    try {
      changes.updated_at = new Date().toISOString();
      const { error } = await supabase
        .from("institutes")
        .update(changes)
        .eq("id", updatedInstitute.institute_id);
      if (error) throw error;
      setInstitutes((prev) =>
        prev.map((inst) =>
          inst.institute_id === updatedInstitute.institute_id
            ? { ...inst, ...changes }
            : inst,
        ),
      );
      setModalOpen(false);
      setOriginalInstitute(null);
      NotificationService.success("Institute updated successfully!");
    } catch (err) {
      console.error(err);
      NotificationService.error("Failed to save institute!");
    }
  };

  const getChangedFields = () => {
    if (!selected || !originalInstitute) return {};
    const keysToCheck = [
      "institute_name",
      "institute_display_name",
      "institute_type",
      "institute_email",
      "support_email",
      "contact_person_name",
      "contact_person_designation",
      "contact_phone",
      "contact_phone_alt",
      "location_city",
      "location_state",
      "location_country",
      "location_pin",
      "account_status",
      "revenue",
      "admin_notes",
    ];
    const changes = {};
    keysToCheck.forEach((key) => {
      if (selected[key] !== originalInstitute[key]) changes[key] = true;
    });
    return changes;
  };

  const changedFields = getChangedFields();
  const hasChanges = Object.keys(changedFields).length > 0;

  useEffect(() => {
    setSelectedEmails((prev) => {
      const placeholder = prev.find((r) => r.isSummaryPlaceholder);
      if (!placeholder) return prev;
      // Update placeholder count to reflect how many are still unaccounted for
      return prev.map((r) =>
        r.isSummaryPlaceholder
          ? { ...r, count: totalMatchingCount - selectedInstitutesData.length }
          : r,
      );
    });
  }, [selectedInstitutesData, totalMatchingCount]);

  useEffect(() => {
    setNotificationRecipients((prev) => {
      const placeholder = prev.find((r) => r.isSummaryPlaceholder);
      if (!placeholder) return prev;
      return prev.map((r) =>
        r.isSummaryPlaceholder
          ? { ...r, count: totalMatchingCount - selectedInstitutesData.length }
          : r,
      );
    });
  }, [selectedInstitutesData, totalMatchingCount]);
  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <section>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header in preview only */}
        {isPreview && (
          <div
            className="flex justify-between items-center p-6 rounded-2xl 
            bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
            backdrop-blur-xl border border-gray-200 dark:border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                <Building2
                  size={20}
                  className="text-cyan-600 dark:text-cyan-400"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Institutes Overview
                </h3>
                <p className="text-xs font-bold text-black dark:text-amber-200">
                  Click "View Full" to add up an institute
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate("/admin/institutes-management");
              }}
              className="group flex items-center gap-2 px-4 py-2 rounded-xl 
                bg-cyan-500/10 border border-cyan-500/20 
                text-cyan-600 dark:text-cyan-400 
                hover:bg-cyan-500/20 hover:border-cyan-500/30 
                transition-all duration-200 text-sm font-medium cursor-pointer">
              <span>View Full</span>
              <ArrowRight
                size={16}
                className="group-hover:translate-x-0.5 transition-transform duration-200"
              />
            </button>
          </div>
        )}

        {/* HEADER */}
        {!isPreview && (
          <div
            id="tour-institutes-header"
            className="relative overflow-hidden rounded-2xl 
            bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
            backdrop-blur-xl border border-gray-200 dark:border-slate-700/50 shadow-xl p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-3">
                <button
                  onClick={() => navigate(-1)}
                  className="group flex items-center gap-2 text-sm 
                    text-gray-600 dark:text-slate-400 
                    hover:text-cyan-600 dark:hover:text-cyan-400 
                    transition-all duration-200 cursor-pointer">
                  <ArrowLeft
                    size={16}
                    className="group-hover:-translate-x-1 transition-transform duration-200"
                  />
                  <span className="font-medium">Back</span>
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                    <Building2
                      size={24}
                      className="text-cyan-600 dark:text-cyan-400"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Institutes Management
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-slate-400 mt-0.5">
                      Monitor institute performance, exam activity, and revenue
                      metrics
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-auto flex justify-end">
                <button
                  id="tour-institutes-add"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAddOpen(true);
                  }}
                  className="group flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold hover:from-cyan-600 hover:to-cyan-700 transition-all duration-200 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 cursor-pointer">
                  <Plus size={18} />
                  <span>Add Institute</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SEARCH + SORT + EXPORT */}
        <div
          id="tour-institutes-search"
          className="relative overflow-hidden rounded-2xl 
          bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
          backdrop-blur-xl border border-gray-200 dark:border-slate-700/50 shadow-xl p-3 sm:p-4 lg:p-5">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
          <div className="relative flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch lg:items-center lg:justify-between">
            <div className="relative flex-1 max-w-full lg:max-w-md">
              <Search
                size={18}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by name, city, status, or email..."
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl 
                  bg-white dark:bg-slate-800/50 
                  border border-gray-300 dark:border-slate-700/50 
                  text-gray-900 dark:text-white 
                  placeholder-gray-400 dark:placeholder-slate-500 
                  focus:border-cyan-500 dark:focus:border-cyan-500/50 
                  focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20 
                  transition-all duration-200 outline-none"
              />
            </div>

            <div className="flex gap-2 sm:gap-3 items-center overflow-x-auto pb-2 lg:pb-0 -mx-3 px-3 sm:mx-0 sm:px-0 lg:overflow-visible scrollbar-hide">
              <div
                className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl 
                bg-white dark:bg-slate-800/50 
                border border-gray-300 dark:border-slate-700/50 flex-shrink-0">
                <Filter
                  size={14}
                  className="sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400"
                />
                <label
                  htmlFor="sort"
                  className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 font-medium whitespace-nowrap">
                  Sort:
                </label>
                <select
                  id="sort"
                  value={sortOption}
                  onChange={(e) => {
                    setSortOption(e.target.value);
                    setPage(1);
                  }}
                  className="bg-transparent text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none cursor-pointer pr-2">
                  <option value="" className="bg-white dark:bg-slate-800">
                    None
                  </option>
                  <option
                    value="name-asc"
                    className="bg-white dark:bg-slate-800">
                    Name A-Z
                  </option>
                  <option
                    value="name-desc"
                    className="bg-white dark:bg-slate-800">
                    Name Z-A
                  </option>
                  <option
                    value="revenue-asc"
                    className="bg-white dark:bg-slate-800">
                    Revenue ↑
                  </option>
                  <option
                    value="revenue-desc"
                    className="bg-white dark:bg-slate-800">
                    Revenue ↓
                  </option>
                </select>
              </div>

              {isPreview && (
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className={`px-2.5 sm:px-3 py-2 rounded-xl bg-gray-100 dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700/50 text-gray-700 dark:text-slate-300 font-medium transition-all duration-200 hover:bg-gray-200 dark:hover:bg-slate-700/50 disabled:opacity-40 disabled:cursor-not-allowed ${page === 1 ? "cursor-not-allowed" : "cursor-pointer"}`}>
                    <ArrowLeft size={16} />
                  </button>
                  <div className="px-3 sm:px-4 py-2 rounded-xl bg-white dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700/50 text-xs sm:text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    Page {page}
                  </div>
                  <button
                    disabled={
                      page === Math.ceil(totalMatchingCount / PAGE_SIZE)
                    }
                    onClick={() =>
                      setPage((p) =>
                        Math.min(
                          Math.ceil(totalMatchingCount / PAGE_SIZE),
                          p + 1,
                        ),
                      )
                    }
                    className={`px-2.5 sm:px-3 py-2 rounded-xl bg-gray-100 dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700/50 text-gray-700 dark:text-slate-300 font-medium transition-all duration-200 hover:bg-gray-200 dark:hover:bg-slate-700/50 disabled:opacity-40 disabled:cursor-not-allowed ${page === Math.ceil(totalMatchingCount / PAGE_SIZE) ? "cursor-not-allowed" : "cursor-pointer"}`}>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}

              <button
                id="tour-institutes-export"
                onClick={exportCSV}
                className="group flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl 
                  bg-green-500/10 border border-green-500/20 
                  text-green-600 dark:text-green-400 
                  hover:bg-green-500/20 hover:border-green-500/30 
                  transition-all duration-200 font-medium cursor-pointer flex-shrink-0">
                <Download
                  size={14}
                  className="sm:w-4 sm:h-4 group-hover:translate-y-0.5 transition-transform duration-200"
                />
                <span className="text-xs sm:text-sm whitespace-nowrap">
                  Export CSV
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ── SELECTION BANNER ──────────────────────────────────────────────── */}
        {(selectedIds.length > 0 || isAllMatchingSelected) && (
          <div
            id="tour-institutes-bulk"
            className="relative overflow-hidden rounded-2xl 
            bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
            backdrop-blur-xl border border-gray-200 dark:border-slate-700/50 shadow-xl">
            {/* Count bar */}
            <div className="relative p-4 border-b border-gray-200 dark:border-slate-700/50">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent pointer-events-none" />

              <div className="relative flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                {/* Selection count pill */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                    {isAllMatchingSelected ? (
                      <span className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">
                        All {totalMatchingCount.toLocaleString()} matching
                        institutes selected
                      </span>
                    ) : hasCrossPageSelection ? (
                      <span className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">
                        {selectedIds.length} selected across multiple pages
                      </span>
                    ) : (
                      <span className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">
                        {selectedIds.length} of {institutes.length} on this page
                        selected
                      </span>
                    )}
                  </div>
                  {/* Clear cross-page selection — ← ADD THIS BLOCK */}
                  {!isAllMatchingSelected && hasCrossPageSelection && (
                    <button
                      onClick={resetSelection}
                      className="text-sm font-medium text-gray-500 dark:text-slate-400 
        underline underline-offset-2 hover:text-gray-700 dark:hover:text-slate-200 
        transition-colors duration-150 cursor-pointer whitespace-nowrap">
                      Clear selection
                    </button>
                  )}

                  {/* "Select all matching" prompt — only when page is fully selected and more exist */}
                  {!isAllMatchingSelected &&
                    allPageIds.every((id) => selectedIds.includes(id)) &&
                    totalMatchingCount > selectedIds.length && (
                      <button
                        onClick={handleSelectAllMatching}
                        className="text-sm font-medium text-cyan-600 dark:text-cyan-400 
                        underline underline-offset-2 hover:text-cyan-700 dark:hover:text-cyan-300 
                        transition-colors duration-150 cursor-pointer whitespace-nowrap">
                        Select all {totalMatchingCount.toLocaleString()}{" "}
                        institutes
                      </button>
                    )}

                  {/* Clear selection */}
                  {isAllMatchingSelected && (
                    <button
                      onClick={resetSelection}
                      className="text-sm font-medium text-gray-500 dark:text-slate-400 
                        underline underline-offset-2 hover:text-gray-700 dark:hover:text-slate-200 
                        transition-colors duration-150 cursor-pointer whitespace-nowrap">
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
                  onClick={() => setSuspendConfirmOpen(true)}
                  className="group flex items-center gap-2 px-4 py-2 rounded-xl 
                    bg-red-500/10 border border-red-500/20 
                    text-red-600 dark:text-red-400 
                    hover:bg-red-500/20 hover:border-red-500/30 
                    transition-all duration-200 font-medium cursor-pointer">
                  <Ban size={16} />
                  <span className="text-sm">
                    Suspend{" "}
                    {isAllMatchingSelected
                      ? `All ${totalMatchingCount.toLocaleString()}`
                      : selectedIds.length}
                  </span>
                </button>

                <div className="relative inline-flex items-center group/container">
                  {/* Your Original Button Style - Unchanged */}
                  <button
                    onClick={openEmailModal}
                    className="group flex items-center gap-2 px-4 py-2 rounded-xl 
      bg-cyan-500/10 border border-cyan-500/20 
      text-cyan-600 dark:text-cyan-400 
      hover:bg-cyan-500/20 hover:border-cyan-500/30 
      transition-all duration-200 font-medium cursor-pointer">
                    <Mail size={16} />
                    <span className="text-sm">Send Email</span>
                  </button>

                  {/* Your Logic + New Professional Badge Design */}
                  {!emailModalOpen &&
                    (() => {
                      try {
                        const d = JSON.parse(
                          localStorage.getItem("email_draft_institutes") ||
                            "{}",
                        );
                        return d.subject || d.body;
                      } catch {
                        return false;
                      }
                    })() && (
                      <div
                        onClick={openEmailModal}
                        className="absolute -top-2 -right-2 flex items-center gap-1.5 px-2 py-0.5 
        rounded-full bg-amber-500 shadow-lg shadow-amber-500/40
        border-2 border-white dark:border-slate-900
        cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 
        z-10 select-none">
                        {/* Animated Status Dot */}
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
                  {/* Your Original Button Style - Unchanged */}
                  <button
                    onClick={openNotificationModal}
                    className="group flex items-center gap-2 px-4 py-2 rounded-xl 
      bg-yellow-500/10 border border-yellow-500/20 
      text-yellow-600 dark:text-yellow-400 
      hover:bg-yellow-500/20 hover:border-yellow-500/30 
      transition-all duration-200 font-medium cursor-pointer">
                    <span className="text-sm">Send Notification</span>
                  </button>

                  {/* Notification Logic + Floating Badge Design */}
                  {!notificationModalOpen &&
                    (() => {
                      try {
                        const d = JSON.parse(
                          localStorage.getItem(
                            "notification_draft_institutes",
                          ) || "{}",
                        );
                        return d.title || d.description || d.actionUrl;
                      } catch {
                        return false;
                      }
                    })() && (
                      <div
                        onClick={() => setNotificationModalOpen(true)}
                        className="absolute -top-2 -right-2 flex items-center gap-1.5 px-2 py-0.5 
        rounded-full bg-amber-500 shadow-lg shadow-amber-500/40
        border-2 border-white dark:border-slate-900
        cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 
        z-10 select-none animate-in zoom-in duration-300">
                        {/* Animated Status Dot */}
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
        <div id="tour-institutes-table">
          <InstitutesTable
            institutes={institutes}
            selectedInstitutes={selectedIds}
            isAllMatchingSelected={isAllMatchingSelected}
            isHeaderChecked={isHeaderChecked}
            isHeaderIndeterminate={isHeaderIndeterminate}
            onSelectInstitute={handleSelectInstitute}
            onSelectAll={handleSelectAll}
            onEdit={openEdit}
            menuOpenId={menuOpenId}
            setMenuOpenId={setMenuOpenId}
            isPreview={isPreview}
            page={page}
            setPage={setPage}
            totalRows={totalMatchingCount}
            PAGE_SIZE={PAGE_SIZE}
            isLoadingInstitutes={isLoadingInstitutes}
          />
        </div>

        {/* ADD INSTITUTE MODAL */}
        <AddInstituteModal
          isOpen={addOpen}
          onClose={() => {
            setAddOpen(false);
            resetForm();
          }}
          newInstitute={newInstitute}
          setNewInstitute={setNewInstitute}
          errors={errors}
          onSave={handleSaveNewInstitute}
        />

        {/* EDIT INSTITUTE MODAL */}
        <EditInstituteModal
          open={modalOpen}
          institute={selected}
          mode="quick"
          changedFields={changedFields}
          hasChanges={hasChanges}
          onClose={() => {
            setModalOpen(false);
            setOriginalInstitute(null);
          }}
          onChange={(field, value) =>
            setSelected((prev) => ({ ...prev, [field]: value }))
          }
          onSave={handleSaveEdit}
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
          recipientLabel="Institutes"
          recipientSingular="Institute"
          getRecipientName={(r) => r.name || r.email}
          getRecipientSubtext={(r) => (r.isSummaryPlaceholder ? null : r.email)}
          getRecipientInitial={(r) =>
            r.name?.[0]?.toUpperCase() || r.email?.[0]?.toUpperCase() || "I"
          }
          onDiscard={handleDiscardEmail}
          draftKey="email_draft_institutes"
          activeEmailSet={
            new Set(selectedInstitutesData.map((i) => i.institute_email))
          }
        />

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
          // AFTER:
          selectedRecipients={notificationRecipients}
          onChangeRecipients={setNotificationRecipients}
          activeEmailSet={
            isAllMatchingSelected
              ? new Set(["__all_matching__"])
              : new Set(selectedInstitutesData.map((i) => i.institute_email))
          }
          recipientLabel="Institutes"
          recipientSingular="Institute"
          getRecipientName={(r) => r.name}
          getRecipientSubtext={(r) => r.email}
          getRecipientInitial={(r) =>
            r.name?.[0]?.toUpperCase() || r.email?.[0]?.toUpperCase() || "I"
          }
          onSend={handleSendInstituteNotifications}
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
          draftKey="notification_draft_institutes"
        />
      </div>

      {/* SUSPEND CONFIRMATION MODAL */}
      {suspendConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSuspendConfirmOpen(false)}
          />
          <div
            className="relative w-full max-w-md rounded-2xl 
            bg-white dark:bg-slate-900 
            border border-gray-200 dark:border-slate-700/50 
            shadow-2xl p-6 space-y-5 animate-fade-in">
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <Ban size={28} className="text-red-500" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Suspend Institutes?
              </h3>
              <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                You are about to suspend{" "}
                <span className="font-semibold text-red-500">
                  {isAllMatchingSelected
                    ? `all ${totalMatchingCount.toLocaleString()} matching`
                    : `${selectedIds.length}`}{" "}
                  institute{selectionCount !== 1 ? "s" : ""}
                </span>
                . Their accounts will be deactivated immediately. This can be
                undone by editing each institute individually.
              </p>
            </div>
            <div className="border-t border-gray-200 dark:border-slate-700/50" />
            <div className="flex gap-3">
              <button
                onClick={() => setSuspendConfirmOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-xl 
                  bg-gray-100 dark:bg-slate-800 
                  border border-gray-300 dark:border-slate-700/50 
                  text-gray-700 dark:text-slate-300 
                  hover:bg-gray-200 dark:hover:bg-slate-700 
                  font-medium text-sm transition-all duration-200 cursor-pointer">
                Cancel
              </button>
              <button
                onClick={() => {
                  setSuspendConfirmOpen(false);
                  blockSelected();
                }}
                className="flex-1 px-4 py-2.5 rounded-xl 
                  bg-red-500 hover:bg-red-600 
                  text-white font-semibold text-sm 
                  transition-all duration-200 shadow-lg shadow-red-500/25 
                  hover:shadow-red-500/40 cursor-pointer">
                Yes, Suspend
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default InstitutesSection;
