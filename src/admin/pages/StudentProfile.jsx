// src/components/StudentProfile.jsx
import {
  ArrowLeft,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  CheckCircle,
  Clock,
  Edit3,
  User,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase/SupabaseClient";
import EditStudentModal from "../components/dashboard/studentsSection/EditStudentModal";
import NotificationService from "../components/common/services/NotificationService";

const StudentProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const formatDate = (ts) => {
    if (!ts) return "-";
    try {
      return new Date(ts).toLocaleDateString();
    } catch {
      return ts;
    }
  };

  useEffect(() => {
    if (!id) {
      setError("Invalid student ID");
      setLoading(false);
      return;
    }

    const fetchStudent = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("users")
          .select(
            `
            id,
            full_name,
            email,
            phone_number,
            qualification,
            created_at,
            status,
            is_verified,
            institute_name,
            profile_image
            `,
          )
          .eq("id", id)
          .single();

        if (error) throw error;

        if (!data) {
          setError("Student not found");
        } else {
          setStudent({
            id: data.id,
            full_name: data.full_name || "Not yet mentioned",
            email: data.email || "Not yet mentioned",
            phone_number: data.phone_number || "Not yet mentioned",
            qualification: data.qualification || "Not yet mentioned",
            institute_name: data.institute_name || "Not yet mentioned",
            profile_image: data.profile_image || null,
            joined: formatDate(data.created_at),
            status: data.status || "Not yet mentioned",
            is_verified: data.is_verified === true, // always boolean
          });
        }
      } catch (err) {
        console.error("Error fetching student:", err.message);
        setError("Failed to load student data");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  /* -------------------------------
    EDIT LOGIC
  ------------------------------- */
  const handleEditStudent = (field, value) => {
    setSelectedStudent((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveStudent = async (updatedStudent) => {
    const hasChanges =
      updatedStudent.full_name !== student.full_name ||
      updatedStudent.email !== student.email ||
      updatedStudent.phone_number !== student.phone_number ||
      updatedStudent.qualification !== student.qualification;

    if (!hasChanges) {
      NotificationService.error("No changes to save.");
      setEditModalOpen(false);
      setSelectedStudent(null);
      return;
    }

    try {
      const { error } = await supabase
        .from("users")
        .update({
          full_name: updatedStudent.full_name,
          qualification: updatedStudent.qualification,
          email: updatedStudent.email,
          phone_number: updatedStudent.phone_number,
        })
        .eq("id", updatedStudent.id);

      if (error) throw error;

      setStudent(updatedStudent);
      setEditModalOpen(false);
      setSelectedStudent(null);
      NotificationService.success("Student updated successfully!");
    } catch (err) {
      console.error(err);
      NotificationService.error("Failed to save student!");
    }
  };

  const changedFields = {};
  ["full_name", "email", "phone_number", "qualification"].forEach((key) => {
    if (selectedStudent?.[key] !== student?.[key]) changedFields[key] = true;
  });
  const hasChanges = Object.keys(changedFields).length > 0;

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-slate-400 text-lg">
            Loading student data...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center mx-auto">
            <svg
              className="w-10 h-10 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <p className="text-red-600 dark:text-red-400 text-xl font-semibold">
            {error}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 underline">
            Go back
          </button>
        </div>
      </div>
    );

  if (!student)
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <p className="text-red-600 dark:text-red-400 text-xl">
          Student data not available.
        </p>
      </div>
    );

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
          <span className="font-medium">Back to Students</span>
        </button>

        {/* PROFILE HEADER CARD */}
        <div
          className="relative overflow-hidden rounded-2xl 
          bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
          backdrop-blur-xl 
          border border-gray-200 dark:border-slate-700/50 
          shadow-xl dark:shadow-2xl
          transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />

          <div className="relative p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="relative group">
                <div
                  className="w-32 h-32 rounded-2xl 
                  bg-gradient-to-br from-cyan-500 to-purple-600 
                  flex items-center justify-center text-5xl font-bold text-white 
                  shadow-xl 
                  ring-4 ring-gray-100 dark:ring-slate-800/50">
                  {student.full_name?.[0] || "-"}
                </div>
                <div className="absolute inset-0 rounded-2xl bg-cyan-400/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
              </div>

              {/* Info */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                      {student.full_name}
                    </h1>
                    <p className="text-gray-600 dark:text-slate-400 flex items-center gap-2 text-lg">
                      <Mail
                        size={18}
                        className="text-cyan-500 dark:text-cyan-400 flex-shrink-0"
                      />
                      <span className="break-all">{student.email}</span>
                    </p>
                  </div>

                  {/* Edit Button */}
                  <button
                    onClick={() => {
                      setSelectedStudent(student);
                      setEditModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl 
                      bg-gradient-to-r from-cyan-500 to-cyan-600 
                      text-white text-sm font-semibold 
                      hover:from-cyan-600 hover:to-cyan-700 
                      transition-all duration-200 
                      shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 
                      hover:scale-105 whitespace-nowrap">
                    <Edit3 size={16} />
                    <span>Edit Profile</span>
                  </button>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-3 pt-2">
                  {student.is_verified ? (
                    <span
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                      bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-500/10 dark:to-emerald-500/10 
                      border border-green-300 dark:border-green-500/20 
                      text-green-700 dark:text-green-400 
                      text-sm font-medium">
                      <CheckCircle size={16} />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <span
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                      bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-500/10 dark:to-amber-500/10 
                      border border-yellow-300 dark:border-yellow-500/20 
                      text-yellow-700 dark:text-yellow-400 
                      text-sm font-medium">
                      <Clock size={16} />
                      <span>Not Verified</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact Information Card */}
          <div
            className="group relative overflow-hidden rounded-2xl 
            bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
            backdrop-blur-xl 
            border border-gray-200 dark:border-slate-700/50 
            shadow-lg dark:shadow-xl 
            hover:shadow-xl dark:hover:shadow-2xl 
            hover:border-gray-300 dark:hover:border-slate-600/50 
            transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-slate-700/50">
                <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-500/10 flex items-center justify-center">
                  <User
                    size={16}
                    className="text-cyan-600 dark:text-cyan-400"
                  />
                </div>
                Contact Information
              </h3>

              <div className="space-y-4">
                <div
                  className="flex items-start gap-3 p-3 rounded-xl 
                  bg-gray-50 dark:bg-slate-800/50 
                  hover:bg-gray-100 dark:hover:bg-slate-800/70 
                  transition-colors duration-200
                  border border-gray-200 dark:border-transparent">
                  <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
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
                      {student.email}
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-start gap-3 p-3 rounded-xl 
                  bg-gray-50 dark:bg-slate-800/50 
                  hover:bg-gray-100 dark:hover:bg-slate-800/70 
                  transition-colors duration-200
                  border border-gray-200 dark:border-transparent">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <Phone
                      size={18}
                      className="text-purple-600 dark:text-purple-400"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 dark:text-slate-500 font-medium uppercase tracking-wider mb-1">
                      Phone Number
                    </p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {student.phone_number}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information Card */}
          <div
            className="group relative overflow-hidden rounded-2xl 
            bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
            backdrop-blur-xl 
            border border-gray-200 dark:border-slate-700/50 
            shadow-lg dark:shadow-xl 
            hover:shadow-xl dark:hover:shadow-2xl 
            hover:border-gray-300 dark:hover:border-slate-600/50 
            transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-slate-700/50">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center">
                  <GraduationCap
                    size={16}
                    className="text-purple-600 dark:text-purple-400"
                  />
                </div>
                Academic Information
              </h3>

              <div className="space-y-4">
                <div
                  className="flex items-start gap-3 p-3 rounded-xl 
                  bg-gray-50 dark:bg-slate-800/50 
                  hover:bg-gray-100 dark:hover:bg-slate-800/70 
                  transition-colors duration-200
                  border border-gray-200 dark:border-transparent">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <GraduationCap
                      size={18}
                      className="text-purple-600 dark:text-purple-400"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 dark:text-slate-500 font-medium uppercase tracking-wider mb-1">
                      Qualification
                    </p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {student.qualification}
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-start gap-3 p-3 rounded-xl 
                  bg-gray-50 dark:bg-slate-800/50 
                  hover:bg-gray-100 dark:hover:bg-slate-800/70 
                  transition-colors duration-200
                  border border-gray-200 dark:border-transparent">
                  <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                    <Calendar
                      size={18}
                      className="text-cyan-600 dark:text-cyan-400"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 dark:text-slate-500 font-medium uppercase tracking-wider mb-1">
                      Joined Date
                    </p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {student.joined}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Status Card */}
        <div
          className="relative overflow-hidden rounded-2xl 
          bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
          backdrop-blur-xl 
          border border-gray-200 dark:border-slate-700/50 
          shadow-lg dark:shadow-xl
          transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent" />

          <div className="relative p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4 pb-2 border-b border-gray-200 dark:border-slate-700/50">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  student.is_verified
                    ? "bg-green-100 dark:bg-green-500/10"
                    : "bg-yellow-100 dark:bg-yellow-500/10"
                }`}>
                {student.is_verified ? (
                  <CheckCircle
                    size={16}
                    className="text-green-600 dark:text-green-400"
                  />
                ) : (
                  <Clock
                    size={16}
                    className="text-yellow-600 dark:text-yellow-400"
                  />
                )}
              </div>
              Account Status
            </h3>

            <div
              className="flex items-center gap-3 p-4 rounded-xl 
              bg-gray-50 dark:bg-slate-800/50
              border border-gray-200 dark:border-transparent">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  student.is_verified
                    ? "bg-green-100 dark:bg-green-500/10"
                    : "bg-yellow-100 dark:bg-yellow-500/10"
                }`}>
                {student.is_verified ? (
                  <CheckCircle
                    size={24}
                    className="text-green-600 dark:text-green-400"
                  />
                ) : (
                  <Clock
                    size={24}
                    className="text-yellow-600 dark:text-yellow-400"
                  />
                )}
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-500 font-medium uppercase tracking-wider mb-1">
                  Verification Status
                </p>
                <p
                  className={`text-lg font-semibold ${
                    student.is_verified
                      ? "text-green-600 dark:text-green-400"
                      : "text-yellow-600 dark:text-yellow-400"
                  }`}>
                  {student.is_verified ? "Verified" : "Not Verified"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {editModalOpen && (
        <EditStudentModal
          open={editModalOpen}
          student={selectedStudent}
          hasChanges={hasChanges}
          changedFields={changedFields}
          mode="full"
          onClose={() => setEditModalOpen(false)}
          onChange={handleEditStudent}
          onSave={(updated) => {
            handleSaveStudent(updated);
            setSelectedStudent(null);
          }}
        />
      )}
    </section>
  );
};

export default StudentProfile;
