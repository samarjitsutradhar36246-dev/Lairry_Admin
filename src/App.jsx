import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layout & Protected Route
import AdminLayout from "./admin/layout/AdminLayout";
import ProtectedAdminRoute from "./admin/routes/ProtectedAdminRoute";

// Pages
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import StudentProfile from "./admin/pages/StudentProfile";
import InstituteProfile from "./admin/pages/InstituteProfile";
import AdminProfile from "./admin/pages/AdminProfile";

// Dashboard Components
import GrowthAnalyticsSection from "./admin/components/dashboard/growthAnalyticsSection/GrowthAnalyticsSection";
import FinancialSection from "./admin/components/dashboard/financialSection/FinancialSection";
import InstituteLocationMap from "./admin/components/dashboard/InstituteLocationMap";
import Settings from "./admin/components/dashboard/Settings";
import Support from "./admin/components/dashboard/Support";
import AdminSignup from "./admin/pages/AdminSignup";
import InstitutesSection from "./admin/components/dashboard/instituteSection/InstitutesSection";
import StudentsSection from "./admin/components/dashboard/studentsSection/StudentsSection";
import AiIntelligenceSection from "./admin/components/dashboard/aiIntelligenceSection/AiIntelligenceSection";
import { SupabaseProvider } from "./admin/supabase/SupabaseProvider";
import InstituteSignup from "./institutes/InstitutesSignup";
import InstitutesLogin from "./institutes/InstitutesLogin";
import PaymentDetails from "./admin/pages/PaymentDetails";
import TestPaperOverview from "../src/testPapers/TestPaperOverview";

import { Toaster } from "react-hot-toast";
import Queue from "./admin/components/dashboard/Queue";

// import { useSupabase } from "./admin/supabase/SupabaseProvider";

const App = () => {
  //  const { loading } = useSupabase();
  //   // 🔑 GLOBAL AUTH GATE
  // if (loading) {
  //   return <div>Initializing admin session...</div>;
  // }

  return (
    <>
      <Toaster position="top-center" />
      <BrowserRouter>
        {/* <FirebaseProvider> */}
        <SupabaseProvider>
          <Routes>
            {/* Login Page */}
            <Route path="/institutes-signup" element={<InstituteSignup />} />
            <Route path="/institutes-login" element={<InstitutesLogin />} />
            <Route path="/admin-signup" element={<AdminSignup />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            {/* <Route path="/admin" element={<AdminLayout />}></Route> */}

            {/* Protected Admin Routes */}
            <Route element={<ProtectedAdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route
                  path="institute-location-map"
                  element={<InstituteLocationMap />}
                />
                <Route
                  path="growth-analytics-section"
                  element={<GrowthAnalyticsSection />}
                />
                <Route
                  path="financial-analytics"
                  element={<FinancialSection />}
                />
                <Route
                  path="financial-analytics/:id"
                  element={<PaymentDetails />}
                />
                <Route
                  path="ai-model-intelligence"
                  element={<AiIntelligenceSection />}
                />
                <Route
                  path="students-management"
                  element={<StudentsSection />}
                />
                <Route
                  path="students-management/:id"
                  element={<StudentProfile />}
                />
                <Route
                  path="institutes-management"
                  element={<InstitutesSection />}
                />
                <Route
                  path="institutes-management/:id"
                  element={<InstituteProfile />}
                />
                <Route path="settings" element={<Settings />} />
                <Route path="support" element={<Support />} />
                <Route path="profile" element={<AdminProfile />} />
                <Route path="queue" element={<Queue />} />
                <Route path="test-papers" element={<TestPaperOverview />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/admin-login" replace />} />
          </Routes>
        </SupabaseProvider>
        {/* </FirebaseProvider> */}
      </BrowserRouter>
    </>
  );
};

export default App;
