// AdminProfile.jsx
import { useState, useRef } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Shield,
  Calendar,
  CheckCircle,
  Edit3,
  LogOut,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSupabase } from "../supabase/SupabaseProvider";
import { supabase } from "../supabase/supabaseClient";

const AdminProfile = () => {
  const navigate = useNavigate();
  const { user, logoutUser, loading } = useSupabase();

  // Naye States: File select aur preview ke liye
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  // 1. File Select karne ka logic (Bina upload kiye preview dikhana)
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file)); // Preview generate karna
  };

  // 2. Cancel karne ka logic
  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 3. Save button click karne par Upload & DB Update ka logic
  const handleSave = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      const file = selectedFile;
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `profile-images/${fileName}`;

      // DELETE PREVIOUS PHOTO
      if (user.profile_url) {
        try {
          const urlParts = user.profile_url.split("/");
          const oldFileName = urlParts[urlParts.length - 1];
          const oldPath = `profile-images/${oldFileName}`;

          await supabase.storage.from("uploads").remove([oldPath]);
        } catch (err) {
          console.error("Cleanup failed:", err);
        }
      }

      // UPLOAD NEW PHOTO
      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // GET URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("uploads").getPublicUrl(filePath);

      // UPDATE DB
      const { error: updateError } = await supabase
        .from("admin")
        .update({ profile_url: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      alert("Profile picture saved successfully!");

      // ✅ Custom event bhejenge topbar ke liye taaki bina refresh kiye update ho
      window.dispatchEvent(
        new CustomEvent("profileUpdated", { detail: publicUrl }),
      );

      // Local view aur buttons theek karne ke liye states reset
      user.profile_url = publicUrl;
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error(error);
      alert("Error saving profile picture: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-slate-400 text-lg">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen p-4">
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
          <span className="font-medium">Back</span>
        </button>

        {/* HEADER CARD */}
        <div
          className="relative overflow-hidden rounded-2xl 
          bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
          backdrop-blur-xl 
          border border-gray-200 dark:border-slate-700/50 
          shadow-xl dark:shadow-2xl
          transition-all duration-300">
          <div
            className="absolute inset-0 
            bg-gradient-to-br from-cyan-500/5 via-transparent to-teal-500/5 
            dark:from-cyan-500/5 dark:via-transparent dark:to-teal-500/5 
            pointer-events-none"
          />

          <div className="relative p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar Section Wrapped for Save Button */}
              <div className="flex flex-col items-center gap-3">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => !uploading && fileInputRef.current.click()}>
                  {/* Image Box */}
                  <div
                    className="w-32 h-32 rounded-2xl 
                    bg-gradient-to-br from-cyan-500 to-teal-600 
                    flex items-center justify-center 
                    shadow-xl 
                    ring-4 ring-gray-100 dark:ring-slate-800/50
                    transition-all duration-300 overflow-hidden relative">
                    {/* Preview URL ya Database URL */}
                    {previewUrl || user.profile_url ? (
                      <img
                        src={previewUrl || user.profile_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-white" />
                    )}

                    {/* Loading Overlay (Sirf jab upload ho raha ho) */}
                    {uploading && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-0 rounded-2xl bg-cyan-400/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10" />

                  {/* WhatsApp Style Edit/Pencil Icon - Bottom Right */}
                  {!uploading && (
                    <div
                      className="absolute -bottom-3 -right-3 w-10 h-10 
                      bg-cyan-500 text-white rounded-full 
                      flex items-center justify-center 
                      shadow-lg border-4 border-white dark:border-slate-800 
                      group-hover:bg-cyan-600 transition-colors z-10">
                      <Edit3 size={18} />
                    </div>
                  )}

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* Save and Cancel Buttons (Visible only when file is selected) */}
                {selectedFile && (
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={handleSave}
                      disabled={uploading}
                      className="px-4 py-1.5 rounded-lg bg-cyan-500 text-white text-sm font-medium hover:bg-cyan-600 transition-colors flex items-center gap-2 shadow-sm">
                      {uploading ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={uploading}
                      className="px-4 py-1.5 rounded-lg bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 text-sm font-medium hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors shadow-sm">
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Admin Info */}
              <div className="flex-1 space-y-3">
                <div className="space-y-2">
                  <h1
                    className="text-3xl md:text-4xl font-bold 
                    text-gray-900 dark:text-white 
                    tracking-tight">
                    {user.full_name || "Admin"}
                  </h1>
                  <p className="text-gray-600 dark:text-slate-400 flex items-center gap-2 text-lg">
                    <Mail
                      size={18}
                      className="text-cyan-500 dark:text-cyan-400 flex-shrink-0"
                    />
                    <span className="break-all">{user.email}</span>
                  </p>
                </div>

                {/* Role Badge */}
                <div className="flex items-center gap-3 pt-2">
                  <span
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                    bg-gradient-to-r from-cyan-100 to-teal-100 dark:from-cyan-500/10 dark:to-teal-500/10 
                    border border-cyan-300 dark:border-cyan-500/20 
                    text-cyan-700 dark:text-cyan-400 
                    text-sm font-medium">
                    <Shield size={16} />
                    <span>{user.role}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Role Card */}
          <div
            className="group relative overflow-hidden rounded-2xl 
            bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
            backdrop-blur-xl 
            border border-gray-200 dark:border-slate-700/50 
            shadow-lg dark:shadow-xl 
            hover:shadow-xl dark:hover:shadow-2xl 
            hover:border-gray-300 dark:hover:border-slate-600/50 
            transition-all duration-300">
            <div
              className="absolute inset-0 
              bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent 
              opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />

            <div className="relative p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500 dark:text-slate-500 font-medium uppercase tracking-wider">
                  Role
                </p>
                <div
                  className="w-10 h-10 rounded-lg 
                  bg-cyan-100 dark:bg-cyan-500/10 
                  flex items-center justify-center">
                  <Shield
                    size={20}
                    className="text-cyan-600 dark:text-cyan-400"
                  />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.role}
              </p>
            </div>
          </div>

          {/* Joined Date Card */}
          <div
            className="group relative overflow-hidden rounded-2xl 
            bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
            backdrop-blur-xl 
            border border-gray-200 dark:border-slate-700/50 
            shadow-lg dark:shadow-xl 
            hover:shadow-xl dark:hover:shadow-2xl 
            hover:border-gray-300 dark:hover:border-slate-600/50 
            transition-all duration-300">
            <div
              className="absolute inset-0 
              bg-gradient-to-br from-purple-500/5 via-transparent to-transparent 
              opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />

            <div className="relative p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500 dark:text-slate-500 font-medium uppercase tracking-wider">
                  Joined
                </p>
                <div
                  className="w-10 h-10 rounded-lg 
                  bg-purple-100 dark:bg-purple-500/10 
                  flex items-center justify-center">
                  <Calendar
                    size={20}
                    className="text-purple-600 dark:text-purple-400"
                  />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Account Status Card */}
          <div
            className="group relative overflow-hidden rounded-2xl 
            bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
            backdrop-blur-xl 
            border border-gray-200 dark:border-slate-700/50 
            shadow-lg dark:shadow-xl 
            hover:shadow-xl dark:hover:shadow-2xl 
            hover:border-gray-300 dark:hover:border-slate-600/50 
            transition-all duration-300">
            <div
              className="absolute inset-0 
              bg-gradient-to-br from-green-500/5 via-transparent to-transparent 
              opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />

            <div className="relative p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500 dark:text-slate-500 font-medium uppercase tracking-wider">
                  Account Status
                </p>
                <div
                  className="w-10 h-10 rounded-lg 
                  bg-green-100 dark:bg-green-500/10 
                  flex items-center justify-center">
                  <CheckCircle
                    size={20}
                    className="text-green-600 dark:text-green-400"
                  />
                </div>
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                Active
              </p>
            </div>
          </div>
        </div>

        {/* ACCOUNT DETAILS CARD */}
        <div
          className="group relative overflow-hidden rounded-2xl 
          bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
          backdrop-blur-xl 
          border border-gray-200 dark:border-slate-700/50 
          shadow-lg dark:shadow-xl 
          hover:shadow-xl dark:hover:shadow-2xl 
          hover:border-gray-300 dark:hover:border-slate-600/50 
          transition-all duration-300">
          <div
            className="absolute inset-0 
            bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent 
            opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />

          <div className="relative p-6 space-y-4">
            <h3
              className="text-lg font-semibold 
              text-gray-900 dark:text-white 
              flex items-center gap-2 pb-2 
              border-b border-gray-200 dark:border-slate-700/50">
              <div
                className="w-8 h-8 rounded-lg 
                bg-cyan-100 dark:bg-cyan-500/10 
                flex items-center justify-center">
                <User size={16} className="text-cyan-600 dark:text-cyan-400" />
              </div>
              Account Details
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div
                className="flex items-start gap-3 p-3 rounded-xl 
                bg-gray-50 dark:bg-slate-800/50 
                hover:bg-gray-100 dark:hover:bg-slate-800/70 
                transition-colors duration-200
                border border-gray-200 dark:border-transparent">
                <div
                  className="w-10 h-10 rounded-lg 
                  bg-cyan-100 dark:bg-cyan-500/10 
                  flex items-center justify-center flex-shrink-0">
                  <Mail
                    size={18}
                    className="text-cyan-600 dark:text-cyan-400"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-slate-500 font-medium uppercase tracking-wider mb-1">
                    Email
                  </p>
                  <p className="text-gray-900 dark:text-white font-medium break-all">
                    {user.email}
                  </p>
                </div>
              </div>

              <div
                className="flex items-start gap-3 p-3 rounded-xl 
                bg-gray-50 dark:bg-slate-800/50 
                hover:bg-gray-100 dark:hover:bg-slate-800/70 
                transition-colors duration-200
                border border-gray-200 dark:border-transparent">
                <div
                  className="w-10 h-10 rounded-lg 
                  bg-purple-100 dark:bg-purple-500/10 
                  flex items-center justify-center flex-shrink-0">
                  <Shield
                    size={18}
                    className="text-purple-600 dark:text-purple-400"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-slate-500 font-medium uppercase tracking-wider mb-1">
                    Role
                  </p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {user.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIONS CARD */}
        <div
          className="relative overflow-hidden rounded-2xl 
          bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
          backdrop-blur-xl 
          border border-gray-200 dark:border-slate-700/50 
          shadow-lg dark:shadow-xl
          transition-all duration-300">
          <div
            className="absolute inset-0 
            bg-gradient-to-br from-gray-500/5 via-transparent to-transparent 
            dark:from-slate-500/5"
          />

          <div className="relative p-6 space-y-4">
            <h3
              className="text-lg font-semibold 
              text-gray-900 dark:text-white 
              flex items-center gap-2 pb-2 
              border-b border-gray-200 dark:border-slate-700/50">
              <div
                className="w-8 h-8 rounded-lg 
                bg-gray-100 dark:bg-slate-500/10 
                flex items-center justify-center">
                <Shield
                  size={16}
                  className="text-gray-600 dark:text-slate-400"
                />
              </div>
              Account Actions
            </h3>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={async () => {
                  await logoutUser();
                  navigate("/admin-login");
                }}
                className="group flex items-center justify-center gap-2 px-6 py-3 rounded-xl 
                  bg-gradient-to-r from-red-100 to-red-50 dark:from-red-500/10 dark:to-red-600/10 
                  border border-red-300 dark:border-red-500/20 
                  text-red-700 dark:text-red-400 
                  hover:from-red-200 hover:to-red-100 dark:hover:from-red-500/20 dark:hover:to-red-600/20 
                  hover:border-red-400 dark:hover:border-red-500/30 
                  transition-all duration-200 font-medium
                  shadow-sm hover:shadow-md">
                <LogOut
                  size={18}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminProfile;
