// src/components/EditStudentModal.jsx
import { X, User, Mail, Phone, GraduationCap, Edit3, Save, AlertCircle } from "lucide-react";

const EditStudentModal = ({
  open,
  onClose,
  student,
  mode = "quick", // "quick" or "full"
  onSave,
  onChange,
  hasChanges,
  changedFields,
}) => {
  if (!open || !student) return null;

  const isQuick = mode === "quick";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl rounded-2xl relative max-h-[90vh] overflow-hidden 
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
                {isQuick ? "Quick Edit Student" : "Edit Student Details"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-slate-400 mt-0.5">
                {isQuick ? "Update basic information" : "Update student information"}
              </p>
            </div>

            {/* Status Indicators */}
            <div className="flex items-center gap-2">
              {/* Mode Badge */}
              <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                isQuick 
                  ? "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/20" 
                  : "bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-500/20"
              }`}>
                {isQuick ? "Quick Mode" : "Full Edit"}
              </div>

              {/* Changes Badge */}
              {hasChanges && changedFields && Object.keys(changedFields).length > 0 && (
                <div className="px-3 py-1.5 rounded-full text-xs font-medium 
                  bg-orange-100 dark:bg-orange-500/10 
                  text-orange-700 dark:text-orange-400 
                  border border-orange-300 dark:border-orange-500/20 
                  animate-in fade-in duration-200">
                  {Object.keys(changedFields).length} {Object.keys(changedFields).length === 1 ? 'change' : 'changes'}
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
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-300">
                    <User size={16} className="text-gray-500 dark:text-slate-400" />
                    Full Name
                    {changedFields?.full_name && (
                      <span className="ml-auto text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 animate-pulse"></div>
                        Modified
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={student.full_name || ""}
                    onChange={(e) => onChange("full_name", e.target.value)}
                    placeholder="Enter full name"
                    className={`w-full px-4 py-3 rounded-xl 
                      bg-gray-50 dark:bg-slate-900/50 
                      border transition-all duration-200 outline-none ${
                      changedFields?.full_name
                        ? 'border-orange-400 dark:border-orange-500/50 ring-2 ring-orange-200 dark:ring-orange-500/20'
                        : 'border-gray-200 dark:border-slate-700/50 focus:border-cyan-400 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20'
                    } text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500`}
                  />
                </div>

                {/* Qualification */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-300">
                    <GraduationCap size={16} className="text-gray-500 dark:text-slate-400" />
                    Qualification
                    {changedFields?.qualification && (
                      <span className="ml-auto text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 animate-pulse"></div>
                        Modified
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={student.qualification || ""}
                    onChange={(e) => onChange("qualification", e.target.value)}
                    placeholder="Enter qualification"
                    className={`w-full px-4 py-3 rounded-xl 
                      bg-gray-50 dark:bg-slate-900/50 
                      border transition-all duration-200 outline-none ${
                      changedFields?.qualification
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
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-300">
                    <User size={16} className="text-gray-500 dark:text-slate-400" />
                    Full Name
                    {changedFields?.full_name && (
                      <span className="ml-auto text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 animate-pulse"></div>
                        Modified
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={student.full_name || ""}
                    onChange={(e) => onChange("full_name", e.target.value)}
                    placeholder="Enter full name"
                    className={`w-full px-4 py-3 rounded-xl 
                      bg-gray-50 dark:bg-slate-900/50 
                      border transition-all duration-200 outline-none ${
                      changedFields?.full_name
                        ? 'border-orange-400 dark:border-orange-500/50 ring-2 ring-orange-200 dark:ring-orange-500/20'
                        : 'border-gray-200 dark:border-slate-700/50 focus:border-cyan-400 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20'
                    } text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500`}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-300">
                    <Mail size={16} className="text-gray-500 dark:text-slate-400" />
                    Email Address
                    {changedFields?.email && (
                      <span className="ml-auto text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 animate-pulse"></div>
                        Modified
                      </span>
                    )}
                  </label>
                  <input
                    type="email"
                    value={student.email || ""}
                    onChange={(e) => onChange("email", e.target.value)}
                    placeholder="Enter email address"
                    className={`w-full px-4 py-3 rounded-xl 
                      bg-gray-50 dark:bg-slate-900/50 
                      border transition-all duration-200 outline-none ${
                      changedFields?.email
                        ? 'border-orange-400 dark:border-orange-500/50 ring-2 ring-orange-200 dark:ring-orange-500/20'
                        : 'border-gray-200 dark:border-slate-700/50 focus:border-cyan-400 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20'
                    } text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500`}
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-300">
                    <Phone size={16} className="text-gray-500 dark:text-slate-400" />
                    Phone Number
                    {changedFields?.phone_number && (
                      <span className="ml-auto text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 animate-pulse"></div>
                        Modified
                      </span>
                    )}
                  </label>
                  <input
                    type="tel"
                    value={student.phone_number || ""}
                    onChange={(e) => onChange("phone_number", e.target.value)}
                    placeholder="Enter phone number"
                    className={`w-full px-4 py-3 rounded-xl 
                      bg-gray-50 dark:bg-slate-900/50 
                      border transition-all duration-200 outline-none ${
                      changedFields?.phone_number
                        ? 'border-orange-400 dark:border-orange-500/50 ring-2 ring-orange-200 dark:ring-orange-500/20'
                        : 'border-gray-200 dark:border-slate-700/50 focus:border-cyan-400 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20'
                    } text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500`}
                  />
                </div>

                {/* Qualification */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-300">
                    <GraduationCap size={16} className="text-gray-500 dark:text-slate-400" />
                    Qualification
                    {changedFields?.qualification && (
                      <span className="ml-auto text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 animate-pulse"></div>
                        Modified
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={student.qualification || ""}
                    onChange={(e) => onChange("qualification", e.target.value)}
                    placeholder="Enter qualification"
                    className={`w-full px-4 py-3 rounded-xl 
                      bg-gray-50 dark:bg-slate-900/50 
                      border transition-all duration-200 outline-none ${
                      changedFields?.qualification
                        ? 'border-orange-400 dark:border-orange-500/50 ring-2 ring-orange-200 dark:ring-orange-500/20'
                        : 'border-gray-200 dark:border-slate-700/50 focus:border-cyan-400 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20'
                    } text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500`}
                  />
                </div>
                {/* Optional: Location or other fields */}
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
                onClick={() => onSave(student)}
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
    </div>
  );
};

export default EditStudentModal;