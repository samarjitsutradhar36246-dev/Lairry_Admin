// AdminTopbar.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Bell,
  HelpCircle,
  Search,
  User,
  FileText,
  MessageSquare,
  BookOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSupabase } from "../supabase/SupabaseProvider";
import { supabase } from "../supabase/SupabaseClient"; // ✅ import supabase directly
import ThemeToggle from "../theme/ThemeToggle";

import { useTour } from "../tour/useTour";

import LairryLogoAnimation from "../components/common/LairryLogoAnimation";

const AdminTopbar = ({ sidebarOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [notifications, setNotifications] = useState([]); // ✅ real data
  const [loadingNotifs, setLoadingNotifs] = useState(true);

  const { user } = useSupabase();
  const navigate = useNavigate();

  const notificationRef = useRef(null);
  const helpRef = useRef(null);

  const { startTour } = useTour();

  // ✅ NAYA STATE: Profile photo ko real-time me update karne ke liye (Bina refresh)
  const [localProfileUrl, setLocalProfileUrl] = useState(null);

  useEffect(() => {
    if (user) {
      setLocalProfileUrl(user.profile_url);
    }
  }, [user]);

  useEffect(() => {
    const handleProfileUpdate = (e) => {
      setLocalProfileUrl(e.detail); // Custom event se naya URL set karna
    };
    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () =>
      window.removeEventListener("profileUpdated", handleProfileUpdate);
  }, []);

  /* ---------------------------------------------
     Fetch real notifications from Supabase
  --------------------------------------------- */
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    setLoadingNotifs(true);

    const { data, error } = await supabase
      .from("admin_notifications")
      .select("id, title, description, created_at, is_read")
      .eq("admin_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (!error && data) setNotifications(data);
    setLoadingNotifs(false);
  }, [user?.id]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  /* ---------------------------------------------
     Mark a single notification as read
  --------------------------------------------- */
  const markAsRead = async (notifId) => {
    await supabase
      .from("admin_notifications")
      .update({ is_read: true })
      .eq("id", notifId);

    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, is_read: true } : n)),
    );
  };

  /* ---------------------------------------------
     Mark ALL as read
  --------------------------------------------- */
  const markAllAsRead = async () => {
    if (!user?.id) return;
    await supabase
      .from("admin_notifications")
      .update({ is_read: true })
      .eq("admin_id", user.id)
      .eq("is_read", false);

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  /* ---------------------------------------------
     Format time (replaces hardcoded "2m ago")
  --------------------------------------------- */
  const formatTime = (timestamp) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  /* ---------------------------------------------
     Close dropdowns on outside click (unchanged)
  --------------------------------------------- */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      )
        setShowNotifications(false);
      if (helpRef.current && !helpRef.current.contains(event.target))
        setShowHelp(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const helpItems = [
    { text: "Documentation", icon: BookOpen },
    { text: "Support Chat", icon: MessageSquare },
    { text: "FAQ", icon: FileText },
  ];

  if (!user) return null;

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <header
      className="relative h-16 flex items-center justify-between px-3 sm:px-4 lg:px-6 
      border-b border-gray-200 dark:border-slate-700/50 
      bg-white/80 dark:bg-gradient-to-r dark:from-slate-900/95 dark:to-slate-800/95 
      backdrop-blur-xl shadow-sm dark:shadow-lg 
      overflow-visible z-50 transition-colors duration-300">
      {/* Decorative gradient line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      {/* LEFT SECTION */}
      <div
        className={`flex items-center gap-2 sm:gap-4 lg:gap-6 transition-all duration-300 ${sidebarOpen ? "lg:ml-2" : "lg:ml-23"}`}>
        {/* Logo */}
        <LairryLogoAnimation />
      </div>

      {/* RIGHT SECTION */}
      <div
        className={`flex items-center gap-2 sm:gap-3 transition-all duration-300 ${sidebarOpen ? "lg:mr-4" : "lg:mr-27"}`}>
        {/* Theme Toggle - Added here */}
        <div id="tour-topbar-theme" className="hidden md:block">
          <ThemeToggle />
        </div>

        {/* Divider (before theme toggle on mobile) */}
        <div className="hidden md:block h-8 w-px bg-gray-200 dark:bg-slate-700/50" />

        {/* Notifications */}
        <div
          id="tour-topbar-notifications"
          className="relative"
          ref={notificationRef}>
          <button
            className="relative h-9 w-9 lg:h-10 lg:w-10 flex items-center justify-center rounded-xl 
              bg-gray-50 dark:bg-slate-800/50 
              border border-gray-200 dark:border-slate-700/50 
              hover:bg-gray-100 dark:hover:bg-slate-700/50 
              hover:border-gray-300 dark:hover:border-slate-600/50 
              transition-all duration-200 group"
            onClick={() => setShowNotifications(!showNotifications)}>
            <Bell
              className="h-4 w-4 lg:h-5 lg:w-5 
              text-gray-600 dark:text-slate-300 
              group-hover:text-cyan-500 dark:group-hover:text-cyan-400 
              transition-colors"
            />
            {unreadCount > 0 && (
              <>
                <span
                  className="absolute -top-1 -right-1 h-4 w-4 lg:h-5 lg:w-5 rounded-full 
                  bg-gradient-to-br from-red-500 to-red-600 
                  border-2 border-white dark:border-slate-900 
                  flex items-center justify-center text-[9px] lg:text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
                <span className="absolute -top-1 -right-1 h-4 w-4 lg:h-5 lg:w-5 rounded-full bg-red-500 animate-ping opacity-75" />
              </>
            )}
          </button>

          {showNotifications && (
            <div
              className="absolute right-0 mt-3 w-72 lg:w-80 
              bg-white dark:bg-slate-900/95 
              backdrop-blur-xl 
              border border-gray-200 dark:border-slate-700/50 
              rounded-xl shadow-xl dark:shadow-2xl 
              z-[9999] overflow-hidden animate-slideDown">
              {/* Header */}
              <div
                className="px-3 lg:px-4 py-3 
                border-b border-gray-200 dark:border-slate-700/50 
                bg-gray-50 dark:bg-slate-800/30">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs lg:text-sm font-semibold text-gray-900 dark:text-white">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="text-xs text-cyan-500 dark:text-cyan-400 font-medium">
                      {unreadCount} new
                    </span>
                  )}
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto">
                {loadingNotifs ? (
                  <div className="px-4 py-6 text-center text-sm text-slate-500">
                    Loading...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-slate-500">
                    No notifications
                  </div>
                ) : (
                  notifications.map((note) => (
                    <div
                      key={note.id}
                      onClick={() => markAsRead(note.id)}
                      className={`px-3 lg:px-4 py-3 
          border-b border-gray-100 dark:border-slate-700/30 
          hover:bg-gray-50 dark:hover:bg-slate-800/50 
          cursor-pointer transition-colors duration-200 ${
            !note.is_read ? "bg-cyan-50 dark:bg-cyan-500/5" : ""
          }`}>
                      <div className="flex items-start gap-2 lg:gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                            !note.is_read
                              ? "bg-cyan-500 dark:bg-cyan-400"
                              : "bg-gray-400 dark:bg-slate-600"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs lg:text-sm text-gray-900 dark:text-white font-medium">
                            {note.title}
                          </p>
                          {note.description && (
                            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                              {note.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                            {formatTime(note.created_at)}
                          </p>
                        </div>
                        {note.is_important && (
                          <span className="text-[10px] text-amber-500 font-semibold flex-shrink-0">
                            ●
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div
                className="px-3 lg:px-4 py-3 
                border-t border-gray-200 dark:border-slate-700/50 
                bg-gray-50 dark:bg-slate-800/30">
                <button
                  className="text-xs text-cyan-500 dark:text-cyan-400 
                  hover:text-cyan-600 dark:hover:text-cyan-300 
                  font-medium transition-colors">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Help */}
        <div id="tour-topbar-help" className="relative" ref={helpRef}>
          <button
            className="h-9 w-9 lg:h-10 lg:w-10 flex items-center justify-center rounded-xl 
              bg-gray-50 dark:bg-slate-800/50 
              border border-gray-200 dark:border-slate-700/50 
              hover:bg-gray-100 dark:hover:bg-slate-700/50 
              hover:border-gray-300 dark:hover:border-slate-600/50 
              transition-all duration-200 group"
            onClick={startTour}>
            <HelpCircle
              className="h-4 w-4 lg:h-5 lg:w-5 
              text-gray-600 dark:text-slate-300 
              group-hover:text-cyan-500 dark:group-hover:text-cyan-400 
              transition-colors"
            />
          </button>

          {showHelp && (
            <div
              className="absolute right-0 mt-3 w-48 lg:w-56 
              bg-white dark:bg-slate-900/95 
              backdrop-blur-xl 
              border border-gray-200 dark:border-slate-700/50 
              rounded-xl shadow-xl dark:shadow-2xl 
              z-[9999] overflow-hidden animate-slideDown">
              {/* Header */}
              <div
                className="px-3 lg:px-4 py-3 
                border-b border-gray-200 dark:border-slate-700/50 
                bg-gray-50 dark:bg-slate-800/30">
                <h3 className="text-xs lg:text-sm font-semibold text-gray-900 dark:text-white">
                  Help & Support
                </h3>
              </div>

              {/* Help Items */}
              <div className="p-2">
                {helpItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 lg:gap-3 px-2 lg:px-3 py-2.5 rounded-lg 
                        hover:bg-gray-50 dark:hover:bg-slate-800/50 
                        cursor-pointer transition-colors duration-200 group">
                      <div
                        className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg 
                        bg-cyan-50 dark:bg-cyan-500/10 
                        border border-cyan-200 dark:border-cyan-500/20 
                        flex items-center justify-center flex-shrink-0">
                        <Icon
                          size={14}
                          className="text-cyan-500 dark:text-cyan-400 lg:w-4 lg:h-4"
                        />
                      </div>
                      <span
                        className="text-xs lg:text-sm 
                        text-gray-600 dark:text-slate-300 
                        group-hover:text-gray-900 dark:group-hover:text-white 
                        font-medium transition-colors">
                        {item.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="hidden sm:block h-8 w-px bg-gray-200 dark:bg-slate-700/50" />

        {/* Profile */}
        <button
          id="tour-topbar-profile"
          onClick={() => navigate("/admin/profile")}
          className="flex items-center gap-2 lg:gap-3 px-2 lg:px-4 py-1.5 lg:py-2 rounded-xl 
            bg-gray-50 dark:bg-slate-800/50 
            border border-gray-200 dark:border-slate-700/50 
            hover:bg-gray-100 dark:hover:bg-slate-700/50 
            hover:border-cyan-500/30 
            transition-all duration-200 group">
          <div className="hidden sm:flex flex-col items-end leading-tight">
            <span
              className="text-xs lg:text-sm font-semibold 
              text-gray-900 dark:text-white 
              group-hover:text-cyan-500 dark:group-hover:text-cyan-400 
              transition-colors">
              {user.full_name || "Admin"}
            </span>
            <span className="text-[10px] text-cyan-500 dark:text-cyan-400 uppercase tracking-wider font-medium">
              {user.role}
            </span>
          </div>

          <div className="relative">
            <div
              className="h-8 w-8 lg:h-9 lg:w-9 rounded-xl 
              bg-gradient-to-br from-cyan-500 to-teal-600 
              flex items-center justify-center text-xs lg:text-sm font-bold text-white 
              shadow-lg overflow-hidden relative
              ring-2 ring-gray-100 dark:ring-slate-800 
              group-hover:ring-cyan-500/50 
              transition-all duration-200">
              {/* ✅ Dynamically using localProfileUrl */}
              {localProfileUrl ? (
                <img
                  src={localProfileUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                user.full_name?.[0] || "A"
              )}
            </div>
            {/* Online indicator */}
            <div
              className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 lg:h-3 lg:w-3 rounded-full 
              bg-green-400 
              border-2 border-white dark:border-slate-900"
            />
          </div>
        </button>

        {/* Mobile Theme Toggle - Shows only on small screens */}
        <div className="md:hidden">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
