// src/admin/components/common/GlassContainer.jsx
// Updated version with light/dark mode support

const GlassContainer = ({ children, className = "" }) => {
  return (
    <div
      className={`
        relative overflow-hidden rounded-xl
        bg-white/90 dark:bg-slate-900/50
        backdrop-blur-xl
        border border-gray-200 dark:border-slate-700/50
        shadow-lg dark:shadow-2xl
        p-6
        transition-all duration-300
        hover:shadow-xl dark:hover:shadow-cyan-500/10
        ${className}
      `}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 dark:from-cyan-500/5 dark:via-transparent dark:to-purple-500/5 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlassContainer;