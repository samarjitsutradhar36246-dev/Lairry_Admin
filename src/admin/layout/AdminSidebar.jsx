import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  Globe,
  TrendingUp,
  BarChart3,
  Brain,
  Users,
  School,
  List,
  Settings,
  LifeBuoy,
} from "lucide-react";

const AdminSidebar = () => {
  return (
    <aside
      style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
      className="w-[290px] h-full flex flex-col bg-white dark:bg-[#0a0f1e] border-r border-gray-100 dark:border-white/[0.06] transition-colors"
    >
      {/* Brand */}
      <div className="px-6 pt-5 pb-3 border-b border-gray-100 dark:border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div>
            <h1 className="font-semibold text-[15px] text-gray-900 dark:text-white tracking-tight leading-none">
              L.AI.RRY
            </h1>
            <p className="text-[9px] text-cyan-600 dark:text-cyan-400 tracking-[0.15em] font-medium mt-0.5 uppercase">
              Enterprise Admin
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <SectionLabel>Main Menu</SectionLabel>

        <NavItem to="/admin" end icon={<LayoutGrid size={16} />}>
          Overview
        </NavItem>
        <NavItem to="/admin/institute-location-map" icon={<Globe size={16} />}>
          Institute Location Map
        </NavItem>
        <NavItem to="/admin/growth-analytics-section" icon={<TrendingUp size={16} />}>
          Growth Analytics
        </NavItem>
        <NavItem to="/admin/financial-analytics" icon={<BarChart3 size={16} />}>
          Financial Analytics
        </NavItem>
        {/* <NavItem to="/admin/ai-model-intelligence" icon={<Brain size={16} />}>
          AI Model Intelligence
        </NavItem> */}
        <NavItem to="/admin/students-management" icon={<Users size={16} />}>
          Students Management
        </NavItem>
        <NavItem to="/admin/institutes-management" icon={<School size={16} />}>
          Institutes Management
        </NavItem>

        <Divider />

        {/* <SectionLabel>System</SectionLabel> */}

        {/* <NavItem to="/admin/queue" icon={<List size={16} />}>
          Queue
        </NavItem> */}
        {/* <NavItem to="/admin/settings" icon={<Settings size={16} />}>
          Settings
        </NavItem>
        <NavItem to="/admin/support" icon={<LifeBuoy size={16} />}>
          Support
        </NavItem> */}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-gray-100 dark:border-white/[0.06]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-gray-400 dark:text-slate-600 font-medium">
            v1.0.0
          </span>
          <span className="text-[10px] text-gray-400 dark:text-slate-600">
            © 2026 L.AI.RRY
          </span>
        </div>
      </div>
    </aside>
  );
};

/* ── Sub-components ────────────────────────────────── */

const NavItem = ({ to, end, icon, children, badge }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      [
        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-all duration-150",
        isActive
          ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
          : "text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/[0.04] hover:text-gray-800 dark:hover:text-slate-200",
      ].join(" ")
    }
  >
    {({ isActive }) => (
      <>
        {/* Active indicator bar */}
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-cyan-500" />
        )}

        {/* Icon wrapper */}
        <span
          className={[
            "flex items-center justify-center w-[30px] h-[30px] rounded-md transition-colors duration-150",
            isActive
              ? "bg-cyan-500/15 text-cyan-500 dark:text-cyan-400"
              : "text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-slate-300",
          ].join(" ")}
        >
          {icon}
        </span>

        <span className="flex-1 leading-none">{children}</span>

        {badge && (
          <span className="ml-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-500 dark:text-red-400">
            {badge}
          </span>
        )}
      </>
    )}
  </NavLink>
);

const SectionLabel = ({ children }) => (
  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-slate-600 px-3 pt-2 pb-1.5">
    {children}
  </p>
);

const Divider = () => (
  <div className="my-3 mx-2 h-px bg-gray-100 dark:bg-white/[0.06]" />
);

export default AdminSidebar;