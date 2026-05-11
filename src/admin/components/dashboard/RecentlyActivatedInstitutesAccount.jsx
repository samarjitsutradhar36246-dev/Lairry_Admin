import GlassContainer from "../common/GlassContainer";
import { useState, useEffect } from "react";
import { supabase } from "../../supabase/SupabaseClient";
import { useNavigate } from "react-router-dom";

const RecentlyActivatedInstitutesAccount = () => {
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInstitutes = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("institutes")
        .select("institute_name, institute_email, activated_at")
        .not("activated_at", "is", null)
        .order("activated_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Error fetching institutes:", error);
      } else {
        // map data to match your row props
        const formatted = data.map((i) => ({
          name: i.institute_name,
          email: i.institute_email,
          activatedAt: new Date(i.activated_at).toLocaleString(),
          status: "Active",
        }));
        setInstitutes(formatted);
      }

      setLoading(false);
    };

    fetchInstitutes();
  }, []);

  return (
    <GlassContainer>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Recently Activated Institute's Account
        </h3>
        <button
          className="text-xs text-cyan-600 dark:text-cyan-400 cursor-pointer hover:text-cyan-700 dark:hover:text-cyan-300 hover:underline transition-colors"
          onClick={() => navigate("/admin/institutes-management")}
        >
          View all
        </button>
      </div>

      <div className="space-y-4">
        {loading && (
          <p className="text-sm text-gray-600 dark:text-white/70">Loading...</p>
        )}
        {institutes.map((institute, index) => (
          <InstituteRow key={index} {...institute} />
        ))}
      </div>
    </GlassContainer>
  );
};

const InstituteRow = ({ name, email, activatedAt, status }) => (
  <div className="flex items-center justify-between p-3 rounded-lg 
    bg-gray-50 dark:bg-white/5 
    hover:bg-gray-100 dark:hover:bg-white/10 
    transition-colors duration-200">
    <div className="flex items-center gap-3">
      {/* Avatar */}
      <div className="h-10 w-10 rounded-full 
        bg-cyan-100 dark:bg-cyan-500/20 
        text-cyan-700 dark:text-cyan-400 
        flex items-center justify-center font-semibold
        ring-2 ring-cyan-200 dark:ring-cyan-500/30">
        {name.charAt(0)}
      </div>

      {/* Info */}
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {name}
        </p>
        <p className="text-xs text-gray-600 dark:text-slate-400">
          {email}
        </p>
      </div>
    </div>

    <div className="text-right">
      <span className="text-xs text-gray-600 dark:text-slate-400 block">
        {activatedAt}
      </span>
      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs 
        bg-green-100 dark:bg-green-500/20 
        text-green-700 dark:text-green-400
        border border-green-200 dark:border-green-500/30">
        {status}
      </span>
    </div>
  </div>
);

export default RecentlyActivatedInstitutesAccount;