import React , { useState, useEffect } from "react";
import { X, Bell, CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";

const NOTIFICATION_TYPES = [
  { value: "info", label: "Info", icon: Info, color: "text-blue-500 dark:text-blue-400" },
  { value: "success", label: "Success", icon: CheckCircle, color: "text-green-500 dark:text-green-400" },
  { value: "warning", label: "Warning", icon: AlertTriangle, color: "text-yellow-500 dark:text-yellow-400" },
  { value: "error", label: "Error", icon: XCircle, color: "text-red-500 dark:text-red-400" }
];

const MATERIAL_ICONS = [
  "notifications",
  "campaign",
  "info",
  "check_circle",
  "warning",
  "error",
  "school",
  "assignment",
  "event",
  "star",
  "verified",
  "lock",
  "schedule",
  "grade"
];

const COLOR_PRESETS = [
  { name: "Cyan", value: "#22d3ee" },
  { name: "Green", value: "#22c55e" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Yellow", value: "#eab308" },
  { name: "Red", value: "#ef4444" },
  { name: "Purple", value: "#a855f7" },
  { name: "Gray", value: "#94a3b8" },
];

const BG_PRESETS = [
  { name: "Dark", value: "#020617" },
  { name: "Slate", value: "#0f172a" },
  { name: "Soft Cyan", value: "#164e63" },
  { name: "Soft Green", value: "#14532d" },
  { name: "Soft Red", value: "#450a0a" },
  { name: "Transparent", value: "transparent" },
];

const SendNotificationModal = ({
  open,
  onClose,
  title,
  setTitle,
  description,
  setDescription,
  icon,
  setIcon,
  iconColor,
  setIconColor,
  iconBg,
  setIconBg,
  type,
  setType,
  isImportant,
  setIsImportant,
  actionUrl,
  setActionUrl,
  onSend,
  selectedRecipients = [],
  recipientLabel = "Recipients",
  recipientSingular = "Recipient",
  getRecipientName = (recipient) => recipient.name || recipientSingular,
  getRecipientSubtext = (recipient) => recipient.email || null,
  getRecipientInitial = (recipient) => (recipient.name?.[0]?.toUpperCase() || recipientSingular[0]?.toUpperCase() || 'R'),
  onDiscard,
  onChangeRecipients,
  activeEmailSet = new Set(),
  draftKey = "notification_draft",
}) => {
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  useEffect(() => {
    if (!open) return;
    try {
      const saved = localStorage.getItem(draftKey);
      if (!saved) return;
      const d = JSON.parse(saved);
      if (d.title && !title)                       setTitle(d.title);
      if (d.description && !description)           setDescription(d.description);
      if (d.type && !type)                         setType(d.type);
      if (d.icon && !icon)                         setIcon(d.icon);
      if (d.iconColor && !iconColor)               setIconColor(d.iconColor);
      if (d.iconBg && !iconBg)                     setIconBg(d.iconBg);
      if (d.actionUrl && !actionUrl)               setActionUrl(d.actionUrl);
      if (d.isImportant !== undefined && !isImportant) setIsImportant(d.isImportant);
    } catch { }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    localStorage.setItem(draftKey, JSON.stringify({
      title, description, type, icon, iconColor, iconBg, actionUrl, isImportant
    }));
  }, [title, description, type, icon, iconColor, iconBg, actionUrl, isImportant, draftKey, open]);

  const handleExitClick = () => {
    if (!title && !description && !actionUrl) {
      onDiscard?.();
      return;
    }
    setShowExitConfirm(true);
  };

  const handleSaveDraft = () => {
    setShowExitConfirm(false);
    onClose();
  };

  const handleConfirmDiscard = () => {
    localStorage.removeItem(draftKey);
    setShowExitConfirm(false);
    onDiscard?.();
  };

  const handleSend = () => {
    onSend();
    localStorage.removeItem(draftKey);
  };

  // ── Remove a single recipient by email (safe across active/stale split) ──
  const removeRecipient = (recipient) => {
    onChangeRecipients?.(selectedRecipients.filter((r) => r.email !== recipient.email));
  };

  if (!open) return null;

  // ── Active / stale split ──────────────────────────────────────────────────
  const safeActiveSet = activeEmailSet ?? new Set();

  const activeRecipients = selectedRecipients.filter((r) =>
    safeActiveSet.size === 0 || safeActiveSet.has(r.email)
  );
  const staleRecipients = selectedRecipients.filter((r) =>
    safeActiveSet.size > 0 && !safeActiveSet.has(r.email)
  );

  const staleCount = staleRecipients.some((r) => r.isSummaryPlaceholder)
    ? staleRecipients.find((r) => r.isSummaryPlaceholder).count
    : staleRecipients.length;

  const placeholderActive = activeRecipients.find((r) => r.isSummaryPlaceholder);
  const totalCount = placeholderActive
    ? placeholderActive.count
    : activeRecipients.length + staleCount;

  const selectedType = NOTIFICATION_TYPES.find((t) => t.value === type);

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-slate-800 overflow-hidden max-h-[80vh] flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-800">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Bell className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                Send Notification
              </h3>
              <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                Create and send a notification to selected {recipientLabel.toLowerCase()}
              </p>
            </div>
            <button
              onClick={handleExitClick}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-slate-400" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1">

            {/* Selected Recipients Section */}
            <div className="border border-gray-200 dark:border-slate-800 rounded-lg p-4 bg-gray-50 dark:bg-slate-800/20">

              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                Selected {recipientLabel} ({totalCount})
                {staleRecipients.length > 0 && !placeholderActive && (
                  <span className="ml-2 text-xs font-normal text-gray-500 dark:text-slate-400">
                    · {activeRecipients.length} currently selected ·{" "}
                    <span className="text-yellow-600 dark:text-yellow-400">
                      {staleCount} no longer selected
                    </span>
                  </span>
                )}
              </label>

              {selectedRecipients.length > 0 ? (
                <div className="space-y-3">

                  {/* Active recipients */}
                  {activeRecipients.length > 0 && (
                    <div className="max-h-32 overflow-y-auto space-y-2">
                      {activeRecipients.map((recipient, index) => {
                        const name    = getRecipientName(recipient);
                        const subtext = getRecipientSubtext(recipient);
                        const initial = getRecipientInitial(recipient);
                        return (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-2 bg-white dark:bg-slate-700/30 rounded-lg border border-gray-200 dark:border-transparent"
                          >
                            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-semibold text-sm flex-shrink-0">
                              {initial}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-slate-200 truncate">{name}</p>
                              {subtext && <p className="text-xs text-gray-500 dark:text-slate-500 truncate">{subtext}</p>}
                            </div>
                            {onChangeRecipients && (
                              <button
                                onClick={() => removeRecipient(recipient)}
                                className="p-1 hover:bg-red-100 dark:hover:bg-red-500/20 rounded text-gray-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors flex-shrink-0"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Stale recipients */}
                  {staleRecipients.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                          <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                            No longer selected in table ({staleCount})
                          </span>
                        </div>
                        {onChangeRecipients && (
                          <button
                            onClick={() => onChangeRecipients(activeRecipients)}
                            className="text-xs text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 font-medium underline underline-offset-2 cursor-pointer transition-colors"
                          >
                            Remove all
                          </button>
                        )}
                      </div>

                      {staleRecipients.some((r) => r.isSummaryPlaceholder) ? (
                        <div className="flex items-center gap-3 p-2 bg-yellow-500/5 rounded-lg border border-yellow-500/20">
                          <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-600 dark:text-yellow-400 font-semibold text-sm flex-shrink-0">
                            ~
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-500 dark:text-slate-400 truncate">
                              {staleCount} matching {recipientLabel.toLowerCase()} no longer selected
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="max-h-28 overflow-y-auto space-y-2">
                          {staleRecipients.map((recipient, index) => {
                            const name    = getRecipientName(recipient);
                            const subtext = getRecipientSubtext(recipient);
                            const initial = getRecipientInitial(recipient);
                            return (
                              <div
                                key={index}
                                className="flex items-center gap-3 p-2 bg-yellow-500/5 rounded-lg border border-yellow-500/20"
                              >
                                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-600 dark:text-yellow-400 font-semibold text-sm flex-shrink-0">
                                  {initial}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-500 dark:text-slate-400 truncate">{name}</p>
                                  {subtext && <p className="text-xs text-gray-400 dark:text-slate-500 truncate">{subtext}</p>}
                                </div>
                                {onChangeRecipients && (
                                  <button
                                    onClick={() => removeRecipient(recipient)}
                                    className="p-1 hover:bg-red-100 dark:hover:bg-red-500/20 rounded text-gray-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors flex-shrink-0"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 dark:text-slate-500">
                  <p className="text-sm">No {recipientLabel.toLowerCase()} selected</p>
                  <p className="text-xs mt-1">Please select {recipientLabel.toLowerCase()} to send notification</p>
                </div>
              )}
            </div>

            {/* Title & Description */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Title <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter notification title"
                  className="w-full px-4 py-3 rounded-lg 
                    bg-white dark:bg-slate-800/50 
                    border border-gray-300 dark:border-slate-700 
                    text-gray-900 dark:text-white 
                    placeholder-gray-400 dark:placeholder-slate-500 
                    focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Description <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <textarea
                  placeholder="Enter notification description"
                  className="w-full px-4 py-3 rounded-lg 
                    bg-white dark:bg-slate-800/50 
                    border border-gray-300 dark:border-slate-700 
                    text-gray-900 dark:text-white 
                    placeholder-gray-400 dark:placeholder-slate-500 
                    focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition resize-none"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                Notification Type <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <div className="grid grid-cols-4 gap-3">
                {NOTIFICATION_TYPES.map((t) => {
                  const Icon = t.icon;
                  const isSelected = type === t.value;
                  return (
                    <button
                      key={t.value}
                      onClick={() => setType(t.value)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-500/20 ring-2 ring-cyan-500/30'
                          : 'border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800/30 hover:border-gray-400 dark:hover:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-cyan-600 dark:text-cyan-400' : t.color}`} />
                      <span className={`text-sm font-medium block ${isSelected ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-600 dark:text-slate-400'}`}>
                        {t.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Preview */}
            <div className="border border-gray-200 dark:border-slate-800 rounded-lg p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800/40 dark:to-slate-900/40">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                Preview
              </label>
              <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800/40">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: iconBg || "#0f172a" }}
                >
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={{ color: iconColor || "#ffffff" }}
                  >
                    {icon || "notifications"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {title || "Notification title"}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-slate-400 truncate">
                    {description || "Notification description"}
                  </p>
                </div>
              </div>
            </div>

            {/* Icon Customization */}
            <div className="border border-gray-200 dark:border-slate-800 rounded-lg p-4 bg-gray-50 dark:bg-slate-800/20">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                Icon Customization <span className="text-red-500 dark:text-red-400">*</span>
              </label>

              <div className="space-y-4">
                {/* Icon Picker */}
                <div>
                  <label className="block text-xs text-gray-600 dark:text-slate-400 mb-2">Icon</label>
                  <div className="grid grid-cols-7 gap-2">
                    {MATERIAL_ICONS.map((iconName) => (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setIcon(iconName)}
                        className={`p-2 rounded-lg border transition ${
                          icon === iconName
                            ? "border-cyan-500 bg-cyan-500/20"
                            : "border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span
                          className="material-symbols-outlined text-xl"
                          style={{ color: iconColor || "#ffffff" }}
                        >
                          {iconName}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Icon Color Picker */}
                <div>
                  <label className="block text-xs text-gray-600 dark:text-slate-400 mb-2">Icon Color</label>
                  <div className="grid grid-cols-4 gap-2">
                    {COLOR_PRESETS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setIconColor(c.value)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition ${
                          iconColor === c.value
                            ? "border-cyan-500 bg-cyan-500/20 text-gray-900 dark:text-white"
                            : "border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300"
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: c.value }}
                        />
                        <span className="truncate">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background Color Picker */}
                <div>
                  <label className="block text-xs text-gray-600 dark:text-slate-400 mb-2">Icon Background</label>
                  <div className="grid grid-cols-3 gap-2">
                    {BG_PRESETS.map((bg) => (
                      <button
                        key={bg.value}
                        type="button"
                        onClick={() => setIconBg(bg.value)}
                        className={`px-3 py-2 rounded-lg border text-sm transition ${
                          iconBg === bg.value
                            ? "border-cyan-500 bg-cyan-500/20 text-gray-900 dark:text-white"
                            : "border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300"
                        }`}
                      >
                        {bg.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/30 rounded-lg border border-gray-200 dark:border-slate-800">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Mark as Important</label>
                  <p className="text-xs text-gray-500 dark:text-slate-500 mt-0.5">High priority notifications stand out</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isImportant}
                    onChange={(e) => setIsImportant(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Action URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/action"
                  className="w-full px-4 py-3 rounded-lg 
                    bg-white dark:bg-slate-800/50 
                    border border-gray-300 dark:border-slate-700 
                    text-gray-900 dark:text-white 
                    placeholder-gray-400 dark:placeholder-slate-500 
                    focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition"
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                />
                <p className="text-xs text-gray-500 dark:text-slate-500 mt-1.5">Users will be redirected here when clicking the notification</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50">
            <p className="text-xs text-gray-500 dark:text-slate-500">
              <span className="text-red-500 dark:text-red-400">*</span> Required fields
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleExitClick}
                className="px-5 py-2.5 bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-700 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={
                  !title ||
                  !description ||
                  !type ||
                  !icon ||
                  !iconColor ||
                  !iconBg
                }
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all font-medium shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                Send Notification
              </button>
            </div>
          </div>
        </div>
      </div>

      {showExitConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowExitConfirm(false)}
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700/50 shadow-2xl p-6 space-y-5">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                What would you like to do?
              </h3>
              <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                You have an unsaved notification. Save it as a draft to continue later, or discard it permanently.
              </p>
            </div>
            <div className="border-t border-gray-200 dark:border-slate-700/50" />
            <div className="flex flex-col gap-2">
              <button
                onClick={handleSaveDraft}
                className="w-full px-4 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-sm transition-all shadow-md shadow-cyan-500/25 cursor-pointer"
              >
                Save Draft
              </button>
              <button
                onClick={() => setShowExitConfirm(false)}
                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700/50 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 font-medium text-sm transition-all cursor-pointer"
              >
                Keep Editing
              </button>
              <button
                onClick={handleConfirmDiscard}
                className="w-full px-4 py-3 rounded-xl text-red-500 dark:text-red-400 dark:bg-red-500/20 bg-red-100 hover:bg-red-50 dark:hover:bg-red-500/10 font-medium text-sm transition-all cursor-pointer"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SendNotificationModal;