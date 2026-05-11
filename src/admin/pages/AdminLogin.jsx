// pages/AdminLogin.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabase } from "../supabase/SupabaseProvider";
import { Mail, Lock, Shield, LogIn } from "lucide-react";


const AdminLogin = () => {
  const navigate = useNavigate();
  const { loginUser, user, loading } = useSupabase();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  /* ---------------------------------------------
     Redirect if already logged in as admin
  --------------------------------------------- */
  useEffect(() => {
    if (!loading && user) {
      navigate("/admin");
    }
  }, [user, loading, navigate]);

  /* ---------------------------------------------
     Handle Login
  --------------------------------------------- */
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({ email: "", password: "" });

    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) return;

    try {
      setSubmitting(true);

      // 🔐 ADMIN LOGIN (role validation happens in provider)
      await loginUser(email, password);

      navigate("/admin");
    } catch (err) {
      setErrors({
        email: "",
        password: err.message || "Access denied. Admins only.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------------------------------------
     UI
  --------------------------------------------- */
 return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)] opacity-20" />
      
      <div className="relative w-full max-w-md">
        {/* Login Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-teal-500/5 pointer-events-none" />
          
          <div className="relative p-8 space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              {/* Icon */}
       <div className="relative inline-block group">
  <div className="w-20 h-12 mx-auto rounded-2xl  flex items-center justify-center shadow-2xl overflow-hidden">
    
    {/* Logo Image */}
    <img
      src="/images/logo.png"   // <-- replace with your image path
      alt="Logo"
      className="w-12 h-12 object-contain"
    />
    
  </div>


</div>


              {/* Title */}
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white tracking-tight">
                  Admin Login
                </h2>
                <p className="text-slate-400 text-sm">
                  Log in to access the admin dashboard
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* EMAIL */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className={`${
                      errors.email ? "text-red-400" : "text-slate-500 group-focus-within:text-cyan-400"
                    } transition-colors duration-200`} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 
                      focus:outline-none focus:ring-2 transition-all duration-200
                      ${
                        errors.email
                          ? "border-red-500/50 focus:ring-red-500/20 focus:border-red-500"
                          : "border-slate-700/50 focus:ring-cyan-500/20 focus:border-cyan-500/50 hover:border-slate-600/50"
                      }`}
                    placeholder="admin@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-sm flex items-center gap-1.5 mt-1.5">
                    <span className="w-1 h-1 rounded-full bg-red-400" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className={`${
                      errors.password ? "text-red-400" : "text-slate-500 group-focus-within:text-cyan-400"
                    } transition-colors duration-200`} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 
                      focus:outline-none focus:ring-2 transition-all duration-200
                      ${
                        errors.password
                          ? "border-red-500/50 focus:ring-red-500/20 focus:border-red-500"
                          : "border-slate-700/50 focus:ring-cyan-500/20 focus:border-cyan-500/50 hover:border-slate-600/50"
                      }`}
                    placeholder="Enter your password"
                  />
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm flex items-center gap-1.5 mt-1.5">
                    <span className="w-1 h-1 rounded-full bg-red-400" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={submitting}
                className="group relative w-full mt-6 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 p-[2px] 
                  hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <div className="relative bg-gradient-to-r from-cyan-500 to-teal-600 rounded-[10px] px-6 py-3.5 
                  group-hover:from-cyan-400 group-hover:to-teal-500 transition-all duration-300">
                  <span className="flex items-center justify-center gap-2 text-white font-semibold text-base">
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Logging in...</span>
                      </>
                    ) : (
                      <>
                        <LogIn size={20} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                        <span>Log In</span>
                      </>
                    )}
                  </span>
                </div>
              </button>
            </form>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-700/50">
              <p className="text-center text-sm text-slate-500">
                Authorized personnel only
              </p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-600 flex items-center justify-center gap-2">
            <Shield size={14} />
            <span>Secured with enterprise-grade encryption</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
