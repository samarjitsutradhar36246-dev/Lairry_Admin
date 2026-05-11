import React, { useEffect, useState, useCallback } from "react";

const ErrorToast = ({ message, onClose, duration = 4000 }) => {
  const [mounted, setMounted] = useState(true); // controls DOM presence
  const [visible, setVisible] = useState(false); // fade animation
  const [barWidth, setBarWidth] = useState("100%"); // progress bar

  // Stable handleClose using useCallback
  const handleClose = useCallback(() => {
    setVisible(false); // fade out
    setBarWidth("0%"); // shrink progress immediately

    // Unmount after fade duration
    const timeout = setTimeout(() => {
      setMounted(false);
      onClose?.();
    }, 300); // matches CSS transition

    return () => clearTimeout(timeout);
  }, [onClose]);

  useEffect(() => {
    // Fade in
    const fadeIn = setTimeout(() => setVisible(true), 10);
    // Start progress bar
    const progressTimer = setTimeout(() => setBarWidth("0%"), 10);
    // Auto-close after duration
    const autoClose = setTimeout(() => handleClose(), duration);

    return () => {
      clearTimeout(fadeIn);
      clearTimeout(progressTimer);
      clearTimeout(autoClose);
    };
  }, [duration, handleClose]); // handleClose stable, no ESLint warning

  if (!mounted) return null; // remove from DOM after fade-out

  return (
    <div
      className={`w-96 bg-red-500/90 text-slate-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      <div className="p-4">
        <p className="text-white font-semibold">{message}</p>
        <div className="flex justify-end mt-2">
          <button
            onClick={handleClose}
            className="px-3 py-1 text-sm bg-white text-black rounded hover:bg-red-600 transition"
          >
            OK
          </button>
        </div>
      </div>

      {/* Smooth progress bar */}
      <div className="h-1 w-full bg-gray-200 overflow-hidden">
        <div
          className="h-1 bg-red-500 transition-all linear"
          style={{
            width: barWidth,
            transition: `width ${visible ? duration : 300}ms linear`,
          }}
        />
      </div>
    </div>
  );
};

export default ErrorToast;
