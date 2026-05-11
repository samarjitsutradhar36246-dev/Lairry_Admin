// src/pages/InstituteLogin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../admin/supabase/SupabaseClient";

const InstitutesLogin = () => {
  const [form, setForm] = useState({
    institute_email: "",
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
    if (!form.password) errs.password = "Required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = form.institute_email.trim().toLowerCase();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    try {
      // Supabase Auth login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: form.password,
      });

      if (error) throw error;

      // Login success → redirect to dashboard
      alert("Login successful!");
      navigate("/dashboard"); // change this to your dashboard route
    } catch (err) {
      // Show login error
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 glass rounded-xl">
      <h2 className="text-2xl font-semibold mb-6 text-center">Institute Login</h2>
      {errors.general && (
        <p className="text-red-400 text-sm mb-4 text-center">{errors.general}</p>
      )}
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
          <label className="block text-sm">Password</label>
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
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default InstitutesLogin;
