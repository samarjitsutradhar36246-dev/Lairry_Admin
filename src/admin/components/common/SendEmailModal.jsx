import React, { useState, useEffect } from "react";
import { X, Mail } from "lucide-react";
import TiptapEditor from "./TiptapEditor";
import emailjs from "@emailjs/browser";

const SendEmailModal = ({
  isOpen,
  onClose,
  onDiscard,
  recipients = [],
  onChangeRecipients,
  recipientLabel = "Recipients",
  recipientSingular = "Recipient",
  getRecipientName = (r) => r.name || r.email || recipientSingular,
  getRecipientSubtext = (r) => r.email || null,
  getRecipientInitial = (r) =>
    (r.name?.[0] || r.email?.[0] || recipientSingular[0] || "R").toUpperCase(),
  subject,
  setSubject,
  body,
  setBody,
  onSend,
  activeEmailSet = new Set(),
  draftKey = "email_draft",
}) => {
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // ── Restore draft from localStorage on first mount ───────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem(draftKey);
      if (!saved) return;
      const draft = JSON.parse(saved);
      if (draft.subject && !subject) setSubject(draft.subject);
      if (draft.body && !body) setBody(draft.body);
      if (draft.recipients?.length && recipients.length === 0) {
        onChangeRecipients?.(draft.recipients);
      }
    } catch {
      // malformed localStorage — ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Save draft to localStorage on every relevant change ──────────────────
  useEffect(() => {
    localStorage.setItem(
      draftKey,
      JSON.stringify({ recipients, subject, body }),
    );
  }, [recipients, subject, body, draftKey]);

  // ── Remove recipient ─────────────────────────────────────────────────────
  const removeRecipient = (recipient) => {
    onChangeRecipients?.(recipients.filter((r) => r.email !== recipient.email));
  };

  const safeActiveSet = activeEmailSet ?? new Set();
  const activeRecipients = recipients.filter(
    (r) => safeActiveSet.size === 0 || safeActiveSet.has(r.email),
  );
  const staleRecipients = recipients.filter(
    (r) => safeActiveSet.size > 0 && !safeActiveSet.has(r.email),
  );

  const staleCount = staleRecipients.some((r) => r.isSummaryPlaceholder)
    ? staleRecipients.find((r) => r.isSummaryPlaceholder).count
    : staleRecipients.length;

  const placeholderActive = activeRecipients.find(
    (r) => r.isSummaryPlaceholder,
  );
  const totalCount = placeholderActive
    ? placeholderActive.count
    : activeRecipients.length + staleCount;

  const handleExitClick = () => {
    if (!subject && !body) {
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

  // ── Corrected handleSend with EmailJS Integration ────────────────────────
  // SendEmailModal.jsx ke handleSend function mein
  const handleSend = async () => {
    const templateParams = {
      name: getRecipientName(recipients[0]),
      message: body,
      subject: subject,
      to_email: recipients[0]?.email, // ✅ Yeh already sahi hai
    };

    try {
      await emailjs.send(
        "service_hzdvu8e",
        "template_nu3fk3u",
        templateParams,
        "jXZpEYlzVAdJbACvd",
      );
      onSend(recipients, subject, body);
      localStorage.removeItem(draftKey);
      onClose();
    } catch (error) {
      console.error("EmailJS Error:", error);
      alert("Email send nahi hua: " + error.text);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-slate-800 overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-800">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Mail className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              Send Email
            </h3>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
              Compose and send an email to selected{" "}
              {recipientLabel.toLowerCase()}
            </p>
          </div>
          <button
            onClick={handleExitClick}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Selected Recipients Display Logic */}
          <div className="border border-gray-200 dark:border-slate-800 rounded-lg p-4 bg-gray-50 dark:bg-slate-800/20">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
              Selected {recipientLabel} ({totalCount})
            </label>
            {recipients.length > 0 ? (
              <div className="space-y-3">
                {/* Active recipients list mapping here... */}
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {activeRecipients.map((r, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-2 bg-white dark:bg-slate-700/30 rounded-lg border border-gray-200">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-600 font-semibold text-sm">
                        {getRecipientInitial(r)}
                      </div>
                      <div className="flex-1 truncate text-sm font-medium dark:text-slate-200">
                        {getRecipientName(r)}
                      </div>
                      <button
                        onClick={() => removeRecipient(r)}
                        className="text-gray-400 hover:text-red-500">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center text-sm text-gray-500">
                No recipients selected
              </p>
            )}
          </div>

          {/* Subject Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Subject *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject"
              className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Message / Tiptap */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Message *
            </label>
            <div className="rounded-lg border border-gray-300 dark:border-slate-700 overflow-hidden">
              <TiptapEditor value={body} setValue={setBody} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50">
          <p className="text-xs text-gray-500">* Required fields</p>
          <div className="flex gap-3">
            <button
              onClick={handleExitClick}
              className="px-5 py-2.5 bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-lg font-medium">
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={!subject || !body || recipients.length === 0}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium shadow-lg disabled:opacity-50">
              Send Email
            </button>
          </div>
        </div>
      </div>

      {/* Exit Confirm Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowExitConfirm(false)}
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 space-y-5">
            <h3 className="text-lg font-bold text-center">Unsaved Changes</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleSaveDraft}
                className="w-full py-3 bg-cyan-500 text-white rounded-xl font-semibold">
                Save Draft
              </button>
              <button
                onClick={() => setShowExitConfirm(false)}
                className="w-full py-3 bg-gray-100 dark:bg-slate-800 rounded-xl">
                Keep Editing
              </button>
              <button
                onClick={handleConfirmDiscard}
                className="w-full py-3 bg-red-100 text-red-500 rounded-xl">
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendEmailModal;
