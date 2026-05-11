import React from "react";

const Loading = ({ message = "Loading...", fullPage = false }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center ${
        fullPage
          ? "fixed inset-0 bg-[#0B1120] z-50"
          : "relative w-full min-h-150"
      }`}
    >
      <div className="flex gap-3 mb-4">
        <span className="dot yellow"></span>
        <span className="dot blue"></span>
        <span className="dot red"></span>
        <span className="dot green"></span>
      </div>
      <p className="text-slate-100 text-sm tracking-wide">{message}</p>

      <style>{`
        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          animation: bounce 0.8s infinite ease-in-out;
        }
        .yellow { background: #FDB515; animation-delay: 0s; }
        .blue   { background: #4A8DF6; animation-delay: 0.1s; }
        .red    { background: #E94235; animation-delay: 0.2s; }
        .green  { background: #34A853; animation-delay: 0.3s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Loading;
