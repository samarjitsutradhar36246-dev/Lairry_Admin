// src/pages/InstituteSignup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../admin/supabase/SupabaseClient";



const InstituteSignup = () => {
  const [form, setForm] = useState({
    institute_email: "",
    temp_password: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const validate = () => {
    const errs = {};
    if (!form.institute_email) errs.institute_email = "Required";
    if (!form.temp_password) errs.temp_password = "Required";
    if (!form.password || form.password.length < 6)
      errs.password = "Password must be 6+ chars";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("RAW EMAIL:", JSON.stringify(form.institute_email));

      const email = form.institute_email
  .replace(/[\s\u00A0]+/g, "")
  .toLowerCase();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    try {
      // 1. Fetch institute by email
      const { data: inst, error: fetchError } = await supabase
        .from("institutes")
        .select("*")
        .eq("institute_email", email)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (!inst) {
        setErrors({ institute_email: "Invalid email or not invited" });
        setLoading(false);
        return;
      }

      if (inst.account_status !== "Invited") {
        setErrors({ institute_email: "Already signed up" });
        setLoading(false);
        return;
      }

      if (inst.password !== form.temp_password) {
        setErrors({ temp_password: "Temp password is incorrect" });
        setLoading(false);
        return;
      }


      // 2. Create Supabase Auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: form.password,
      });
      if (authError) throw authError;

      // 3. Update institute row
      const { error: updateError } = await supabase
        .from("institutes")
        .update({
          auth_user_id: authData.user.id,
          account_status: "ACTIVE",
          password: form.password, // overwrite temp password with real password
          activated_at: new Date().toISOString()
        })
        .eq("institute_email", email);

      if (updateError) throw updateError;
      // --- Increment active_institutes KPI ---
await supabase.rpc('update_kpi', {
  kpi_name: 'active_institutes',
  delta: 1
});

      alert("Signup successful! Now check your email for verification then - You can login.");
      navigate("/institutes-login");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 glass rounded-xl">
      <h2 className="text-2xl font-semibold mb-6 text-center">Institute Signup</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-sm">Email</label>
          <input
            type="email"
            value={form.institute_email}
            onChange={(e) => handleChange("institute_email", e.target.value)}
            className="w-full px-3 py-2 rounded bg-white/5 border border-white/10"
          />
          {errors.institute_email && (
            <p className="text-red-400 text-xs">{errors.institute_email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm">Temp Password</label>
          <input
            type="password"
            value={form.temp_password}
            onChange={(e) => handleChange("temp_password", e.target.value)}
            className="w-full px-3 py-2 rounded bg-white/5 border border-white/10"
          />
          {errors.temp_password && (
            <p className="text-red-400 text-xs">{errors.temp_password}</p>
          )}
        </div>

        <div>
          <label className="block text-sm">Set Your Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className="w-full px-3 py-2 rounded bg-white/5 border border-white/10"
          />
          {errors.password && (
            <p className="text-red-400 text-xs">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-cyan-500 hover:bg-cyan-600 rounded text-white"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default InstituteSignup;
