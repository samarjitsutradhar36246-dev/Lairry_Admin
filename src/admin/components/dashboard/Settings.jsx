// src/components/AdminSettings.jsx
import { useState } from "react";
import {
  ArrowLeft,
  Shield,
  Bell,
  Palette,
  Database,
  Mail,
  Clock,
  Globe,
  Key,
  AlertTriangle,
  Settings as SettingsIcon,
  Download,
  Trash2,
  RefreshCw,
  Eye,
  EyeOff,
  Check,
  Zap,
  FileText,
  Users,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminSettings = () => {
  const apiKey = import.meta.env.VITE_ADMIN_API_KEY;
  const navigate = useNavigate();

  // System Preferences
  const [itemsPerPage, setItemsPerPage] = useState("10");
  const [defaultView, setDefaultView] = useState("grid");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState("30");

  // Security Settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [apiKeyVisible, setApiKeyVisible] = useState(false);

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [newSubmissions, setNewSubmissions] = useState(true);
  const [approvalReminders, setApprovalReminders] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);

  // Appearance Settings
  const [theme, setTheme] = useState("dark");
  const [compactMode, setCompactMode] = useState(false);
  const [fontSize, setFontSize] = useState("medium");

  // Data Management
  const [retentionPeriod, setRetentionPeriod] = useState("90");
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState("daily");

  const [activeSection, setActiveSection] = useState("system");

  const handleSaveChanges = () => {
    // TODO: Implement save functionality
    alert("Settings saved successfully!");
  };

  const handleExportData = () => {
    // TODO: Implement data export
    alert("Data export initiated. You'll receive an email when ready.");
  };

  const handleClearCache = () => {
    // TODO: Implement cache clearing
    if (
      confirm(
        "Are you sure you want to clear the cache? This may temporarily slow down the application.",
      )
    ) {
      alert("Cache cleared successfully!");
    }
  };

  const sections = [
    { id: "system", label: "System Preferences", icon: SettingsIcon },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "data", label: "Data Management", icon: Database },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-sm 
            text-gray-600 dark:text-slate-400 
            hover:text-cyan-500 dark:hover:text-cyan-400 
            transition-all duration-200">
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform duration-200"
          />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              Admin Settings
            </h1>
            <p className="text-gray-600 dark:text-slate-400 text-sm">
              Configure system preferences, security, and administrative options
            </p>
          </div>
        </div>

        {/* MAIN CONTENT - TWO COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT SIDEBAR - NAVIGATION */}
          <div className="lg:col-span-3">
            <div
              className="relative overflow-hidden rounded-2xl 
              bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
              backdrop-blur-xl 
              border border-gray-200 dark:border-slate-700/50 
              shadow-xl dark:shadow-2xl 
              sticky top-6">
              {/* Decorative gradient overlay */}
              <div
                className="absolute inset-0 
                bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 
                dark:from-cyan-500/5 dark:via-transparent dark:to-purple-500/5 
                pointer-events-none"
              />

              <div className="relative p-4 space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;

                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl 
                        font-medium text-sm transition-all duration-200
                        ${
                          isActive
                            ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/25"
                            : "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/50"
                        }`}>
                      <Icon size={18} />
                      <span>{section.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT AREA */}
          <div className="lg:col-span-9 space-y-6">
            {/* SYSTEM PREFERENCES */}
            {activeSection === "system" && (
              <div
                className="relative overflow-hidden rounded-2xl 
                bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
                backdrop-blur-xl 
                border border-gray-200 dark:border-slate-700/50 
                shadow-xl dark:shadow-2xl">
                {/* Decorative gradient overlay */}
                <div
                  className="absolute inset-0 
                  bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 
                  dark:from-cyan-500/5 dark:via-transparent dark:to-purple-500/5 
                  pointer-events-none"
                />

                <div className="relative p-6 space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-slate-700/50">
                    <div
                      className="w-10 h-10 rounded-xl 
                      bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-500/20 dark:to-purple-500/20 
                      flex items-center justify-center">
                      <SettingsIcon
                        size={20}
                        className="text-cyan-600 dark:text-cyan-400"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        System Preferences
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        Configure general system behavior
                      </p>
                    </div>
                  </div>

                  {/* Items Per Page */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                      Default Items Per Page
                    </label>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800/50 
                        border border-gray-300 dark:border-slate-700/50 
                        text-gray-900 dark:text-white rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-cyan-500 
                        transition-all duration-200">
                      <option value="10">10 items</option>
                      <option value="25">25 items</option>
                      <option value="50">50 items</option>
                      <option value="100">100 items</option>
                    </select>
                  </div>

                  {/* Default View */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                      Default View Mode
                    </label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setDefaultView("grid")}
                        className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200
                          ${
                            defaultView === "grid"
                              ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/25"
                              : "bg-white dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700/50 text-gray-700 dark:text-slate-300"
                          }`}>
                        Grid View
                      </button>
                      <button
                        onClick={() => setDefaultView("list")}
                        className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200
                          ${
                            defaultView === "list"
                              ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/25"
                              : "bg-white dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700/50 text-gray-700 dark:text-slate-300"
                          }`}>
                        List View
                      </button>
                    </div>
                  </div>

                  {/* Auto Refresh */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <RefreshCw
                          size={18}
                          className="text-cyan-600 dark:text-cyan-400"
                        />
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                            Auto-Refresh Data
                          </label>
                          <p className="text-xs text-gray-600 dark:text-slate-400">
                            Automatically refresh dashboard data
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={autoRefresh}
                          onChange={(e) => setAutoRefresh(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-600"></div>
                      </label>
                    </div>

                    {autoRefresh && (
                      <div className="ml-9 space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                          Refresh Interval (seconds)
                        </label>
                        <select
                          value={refreshInterval}
                          onChange={(e) => setRefreshInterval(e.target.value)}
                          className="w-full px-4 py-3 bg-white dark:bg-slate-800/50 
                            border border-gray-300 dark:border-slate-700/50 
                            text-gray-900 dark:text-white rounded-lg 
                            focus:outline-none focus:ring-2 focus:ring-cyan-500 
                            transition-all duration-200">
                          <option value="15">15 seconds</option>
                          <option value="30">30 seconds</option>
                          <option value="60">1 minute</option>
                          <option value="300">5 minutes</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Time Zone */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-300">
                      <Globe
                        size={18}
                        className="text-cyan-600 dark:text-cyan-400"
                      />
                      Time Zone
                    </label>
                    <select
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800/50 
                        border border-gray-300 dark:border-slate-700/50 
                        text-gray-900 dark:text-white rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-cyan-500 
                        transition-all duration-200">
                      <option>Asia/Kolkata (IST)</option>
                      <option>America/New_York (EST)</option>
                      <option>Europe/London (GMT)</option>
                      <option>Asia/Tokyo (JST)</option>
                      <option>Australia/Sydney (AEST)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* SECURITY SETTINGS */}
            {activeSection === "security" && (
              <div
                className="relative overflow-hidden rounded-2xl 
                bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
                backdrop-blur-xl 
                border border-gray-200 dark:border-slate-700/50 
                shadow-xl dark:shadow-2xl">
                <div
                  className="absolute inset-0 
                  bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 
                  dark:from-cyan-500/5 dark:via-transparent dark:to-purple-500/5 
                  pointer-events-none"
                />

                <div className="relative p-6 space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-slate-700/50">
                    <div
                      className="w-10 h-10 rounded-xl 
                      bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-500/20 dark:to-orange-500/20 
                      flex items-center justify-center">
                      <Shield
                        size={20}
                        className="text-red-600 dark:text-red-400"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Security Settings
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        Manage authentication and access control
                      </p>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div
                    className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 
                    rounded-xl border border-gray-200 dark:border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <Lock
                        size={18}
                        className="text-cyan-600 dark:text-cyan-400"
                      />
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                          Two-Factor Authentication
                        </label>
                        <p className="text-xs text-gray-600 dark:text-slate-400">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={twoFactorAuth}
                        onChange={(e) => setTwoFactorAuth(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-600"></div>
                    </label>
                  </div>

                  {/* Session Timeout */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-300">
                      <Clock
                        size={18}
                        className="text-cyan-600 dark:text-cyan-400"
                      />
                      Session Timeout
                    </label>
                    <select
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800/50 
                        border border-gray-300 dark:border-slate-700/50 
                        text-gray-900 dark:text-white rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-cyan-500 
                        transition-all duration-200">
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                      <option value="0">Never</option>
                    </select>
                    <p className="text-xs text-gray-600 dark:text-slate-400">
                      Auto-logout after period of inactivity
                    </p>
                  </div>

                  {/* Login Alerts */}
                  <div
                    className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 
                    rounded-xl border border-gray-200 dark:border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <AlertTriangle
                        size={18}
                        className="text-yellow-600 dark:text-yellow-400"
                      />
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                          Login Alerts
                        </label>
                        <p className="text-xs text-gray-600 dark:text-slate-400">
                          Get notified of new login attempts
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={loginAlerts}
                        onChange={(e) => setLoginAlerts(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-600"></div>
                    </label>
                  </div>

                  {/* API Key Management */}
                  <div
                    className="space-y-3 p-4 bg-white dark:bg-slate-800/50 
                    rounded-xl border border-gray-200 dark:border-slate-700/50">
                    <div className="flex items-center gap-2">
                      <Key
                        size={18}
                        className="text-cyan-600 dark:text-cyan-400"
                      />
                      <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                        API Access Key
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input
                          type={apiKeyVisible ? "text" : "password"}
                          value={apiKey}
                          readOnly
                          className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-900/50 
                            border border-gray-300 dark:border-slate-700/50 
                            text-gray-900 dark:text-white rounded-lg 
                            font-mono text-sm"
                        />
                      </div>
                      <button
                        onClick={() => setApiKeyVisible(!apiKeyVisible)}
                        className="px-4 py-3 bg-gray-200 dark:bg-slate-700 
                          hover:bg-gray-300 dark:hover:bg-slate-600 
                          text-gray-700 dark:text-slate-300 rounded-lg 
                          transition-all duration-200">
                        {apiKeyVisible ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(apiKey);
                          alert("API key copied to clipboard!");
                        }}
                        className="px-4 py-3 bg-cyan-500 hover:bg-cyan-600 
                          text-white rounded-lg transition-all duration-200 font-medium">
                        Copy
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-slate-400">
                      Use this key for API integrations and third-party services
                    </p>
                  </div>

                  {/* IP Whitelist */}
                  <div
                    className="space-y-3 p-4 bg-white dark:bg-slate-800/50 
                    rounded-xl border border-gray-200 dark:border-slate-700/50">
                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                      IP Whitelist (Optional)
                    </label>
                    <textarea
                      placeholder="Enter IP addresses (one per line)&#10;e.g., 192.168.1.1&#10;10.0.0.1"
                      rows="3"
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-900/50 
                        border border-gray-300 dark:border-slate-700/50 
                        text-gray-900 dark:text-white rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-cyan-500 
                        resize-none font-mono text-sm"
                    />
                    <p className="text-xs text-gray-600 dark:text-slate-400">
                      Restrict admin access to specific IP addresses
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* NOTIFICATION SETTINGS */}
            {activeSection === "notifications" && (
              <div
                className="relative overflow-hidden rounded-2xl 
                bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
                backdrop-blur-xl 
                border border-gray-200 dark:border-slate-700/50 
                shadow-xl dark:shadow-2xl">
                <div
                  className="absolute inset-0 
                  bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 
                  dark:from-cyan-500/5 dark:via-transparent dark:to-purple-500/5 
                  pointer-events-none"
                />

                <div className="relative p-6 space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-slate-700/50">
                    <div
                      className="w-10 h-10 rounded-xl 
                      bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-500/20 dark:to-purple-500/20 
                      flex items-center justify-center">
                      <Bell
                        size={20}
                        className="text-blue-600 dark:text-blue-400"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Notification Preferences
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        Choose what updates you want to receive
                      </p>
                    </div>
                  </div>

                  {/* Email Notifications */}
                  <div
                    className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 
                    rounded-xl border border-gray-200 dark:border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <Mail
                        size={18}
                        className="text-cyan-600 dark:text-cyan-400"
                      />
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                          Email Notifications
                        </label>
                        <p className="text-xs text-gray-600 dark:text-slate-400">
                          Receive notifications via email
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emailNotifications}
                        onChange={(e) =>
                          setEmailNotifications(e.target.checked)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-600"></div>
                    </label>
                  </div>

                  {emailNotifications && (
                    <div className="space-y-3 ml-4 pl-4 border-l-2 border-cyan-500">
                      {/* New Submissions */}
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                            New Test Paper Submissions
                          </label>
                          <p className="text-xs text-gray-600 dark:text-slate-400">
                            When institutes submit new test papers
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newSubmissions}
                            onChange={(e) =>
                              setNewSubmissions(e.target.checked)
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-300 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-600"></div>
                        </label>
                      </div>

                      {/* Approval Reminders */}
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                            Pending Approval Reminders
                          </label>
                          <p className="text-xs text-gray-600 dark:text-slate-400">
                            Daily digest of pending reviews
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={approvalReminders}
                            onChange={(e) =>
                              setApprovalReminders(e.target.checked)
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-300 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-600"></div>
                        </label>
                      </div>

                      {/* System Alerts */}
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                            System Alerts
                          </label>
                          <p className="text-xs text-gray-600 dark:text-slate-400">
                            Important system updates and errors
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={systemAlerts}
                            onChange={(e) => setSystemAlerts(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-300 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-600"></div>
                        </label>
                      </div>

                      {/* Weekly Reports */}
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                            Weekly Performance Reports
                          </label>
                          <p className="text-xs text-gray-600 dark:text-slate-400">
                            Analytics and statistics summary
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={weeklyReports}
                            onChange={(e) => setWeeklyReports(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-300 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-600"></div>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* APPEARANCE SETTINGS */}
            {activeSection === "appearance" && (
              <div
                className="relative overflow-hidden rounded-2xl 
                bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
                backdrop-blur-xl 
                border border-gray-200 dark:border-slate-700/50 
                shadow-xl dark:shadow-2xl">
                <div
                  className="absolute inset-0 
                  bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 
                  dark:from-cyan-500/5 dark:via-transparent dark:to-purple-500/5 
                  pointer-events-none"
                />

                <div className="relative p-6 space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-slate-700/50">
                    <div
                      className="w-10 h-10 rounded-xl 
                      bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-500/20 dark:to-pink-500/20 
                      flex items-center justify-center">
                      <Palette
                        size={20}
                        className="text-purple-600 dark:text-purple-400"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Appearance Settings
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        Customize the look and feel
                      </p>
                    </div>
                  </div>

                  {/* Theme Selection */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                      Theme Mode
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {["light", "dark", "auto"].map((themeOption) => (
                        <button
                          key={themeOption}
                          onClick={() => setTheme(themeOption)}
                          className={`px-4 py-3 rounded-lg font-medium capitalize transition-all duration-200
                            ${
                              theme === themeOption
                                ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/25"
                                : "bg-white dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700/50 text-gray-700 dark:text-slate-300"
                            }`}>
                          {themeOption}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Size */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                      Font Size
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {["small", "medium", "large"].map((size) => (
                        <button
                          key={size}
                          onClick={() => setFontSize(size)}
                          className={`px-4 py-3 rounded-lg font-medium capitalize transition-all duration-200
                            ${
                              fontSize === size
                                ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/25"
                                : "bg-white dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700/50 text-gray-700 dark:text-slate-300"
                            }`}>
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Compact Mode */}
                  <div
                    className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 
                    rounded-xl border border-gray-200 dark:border-slate-700/50">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                        Compact Mode
                      </label>
                      <p className="text-xs text-gray-600 dark:text-slate-400">
                        Reduce spacing and padding for more content
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={compactMode}
                        onChange={(e) => setCompactMode(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* DATA MANAGEMENT */}
            {activeSection === "data" && (
              <div
                className="relative overflow-hidden rounded-2xl 
                bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
                backdrop-blur-xl 
                border border-gray-200 dark:border-slate-700/50 
                shadow-xl dark:shadow-2xl">
                <div
                  className="absolute inset-0 
                  bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 
                  dark:from-cyan-500/5 dark:via-transparent dark:to-purple-500/5 
                  pointer-events-none"
                />

                <div className="relative p-6 space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-slate-700/50">
                    <div
                      className="w-10 h-10 rounded-xl 
                      bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-500/20 dark:to-emerald-500/20 
                      flex items-center justify-center">
                      <Database
                        size={20}
                        className="text-green-600 dark:text-green-400"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Data Management
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        Backup, export, and retention settings
                      </p>
                    </div>
                  </div>

                  {/* Auto Backup */}
                  <div className="space-y-4">
                    <div
                      className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 
                      rounded-xl border border-gray-200 dark:border-slate-700/50">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                          Automatic Backups
                        </label>
                        <p className="text-xs text-gray-600 dark:text-slate-400">
                          Regularly backup all system data
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={autoBackup}
                          onChange={(e) => setAutoBackup(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-600"></div>
                      </label>
                    </div>

                    {autoBackup && (
                      <div className="space-y-2 ml-4">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                          Backup Frequency
                        </label>
                        <select
                          value={backupFrequency}
                          onChange={(e) => setBackupFrequency(e.target.value)}
                          className="w-full px-4 py-3 bg-white dark:bg-slate-800/50 
                            border border-gray-300 dark:border-slate-700/50 
                            text-gray-900 dark:text-white rounded-lg 
                            focus:outline-none focus:ring-2 focus:ring-cyan-500 
                            transition-all duration-200">
                          <option value="hourly">Every Hour</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Data Retention */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                      Data Retention Period
                    </label>
                    <select
                      value={retentionPeriod}
                      onChange={(e) => setRetentionPeriod(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800/50 
                        border border-gray-300 dark:border-slate-700/50 
                        text-gray-900 dark:text-white rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-cyan-500 
                        transition-all duration-200">
                      <option value="30">30 days</option>
                      <option value="90">90 days</option>
                      <option value="180">6 months</option>
                      <option value="365">1 year</option>
                      <option value="0">Keep forever</option>
                    </select>
                    <p className="text-xs text-gray-600 dark:text-slate-400">
                      Automatically delete old data after this period
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <button
                      onClick={handleExportData}
                      className="flex items-center justify-center gap-2 px-6 py-3 
                        bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                        text-white font-semibold rounded-xl 
                        shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 
                        transition-all duration-200">
                      <Download size={18} />
                      <span>Export All Data</span>
                    </button>

                    <button
                      onClick={handleClearCache}
                      className="flex items-center justify-center gap-2 px-6 py-3 
                        bg-white dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-700/50 
                        border border-gray-300 dark:border-slate-700/50 
                        text-gray-700 dark:text-slate-300 font-semibold rounded-xl 
                        transition-all duration-200">
                      <RefreshCw size={18} />
                      <span>Clear Cache</span>
                    </button>
                  </div>

                  {/* Danger Zone */}
                  <div
                    className="p-4 bg-red-50 dark:bg-red-500/10 
                    rounded-xl border border-red-200 dark:border-red-500/30">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle
                        size={18}
                        className="text-red-600 dark:text-red-400"
                      />
                      <h3 className="text-sm font-bold text-red-700 dark:text-red-400">
                        Danger Zone
                      </h3>
                    </div>
                    <p className="text-xs text-red-600 dark:text-red-300 mb-3">
                      Deleting all data is permanent and cannot be undone.
                    </p>
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            "⚠️ WARNING: This will permanently delete ALL data. Are you absolutely sure?",
                          )
                        ) {
                          alert("Data deletion cancelled for demo purposes.");
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 
                        bg-red-600 hover:bg-red-700 
                        text-white font-semibold rounded-lg 
                        transition-all duration-200">
                      <Trash2 size={16} />
                      <span>Delete All Data</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SAVE BUTTON - Fixed at bottom */}
            <div
              className="relative overflow-hidden rounded-2xl 
              bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
              backdrop-blur-xl 
              border border-gray-200 dark:border-slate-700/50 
              shadow-xl dark:shadow-2xl p-6">
              <div
                className="absolute inset-0 
                bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 
                dark:from-cyan-500/5 dark:via-transparent dark:to-purple-500/5 
                pointer-events-none"
              />

              <div className="relative flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  Changes are automatically saved to your preferences
                </p>
                <button
                  onClick={handleSaveChanges}
                  className="flex items-center gap-2 px-8 py-3 
                    bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 
                    text-white font-bold rounded-xl 
                    shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 
                    transition-all duration-200">
                  <Check size={18} />
                  <span>Save All Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
