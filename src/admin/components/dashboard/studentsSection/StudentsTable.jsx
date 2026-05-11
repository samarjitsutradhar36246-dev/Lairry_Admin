// src/components/StudentsTable.jsx
import { 
  Eye, 
  Edit, 
  MoreVertical, 
  ArrowLeft, 
  ArrowRight, 
  ChevronsLeft, 
  ChevronsRight,
  User,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  UserCircle,
  XCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const StudentsTable = ({
  students,
  selectedStudents,
  onSelectStudent,
  onSelectAll,
  onEdit,
  menuOpenId,
  setMenuOpenId,
  isPreview = false,
  page,
  setPage,
  totalRows,
  PAGE_SIZE,
  isHeaderChecked,
  isHeaderIndeterminate,
  isLoadingStudents = false,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl 
        bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
        backdrop-blur-xl 
        border border-gray-200 dark:border-slate-700/50 
        shadow-lg dark:shadow-xl
        transition-all duration-300">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-700/50">
              <tr>
                <th className="px-3 lg:px-6 py-3 lg:py-4 text-center">
                  <div className="flex items-center justify-center">
                    <input
  type="checkbox"
  ref={(el) => { if (el) el.indeterminate = isHeaderIndeterminate; }}
  checked={isHeaderChecked}
  onChange={onSelectAll}
                      className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-cyan-500 focus:ring-cyan-500/50 focus:ring-2 cursor-pointer transition-all"
                    />
                  </div>
                </th>
                <th className="px-3 lg:px-6 py-3 lg:py-4 text-left whitespace-nowrap">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                    <User size={14} className="text-cyan-500 dark:text-cyan-400" />
                    Name
                  </div>
                </th>
                <th className="px-3 lg:px-6 py-3 lg:py-4 text-left whitespace-nowrap">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                    <Mail size={14} className="text-purple-500 dark:text-purple-400" />
                    Email
                  </div>
                </th>
                <th className="px-3 lg:px-6 py-3 lg:py-4 text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                    <Phone size={14} className="text-green-500 dark:text-green-400" />
                    Phone
                  </div>
                </th>
                <th className="px-3 lg:px-6 py-3 lg:py-4 text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                    <GraduationCap size={14} className="text-yellow-500 dark:text-yellow-400" />
                    Qualification
                  </div>
                </th>
                <th className="px-3 lg:px-6 py-3 lg:py-4 text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                    <Calendar size={14} className="text-orange-500 dark:text-orange-400" />
                    Joined
                  </div>
                </th>
                <th className="px-3 lg:px-6 py-3 lg:py-4 text-right whitespace-nowrap">
                  <span className="text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoadingStudents ? (
  Array.from({ length: PAGE_SIZE }).map((_, idx) => (
    <tr key={idx} className="border-t border-gray-200 dark:border-slate-700/30">
      <td className="px-3 lg:px-6 py-3 lg:py-4">
        <div className="h-4 w-4 bg-gray-200 dark:bg-slate-700/50 rounded animate-pulse mx-auto" />
      </td>
      <td className="px-3 lg:px-6 py-3 lg:py-4">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700/50 rounded animate-pulse" />
          <div className="h-3 w-24 bg-gray-100 dark:bg-slate-700/30 rounded animate-pulse" />
        </div>
      </td>
      <td className="px-3 lg:px-6 py-3 lg:py-4">
        <div className="h-4 w-40 bg-gray-200 dark:bg-slate-700/50 rounded animate-pulse" />
      </td>
      <td className="px-3 lg:px-6 py-3 lg:py-4">
        <div className="h-6 w-24 bg-gray-200 dark:bg-slate-700/50 rounded-lg animate-pulse mx-auto" />
      </td>
      <td className="px-3 lg:px-6 py-3 lg:py-4">
        <div className="h-6 w-20 bg-gray-200 dark:bg-slate-700/50 rounded-full animate-pulse mx-auto" />
      </td>
      <td className="px-3 lg:px-6 py-3 lg:py-4">
        <div className="h-6 w-24 bg-gray-200 dark:bg-slate-700/50 rounded-lg animate-pulse mx-auto" />
      </td>
      <td className="px-3 lg:px-6 py-3 lg:py-4">
        <div className="flex justify-end gap-2">
          <div className="h-8 w-8 bg-gray-200 dark:bg-slate-700/50 rounded-lg animate-pulse" />
          <div className="h-8 w-8 bg-gray-200 dark:bg-slate-700/50 rounded-lg animate-pulse" />
        </div>
      </td>
    </tr>
  ))
) : students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800/50 flex items-center justify-center">
                        <UserCircle size={24} className="text-gray-400 dark:text-slate-500" />
                      </div>
                      <p className="text-gray-600 dark:text-slate-400 font-medium">No students found</p>
                      <p className="text-gray-500 dark:text-slate-500 text-xs">Try adjusting your filters or search criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                (isPreview ? students.slice(0, 5) : students).map((s, index) => (
                  <tr
                    key={s.id ?? index}
                    className="group border-t border-gray-200 dark:border-slate-700/30 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-slate-800/30"
                  >
                    <td className="px-3 lg:px-6 py-3 lg:py-4 text-center">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(s.id)}
                          onChange={() => onSelectStudent(s.id)}
                          className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-cyan-500 focus:ring-cyan-500/50 focus:ring-2 cursor-pointer transition-all"
                        />
                      </div>
                    </td>
                    
                    <td className="px-3 lg:px-6 py-3 lg:py-4">
                      <div className="flex items-center gap-2 lg:gap-3 min-w-[180px] lg:min-w-0">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg 
                          bg-gradient-to-br from-cyan-100 to-purple-100 dark:from-cyan-500/20 dark:to-purple-500/20 
                          border border-cyan-300 dark:border-cyan-500/30 
                          flex items-center justify-center flex-shrink-0">
                          <span className="text-xs lg:text-sm font-bold text-cyan-600 dark:text-cyan-400">
                            {s.full_name?.[0]?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm lg:text-base">{s.full_name}</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">Student ID: {s.id}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-3 lg:px-6 py-3 lg:py-4">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                        <Mail size={14} className="text-purple-400 dark:text-purple-400/60 flex-shrink-0" />
                        <span className="text-sm lg:text-base truncate max-w-[200px]" title={s.email}>
                          {s.email}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-3 lg:px-6 py-3 lg:py-4 text-center">
                      {s.phone_number ? (
                        <div className="inline-flex items-center gap-1.5 px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg 
                          bg-green-50 dark:bg-green-500/10 
                          border border-green-200 dark:border-green-500/20">
                          <Phone size={14} className="text-green-600 dark:text-green-400" />
                          <span className="font-medium text-gray-700 dark:text-slate-300 text-sm lg:text-base whitespace-nowrap">
                            {s.phone_number}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-slate-500 text-xs italic">No phone</span>
                      )}
                    </td>
                    
                    <td className="px-3 lg:px-6 py-3 lg:py-4 text-center">
                      {s.qualification ? (
                        <span className="inline-flex items-center gap-1.5 px-2 lg:px-3 py-1 lg:py-1.5 rounded-full 
                          bg-cyan-50 dark:bg-cyan-500/10 
                          border border-cyan-200 dark:border-cyan-500/20 
                          text-cyan-700 dark:text-cyan-400 
                          font-medium text-xs lg:text-sm whitespace-nowrap">
                          <GraduationCap size={14} />
                          {s.qualification}
                        </span>
                      ) : (
                        <span className="text-gray-400 dark:text-slate-500 text-xs italic">Not specified</span>
                      )}
                    </td>
                    
                    <td className="px-3 lg:px-6 py-3 lg:py-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg 
                        bg-purple-50 dark:bg-purple-500/10 
                        border border-purple-200 dark:border-purple-500/20">
                        <Calendar size={14} className="text-purple-600 dark:text-purple-400" />
                        <span className="text-purple-700 dark:text-purple-400 font-medium text-xs lg:text-sm whitespace-nowrap">
                          {new Date(s.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-3 lg:px-6 py-3 lg:py-4 text-right relative">
                      <div className="flex justify-end gap-1 lg:gap-2 opacity-100 group-hover:opacity-80 transition-opacity duration-200">
                        <button
                          onClick={() =>
                            navigate(`/admin/students-management/${s.id}`, { state: s })
                          }
                          className="w-8 h-8 rounded-lg 
                            bg-gray-100 dark:bg-slate-800/50 
                            hover:bg-cyan-100 dark:hover:bg-cyan-500/20 
                            border border-gray-200 dark:border-slate-700/50 
                            hover:border-cyan-300 dark:hover:border-cyan-500/30 
                            flex items-center justify-center 
                            text-gray-600 dark:text-slate-400 
                            hover:text-cyan-600 dark:hover:text-cyan-400 
                            transition-all duration-200 cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        
                        <button
                          onClick={() => onEdit && onEdit(s)}
                          className="w-8 h-8 rounded-lg 
                            bg-gray-100 dark:bg-slate-800/50 
                            hover:bg-purple-100 dark:hover:bg-purple-500/20 
                            border border-gray-200 dark:border-slate-700/50 
                            hover:border-purple-300 dark:hover:border-purple-500/30 
                            flex items-center justify-center 
                            text-gray-600 dark:text-slate-400 
                            hover:text-purple-600 dark:hover:text-purple-400 
                            transition-all duration-200 cursor-pointer"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        
                        {/* <button
                          onClick={() =>
                            setMenuOpenId(menuOpenId === s.id ? null : s.id)
                          }
                          className="w-8 h-8 rounded-lg 
                            bg-gray-100 dark:bg-slate-800/50 
                            hover:bg-gray-200 dark:hover:bg-slate-700/50 
                            border border-gray-200 dark:border-slate-700/50 
                            hover:border-gray-300 dark:hover:border-slate-600/50 
                            flex items-center justify-center 
                            text-gray-600 dark:text-slate-400 
                            hover:text-gray-900 dark:hover:text-white 
                            transition-all duration-200 cursor-pointer"
                          title="More Options"
                        >
                          <MoreVertical size={16} />
                        </button> */}
                      </div>

                      {menuOpenId === s.id && (
                        <div className="absolute right-3 lg:right-6 top-full mt-2 w-44 rounded-xl 
                          bg-white dark:bg-slate-900/95 
                          backdrop-blur-xl 
                          border border-gray-200 dark:border-slate-700/50 
                          shadow-xl dark:shadow-2xl 
                          z-10 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                          <button
                            onClick={() => navigate(`/admin/students-management/${s.id}`, { state: s })}
                            className="flex items-center gap-3 w-full px-4 py-3 text-left 
                              text-gray-700 dark:text-slate-300 
                              hover:bg-gray-50 dark:hover:bg-slate-800/50 
                              hover:text-gray-900 dark:hover:text-white 
                              transition-colors duration-200"
                          >
                            <div className="w-6 h-6 rounded-lg bg-cyan-100 dark:bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                              <Eye size={14} className="text-cyan-600 dark:text-cyan-400" />
                            </div>
                            <span className="text-sm font-medium">View Details</span>
                          </button>
                          
                          <button
                            className="flex items-center gap-3 w-full px-4 py-3 text-left 
                              text-gray-700 dark:text-slate-300 
                              hover:bg-gray-50 dark:hover:bg-slate-800/50 
                              hover:text-gray-900 dark:hover:text-white 
                              transition-colors duration-200"
                          >
                            <div className="w-6 h-6 rounded-lg bg-yellow-100 dark:bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                              <User size={14} className="text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <span className="text-sm font-medium">Reset Password</span>
                          </button>
                          
                          <button
                            className="flex items-center gap-3 w-full px-4 py-3 text-left 
                              text-red-600 dark:text-red-400 
                              hover:bg-red-50 dark:hover:bg-red-500/10 
                              hover:text-red-700 dark:hover:text-red-300 
                              transition-colors duration-200 
                              border-t border-gray-200 dark:border-slate-700/50"
                          >
                            <div className="w-6 h-6 rounded-lg bg-red-100 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0">
                              <XCircle size={14} className="text-red-600 dark:text-red-400" />
                            </div>
                            <span className="text-sm font-medium">Delete</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION - only for full view */}
      {!isPreview && students.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {/* Skip to First */}
          <button
            disabled={page === 1}
            onClick={() => setPage(1)}
            className={`group flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl 
              bg-gray-50 dark:bg-slate-800/50 
              border border-gray-200 dark:border-slate-700/50 
              text-gray-600 dark:text-slate-300 
              font-medium transition-all duration-200 
              hover:bg-gray-100 dark:hover:bg-slate-700/50 
              hover:border-gray-300 dark:hover:border-slate-600/50 
              disabled:opacity-40 disabled:cursor-not-allowed ${
              page === 1 ? "cursor-not-allowed" : "cursor-pointer hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <ChevronsLeft size={16} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
            <span className="text-sm hidden sm:inline">First</span>
          </button>

          {/* Previous */}
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={`group flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl 
              bg-gray-50 dark:bg-slate-800/50 
              border border-gray-200 dark:border-slate-700/50 
              text-gray-600 dark:text-slate-300 
              font-medium transition-all duration-200 
              hover:bg-gray-100 dark:hover:bg-slate-700/50 
              hover:border-gray-300 dark:hover:border-slate-600/50 
              disabled:opacity-40 disabled:cursor-not-allowed ${
              page === 1 ? "cursor-not-allowed" : "cursor-pointer hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
            <span className="text-sm hidden sm:inline">Prev</span>
          </button>

          {/* Current page indicator */}
          <div className="flex items-center gap-2 px-3 sm:px-5 py-2.5 rounded-xl 
            bg-gradient-to-r from-cyan-100 to-purple-100 dark:from-cyan-500/10 dark:to-purple-500/10 
            border border-cyan-300 dark:border-cyan-500/20">
            <span className="text-sm font-medium text-gray-600 dark:text-slate-400 hidden sm:inline">Page</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{page}</span>
            <span className="text-sm text-gray-500 dark:text-slate-500">of</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{Math.ceil(totalRows / PAGE_SIZE)}</span>
          </div>

          {/* Next */}
          <button
            disabled={page === Math.ceil(totalRows / PAGE_SIZE)}
            onClick={() =>
              setPage((p) => Math.min(Math.ceil(totalRows / PAGE_SIZE), p + 1))
            }
            className={`group flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl 
              bg-gray-50 dark:bg-slate-800/50 
              border border-gray-200 dark:border-slate-700/50 
              text-gray-600 dark:text-slate-300 
              font-medium transition-all duration-200 
              hover:bg-gray-100 dark:hover:bg-slate-700/50 
              hover:border-gray-300 dark:hover:border-slate-600/50 
              disabled:opacity-40 disabled:cursor-not-allowed ${
              page === Math.ceil(totalRows / PAGE_SIZE) ? "cursor-not-allowed" : "cursor-pointer hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <span className="text-sm hidden sm:inline">Next</span>
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </button>

          {/* Skip to Last */}
          <button
            disabled={page === Math.ceil(totalRows / PAGE_SIZE)}
            onClick={() => setPage(Math.ceil(totalRows / PAGE_SIZE))}
            className={`group flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl 
              bg-gray-50 dark:bg-slate-800/50 
              border border-gray-200 dark:border-slate-700/50 
              text-gray-600 dark:text-slate-300 
              font-medium transition-all duration-200 
              hover:bg-gray-100 dark:hover:bg-slate-700/50 
              hover:border-gray-300 dark:hover:border-slate-600/50 
              disabled:opacity-40 disabled:cursor-not-allowed ${
              page === Math.ceil(totalRows / PAGE_SIZE) ? "cursor-not-allowed" : "cursor-pointer hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <span className="text-sm hidden sm:inline">Last</span>
            <ChevronsRight size={16} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </button>
        </div>
      )}
    </>
  );
};

export default StudentsTable;