import { Navigate, Outlet } from "react-router-dom";
import { useSupabase } from "../supabase/SupabaseProvider";
import Loading from "../components/common/Loading";

const ProtectedAdminRoute = () => {
  const { user, loading } = useSupabase();

  // console.log("ProtectedAdminRoute", { user, loading });

  if (loading) {
    return <Loading message="Checking admin access..." fullPage />
;
  }

  if (!user) {
    return <Navigate to="/admin-login" replace />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
