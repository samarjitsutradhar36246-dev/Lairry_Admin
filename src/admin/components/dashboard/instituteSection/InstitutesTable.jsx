// src/components/InstitutesTable.jsx
import { Eye, Edit, MoreVertical, Building2, MapPin, IndianRupee, CheckCircle, AlertCircle, XCircle, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const InstitutesTable = ({
  institutes,
  selectedInstitutes,
  onSelectInstitute,
  onSelectAll,
  onEdit,
  menuOpenId,
  setMenuOpenId,
  isPreview = false,
  page,
  setPage,
  totalRows,
  PAGE_SIZE,
  isLoadingInstitutes = false 
}) => {
  const navigate = useNavigate();

  const getStatusConfig = (status) => {
    switch (status) {
      case "ACTIVE":
        return {
          icon: CheckCircle,
          className: "bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 text-green-600 dark:text-green-400"
        };
      case "Invited":
        return {
          icon: AlertCircle,
          className: "bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400"
        };
      case "Suspended":
        return {
          icon: XCircle,
          className: "bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/20 text-red-600 dark:text-red-400"
        };
      default:
        return {
          icon: AlertCircle,
          className: "bg-gradient-to-r from-slate-500/10 to-slate-500/10 border border-slate-500/20 text-gray-600 dark:text-slate-400"
        };
    }
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl 
        bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
        backdrop-blur-xl border border-gray-200 dark:border-slate-700/50 shadow-xl">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-700/50">
              <tr>
                <th className="px-3 lg:px-6 py-3 lg:py-4 text-center">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={
                        selectedInstitutes.length === institutes.length &&
                        institutes.length > 0
                      }
                      onChange={onSelectAll}
                      className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-cyan-500 focus:ring-cyan-500/50 focus:ring-2 cursor-pointer transition-all"
                    />
                  </div>
                </th>
                <th className="px-3 lg:px-6 py-3 lg:py-4 text-left whitespace-nowrap">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                    <Building2 size={14} className="text-cyan-600 dark:text-cyan-400" />
                    Institute
                  </div>
                </th>
                <th className="px-3 lg:px-6 py-3 lg:py-4 text-left whitespace-nowrap">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                    <MapPin size={14} className="text-purple-600 dark:text-purple-400" />
                    City
                  </div>
                </th>
                <th className="px-3 lg:px-6 py-3 lg:py-4 text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                    <IndianRupee size={14} className="text-green-600 dark:text-green-400" />
                    Revenue
                  </div>
                </th>
                <th className="px-3 lg:px-6 py-3 lg:py-4 text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                    <CheckCircle size={14} className="text-yellow-600 dark:text-yellow-400" />
                    Status
                  </div>
                </th>
                <th className="px-3 lg:px-6 py-3 lg:py-4 text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                    <FileText size={14} className="text-orange-600 dark:text-orange-400" />
                    Notes
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
              {isLoadingInstitutes ? (
                // Show skeleton rows while loading
                Array.from({ length: PAGE_SIZE }).map((_, idx) => (
                  <tr key={idx} className="border-t border-gray-200 dark:border-slate-700/30 hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors duration-200">
                    <td className="px-3 lg:px-6 py-3 lg:py-4">
                      <div className="h-4 w-4 bg-gray-200 dark:bg-slate-700/50 rounded animate-pulse mx-auto"></div>
                    </td>
                    <td className="px-3 lg:px-6 py-3 lg:py-4">
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700/50 rounded animate-pulse"></div>
                        <div className="h-3 w-24 bg-gray-100 dark:bg-slate-700/30 rounded animate-pulse"></div>
                      </div>
                    </td>
                    <td className="px-3 lg:px-6 py-3 lg:py-4">
                      <div className="h-4 w-20 bg-gray-200 dark:bg-slate-700/50 rounded animate-pulse"></div>
                    </td>
                    <td className="px-3 lg:px-6 py-3 lg:py-4">
                      <div className="h-4 w-16 bg-gray-200 dark:bg-slate-700/50 rounded animate-pulse mx-auto"></div>
                    </td>
                    <td className="px-3 lg:px-6 py-3 lg:py-4">
                      <div className="h-6 w-20 bg-gray-200 dark:bg-slate-700/50 rounded-full animate-pulse mx-auto"></div>
                    </td>
                    <td className="px-3 lg:px-6 py-3 lg:py-4">
                      <div className="h-4 w-24 bg-gray-200 dark:bg-slate-700/50 rounded animate-pulse mx-auto"></div>
                    </td>
                    <td className="px-3 lg:px-6 py-3 lg:py-4">
                      <div className="flex justify-end gap-2">
                        <div className="h-8 w-8 bg-gray-200 dark:bg-slate-700/50 rounded-lg animate-pulse"></div>
                        <div className="h-8 w-8 bg-gray-200 dark:bg-slate-700/50 rounded-lg animate-pulse"></div>
                        <div className="h-8 w-8 bg-gray-200 dark:bg-slate-700/50 rounded-lg animate-pulse"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : institutes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800/50 flex items-center justify-center">
                        <Building2 size={24} className="text-gray-400 dark:text-slate-500" />
                      </div>
                      <p className="text-gray-600 dark:text-slate-400 font-medium">No institutes found</p>
                      <p className="text-gray-500 dark:text-slate-500 text-xs">Try adjusting your filters or search criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                (isPreview ? institutes.slice(0, 5) : institutes).map(
                  (inst, index) => {
                    const statusConfig = getStatusConfig(inst.account_status);
                    const StatusIcon = statusConfig.icon;
                    
                    return (
                      <tr
                        key={inst.institute_id ?? index}
                        className={`group border-t border-gray-200 dark:border-slate-700/30 transition-all duration-200 ${
                          inst.highlight 
                            ? "bg-gradient-to-r from-cyan-500/10 to-transparent" 
                            : "hover:bg-gray-50 dark:hover:bg-slate-800/30"
                        }`}
                      >
                        <td className="px-3 lg:px-6 py-3 lg:py-4 text-center">
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={selectedInstitutes.includes(inst.institute_id)}
                              onChange={() => onSelectInstitute(inst.institute_id)}
                              className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-cyan-500 focus:ring-cyan-500/50 focus:ring-2 cursor-pointer transition-all"
                            />
                          </div>
                        </td>
                        
                        <td className="px-3 lg:px-6 py-3 lg:py-4">
                          <div className="flex items-center gap-2 lg:gap-3 min-w-[180px] lg:min-w-0">
                            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                              <Building2 size={16} className="lg:w-[18px] lg:h-[18px] text-cyan-600 dark:text-cyan-400" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white text-sm lg:text-base">{inst.institute_name}</p>
                              <p className="text-xs text-gray-500 dark:text-slate-400">{inst.institute_type || 'Institute'}</p>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-3 lg:px-6 py-3 lg:py-4">
                          <div className="flex items-center gap-2 text-gray-700 dark:text-slate-300 whitespace-nowrap">
                            <MapPin size={14} className="text-purple-500/60 dark:text-purple-400/60 flex-shrink-0" />
                            <span className="text-sm lg:text-base">{inst.location_city}</span>
                          </div>
                        </td>
                        
                        <td className="px-3 lg:px-6 py-3 lg:py-4 text-center">
                          <div className="inline-flex items-center gap-1.5 px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 whitespace-nowrap">
                            <IndianRupee size={14} className="text-green-600 dark:text-green-400" />
                            <span className="font-semibold text-gray-900 dark:text-white text-sm lg:text-base">{inst.revenue}</span>
                          </div>
                        </td>
                        
                        <td className="px-3 lg:px-6 py-3 lg:py-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-2 lg:px-3 py-1 lg:py-1.5 rounded-full text-xs font-medium ${statusConfig.className} whitespace-nowrap`}>
                            <StatusIcon size={14} />
                            {inst.account_status}
                          </span>
                        </td>
                        
                        <td className="px-3 lg:px-6 py-3 lg:py-4 text-center">
                          <div className="flex items-center justify-center">
                            {inst.admin_notes ? (
                              <div className="max-w-[150px] lg:max-w-xs truncate text-gray-700 dark:text-slate-300 text-sm lg:text-base" title={inst.admin_notes}>
                                {inst.admin_notes}
                              </div>
                            ) : (
                              <span className="text-gray-400 dark:text-slate-500 text-xs italic whitespace-nowrap">No notes</span>
                            )}
                          </div>
                        </td>
                        
                        <td className="px-3 lg:px-6 py-3 lg:py-4 text-right relative">
                          <div className="flex justify-end gap-1 lg:gap-2 opacity-100 group-hover:opacity-80 transition-opacity duration-200">
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/institutes-management/${inst.institute_id}`,
                                  {
                                    state: inst,
                                  }
                                )
                              }
                              className="w-8 h-8 rounded-lg 
                                bg-gray-100 dark:bg-slate-800/50 
                                hover:bg-cyan-500/20 
                                border border-gray-300 dark:border-slate-700/50 
                                hover:border-cyan-500/30 
                                flex items-center justify-center 
                                text-gray-600 dark:text-slate-400 
                                hover:text-cyan-600 dark:hover:text-cyan-400 
                                transition-all duration-200 cursor-pointer"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            
                            <button
                              onClick={() => onEdit(inst)}
                              className="w-8 h-8 rounded-lg 
                                bg-gray-100 dark:bg-slate-800/50 
                                hover:bg-purple-500/20 
                                border border-gray-300 dark:border-slate-700/50 
                                hover:border-purple-500/30 
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
                                setMenuOpenId(
                                  menuOpenId === inst.institute_id
                                    ? null
                                    : inst.institute_id
                                )
                              }
                              className="w-8 h-8 rounded-lg 
                                bg-gray-100 dark:bg-slate-800/50 
                                hover:bg-gray-200 dark:hover:bg-slate-700/50 
                                border border-gray-300 dark:border-slate-700/50 
                                hover:border-gray-400 dark:hover:border-slate-600/50 
                                flex items-center justify-center 
                                text-gray-600 dark:text-slate-400 
                                hover:text-gray-900 dark:hover:text-white 
                                transition-all duration-200 cursor-pointer"
                              title="More Options"
                            >
                              <MoreVertical size={16} />
                            </button> */}
                          </div>

                          {/* {menuOpenId === inst.institute_id && (
                            <div className="absolute right-3 lg:right-6 top-full mt-2 w-40 rounded-xl 
                              bg-white dark:bg-slate-900/95 
                              backdrop-blur-xl 
                              border border-gray-200 dark:border-slate-700/50 
                              shadow-2xl z-10 overflow-hidden animate-slideDown">
                              <button
                                key="duplicate"
                                className="flex items-center gap-3 w-full px-4 py-3 text-left 
                                  text-gray-700 dark:text-slate-300 
                                  hover:bg-gray-100 dark:hover:bg-slate-800/50 
                                  hover:text-gray-900 dark:hover:text-white 
                                  transition-colors duration-200"
                              >
                                <div className="w-6 h-6 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                                  <Building2 size={14} className="text-cyan-600 dark:text-cyan-400" />
                                </div>
                                <span className="text-sm font-medium">Duplicate</span>
                              </button>
                              
                              <button
                                key="archive"
                                className="flex items-center gap-3 w-full px-4 py-3 text-left 
                                  text-gray-700 dark:text-slate-300 
                                  hover:bg-gray-100 dark:hover:bg-slate-800/50 
                                  hover:text-gray-900 dark:hover:text-white 
                                  transition-colors duration-200"
                              >
                                <div className="w-6 h-6 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                                  <FileText size={14} className="text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <span className="text-sm font-medium">Archive</span>
                              </button>
                              
                              <button
                                key="delete"
                                className="flex items-center gap-3 w-full px-4 py-3 text-left 
                                  text-red-600 dark:text-red-400 
                                  hover:bg-red-500/10 
                                  hover:text-red-700 dark:hover:text-red-300 
                                  transition-colors duration-200 
                                  border-t border-gray-200 dark:border-slate-700/50"
                              >
                                <div className="w-6 h-6 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                                  <XCircle size={14} className="text-red-600 dark:text-red-400" />
                                </div>
                                <span className="text-sm font-medium">Delete</span>
                              </button>
                            </div>
                          )} */}
                        </td>
                      </tr>
                    );
                  }
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION - only for full view */}
      {!isPreview && !isLoadingInstitutes && institutes.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {/* Skip to First */}
          <button
            disabled={page === 1}
            onClick={() => setPage(1)}
            className={`group flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl 
              bg-gray-100 dark:bg-slate-800/50 
              border border-gray-300 dark:border-slate-700/50 
              text-gray-700 dark:text-slate-300 
              font-medium transition-all duration-200 
              hover:bg-gray-200 dark:hover:bg-slate-700/50 
              hover:border-gray-400 dark:hover:border-slate-600/50 
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
              bg-gray-100 dark:bg-slate-800/50 
              border border-gray-300 dark:border-slate-700/50 
              text-gray-700 dark:text-slate-300 
              font-medium transition-all duration-200 
              hover:bg-gray-200 dark:hover:bg-slate-700/50 
              hover:border-gray-400 dark:hover:border-slate-600/50 
              disabled:opacity-40 disabled:cursor-not-allowed ${
              page === 1 ? "cursor-not-allowed" : "cursor-pointer hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
            <span className="text-sm hidden sm:inline">Prev</span>
          </button>

          {/* Current page indicator */}
          <div className="flex items-center gap-2 px-3 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
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
              bg-gray-100 dark:bg-slate-800/50 
              border border-gray-300 dark:border-slate-700/50 
              text-gray-700 dark:text-slate-300 
              font-medium transition-all duration-200 
              hover:bg-gray-200 dark:hover:bg-slate-700/50 
              hover:border-gray-400 dark:hover:border-slate-600/50 
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
              bg-gray-100 dark:bg-slate-800/50 
              border border-gray-300 dark:border-slate-700/50 
              text-gray-700 dark:text-slate-300 
              font-medium transition-all duration-200 
              hover:bg-gray-200 dark:hover:bg-slate-700/50 
              hover:border-gray-400 dark:hover:border-slate-600/50 
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

export default InstitutesTable;