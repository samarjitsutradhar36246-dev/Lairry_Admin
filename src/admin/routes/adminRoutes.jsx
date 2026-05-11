// import AdminLayout from "../layout/AdminLayout";
// import ProtectedAdminRoute from "./ProtectedAdminRoute";
// import AdminLogin from "../pages/AdminLogin";

// import AdminDashboard from "../pages/AdminDashboard";
// import InstituteLocationMap from "../components/dashboard/InstituteLocationMap";
// import RevenueSection from "../components/dashboard/RevenueSection";
// import FinancialSection from "../components/dashboard/FinancialSection";
// import AiIntelligenceSection from "../components/dashboard/AiIntelligenceSection";
// import StudentsSection from "../components/dashboard/StudentsSection";
// import InstitutesSection from "../components/dashboard/InstitutesSection";
// import InstituteProfile from "../pages/InstituteProfile";
// import StudentProfile from "../pages/StudentProfile";
// import Settings from "../components/dashboard/Settings";
// import Support from "../components/dashboard/Support";
// import AdminProfile from "../pages/AdminProfile";

// export const adminRoutes = [
//   {
//     path: "/admin-login",
//     element: <AdminLogin />,
//   },
//   {
//     path: "/admin",
//     element: <ProtectedAdminRoute />, // 🔒 auth wrapper
//     children: [
//       {
//         element: <AdminLayout />,
//         children: [
//           { index: true, element: <AdminDashboard /> },

//           { path: "institute-location-map", element: <InstituteLocationMap /> },
//           { path: "revenue", element: <RevenueSection /> },
//           { path: "financial-analytics", element: <FinancialSection /> },
//           { path: "ai-model-intelligence", element: <AiIntelligenceSection /> },

//           { path: "students-management", element: <StudentsSection /> },
//           { path: "students-management/:uid", element: <StudentProfile /> },

//           { path: "institutes-management", element: <InstitutesSection /> },
//           { path: "institutes-management/:id", element: <InstituteProfile /> },

//           { path: "settings", element: <Settings /> },
//           { path: "support", element: <Support /> },
//           { path: "profile", element: <AdminProfile /> },
//         ],
//       },
//     ],
//   },
// ];

