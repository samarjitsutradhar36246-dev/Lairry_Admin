import React, { useState, useEffect, useCallback } from "react";

const PayloadToast = ({ message, payload, onClose, duration = 5000 }) => {
  const [mounted, setMounted] = useState(true); // controls DOM presence
  const [visible, setVisible] = useState(false); // fade animation
  const [barWidth, setBarWidth] = useState("100%"); // progress bar

  // Stable handleClose
  const handleClose = useCallback(() => {
    setVisible(false); // fade out
    setBarWidth("0%"); // shrink progress immediately

    const timeout = setTimeout(() => {
      setMounted(false); // remove from DOM
      onClose?.();
    }, 300); // matches CSS transition

    return () => clearTimeout(timeout);
  }, [onClose]);

  useEffect(() => {
    // Fade in
    const fadeIn = setTimeout(() => setVisible(true), 10);
    // Animate progress bar
    const progressTimer = setTimeout(() => setBarWidth("0%"), 10);
    // Auto-close
    const autoClose = setTimeout(() => handleClose(), duration);

    return () => {
      clearTimeout(fadeIn);
      clearTimeout(progressTimer);
      clearTimeout(autoClose);
    };
  }, [duration, handleClose]);

  if (!mounted) return null; // remove from DOM after fade-out

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Toast */}
      <div
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transform transition-all duration-300 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <div className="w-96 bg-cyan-500 text-slate-800 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-5">
            <p className="text-white font-semibold">{message}</p>
            {payload && (
              <p className="text-sm mt-3">
                <span className="font-mono text-slate-900 select-all">{payload}</span>
              </p>
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={handleClose}
                className="px-4 py-1.5 text-sm rounded-lg bg-white text-black hover:bg-cyan-600 transition"
              >
                OK
              </button>
            </div>
          </div>

          {/* Smooth progress bar */}
          <div className="h-1 w-full bg-gray-200 overflow-hidden">
            <div
              className="h-1 bg-cyan-500 transition-all linear"
              style={{
                width: barWidth,
                transition: `width ${duration}ms linear`,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PayloadToast;
