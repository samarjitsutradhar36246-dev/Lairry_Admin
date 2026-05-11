// import { useState } from "react";
// import { Search, Eye, Edit } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { studentsData } from "../../data/studentsData";

// const StudentsSection = ({ mode = "full" }) => {
//   const [students, setStudents] = useState(studentsData);
//   const [search, setSearch] = useState("");
//   const [sortOption, setSortOption] = useState("");
//   const [selectedStudents, setSelectedStudents] = useState([]);
//   const navigate = useNavigate();

//   const isPreview = mode === "preview";

//   // Filter and sort
//   const filteredStudents = students.filter(
//     (s) =>
//       s.uid.toLowerCase().includes(search.toLowerCase()) ||
//       s.phone.includes(search) ||
//       s.email.toLowerCase().includes(search.toLowerCase()) ||
//       s.major.toLowerCase().includes(search.toLowerCase())
//   );

//   const sortedStudents = [...filteredStudents].sort((a, b) => {
//     switch (sortOption) {
//       case "uid-asc":
//         return a.uid.localeCompare(b.uid);
//       case "uid-desc":
//         return b.uid.localeCompare(a.uid);
//       case "attempts-asc":
//         return a.attempts - b.attempts;
//       case "attempts-desc":
//         return b.attempts - a.attempts;
//       case "percentile-asc":
//         return parseInt(a.percentile) - parseInt(b.percentile);
//       case "percentile-desc":
//         return parseInt(b.percentile) - parseInt(a.percentile);
//       case "readiness-asc":
//         return parseInt(a.readiness) - parseInt(b.readiness);
//       case "readiness-desc":
//         return parseInt(b.readiness) - parseInt(a.readiness);
//       case "newest":
//         return new Date(b.joined) - new Date(a.joined);
//       case "oldest":
//         return new Date(a.joined) - new Date(b.joined);
//       default:
//         return 0;
//     }
//   });

//   // Selection & bulk actions (unchanged)
//   const handleSelectStudent = (uid) => {
//     if (selectedStudents.includes(uid)) {
//       setSelectedStudents(selectedStudents.filter((id) => id !== uid));
//     } else {
//       setSelectedStudents([...selectedStudents, uid]);
//     }
//   };

//   const handleSelectAll = () => {
//     if (selectedStudents.length === sortedStudents.length) {
//       setSelectedStudents([]);
//     } else {
//       setSelectedStudents(sortedStudents.map((s) => s.uid));
//     }
//   };

//   const blockSelected = () => {
//     setStudents((prev) =>
//       prev.map((s) =>
//         selectedStudents.includes(s.uid) ? { ...s, status: "Blocked" } : s
//       )
//     );
//     setSelectedStudents([]);
//     alert("Selected students have been blocked!");
//   };

//   const resetAttempts = () => {
//     setStudents((prev) =>
//       prev.map((s) =>
//         selectedStudents.includes(s.uid) ? { ...s, attempts: 0 } : s
//       )
//     );
//     setSelectedStudents([]);
//     alert("Attempts reset for selected students!");
//   };

//   const sendEmail = () => {
//     alert(`Send email to: ${selectedStudents.join(", ")}`);
//   };

//   const exportCSV = () => {
//     if (sortedStudents.length === 0) {
//       alert("No students to export!");
//       return;
//     }

//     const headers = [
//       "UID",
//       "Phone",
//       "Attempts",
//       "Avg %",
//       "Readiness",
//       "Status",
//       "Email",
//       "Joined",
//       "Major",
//     ];
//     const rows = sortedStudents.map((s) => [
//       s.uid,
//       s.phone,
//       s.attempts,
//       s.percentile,
//       s.readiness,
//       s.status,
//       s.email,
//       s.joined,
//       s.major,
//     ]);

//     let csvContent =
//       "data:text/csv;charset=utf-8," +
//       [headers, ...rows].map((e) => e.join(",")).join("\n");

//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "students_export.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <section
//       className="space-y-6 max-w-7xl mx-auto"
//       onClick={isPreview ? () => navigate("/admin/students-management") : undefined}
//     >
//       {/* Main Header (full mode only) */}
// {!isPreview && (
//   <div>
//     <h2 className="text-xl font-semibold">Students Management</h2>
//     <p className="text-xs text-slate-400 mt-1">
//       Monitor student activity, readiness, and performance metrics.
//     </p>
//   </div>
// )}

//       {/* Header in preview only */}
//       {isPreview && (
//         <div className="flex justify-between items-center">
//           <h3 className="text-lg font-semibold">Students Overview</h3>
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               navigate("/admin/students-management");
//             }}
//             className="text-cyan-400 text-sm"
//           >
//             View Full →
//           </button>
//         </div>
//       )}

//       {/* Search + Sort + Export */}
//       <div className="glass rounded-xl p-4 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
//         {/* Search input */}
//         <div className="relative w-full md:w-80">
//           <Search
//             size={16}
//             className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//           />
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search by UID, phone, email or major..."
//             className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-cyan-400/40 text-slate-200"
//           />
//         </div>

