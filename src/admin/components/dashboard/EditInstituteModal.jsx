import {
  X,
  Building2,
  Mail,
  Phone,
  MapPin,
  User,
  FileText,
  Save,
  AlertCircle,
  Edit3,
} from "lucide-react";
import LocationPicker from "./LocationPicker";
import { useState } from "react";

const EditInstituteModal = ({
  open,
  onClose,
  institute,
  mode = "quick", // "quick" or "full"
  onSave,
  onChange,
  changedFields,
  hasChanges,
}) => {
  if (!open || !institute) return null;

  const isQuick = mode === "quick";
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl rounded-2xl relative mt-15 max-h-[90vh] overflow-hidden 
          bg-white dark:bg-slate-900 
          border border-gray-200 dark:border-slate-800/50 
          shadow-2xl 
          animate-in zoom-in-95 duration-200
          transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-8 py-6 
          border-b border-gray-200 dark:border-slate-800/50 
          bg-gradient-to-r from-gray-50 to-transparent dark:from-slate-900/50 dark:to-transparent">
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl 
              bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-500/20 dark:to-blue-500/20 
              border border-cyan-300 dark:border-cyan-500/30 
              flex items-center justify-center">
              <Edit3 className="text-cyan-600 dark:text-cyan-400" size={20} />
            </div>
            
            {/* Title */}
            <div className="flex-1">
              <h3 className="text-xl font-bold 
                bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 
                bg-clip-text text-transparent">
                {isQuick ? "Quick Edit Institute" : "Edit Institute Details"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-slate-400 mt-0.5">
                {isQuick
                  ? "Update visible information"
                  : "Update complete institute information"}
              </p>
            </div>

            {/* Status Indicators */}
            <div className="flex items-center gap-2">
              {/* Mode Badge */}
              <div
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  isQuick
                    ? "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/20"
                    : "bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-500/20"
                }`}
              >
                {isQuick ? "Quick Mode" : "Full Edit"}
              </div>

              {/* Changes Badge */}
              {hasChanges && changedFields && Object.keys(changedFields).length > 0 && (
                <div className="px-3 py-1.5 rounded-full text-xs font-medium 
                  bg-orange-100 dark:bg-orange-500/10 
                  text-orange-700 dark:text-orange-400 
                  border border-orange-300 dark:border-orange-500/20 
                  animate-in fade-in duration-200">
                  {Object.keys(changedFields).length}{" "}
                  {Object.keys(changedFields).length === 1 ? "change" : "changes"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-5">
            {/* Quick Edit Fields */}
            {isQuick && (
              <>
                {/* Institute Name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-300">
                    <Building2 size={16} className="text-gray-500 dark:text-slate-400" />
                    Institute Name
                    {changedFields?.institute_name && (
                      <span className="ml-auto text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 animate-pulse"></div>
                        Modified
                      </span>
                    )}
                  </label>
                  <input
                    value={institute.institute_name || ""}
                    onChange={(e) => onChange("institute_name", e.target.value)}
                    placeholder="Enter institute name"
                    className={`w-full px-4 py-3 rounded-xl 
                      bg-gray-50 dark:bg-slate-900/50 
                      border transition-all duration-200 outline-none ${
                      changedFields?.institute_name
                        ? 'border-orange-400 dark:border-orange-500/50 ring-2 ring-orange-200 dark:ring-orange-500/20'
                        : 'border-gray-200 dark:border-slate-700/50 focus:border-cyan-400 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20'
                    } text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500`}
                  />
                </div>

                {/* City */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-300">
                    <MapPin size={16} className="text-gray-500 dark:text-slate-400" />
                    City
                    {changedFields?.location_city && (
                      <span className="ml-auto text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 animate-pulse"></div>
                        Modified
                      </span>
                    )}
                  </label>
                  <input
                    value={institute.location_city || ""}
                    onChange={(e) => onChange("location_city", e.target.value)}
                    placeholder="Enter city"
                    className={`w-full px-4 py-3 rounded-xl 
                      bg-gray-50 dark:bg-slate-900/50 
                      border transition-all duration-200 outline-none ${
                      changedFields?.location_city
                        ? 'border-orange-400 dark:border-orange-500/50 ring-2 ring-orange-200 dark:ring-orange-500/20'
                        : 'border-gray-200 dark:border-slate-700/50 focus:border-cyan-400 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20'
                    } text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500`}
                  />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-300">
                    <Building2 size={16} className="text-gray-500 dark:text-slate-400" />
                    Status
                    {changedFields?.account_status && (
                      <span className="ml-auto text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 animate-pulse"></div>
                        Modified
                      </span>
                    )}
                  </label>
                  <input
                    value={institute.account_status || ""}
                    onChange={(e) => onChange("account_status", e.target.value)}
                    placeholder="Enter status"
                    className={`w-full px-4 py-3 rounded-xl 
                      bg-gray-50 dark:bg-slate-900/50 
                      border transition-all duration-200 outline-none ${
                      changedFields?.account_status
                        ? 'border-orange-400 dark:border-orange-500/50 ring-2 ring-orange-200 dark:ring-orange-500/20'
                        : 'border-gray-200 dark:border-slate-700/50 focus:border-cyan-400 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20'
                    } text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500`}
                  />
                </div>

                {/* Revenue */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-300">
                    <FileText size={16} className="text-gray-500 dark:text-slate-400" />
                    Revenue
                    {changedFields?.revenue && (
                      <span className="ml-auto text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 animate-pulse"></div>
                        Modified
                      </span>
                    )}
                  </label>
                  <input
                    value={institute.revenue || ""}
                    onChange={(e) => onChange("revenue", e.target.value)}
                    placeholder="Enter revenue"
                    className={`w-full px-4 py-3 rounded-xl 
                      bg-gray-50 dark:bg-slate-900/50 
                      border transition-all duration-200 outline-none ${
                      changedFields?.revenue
                        ? 'border-orange-400 dark:border-orange-500/50 ring-2 ring-orange-200 dark:ring-orange-500/20'
                        : 'border-gray-200 dark:border-slate-700/50 focus:border-cyan-400 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20'
                    } text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500`}
                  />
                </div>

                {/* Admin Notes */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-300">
                    <FileText size={16} className="text-gray-500 dark:text-slate-400" />
                    Admin Notes
                    {changedFields?.admin_notes && (
                      <span className="ml-auto text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 animate-pulse"></div>
                        Modified
                      </span>
                    )}
                  </label>
                  <textarea
                    value={institute.admin_notes || ""}
                    onChange={(e) => onChange("admin_notes", e.target.value)}
                    placeholder="Add admin notes..."
                    rows={3}
                    className={`w-full px-4 py-3 rounded-xl 
                      bg-gray-50 dark:bg-slate-900/50 
                      border transition-all duration-200 outline-none resize-none ${
                      changedFields?.admin_notes
                        ? 'border-orange-400 dark:border-orange-500/50 ring-2 ring-orange-200 dark:ring-orange-500/20'
                        : 'border-gray-200 dark:border-slate-700/50 focus:border-cyan-400 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20'
                    } text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500`}
                  />
                </div>
              </>
            )}

            {/* Full Edit Fields */}
            {!isQuick && (
              <>
                {/* Basic Information Section */}
                <div className="space-y-4 p-6 rounded-xl 
                  bg-gradient-to-br from-gray-100/50 to-gray-50/30 dark:from-slate-800/40 dark:to-slate-800/20 
                  border border-gray-200 dark:border-slate-700/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/3 to-transparent pointer-events-none" />
                  
                  <h4 className="relative text-sm font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-cyan-100 dark:bg-cyan-500/10">
                      <Building2 size={14} className="text-cyan-600 dark:text-cyan-400" />
                    </div>
                    Basic Information
                  </h4>

                  <div className="relative grid md:grid-cols-2 gap-4">
                    {/* Institute Name */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400">
                        Institute Name
                        {changedFields?.institute_name && (
                          <span className="ml-auto text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 animate-pulse"></div>
                            Modified
                          </span>
                        )}
                      </label>
                      <input
                        value={institute.institute_name || ""}
                        onChange={(e) => onChange("institute_name", e.target.value)}
                        placeholder="Enter institute name"
                        className={`w-full px-4 py-3 rounded-xl 
                          bg-white dark:bg-slate-900/50 
                          border transition-all duration-200 outline-none ${
                          changedFields?.institute_name
                            ? 'border-orange-400 dark:border-orange-500/50 ring-2 ring-orange-200 dark:ring-orange-500/20'
                            : 'border-gray-200 dark:border-slate-700/50 focus:border-cyan-400 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20'
                        } text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500`}
                      />
                    </div>

                    {/* Display Name */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400">
                        Display Name
                        {changedFields?.institute_display_name && (
                          <span className="ml-auto text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 animate-pulse"></div>
                            Modified
                          </span>
                        )}
                      </label>
                      <input
                        value={institute.institute_display_name || ""}
                        onChange={(e) => onChange("institute_display_name", e.target.value)}
                        placeholder="Enter display name"
                        className={`w-full px-4 py-3 rounded-xl 
                          bg-white dark:bg-slate-900/50 
                          border transition-all duration-200 outline-none ${
                          changedFields?.institute_display_name
                            ? 'border-orange-400 dark:border-orange-500/50 ring-2 ring-orange-200 dark:ring-orange-500/20'
                            : 'border-gray-200 dark:border-slate-700/50 focus:border-cyan-400 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20'
                        } text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500`}
                      />
                    </div>

                    {/* Institute Type */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400">
                        Institute Type
                        {changedFields?.institute_type && (
                          <span className="ml-auto text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 animate-pulse"></div>
                            Modified
                          </span>
                        )}
                      </label>
                      <input
                        value={institute.institute_type || ""}
                        onChange={(e) => onChange("institute_type", e.target.value)}
                        placeholder="Enter institute type"
                        className={`w-full px-4 py-3 rounded-xl 
                          bg-white dark:bg-slate-900/50 
                          border transition-all duration-200 outline-none ${
                          changedFields?.institute_type
                            ? 'border-orange-400 dark:border-orange-500/50 ring-2 ring-orange-200 dark:ring-orange-500/20'
                            : 'border-gray-200 dark:border-slate-700/50 focus:border-cyan-400 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20'
                        } text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500`}
                      />
                    </div>

                    {/* Account Status */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400">
                        Account Status
                        {changedFields?.account_status && (
                          <span className="ml-auto text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 animate-pulse"></div>
                            Modified
                          </span>
                        )}
                      </label>
                      <input
                        value={institute.account_status || ""}
                        onChange={(e) => onChange("account_status", e.target.value)}
                        placeholder="Enter status"
                        className={`w-full px-4 py-3 rounded-xl 
                          bg-white dark:bg-slate-900/50 
                          border transition-all duration-200 outline-none ${
                          changedFields?.account_status
                            ? 'border-orange-400 dark:border-orange-500/50 ring-2 ring-orange-200 dark:ring-orange-500/20'
                            : 'border-gray-200 dark:border-slate-700/50 focus:border-cyan-400 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20'
                        } text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500`}
                      />
                    </div>

                    {/* Revenue */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400">
                        Revenue
                        {changedFields?.revenue && (
                          <span className="ml-auto text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 animate-pulse"></div>
                            Modified
                          </span>
                        )}
                      </label>
                      <input
                        value={institute.revenue || ""}
                        onChange={(e) => onChange("revenue", e.target.value)}
                        placeholder="Enter revenue"
                        className={`w-full px-4 py-3 rounded-xl 
                          bg-white dark:bg-slate-900/50 
                          border transition-all duration-200 outline-none ${
                          changedFields?.revenue
                            ? 'border-orange-400 dark:border-orange-500/50 ring-2 ring-orange-200 dark:ring-orange-500/20'
                            : 'border-gray-200 dark:border-slate-700/50 focus:border-cyan-400 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20'
                        } text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500`}
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="space-y-4 p-6 rounded-xl 
                  bg-gradient-to-br from-gray-100/50 to-gray-50/30 dark:from-slate-800/40 dark:to-slate-800/20 
                  border border-gray-200 dark:border-slate-700/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/3 to-transparent pointer-events-none" />
                  
                  <h4 className="relative text-sm font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-500/10">
                      <Mail size={14} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    Contact Information
                  </h4>

                  <div className="relative grid md:grid-cols-2 gap-4">
                    {/* Institute Email */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400">
                        Institute Email
                        {changedFields?.institute_email && (
                          <span className="ml-auto text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 animate-pulse"></div>
                            Modified
                          </span>
                        )}
                      </label>
                      <input
                        value={institute.institute_email || ""}
                        onChange={(e) => onChange("institute_email", e.target.value)}
                        placeholder="institute@example.com"
                        className={`w-full px-4 py-3 rounded-xl 
                          bg-white dark:bg-slate-900/50 
                          border transition-all duration-200 outline-none ${
                          changedFields?.institute_email
                            ? 'border-orange-400 dark:border-orange-500/50 ring-2 ring-orange-200 dark:ring-orange-500/20'
                            : 'border-gray-200 dark:border-slate-700/50 focus:border-cyan-400 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20'
                        } text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500`}
                      />
                    </div>

                    {/* Support Email */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400">
                        Support Email
                        {changedFields?.support_email && (
                          <span className="ml-auto text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 animate-pulse"></div>
                            Modified
                          </span>
                        )}
                      </label>
                      <input
                        value={institute.support_email || ""}
                        onChange={(e) => onChange("support_email", e.target.value)}
                        placeholder="support@example.com"
                        className={`w-full px-4 py-3 rounded-xl 
                          bg-white dark:bg-slate-900/50 
                          border transition-all duration-200 outline-none ${
                          changedFields?.support_email
                            ? 'border-orange-400 dark:border-orange-500/50 ring-2 ring-orange-200 dark:ring-orange-500/20'
                            : 'border-gray-200 dark:border-slate-700/50 focus:border-cyan-400 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20'
                        } text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500`}
                      />
                    </div>

                    {/* Contact Person Name */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400">
                        Contact Person Name
                        {changedFields?.contact_person_name && (
                          <span className="ml-auto text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 animate-pulse"></div>
                            Modified
                          </span>
                        )}
                      </label>
                      <input
                        value={institute.contact_person_name || ""}
                        onChange={(e) => onChange("contact_person_name", e.target.value)}
                        placeholder="Enter contact person name"
                        className={`w-full px-4 py-3 rounded-xl 
                          bg-white dark:bg-slate-900/50 
                          border transition-all duration-200 outline-none ${
                          changedFields?.contact_person_name
                            ? 'border-orange-400 dark:border-orange-500/50 ring-2 ring-orange-200 dark:ring-orange-500/20'
                            : 'border-gray-200 dark:border-slate-700/50 focus:border-cyan-400 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20'
                        } text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500`}
                      />
                    </div>

                    {/* Designation */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400">
                        Designation
                        {changedFields?.contact_person_designation && (
                          <span className="ml-auto text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 animate-pulse"></div>
                            Modified
                          </span>
                        )}
                      </label>
                      <input
                        value={institute.contact_person_designation || ""}
                        onChange={(e) => onChange("contact_person_designation", e.target.value)}
                        placeholder="Enter designation"
                        className={`w-full px-4 py-3 rounded-xl 
                          bg-white dark:bg-slate-900/50 
                          border transition-all duration-200 outline-none ${
                          changedFields?.contact_person_designation
                            ? 'border-orange-400 dark:border-orange-500/50 ring-2 ring-orange-200 dark:ring-orange-500/20'
                            : 'border-gray-200 dark:border-slate-700/50 focus:border-cyan-400 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20'
                        } text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500`}
                      />
                    </div>

                    {/* Contact Phone */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400">
                        Contact Phone
                        {changedFields?.contact_phone && (
                          <span className="ml-auto text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 animate-pulse"></div>
                            Modified
                          </span>
                        )}
                      </label>
                      <input
                        value={institute.contact_phone || ""}
                        onChange={(e) => onChange("contact_phone", e.target.value)}
                        placeholder="+1 234 567 8900"
                        className={`w-full px-4 py-3 rounded-xl 
                          bg-white dark:bg-slate-900/50 
                          border transition-all duration-200 outline-none ${
                          changedFields?.contact_phone
                            ? 'border-orange-400 dark:border-orange-500/50 ring-2 ring-orange-200 dark:ring-orange-500/20'
                            : 'border-gray-200 dark:border-slate-700/50 focus:border-cyan-400 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20'
                        } text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500`}
                      />
                    </div>

                    {/* Alternate Phone */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400">
                        Alternate Phone
                        {changedFields?.contact_phone_alt && (
                          <span className="ml-auto text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 animate-pulse"></div>
                            Modified
                          </span>
                        )}
                      </label>
                      <input
                        value={institute.contact_phone_alt || ""}
                        onChange={(e) => onChange("contact_phone_alt", e.target.value)}
                        placeholder="+1 234 567 8901"
                        className={`w-full px-4 py-3 rounded-xl 
                          bg-white dark:bg-slate-900/50 
                          border transition-all duration-200 outline-none ${
                          changedFields?.contact_phone_alt
                            ? 'border-orange-400 dark:border-orange-500/50 ring-2 ring-orange-200 dark:ring-orange-500/20'
                            : 'border-gray-200 dark:border-slate-700/50 focus:border-cyan-400 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20'
                        } text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500`}
                      />
                    </div>
                  </div>
                </div>

                {/* Location Section */}
                <div className="space-y-4 p-6 rounded-xl 
                  bg-gradient-to-br from-gray-100/50 to-gray-50/30 dark:from-slate-800/40 dark:to-slate-800/20 
                  border border-gray-200 dark:border-slate-700/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 to-transparent pointer-events-none" />
                  
                  <h4 className="relative text-sm font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-500/10">
                      <MapPin size={14} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    Location Details
                  </h4>

                  <div className="relative grid md:grid-cols-2 gap-4">
                    {/* City */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400">
                        City
                        {changedFields?.location_city && (
                          <span className="ml-auto text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 animate-pulse"></div>
                            Modified
                          </span>
                        )}
                      </label>
                      <input
                        value={institute.location_city || ""}
                        onChange={(e) => onChange("location_city", e.target.value)}
                        placeholder="Enter city"
                        className={`w-full px-4 py-3 rounded-xl 
                          bg-white dark:bg-slate-900/50 
                          border transition-all duration-200 outline-none ${
                          changedFields?.location_city
                            ? 'border-orange-400 dark:border-orange-500/50 ring-2 ring-orange-200 dark:ring-orange-500/20'
                            : 'border-gray-200 dark:border-slate-700/50 focus:border-cyan-400 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20'
                        } text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500`}
                      />
                    </div>

                    {/* State */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400">
                        State
                        {changedFields?.location_state && (
                          <span className="ml-auto text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 animate-pulse"></div>
                            Modified
                          </span>
                        )}
                      </label>
                      <input
                        value={institute.location_state || ""}
                        onChange={(e) => onChange("location_state", e.target.value)}
                        placeholder="Enter state"
                        className={`w-full px-4 py-3 rounded-xl 
                          bg-white dark:bg-slate-900/50 
                          border transition-all duration-200 outline-none ${
                          changedFields?.location_state
                            ? 'border-orange-400 dark:border-orange-500/50 ring-2 ring-orange-200 dark:ring-orange-500/20'
                            : 'border-gray-200 dark:border-slate-700/50 focus:border-cyan-400 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20'
                        } text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500`}
                      />
                    </div>

                    {/* Country */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400">
                        Country
                        {changedFields?.location_country && (
                          <span className="ml-auto text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 animate-pulse"></div>
                            Modified
                          </span>
                        )}
                      </label>
                      <input
                        value={institute.location_country || ""}
                        onChange={(e) => onChange("location_country", e.target.value)}
                        placeholder="Enter country"
                        className={`w-full px-4 py-3 rounded-xl 
                          bg-white dark:bg-slate-900/50 
                          border transition-all duration-200 outline-none ${
                          changedFields?.location_country
                            ? 'border-orange-400 dark:border-orange-500/50 ring-2 ring-orange-200 dark:ring-orange-500/20'
                            : 'border-gray-200 dark:border-slate-700/50 focus:border-cyan-400 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20'
                        } text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500`}
                      />
                    </div>

                    {/* PIN Code */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400">
                        PIN Code
                        {changedFields?.location_pin && (
                          <span className="ml-auto text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 animate-pulse"></div>
                            Modified
                          </span>
                        )}
                      </label>
                      <input
                        value={institute.location_pin || ""}
                        onChange={(e) => onChange("location_pin", e.target.value)}
                        placeholder="Enter PIN code"
                        className={`w-full px-4 py-3 rounded-xl 
                          bg-white dark:bg-slate-900/50 
                          border transition-all duration-200 outline-none ${
                          changedFields?.location_pin
                            ? 'border-orange-400 dark:border-orange-500/50 ring-2 ring-orange-200 dark:ring-orange-500/20'
                            : 'border-gray-200 dark:border-slate-700/50 focus:border-cyan-400 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20'
                        } text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500`}
                      />
                    </div>
                  </div>

                  {/* Location Picker */}
                  <div className="relative mt-4">
                    <LocationPicker
                      newInstitute={institute}
                      setNewInstitute={(field, val) => onChange(field, val)}
                    />
                  </div>
                </div>

                {/* Admin Notes Section */}
                <div className="space-y-4 p-6 rounded-xl 
                  bg-gradient-to-br from-gray-100/50 to-gray-50/30 dark:from-slate-800/40 dark:to-slate-800/20 
                  border border-gray-200 dark:border-slate-700/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/3 to-transparent pointer-events-none" />
                  
                  <h4 className="relative text-sm font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-yellow-100 dark:bg-yellow-500/10">
                      <FileText size={14} className="text-yellow-600 dark:text-yellow-400" />
                    </div>
                    Admin Notes
                    {changedFields?.admin_notes && (
                      <span className="ml-auto text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 animate-pulse"></div>
                        Modified
                      </span>
                    )}
                  </h4>

                  <div className="relative">
                    <textarea
                      value={institute.admin_notes || ""}
                      onChange={(e) => onChange("admin_notes", e.target.value)}
                      placeholder="Add internal notes about this institute..."
                      rows={4}
                      className={`w-full px-4 py-3 rounded-xl 
                        bg-white dark:bg-slate-900/50 
                        border transition-all duration-200 outline-none resize-none ${
                        changedFields?.admin_notes
                          ? 'border-orange-400 dark:border-orange-500/50 ring-2 ring-orange-200 dark:ring-orange-500/20'
                          : 'border-gray-200 dark:border-slate-700/50 focus:border-cyan-400 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20'
                      } text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500`}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 
          border-t border-gray-200 dark:border-slate-800/50 
          bg-gray-50 dark:bg-slate-900/30">
          <div className="flex items-center justify-between">
            {/* Info Text */}
            <div className="flex items-center gap-2">
              {hasChanges ? (
                <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400">
                  <AlertCircle size={14} />
                  <span>You have unsaved changes</span>
                </div>
              ) : (
                <p className="text-xs text-gray-500 dark:text-slate-500">
                  No changes made
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl 
                  bg-gray-100 dark:bg-slate-800/50 
                  hover:bg-gray-200 dark:hover:bg-slate-700/50 
                  border border-gray-200 dark:border-slate-700/50 
                  hover:border-gray-300 dark:hover:border-slate-600/50 
                  text-gray-700 dark:text-slate-300 
                  hover:text-gray-900 dark:hover:text-white 
                  transition-all duration-200 font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                disabled={!hasChanges}
                className={`group flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  hasChanges
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 cursor-pointer'
                    : 'bg-gray-200 dark:bg-slate-800/30 border border-gray-300 dark:border-slate-700/30 text-gray-400 dark:text-slate-500 cursor-not-allowed'
                }`}
                title={!hasChanges ? 'No changes to save' : 'Save changes'}
              >
                <Save size={16} className={hasChanges ? 'group-hover:scale-110 transition-transform' : ''} />
                {hasChanges ? 'Save Changes' : 'No Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
{showConfirm && (
  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 mx-6 shadow-2xl animate-in zoom-in-95 duration-200 max-w-sm w-full">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-500/10 border border-orange-300 dark:border-orange-500/30 flex items-center justify-center">
          <AlertCircle size={18} className="text-orange-600 dark:text-orange-400" />
        </div>
        <h4 className="text-base font-bold text-gray-900 dark:text-white">Save Changes?</h4>
      </div>
      <p className="text-sm text-gray-600 dark:text-slate-400 mb-5">
        Are you sure you want to save{" "}
        <span className="font-semibold text-orange-600 dark:text-orange-400">
          {changedFields ? Object.keys(changedFields).length : 0}{" "}
          {changedFields && Object.keys(changedFields).length === 1 ? "change" : "changes"}
        </span>{" "}
        to this institute?
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => setShowConfirm(false)}
          className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-slate-700/50 hover:bg-gray-200 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-300 text-sm font-medium transition-all duration-200"
        >
          Cancel
        </button>
        <button
          onClick={() => { setShowConfirm(false); onSave(institute); }}
          className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-sm font-medium shadow-lg shadow-cyan-500/20 transition-all duration-200"
        >
          Yes, Save
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default EditInstituteModal;