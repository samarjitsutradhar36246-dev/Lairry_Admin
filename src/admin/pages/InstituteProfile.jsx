import { ArrowLeft, Edit, Building2, Mail, Phone, MapPin, User, FileText, Clock, IndianRupee, CheckCircle, AlertCircle, XCircle, Globe } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import EditInstituteModal from "../components/dashboard/EditInstituteModal";
import { supabase } from "../supabase/SupabaseClient";
import NotificationService from"../components/common/services/NotificationService"

const InstituteProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [institute, setInstitute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState(null);

 
const [originalInstitute, setOriginalInstitute] = useState(null);

  const formatTimestamp = (ts) => {
    if (!ts) return "-";
    try {
      return new Date(ts).toLocaleString();
    } catch {
      return ts;
    }
  };

  /* ---------------------------------------------
     FETCH INSTITUTE (ADMIN VIEW)
  --------------------------------------------- */
  useEffect(() => {
    const fetchInstitute = async () => {
      try {
        const { data, error } = await supabase
          .from("institutes")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        setInstitute({
          id: data.id,
          institute_name: data.institute_name,
          institute_display_name: data.institute_display_name,
          institute_type: data.institute_type,

          account_status: data.account_status,

          institute_email: data.institute_email,
          support_email: data.support_email,
          contact_person_name: data.contact_person_name,
          contact_person_designation: data.contact_person_designation,
          contact_phone: data.contact_phone,
          contact_phone_alt: data.contact_phone_alt,

          location_city: data.location_city,
          location_state: data.location_state,
          location_country: data.location_country,
          location_pin: data.location_pin,
          latitude: data.latitude,
          longitude: data.longitude,

          revenue: data.revenue ?? "0",

          admin_notes: data.admin_notes,
          created_by_admin_name: data.created_by_admin_name,
          invited_at: data.invited_at,
          created_at: data.created_at,
          updated_at: data.updated_at,
          activated_at: data.activated_at
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Unable to load institute details");
        setLoading(false);
      }
    };

    fetchInstitute();
  }, [id]);

  /* -------------------------------
   FUNCTION: Save Edited Institute
------------------------------- */
const saveEditedInstitute = async (updatedInstitute) => {
  if (!updatedInstitute || !originalInstitute) return;

  try {
    // 1. Compute only changed fields
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
      "admin_notes"
    ];

    const changes = {};
    keysToCheck.forEach((key) => {
      if (
        updatedInstitute[key] !== undefined &&
        updatedInstitute[key] !== originalInstitute[key]
      ) {
        changes[key] = updatedInstitute[key];
      }
    });

    if (Object.keys(changes).length === 0) {
      NotificationService.error("No changes detected!");
      return;
    }

    // 2. Always update timestamp
    changes.updated_at = new Date().toISOString();

    // 3. DB call
    const { error } = await supabase
      .from("institutes")
      .update(changes)
      .eq("id", updatedInstitute.id);

    if (error) throw error;

    // 4. Update UI
    setInstitute((prev) => ({ ...prev, ...changes }));
    setEditModalOpen(false);
    setOriginalInstitute(null); // ← Add cleanup
    NotificationService.success("Institute updated successfully!");
  } catch (err) {
    NotificationService.error("Error updating institute: " + err.message);
  }
};

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-slate-950">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-slate-400 text-lg">Loading institute profile...</p>
        </div>
      </div>
    );
  }

  if (error || !institute) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 bg-white dark:bg-slate-950">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-500 dark:text-red-400 text-xl font-semibold">{error || "Institute not found"}</p>
          <button
            onClick={() => navigate(-1)}
            className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const getStatusConfig = () => {
    switch (institute.account_status) {
      case "ACTIVE":
        return {
          icon: CheckCircle,
          bgClass: "bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20",
          textClass: "text-green-600 dark:text-green-400",
          label: "Active"
        };
      case "Invited":
        return {
          icon: AlertCircle,
          bgClass: "bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/20",
          textClass: "text-yellow-600 dark:text-yellow-400",
          label: "Invited"
        };
      case "Suspended":
        return {
          icon: XCircle,
          bgClass: "bg-gradient-to-r from-red-500/10 to-rose-500/10 border-red-500/20",
          textClass: "text-red-600 dark:text-red-400",
          label: "Suspended"
        };
      default:
        return {
          icon: AlertCircle,
          bgClass: "bg-gradient-to-r from-slate-500/10 to-slate-500/10 border-slate-500/20",
          textClass: "text-gray-600 dark:text-slate-400",
          label: institute.account_status
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  
const changedFields = {};
if (selectedInstitute && originalInstitute) {
  [
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
    "admin_notes"
  ].forEach((key) => {
    if (selectedInstitute[key] !== originalInstitute[key]) {
      changedFields[key] = true;
    }
  });
}
const hasChanges = Object.keys(changedFields).length > 0;

  return (
    <section className="min-h-screen p-6  transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all duration-200"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Back to Institutes</span>
        </button>

        {/* HEADER CARD */}
        <div className="relative overflow-hidden rounded-2xl 
          bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
          backdrop-blur-xl border border-gray-200 dark:border-slate-700/50 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
          
          <div className="relative p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              
              {/* Logo/Avatar */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-5xl font-bold text-white shadow-xl ring-4 ring-gray-200 dark:ring-slate-800/50">
                  {institute.institute_name?.[0]}
                </div>
                <div className="absolute inset-0 rounded-2xl bg-cyan-400/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
              </div>

              {/* Institute Info */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                      {institute.institute_name}
                    </h1>
                    <p className="text-gray-600 dark:text-slate-400 flex items-center gap-2 text-lg">
                      <Building2 size={18} className="text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                      <span>{institute.institute_type}</span>
                    </p>
                  </div>
                  
                  {/* Edit Button */}
                  <button
                    onClick={() => {
                      setSelectedInstitute(institute);
                      setOriginalInstitute(institute);
                      setEditModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-sm font-semibold hover:from-cyan-600 hover:to-cyan-700 transition-all duration-200 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 whitespace-nowrap"
                  >
                    <Edit size={16} />
                    <span>Edit Institute</span>
                  </button>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-3 pt-2">
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${statusConfig.bgClass} ${statusConfig.textClass} text-sm font-medium`}>
                    <StatusIcon size={16} />
                    <span>{statusConfig.label}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REVENUE STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group relative overflow-hidden rounded-2xl 
            bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
            backdrop-blur-xl border border-gray-200 dark:border-slate-700/50 
            shadow-xl hover:shadow-2xl hover:border-gray-300 dark:hover:border-slate-600/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500 dark:text-slate-500 font-medium uppercase tracking-wider">Revenue</p>
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <IndianRupee size={20} className="text-green-600 dark:text-green-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{institute.revenue}</p>
            </div>
          </div>
        </div>

        {/* CONTACT INFORMATION */}
        <div className="group relative overflow-hidden rounded-2xl 
          bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
          backdrop-blur-xl border border-gray-200 dark:border-slate-700/50 
          shadow-xl hover:shadow-2xl hover:border-gray-300 dark:hover:border-slate-600/50 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-slate-700/50">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Mail size={16} className="text-cyan-600 dark:text-cyan-400" />
              </div>
              Contact Information
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-xl 
                bg-gray-100 dark:bg-slate-800/50 
                hover:bg-gray-200 dark:hover:bg-slate-800/70 transition-colors duration-200">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-cyan-600 dark:text-cyan-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-slate-500 font-medium uppercase tracking-wider mb-1">Institute Email</p>
                  <p className="text-gray-900 dark:text-white font-medium break-all">{institute.institute_email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl 
                bg-gray-100 dark:bg-slate-800/50 
                hover:bg-gray-200 dark:hover:bg-slate-800/70 transition-colors duration-200">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-slate-500 font-medium uppercase tracking-wider mb-1">Support Email</p>
                  <p className="text-gray-900 dark:text-white font-medium break-all">{institute.support_email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl 
                bg-gray-100 dark:bg-slate-800/50 
                hover:bg-gray-200 dark:hover:bg-slate-800/70 transition-colors duration-200">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <User size={18} className="text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-slate-500 font-medium uppercase tracking-wider mb-1">Contact Person</p>
                  <p className="text-gray-900 dark:text-white font-medium">{institute.contact_person_name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl 
                bg-gray-100 dark:bg-slate-800/50 
                hover:bg-gray-200 dark:hover:bg-slate-800/70 transition-colors duration-200">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                  <Building2 size={18} className="text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-slate-500 font-medium uppercase tracking-wider mb-1">Designation</p>
                  <p className="text-gray-900 dark:text-white font-medium">{institute.contact_person_designation}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl 
                bg-gray-100 dark:bg-slate-800/50 
                hover:bg-gray-200 dark:hover:bg-slate-800/70 transition-colors duration-200">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-cyan-600 dark:text-cyan-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-slate-500 font-medium uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-gray-900 dark:text-white font-medium">{institute.contact_phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl 
                bg-gray-100 dark:bg-slate-800/50 
                hover:bg-gray-200 dark:hover:bg-slate-800/70 transition-colors duration-200">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-slate-500 font-medium uppercase tracking-wider mb-1">Alternative Phone</p>
                  <p className="text-gray-900 dark:text-white font-medium">{institute.contact_phone_alt || "-"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LOCATION */}
        <div className="group relative overflow-hidden rounded-2xl 
          bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
          backdrop-blur-xl border border-gray-200 dark:border-slate-700/50 
          shadow-xl hover:shadow-2xl hover:border-gray-300 dark:hover:border-slate-600/50 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-slate-700/50">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <MapPin size={16} className="text-purple-600 dark:text-purple-400" />
              </div>
              Location Details
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-xl 
                bg-gray-100 dark:bg-slate-800/50 
                hover:bg-gray-200 dark:hover:bg-slate-800/70 transition-colors duration-200">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-slate-500 font-medium uppercase tracking-wider mb-1">City</p>
                  <p className="text-gray-900 dark:text-white font-medium">{institute.location_city}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl 
                bg-gray-100 dark:bg-slate-800/50 
                hover:bg-gray-200 dark:hover:bg-slate-800/70 transition-colors duration-200">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-cyan-600 dark:text-cyan-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-slate-500 font-medium uppercase tracking-wider mb-1">State</p>
                  <p className="text-gray-900 dark:text-white font-medium">{institute.location_state || "-"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl 
                bg-gray-100 dark:bg-slate-800/50 
                hover:bg-gray-200 dark:hover:bg-slate-800/70 transition-colors duration-200">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <Globe size={18} className="text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-slate-500 font-medium uppercase tracking-wider mb-1">Country</p>
                  <p className="text-gray-900 dark:text-white font-medium">{institute.location_country}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl 
                bg-gray-100 dark:bg-slate-800/50 
                hover:bg-gray-200 dark:hover:bg-slate-800/70 transition-colors duration-200">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-slate-500 font-medium uppercase tracking-wider mb-1">PIN Code</p>
                  <p className="text-gray-900 dark:text-white font-medium">{institute.location_pin}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl 
                bg-gray-100 dark:bg-slate-800/50 
                hover:bg-gray-200 dark:hover:bg-slate-800/70 transition-colors duration-200 md:col-span-2">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                  <Globe size={18} className="text-cyan-600 dark:text-cyan-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-slate-500 font-medium uppercase tracking-wider mb-1">Coordinates</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {institute.latitude ? `${institute.latitude}, ${institute.longitude}` : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ADMIN NOTES */}
        <div className="group relative overflow-hidden rounded-2xl 
          bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
          backdrop-blur-xl border border-gray-200 dark:border-slate-700/50 
          shadow-xl hover:shadow-2xl hover:border-gray-300 dark:hover:border-slate-600/50 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-slate-700/50">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <FileText size={16} className="text-yellow-600 dark:text-yellow-400" />
              </div>
              Admin Notes
            </h3>
            
            <div className="p-4 rounded-xl bg-gray-100 dark:bg-slate-800/50">
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                {institute.admin_notes || "No notes added"}
              </p>
            </div>
          </div>
        </div>

        {/* ACCOUNT CREATION DETAILS */}
        <div className="group relative overflow-hidden rounded-2xl 
          bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
          backdrop-blur-xl border border-gray-200 dark:border-slate-700/50 
          shadow-xl hover:shadow-2xl hover:border-gray-300 dark:hover:border-slate-600/50 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-slate-700/50">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Clock size={16} className="text-green-600 dark:text-green-400" />
              </div>
              Account Creation Details
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-xl 
                bg-gray-100 dark:bg-slate-800/50 
                hover:bg-gray-200 dark:hover:bg-slate-800/70 transition-colors duration-200">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <User size={18} className="text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-slate-500 font-medium uppercase tracking-wider mb-1">Created By</p>
                  <p className="text-gray-900 dark:text-white font-medium">{institute.created_by_admin_name || "-"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl 
                bg-gray-100 dark:bg-slate-800/50 
                hover:bg-gray-200 dark:hover:bg-slate-800/70 transition-colors duration-200">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                  <Clock size={18} className="text-cyan-600 dark:text-cyan-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-slate-500 font-medium uppercase tracking-wider mb-1">Created At</p>
                  <p className="text-gray-900 dark:text-white font-medium">{formatTimestamp(institute.created_at)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl 
                bg-gray-100 dark:bg-slate-800/50 
                hover:bg-gray-200 dark:hover:bg-slate-800/70 transition-colors duration-200">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-slate-500 font-medium uppercase tracking-wider mb-1">Invitation Sent</p>
                  <p className="text-gray-900 dark:text-white font-medium">{formatTimestamp(institute.invited_at)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl 
                bg-gray-100 dark:bg-slate-800/50 
                hover:bg-gray-200 dark:hover:bg-slate-800/70 transition-colors duration-200">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={18} className="text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-slate-500 font-medium uppercase tracking-wider mb-1">Activated At</p>
                  <p className="text-gray-900 dark:text-white font-medium">{formatTimestamp(institute.activated_at)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl 
                bg-gray-100 dark:bg-slate-800/50 
                hover:bg-gray-200 dark:hover:bg-slate-800/70 transition-colors duration-200">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                  <Clock size={18} className="text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-slate-500 font-medium uppercase tracking-wider mb-1">Last Updated</p>
                  <p className="text-gray-900 dark:text-white font-medium">{formatTimestamp(institute.updated_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* EDIT MODAL */}
<EditInstituteModal
  open={editModalOpen}
  institute={selectedInstitute}
  mode="full"
  changedFields={changedFields}  
  hasChanges={hasChanges}    
  onClose={() => {
    setEditModalOpen(false);
    setOriginalInstitute(null);  
  }}
  onChange={(field, value) =>
    setSelectedInstitute({ ...selectedInstitute, [field]: value })
  }
  onSave={() => saveEditedInstitute(selectedInstitute)} 
/>
    </section>
  );
};

export default InstituteProfile;