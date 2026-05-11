import { Outlet } from "react-router-dom";
import { useState, useRef } from "react";
import { PanelLeftOpen, PanelLeftClose } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

import { ScrollContext } from "../hooks/ScrollContext";
import ScrollToTop from "../hooks/ScrollToTop"

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainRef = useRef(null)

  return (
    <ScrollContext.Provider value={mainRef}>
       <ScrollToTop /> 
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Backdrop overlay for mobile/tablet */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop: collapsible, Mobile/Tablet: overlay */}
      <div
        className={`
          flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden
          lg:relative lg:z-10
          fixed inset-y-0 left-0 z-50
          ${sidebarOpen ? "w-72" : "w-0 lg:w-0"}
        `}
      >
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="relative flex flex-1 flex-col overflow-hidden">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 opacity-20 dark:opacity-30 transition-opacity duration-300">
          <div className="absolute -top-40 left-20 h-[520px] w-[520px] rounded-full bg-cyan-400 dark:bg-cyan-600 blur-[140px]" />
          <div className="absolute bottom-0 right-20 h-[420px] w-[420px] rounded-full bg-teal-400 dark:bg-teal-600 blur-[120px]" />
        </div>

        <AdminTopbar sidebarOpen={sidebarOpen} />

        <main
        ref={mainRef}
        className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 transition-all duration-300 ease-in-out">
          {/* Sidebar Toggle Button */}
          <button
          id="tour-sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed bottom-6 left-6 sm:bottom-8 sm:left-8 z-30 flex items-center gap-2 px-3 h-10 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0a0f1e] shadow-md dark:shadow-black/30 text-gray-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/40 dark:hover:border-cyan-500/30 hover:bg-cyan-50/50 dark:hover:bg-cyan-500/5 transition-all duration-150 group"
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? (
              <PanelLeftClose size={16} className="transition-transform duration-150 group-hover:scale-110" />
            ) : (
              <PanelLeftOpen size={16} className="transition-transform duration-150 group-hover:scale-110" />
            )}
            <span className="text-[12px] font-medium tracking-wide">
              {sidebarOpen ? "Close" : "Menu"}
            </span>
          </button>

          <Outlet />
        </main>
      </div>
    </div>
    </ScrollContext.Provider>
  );
};

export default AdminLayout;