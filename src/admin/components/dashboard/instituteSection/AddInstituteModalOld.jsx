// src/components/AddInstituteModal.jsx
import {
  X,
  Building2,
  Mail,
  User,
  Phone,
  MapPin,
  Globe,
  FileText,
  Save,
  AlertCircle,
} from "lucide-react";
import LocationPicker from "../LocationPicker";
import SmartLocationFields from "./SmartLocationFields";
import { useState } from "react";
import { initialInstituteState } from "./validateInstitute";

const AddInstituteModal = ({
  isOpen,
  onClose,
  newInstitute,
  setNewInstitute,
  errors,
  onSave,
  isSaving = false,
}) => {
  const [closeWarningOpen, setCloseWarningOpen] = useState(false);

  const hasAnyData = () => {
    const excludeKeys = ["location_country", "latitude", "longitude"];

    return Object.keys(initialInstituteState).some((key) => {
      if (excludeKeys.includes(key)) return false;
      const current = newInstitute[key] ?? "";
      const initial = initialInstituteState[key] ?? "";
      return current.toString().trim() !== initial.toString().trim();
    });
  };
  const handleClose = () => {
    if (hasAnyData()) {
      setCloseWarningOpen(true);
    } else {
      onClose();
    }
  };
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      data-tour-key="add-institute-modal"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="relative w-full max-w-4xl max-h-[85vh] mt-10 overflow-hidden rounded-2xl 
        bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/95 dark:to-slate-800/95 
        backdrop-blur-xl border border-gray-200 dark:border-slate-700/50 shadow-2xl flex flex-col animate-slideUp">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />

        {/* Header */}
        <div className="relative flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
              <Building2
                size={24}
                className="text-cyan-600 dark:text-cyan-400"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Add New Institute
              </h3>
              <p className="text-sm text-gray-600 dark:text-slate-400 mt-0.5">
                Enter institute and contact details
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            disabled={isSaving}
            className="w-10 h-10 rounded-xl 
              bg-gray-100 dark:bg-slate-800/50 
              hover:bg-gray-200 dark:hover:bg-slate-700/50 
              flex items-center justify-center 
              text-gray-600 dark:text-slate-400 
              hover:text-gray-900 dark:hover:text-white 
              transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group">
            <X
              size={20}
              className="group-hover:rotate-90 transition-transform duration-200"
            />
          </button>
        </div>

        {/* Error Alert */}
        {Object.keys(errors).length > 0 && (
          <div className="relative mx-6 mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <div className="flex items-start gap-3">
              <AlertCircle
                size={20}
                className="text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5"
              />
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  Please check the form
                </p>
                <p className="text-xs text-red-500 dark:text-red-400/80 mt-1">
                  Some required fields are invalid or missing
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable Body */}
        <div className="relative overflow-y-auto flex-1 p-6">
          <div className="space-y-6">
            {/* Basic Information Section */}
            <div
              id="tour-basic-info"
              className="space-y-4 p-5 rounded-xl 
              bg-gray-100 dark:bg-slate-800/30 
              border border-gray-200 dark:border-slate-700/30">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Building2
                  size={16}
                  className="text-cyan-600 dark:text-cyan-400"
                />
                Basic Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Institute Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-slate-400 flex items-center gap-1.5">
                    Institute Name
                    <span className="text-red-500 dark:text-red-400">*</span>
                  </label>
                  <input
                    placeholder="Enter institute name"
                    value={newInstitute.institute_name}
                    onChange={(e) =>
                      setNewInstitute({
                        ...newInstitute,
                        institute_name: e.target.value,
                      })
                    }
                    disabled={isSaving}
                    className="w-full rounded-xl px-4 py-3 
                      bg-white dark:bg-slate-800/50 
                      border border-gray-300 dark:border-slate-700/50 
                      text-gray-900 dark:text-white 
                      placeholder-gray-400 dark:placeholder-slate-500 
                      focus:border-cyan-500 dark:focus:border-cyan-500/50 
                      focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20 
                      transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {errors.institute_name && (
                    <span className="text-red-500 dark:text-red-400 text-xs flex items-center gap-1.5">
                      <AlertCircle size={12} />
                      {errors.institute_name}
                    </span>
                  )}
                </div>

                {/* Display Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-slate-400">
                    Institute Display Name
                  </label>
                  <input
                    placeholder="Enter display name"
                    value={newInstitute.institute_display_name}
                    onChange={(e) =>
                      setNewInstitute({
                        ...newInstitute,
                        institute_display_name: e.target.value,
                      })
                    }
                    disabled={isSaving}
                    className="w-full rounded-xl px-4 py-3 
                      bg-white dark:bg-slate-800/50 
                      border border-gray-300 dark:border-slate-700/50 
                      text-gray-900 dark:text-white 
                      placeholder-gray-400 dark:placeholder-slate-500 
                      focus:border-cyan-500 dark:focus:border-cyan-500/50 
                      focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20 
                      transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Institute Type */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-slate-400 flex items-center gap-1.5">
                    Institute Type
                    <span className="text-red-500 dark:text-red-400">*</span>
                  </label>
                  <input
                    placeholder="e.g., University, School, Training Center"
                    value={newInstitute.institute_type}
                    onChange={(e) =>
                      setNewInstitute({
                        ...newInstitute,
                        institute_type: e.target.value,
                      })
                    }
                    disabled={isSaving}
                    className="w-full rounded-xl px-4 py-3 
                      bg-white dark:bg-slate-800/50 
                      border border-gray-300 dark:border-slate-700/50 
                      text-gray-900 dark:text-white 
                      placeholder-gray-400 dark:placeholder-slate-500 
                      focus:border-cyan-500 dark:focus:border-cyan-500/50 
                      focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20 
                      transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {errors.institute_type && (
                    <span className="text-red-500 dark:text-red-400 text-xs flex items-center gap-1.5">
                      <AlertCircle size={12} />
                      {errors.institute_type}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Email Information Section */}
            <div
              id="tour-email-info"
              className="space-y-4 p-5 rounded-xl 
              bg-gray-100 dark:bg-slate-800/30 
              border border-gray-200 dark:border-slate-700/30">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Mail size={16} className="text-cyan-600 dark:text-cyan-400" />
                Email Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Institute Email */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-slate-400 flex items-center gap-1.5">
                    Institute Email
                    <span className="text-red-500 dark:text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="institute@example.com"
                    value={newInstitute.institute_email}
                    onChange={(e) =>
                      setNewInstitute({
                        ...newInstitute,
                        institute_email: e.target.value,
                      })
                    }
                    disabled={isSaving}
                    className="w-full rounded-xl px-4 py-3 
                      bg-white dark:bg-slate-800/50 
                      border border-gray-300 dark:border-slate-700/50 
                      text-gray-900 dark:text-white 
                      placeholder-gray-400 dark:placeholder-slate-500 
                      focus:border-cyan-500 dark:focus:border-cyan-500/50 
                      focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20 
                      transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {errors.institute_email && (
                    <span className="text-red-500 dark:text-red-400 text-xs flex items-center gap-1.5">
                      <AlertCircle size={12} />
                      {errors.institute_email}
                    </span>
                  )}
                </div>

                {/* Support Email */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-slate-400">
                    Support Email
                  </label>
                  <input
                    type="email"
                    placeholder="support@example.com"
                    value={newInstitute.support_email}
                    onChange={(e) =>
                      setNewInstitute({
                        ...newInstitute,
                        support_email: e.target.value,
                      })
                    }
                    disabled={isSaving}
                    className="w-full rounded-xl px-4 py-3 
                      bg-white dark:bg-slate-800/50 
                      border border-gray-300 dark:border-slate-700/50 
                      text-gray-900 dark:text-white 
                      placeholder-gray-400 dark:placeholder-slate-500 
                      focus:border-cyan-500 dark:focus:border-cyan-500/50 
                      focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20 
                      transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div
              id="tour-contact-info"
              className="space-y-4 p-5 rounded-xl 
              bg-gray-100 dark:bg-slate-800/30 
              border border-gray-200 dark:border-slate-700/30">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <User
                  size={16}
                  className="text-purple-600 dark:text-purple-400"
                />
                Contact Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contact Person */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-slate-400 flex items-center gap-1.5">
                    Contact Person Name
                    <span className="text-red-500 dark:text-red-400">*</span>
                  </label>
                  <input
                    placeholder="Enter contact person name"
                    value={newInstitute.contact_person_name}
                    onChange={(e) =>
                      setNewInstitute({
                        ...newInstitute,
                        contact_person_name: e.target.value,
                      })
                    }
                    disabled={isSaving}
                    className="w-full rounded-xl px-4 py-3 
                      bg-white dark:bg-slate-800/50 
                      border border-gray-300 dark:border-slate-700/50 
                      text-gray-900 dark:text-white 
                      placeholder-gray-400 dark:placeholder-slate-500 
                      focus:border-cyan-500 dark:focus:border-cyan-500/50 
                      focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20 
                      transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {errors.contact_person_name && (
                    <span className="text-red-500 dark:text-red-400 text-xs flex items-center gap-1.5">
                      <AlertCircle size={12} />
                      {errors.contact_person_name}
                    </span>
                  )}
                </div>

                {/* Contact Person Designation */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-slate-400 flex items-center gap-1.5">
                    Designation
                    <span className="text-red-500 dark:text-red-400">*</span>
                  </label>
                  <input
                    placeholder="e.g., Director, Administrator"
                    value={newInstitute.contact_person_designation}
                    onChange={(e) =>
                      setNewInstitute({
                        ...newInstitute,
                        contact_person_designation: e.target.value,
                      })
                    }
                    disabled={isSaving}
                    className="w-full rounded-xl px-4 py-3 
                      bg-white dark:bg-slate-800/50 
                      border border-gray-300 dark:border-slate-700/50 
                      text-gray-900 dark:text-white 
                      placeholder-gray-400 dark:placeholder-slate-500 
                      focus:border-cyan-500 dark:focus:border-cyan-500/50 
                      focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20 
                      transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {errors.contact_person_designation && (
                    <span className="text-red-500 dark:text-red-400 text-xs flex items-center gap-1.5">
                      <AlertCircle size={12} />
                      {errors.contact_person_designation}
                    </span>
                  )}
                </div>

                {/* Contact Phone */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-slate-400 flex items-center gap-1.5">
                    Contact Phone
                    <span className="text-red-500 dark:text-red-400">*</span>
                  </label>
                  <input
                    placeholder="Enter phone number"
                    value={newInstitute.contact_phone}
                    onChange={(e) =>
                      setNewInstitute({
                        ...newInstitute,
                        contact_phone: e.target.value,
                      })
                    }
                    disabled={isSaving}
                    className="w-full rounded-xl px-4 py-3 
                      bg-white dark:bg-slate-800/50 
                      border border-gray-300 dark:border-slate-700/50 
                      text-gray-900 dark:text-white 
                      placeholder-gray-400 dark:placeholder-slate-500 
                      focus:border-cyan-500 dark:focus:border-cyan-500/50 
                      focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20 
                      transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {errors.contact_phone && (
                    <span className="text-red-500 dark:text-red-400 text-xs flex items-center gap-1.5">
                      <AlertCircle size={12} />
                      {errors.contact_phone}
                    </span>
                  )}
                </div>

                {/* Alternate Phone */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-slate-400">
                    Alternate Contact Phone
                  </label>
                  <input
                    placeholder="Enter alternate phone number"
                    value={newInstitute.contact_phone_alt}
                    onChange={(e) =>
                      setNewInstitute({
                        ...newInstitute,
                        contact_phone_alt: e.target.value,
                      })
                    }
                    disabled={isSaving}
                    className="w-full rounded-xl px-4 py-3 
                      bg-white dark:bg-slate-800/50 
                      border border-gray-300 dark:border-slate-700/50 
                      text-gray-900 dark:text-white 
                      placeholder-gray-400 dark:placeholder-slate-500 
                      focus:border-cyan-500 dark:focus:border-cyan-500/50 
                      focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20 
                      transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div
              id="tour-location-details"
              className="space-y-4 p-5 rounded-xl 
              bg-gray-100 dark:bg-slate-800/30 
              border border-gray-200 dark:border-slate-700/30">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <MapPin
                  size={16}
                  className="text-green-600 dark:text-green-400"
                />
                Location Details
              </h4>

              <SmartLocationFields
                newInstitute={newInstitute}
                setNewInstitute={setNewInstitute}
                errors={errors}
                isSaving={isSaving}
                placeAtRef={placeAtRef}
              />

              {/* Location Picker */}
              <div id="tour-map-picker" className="mt-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400">
                  <Globe
                    size={16}
                    className="text-cyan-600 dark:text-cyan-400"
                  />
                  <span>Map Location Picker</span>
                </div>
                <LocationPicker
                  newInstitute={newInstitute}
                  setNewInstitute={setNewInstitute}
                  onReady={(fn) => (placeAtRef.current = fn)}
                />
                <div
                  className="flex gap-4 p-3 rounded-xl 
                  bg-white dark:bg-slate-800/50 
                  border border-gray-300 dark:border-slate-700/50 
                  flex-col sm:flex-row">
                  <div className="flex items-center gap-2 text-sm w-full sm:w-auto">
                    <span className="text-gray-600 dark:text-slate-400">
                      Latitude:
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {newInstitute.latitude || "Not selected"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm w-full sm:w-auto">
                    <span className="text-gray-600 dark:text-slate-400">
                      Longitude:
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {newInstitute.longitude || "Not selected"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Notes Section */}
            <div
              id="tour-admin-notes"
              className="space-y-4 p-5 rounded-xl 
              bg-gray-100 dark:bg-slate-800/30 
              border border-gray-200 dark:border-slate-700/30">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <FileText
                  size={16}
                  className="text-yellow-600 dark:text-yellow-400"
                />
                Admin Notes
              </h4>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-600 dark:text-slate-400">
                  Internal Notes (Optional)
                </label>
                <textarea
                  rows={4}
                  placeholder="Add any internal notes about this institute..."
                  value={newInstitute.admin_notes}
                  onChange={(e) =>
                    setNewInstitute({
                      ...newInstitute,
                      admin_notes: e.target.value,
                    })
                  }
                  disabled={isSaving}
                  className="w-full rounded-xl px-4 py-3 
                    bg-white dark:bg-slate-800/50 
                    border border-gray-300 dark:border-slate-700/50 
                    text-gray-900 dark:text-white 
                    placeholder-gray-400 dark:placeholder-slate-500 
                    resize-none 
                    focus:border-cyan-500 dark:focus:border-cyan-500/50 
                    focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20 
                    transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="relative flex justify-end items-center gap-3 p-6 
          border-t border-gray-200 dark:border-slate-700/50 
          bg-gray-50 dark:bg-slate-900/50">
          <button
            onClick={handleClose}
            disabled={isSaving}
            className="px-6 py-3 rounded-xl 
              bg-gray-100 dark:bg-slate-800/50 
              hover:bg-gray-200 dark:hover:bg-slate-700/50 
              text-gray-700 dark:text-slate-300 
              hover:text-gray-900 dark:hover:text-white 
              font-medium transition-all duration-200 
              border border-gray-300 dark:border-slate-700/50 
              hover:border-gray-400 dark:hover:border-slate-600/50 
              disabled:opacity-50 disabled:cursor-not-allowed">
            Cancel
          </button>

          <button
            id="tour-add-save"
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold transition-all duration-200 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
            {isSaving ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Save Institute</span>
              </>
            )}
          </button>
        </div>
      </div>
      {/* CLOSE WARNING MODAL */}
      {closeWarningOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setCloseWarningOpen(false)}
          />

          {/* Modal */}
          <div
            className="relative w-full max-w-md rounded-2xl 
      bg-white dark:bg-slate-900 
      border border-gray-200 dark:border-slate-700/50 
      shadow-2xl p-6 space-y-5">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                <AlertCircle size={28} className="text-yellow-500" />
              </div>
            </div>

            {/* Title & Message */}
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Discard Changes?
              </h3>
              <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                You have unsaved data in this form. Closing now will{" "}
                <span className="font-semibold text-yellow-500">
                  permanently discard
                </span>{" "}
                everything you've entered.
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-slate-700/50" />

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setCloseWarningOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-xl 
            bg-gray-100 dark:bg-slate-800 
            border border-gray-300 dark:border-slate-700/50 
            text-gray-700 dark:text-slate-300 
            hover:bg-gray-200 dark:hover:bg-slate-700 
            font-medium text-sm transition-all duration-200 cursor-pointer">
                Keep Editing
              </button>
              <button
                onClick={() => {
                  setCloseWarningOpen(false);
                  onClose();
                  setNewInstitute(initialInstituteState);
                }}
                className="flex-1 px-4 py-2.5 rounded-xl 
            bg-yellow-500 hover:bg-yellow-600 
            text-white font-semibold text-sm 
            transition-all duration-200 shadow-lg shadow-yellow-500/25 
            hover:shadow-yellow-500/40 cursor-pointer">
                Yes, Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddInstituteModal;