//         {/* Sort */}
//         <div className="flex gap-2 items-center relative">
//           <label htmlFor="sort" className="text-sm text-slate-400">
//             Sort by:
//           </label>
//           <select
//             id="sort"
//             value={sortOption}
//             onChange={(e) => setSortOption(e.target.value)}
//             className="appearance-none bg-white/5 backdrop-blur-md border border-white/10 rounded-lg px-3 py-1 text-sm text-slate-200 focus:outline-none focus:border-cyan-400/40 pr-8"
//           >
//             <option value="" className="bg-slate-800">None</option>
//             <option value="uid-asc" className="bg-slate-800">UID A-Z</option>
//             <option value="uid-desc" className="bg-slate-800">UID Z-A</option>
//             <option value="attempts-asc" className="bg-slate-800">Attempts Asc</option>
//             <option value="attempts-desc" className="bg-slate-800">Attempts Desc</option>
//             <option value="percentile-asc" className="bg-slate-800">Avg % Asc</option>
//             <option value="percentile-desc" className="bg-slate-800">Avg % Desc</option>
//             <option value="readiness-asc" className="bg-slate-800">Readiness Asc</option>
//             <option value="readiness-desc" className="bg-slate-800">Readiness Desc</option>
//             <option value="newest" className="bg-slate-800">Newest Registered</option>
//             <option value="oldest" className="bg-slate-800">Oldest Registered</option>
//           </select>
//           <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
//             ▼
//           </div>
//         </div>

//         <button
//           onClick={exportCSV}
//           className="px-3 py-1 bg-slate-500/30 text-white rounded hover:bg-slate-500/20 transition text-sm"
//         >
//           Export CSV
//         </button>
//       </div>

//       {/* Bulk actions */}
//       {selectedStudents.length > 0 && (
//         <div className="glass rounded-xl p-3 flex gap-3 items-center">
//           <span className="text-sm text-slate-400">
//             {selectedStudents.length} selected
//           </span>
//           <button
//             onClick={blockSelected}
//             className="px-3 py-1 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition text-sm"
//           >
//             Block Selected
//           </button>
//           <button
//             onClick={resetAttempts}
//             className="px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded hover:bg-yellow-500/20 transition text-sm"
//           >
//             Reset Attempts
//           </button>
//           <button
//             onClick={sendEmail}
//             className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded hover:bg-cyan-500/20 transition text-sm"
//           >
//             Send Email
//           </button>
//         </div>
//       )}

//       {/* Table */}
//       <div className="glass rounded-xl overflow-hidden">
//         <table className="w-full text-sm">
//           <thead className="bg-white/5 text-slate-400 text-xs">
//             <tr>
//               <th className="px-6 py-4 text-center">
//                 <input
//                   type="checkbox"
//                   checked={
//                     selectedStudents.length === sortedStudents.length &&
//                     sortedStudents.length > 0
//                   }
//                   onChange={handleSelectAll}
//                   className="accent-cyan-400 w-4 h-4"
//                 />
//               </th>
//               <th className="px-6 py-4 text-left">UID</th>
//               <th className="px-6 py-4 text-left">Phone</th>
//               <th className="px-6 py-4 text-center">Attempts</th>
//               <th className="px-6 py-4 text-center">Avg %</th>
//               <th className="px-6 py-4 text-center">Readiness</th>
//               <th className="px-6 py-4 text-center">Status</th>
//               <th className="px-6 py-4 text-right">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {(isPreview ? sortedStudents.slice(0, 5) : sortedStudents).map((s) => (
//               <tr
//                 key={s.uid}
//                 className="group border-t border-white/5 hover:bg-cyan-500/5 transition"
//               >
//                 <td className="px-6 py-4 text-center">
//                   <input
//                     type="checkbox"
//                     checked={selectedStudents.includes(s.uid)}
//                     onChange={() => handleSelectStudent(s.uid)}
//                     className="accent-cyan-400 w-4 h-4"
//                   />
//                 </td>
//                 <td className="px-6 py-4 font-medium">{s.uid}</td>
//                 <td className="px-6 py-4 text-slate-300">{s.phone}</td>
//                 <td className="px-6 py-4 text-center">{s.attempts}</td>
//                 <td className="px-6 py-4 text-center text-cyan-400">{s.percentile}</td>
//                 <td className="px-6 py-4 text-center text-purple-400">{s.readiness}</td>
//                 <td className="px-6 py-4 text-center">
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs ${
//                       s.status === "Active"
//                         ? "bg-green-500/10 text-green-400"
//                         : "bg-red-500/10 text-red-400"
//                     }`}
//                   >
//                     {s.status}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 text-right">
//                   <div className="flex justify-end gap-3 opacity-100 group-hover:opacity-70 transition">
//                     <button
//                       onClick={() =>
//                         navigate(`/admin/students-management/${s.uid}`, { state: s })
//                       }
//                     >
//                       <Eye size={16} />
//                     </button>
//                     <button onClick={() => alert("Edit feature coming soon")}>
//                       <Edit size={16} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </section>
//   );
// };

// export default StudentsSection;
