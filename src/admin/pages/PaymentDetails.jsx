// src/pages/PaymentDetails.jsx
import { ArrowLeft, FileText, Building2, User, CreditCard, Calendar, Hash, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase/SupabaseClient";

const PaymentDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Format date for readability
  const formatDate = (ts) => {
    if (!ts) return "-";
    try {
      return new Date(ts).toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return ts;
    }
  };

  // Format INR
  const formatINR = (amount) => {
    if (amount == null) return "-";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  useEffect(() => {
    const fetchPayment = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("institute_pricing")
          .select(`
            id,
            institute_id,
            user_id,
            exam_name,
            subject_id,
            subject_name,
            institute_name,
            total_price,
            total_test_papers,
            razorpay_payment_id,
            created_at,
            razorpay_order_id,
            razorpay_signature,
            status
          `)
          .eq("razorpay_payment_id", id)
          .maybeSingle(); // Safe if 0 rows

        if (error) throw error;

        if (!data) {
          setError("Payment not found");
        } else {
          setPayment(data);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load payment details");
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [id]);

  // Status configuration
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "success":
        return {
          icon: CheckCircle2,
          className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
          label: "Success"
        };
      case "pending":
        return {
          icon: Clock,
          className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
          label: "Pending"
        };
      default:
        return {
          icon: XCircle,
          className: "bg-gray-500/10 dark:bg-slate-500/10 text-gray-600 dark:text-slate-400 border border-gray-500/20 dark:border-slate-500/20",
          label: status || "Unknown"
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-slate-400">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-white dark:bg-slate-950">
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl p-8 rounded-2xl border border-gray-200 dark:border-slate-800/50 text-center max-w-md space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
            <XCircle className="text-red-500 dark:text-red-400" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-red-600 dark:text-red-400">Error</h3>
          <p className="text-gray-600 dark:text-slate-400">{error || "Payment not found"}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(payment.status);
  const StatusIcon = statusConfig.icon;

  return (
    <section className="min-h-screen transition-colors p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <div className="p-1 rounded-lg bg-gray-100 dark:bg-slate-800/50 group-hover:bg-gray-200 dark:group-hover:bg-slate-700/50 transition-colors">
            <ArrowLeft size={16} />
          </div>
          <span>Back to Transactions</span>
        </button>

        {/* HEADER CARD */}
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-200 dark:border-slate-800/50 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-4xl font-bold text-cyan-600 dark:text-cyan-400 shadow-lg">
                {payment.user_id?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="absolute -bottom-2 -right-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700">
                <User size={16} className="text-cyan-600 dark:text-cyan-400" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-3">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    {payment.user_id}
                  </h2>
                  <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium ${statusConfig.className}`}>
                    <StatusIcon size={16} />
                    <span>{statusConfig.label}</span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-slate-400 mt-1 flex items-center gap-2">
                  <FileText size={16} />
                  Student Payment Transaction
                </p>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 pt-2">
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-500 uppercase tracking-wide mb-1">Amount</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatINR(payment.total_price)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-500 uppercase tracking-wide mb-1">Test Papers</p>
                  <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{payment.total_test_papers || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-500 uppercase tracking-wide mb-1">Date</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-slate-300">{formatDate(payment.created_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transaction Details */}
          <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-slate-800/50 space-y-5 shadow-xl">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-slate-800">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <CreditCard className="text-cyan-600 dark:text-cyan-400" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Transaction Details</h3>
            </div>

            <div className="space-y-4">
              <DetailRow
                label="Razorpay Payment ID"
                value={payment.razorpay_payment_id}
                mono
              />
              <DetailRow
                label="Razorpay Order ID"
                value={payment.razorpay_order_id}
                mono
              />
              <DetailRow
                label="Razorpay Signature"
                value={payment.razorpay_signature}
                mono
                truncate
              />
              <DetailRow
                label="Internal ID"
                value={payment.id}
                mono
              />
            </div>
          </div>

          {/* Institute & Student Details */}
          <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-slate-800/50 space-y-5 shadow-xl">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-slate-800">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Building2 className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Institute & Student Info</h3>
            </div>

            <div className="space-y-4">
              <DetailRow
                label="Institute Name"
                value={payment.institute_name}
                highlight
              />
              <DetailRow
                label="Institute ID"
                value={payment.institute_id}
                mono
              />
              <DetailRow
                label="Student ID"
                value={payment.user_id}
                mono
              />
              <DetailRow
                label="Exam Name"
                value={payment.exam_name}
              />
              <DetailRow
                label="Subject Name"
                value={payment.subject_name}
              />
              <DetailRow
                label="Subject ID"
                value={payment.subject_id}
                mono
              />
            </div>
          </div>
        </div>

        {/* Additional Info Footer */}
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl p-5 border border-gray-200 dark:border-slate-800/50 shadow-xl">
          <div className="flex items-center justify-between flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
              <Calendar size={16} />
              <span>Transaction created on {formatDate(payment.created_at)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
              <Hash size={16} />
              <span>ID: {payment.id}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Reusable Detail Row Component
const DetailRow = ({ label, value, mono = false, truncate = false, highlight = false }) => (
  <div className="group">
    <p className="text-xs text-gray-500 dark:text-slate-500 uppercase tracking-wide mb-1.5 font-medium">{label}</p>
    <p
      className={`text-sm ${
        highlight
          ? "text-gray-900 dark:text-white font-semibold"
          : "text-gray-700 dark:text-slate-300"
      } ${mono ? "font-mono text-xs" : ""} ${
        truncate ? "truncate" : ""
      } ${
        value && value !== "-"
          ? "group-hover:text-gray-900 dark:group-hover:text-white transition-colors"
          : "text-gray-400 dark:text-slate-500"
      }`}
      title={truncate ? value : undefined}
    >
      {value || "-"}
    </p>
  </div>
);

export default PaymentDetails;