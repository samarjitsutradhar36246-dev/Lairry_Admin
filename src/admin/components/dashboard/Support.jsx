// src/components/AdminSupport.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  LifeBuoy, 
  MessageSquare, 
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Send,
  BookOpen,
  HelpCircle,
  Mail,
  Phone,
  MessageCircle,
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from "lucide-react";

const sampleTickets = [
  { 
    id: 1, 
    title: "Unable to upload student data", 
    status: "Open", 
    priority: "High",
    category: "Technical Issue",
    date: "2025-02-10",
    description: "Getting error 500 when uploading CSV files with student data"
  },
  { 
    id: 2, 
    title: "Payment gateway not working", 
    status: "Resolved", 
    priority: "Critical",
    category: "Payment",
    date: "2025-02-08",
    description: "Razorpay integration failing for test paper purchases"
  },
  { 
    id: 3, 
    title: "Feature request: AI report export", 
    status: "In Progress", 
    priority: "Low",
    category: "Feature Request",
    date: "2025-02-05",
    description: "Add ability to export AI-generated reports to PDF"
  },
  { 
    id: 4, 
    title: "Bulk approval not working correctly", 
    status: "Open", 
    priority: "Medium",
    category: "Bug Report",
    date: "2025-02-12",
    description: "Bulk approve feature only approving first 10 items"
  },
  { 
    id: 5, 
    title: "API rate limit questions", 
    status: "Pending", 
    priority: "Low",
    category: "Question",
    date: "2025-02-09",
    description: "Need clarification on API rate limits for admin panel"
  },
];

const faqs = [
  {
    question: "How do I approve test papers in bulk?",
    answer: "Navigate to the Test Paper Queue, select multiple papers using the checkboxes, then click the 'Bulk Approve' button at the top of the table. You can select up to 50 papers at once."
  },
  {
    question: "What's the difference between rejection and archiving?",
    answer: "Rejecting a test paper sends feedback to the institute and keeps a record. Archiving simply removes it from the active queue without notification. Use rejection when you need the institute to revise their submission."
  },
  {
    question: "How can I export analytics data?",
    answer: "Go to Analytics > Reports, select your date range and metrics, then click 'Export' in the top right. You can export to CSV, Excel, or PDF format."
  },
  {
    question: "Can I customize notification preferences?",
    answer: "Yes! Go to Settings > Notifications to configure which alerts you receive via email, SMS, or in-app notifications. You can set different preferences for different event types."
  },
  {
    question: "How do I reset an institute's password?",
    answer: "Navigate to Institutes > Select Institute > Actions > Reset Password. The system will send them a password reset email automatically."
  },
  {
    question: "What should I do if the dashboard is loading slowly?",
    answer: "First, try clearing your browser cache. If the issue persists, go to Settings > Data Management > Clear Cache. For persistent issues, contact technical support."
  },
];

const knowledgeBase = [
  {
    category: "Getting Started",
    articles: [
      { title: "Admin Dashboard Overview", url: "#" },
      { title: "First Time Setup Guide", url: "#" },
      { title: "User Management Basics", url: "#" },
    ]
  },
  {
    category: "Test Paper Management",
    articles: [
      { title: "Approving Test Papers", url: "#" },
      { title: "Excel Format Requirements", url: "#" },
      { title: "Quality Control Guidelines", url: "#" },
    ]
  },
  {
    category: "Analytics & Reports",
    articles: [
      { title: "Understanding Dashboard Metrics", url: "#" },
      { title: "Generating Custom Reports", url: "#" },
      { title: "Export Options Explained", url: "#" },
    ]
  },
  {
    category: "Security & Access",
    articles: [
      { title: "Setting Up Two-Factor Auth", url: "#" },
      { title: "Managing Admin Permissions", url: "#" },
      { title: "API Key Management", url: "#" },
    ]
  },
];

const AdminSupport = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  // New ticket form state
  const [newTicket, setNewTicket] = useState({
    title: "",
    category: "Technical Issue",
    priority: "Medium",
    description: ""
  });

  const statusConfig = {
    Open: {
      color: "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30",
      icon: AlertCircle
    },
    "In Progress": {
      color: "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30",
      icon: Clock
    },
    Pending: {
      color: "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30",
      icon: Clock
    },
    Resolved: {
      color: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/30",
      icon: CheckCircle
    },
    Closed: {
      color: "bg-gray-100 dark:bg-slate-500/20 text-gray-700 dark:text-slate-400 border-gray-200 dark:border-slate-500/30",
      icon: XCircle
    },
  };

  const priorityConfig = {
    Critical: "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400",
    High: "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400",
    Medium: "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
    Low: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400",
  };

  const filteredTickets = sampleTickets.filter(ticket => {
    const matchesFilter = filter === "All" || ticket.status === filter;
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreateTicket = () => {
    // TODO: Implement ticket creation
    alert("Ticket created successfully! Our team will respond within 24 hours.");
    setShowNewTicketModal(false);
    setNewTicket({ title: "", category: "Technical Issue", priority: "Medium", description: "" });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-sm 
            text-gray-600 dark:text-slate-400 
            hover:text-cyan-500 dark:hover:text-cyan-400 
            transition-all duration-200"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              Support Center
            </h1>
            <p className="text-gray-600 dark:text-slate-400 text-sm">
              Get help with tickets, FAQs, and documentation
            </p>
          </div>
          <button
            onClick={() => setShowNewTicketModal(true)}
            className="flex items-center gap-2 px-6 py-3 
              bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 
              text-white font-semibold rounded-xl 
              shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 
              transition-all duration-200"
          >
            <Plus size={18} />
            <span>New Ticket</span>
          </button>
        </div>

        {/* QUICK CONTACT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Mail, label: "Email Support", value: "support@example.com", action: "Send Email" },
            { icon: Phone, label: "Phone Support", value: "+91 1234567890", action: "Call Now" },
            { icon: MessageCircle, label: "Live Chat", value: "Available 24/7", action: "Start Chat" },
          ].map((contact, idx) => {
            const Icon = contact.icon;
            return (
              <div key={idx} className="relative overflow-hidden rounded-2xl 
                bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
                backdrop-blur-xl 
                border border-gray-200 dark:border-slate-700/50 
                shadow-lg dark:shadow-xl 
                p-5 hover:shadow-xl dark:hover:shadow-2xl 
                transition-all duration-200 cursor-pointer group">
                
                <div className="absolute inset-0 
                  bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 
                  dark:from-cyan-500/5 dark:via-transparent dark:to-purple-500/5 
                  pointer-events-none" />

                <div className="relative flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl 
                      bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-500/20 dark:to-purple-500/20 
                      flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon size={20} className="text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-slate-300">{contact.label}</p>
                      <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">{contact.value}</p>
                      <button className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold mt-2 hover:underline">
                        {contact.action} →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* SUPPORT TICKETS SECTION */}
        <div className="relative overflow-hidden rounded-2xl 
          bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
          backdrop-blur-xl 
          border border-gray-200 dark:border-slate-700/50 
          shadow-xl dark:shadow-2xl">
          
          <div className="absolute inset-0 
            bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 
            dark:from-cyan-500/5 dark:via-transparent dark:to-purple-500/5 
            pointer-events-none" />

          <div className="relative p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-slate-700/50">
              <div className="w-10 h-10 rounded-xl 
                bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-500/20 dark:to-purple-500/20 
                flex items-center justify-center">
                <MessageSquare size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Support Tickets</h2>
                <p className="text-sm text-gray-600 dark:text-slate-400">Track and manage your support requests</p>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800/50 
                    border border-gray-300 dark:border-slate-700/50 
                    text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 
                    rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 
                    transition-all duration-200"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {["All", "Open", "In Progress", "Pending", "Resolved"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-200
                      ${filter === status
                        ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/25"
                        : "bg-white dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700/50 text-gray-700 dark:text-slate-300"
                      }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Tickets List */}
            <div className="space-y-3">
              {filteredTickets.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="text-6xl mb-4 opacity-30">🎫</div>
                  <p className="text-gray-500 dark:text-slate-500">No tickets found</p>
                </div>
              ) : (
                filteredTickets.map((ticket) => {
                  const StatusIcon = statusConfig[ticket.status].icon;
                  return (
                    <div
                      key={ticket.id}
                      className="flex flex-col md:flex-row md:items-center justify-between gap-4 
                        p-5 bg-white dark:bg-slate-800/50 
                        rounded-xl border border-gray-200 dark:border-slate-700/50 
                        hover:border-cyan-300 dark:hover:border-cyan-500/50 
                        hover:shadow-lg transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            <StatusIcon size={18} className={statusConfig[ticket.status].color.split(' ')[1]} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                              {ticket.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">{ticket.description}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-xs text-gray-500 dark:text-slate-500 flex items-center gap-1">
                                <Clock size={12} />
                                {ticket.date}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-slate-500">
                                #{ticket.id}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-slate-500">
                                {ticket.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${priorityConfig[ticket.priority]}`}>
                          {ticket.priority}
                        </span>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusConfig[ticket.status].color}`}>
                          {ticket.status}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* TWO COLUMN LAYOUT - FAQ & KNOWLEDGE BASE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* FAQ SECTION */}
          <div className="relative overflow-hidden rounded-2xl 
            bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
            backdrop-blur-xl 
            border border-gray-200 dark:border-slate-700/50 
            shadow-xl dark:shadow-2xl">
            
            <div className="absolute inset-0 
              bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 
              dark:from-cyan-500/5 dark:via-transparent dark:to-purple-500/5 
              pointer-events-none" />

            <div className="relative p-6 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-slate-700/50">
                <div className="w-10 h-10 rounded-xl 
                  bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-500/20 dark:to-pink-500/20 
                  flex items-center justify-center">
                  <HelpCircle size={20} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
                  <p className="text-sm text-gray-600 dark:text-slate-400">Quick answers to common questions</p>
                </div>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-slate-800/50 
                      rounded-xl border border-gray-200 dark:border-slate-700/50 
                      overflow-hidden transition-all duration-200"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-4 
                        text-left hover:bg-gray-50 dark:hover:bg-slate-800/70 
                        transition-colors duration-200"
                    >
                      <span className="font-semibold text-gray-900 dark:text-white text-sm pr-4">
                        {faq.question}
                      </span>
                      {expandedFaq === idx ? (
                        <ChevronUp size={18} className="text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown size={18} className="text-gray-400 dark:text-slate-500 flex-shrink-0" />
                      )}
                    </button>
                    {expandedFaq === idx && (
                      <div className="px-4 pb-4 pt-0">
                        <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* KNOWLEDGE BASE */}
          <div className="relative overflow-hidden rounded-2xl 
            bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
            backdrop-blur-xl 
            border border-gray-200 dark:border-slate-700/50 
            shadow-xl dark:shadow-2xl">
            
            <div className="absolute inset-0 
              bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 
              dark:from-cyan-500/5 dark:via-transparent dark:to-purple-500/5 
              pointer-events-none" />

            <div className="relative p-6 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-slate-700/50">
                <div className="w-10 h-10 rounded-xl 
                  bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-500/20 dark:to-emerald-500/20 
                  flex items-center justify-center">
                  <BookOpen size={20} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Knowledge Base</h2>
                  <p className="text-sm text-gray-600 dark:text-slate-400">Browse documentation and guides</p>
                </div>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {knowledgeBase.map((section, idx) => (
                  <div key={idx} className="space-y-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <FileText size={16} className="text-cyan-600 dark:text-cyan-400" />
                      {section.category}
                    </h3>
                    <div className="space-y-1 ml-6">
                      {section.articles.map((article, articleIdx) => (
                        <a
                          key={articleIdx}
                          href={article.url}
                          className="flex items-center justify-between p-3 
                            bg-white dark:bg-slate-800/50 
                            rounded-lg border border-gray-200 dark:border-slate-700/50 
                            hover:border-cyan-300 dark:hover:border-cyan-500/50 
                            hover:bg-gray-50 dark:hover:bg-slate-800/70 
                            text-sm text-gray-700 dark:text-slate-300 
                            transition-all duration-200 group"
                        >
                          <span className="group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                            {article.title}
                          </span>
                          <ExternalLink size={14} className="text-gray-400 dark:text-slate-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM CTA */}
        <div className="relative overflow-hidden rounded-2xl 
          bg-gradient-to-r from-cyan-500 to-blue-600 
          shadow-xl shadow-cyan-500/25 p-8">
          
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <LifeBuoy size={28} className="text-white" />
              </div>
              <div className="text-white">
                <h3 className="text-xl font-bold mb-1">Still Need Help?</h3>
                <p className="text-white/80 text-sm">Our support team is available 24/7 to assist you</p>
              </div>
            </div>
            <button
              onClick={() => setShowNewTicketModal(true)}
              className="px-8 py-3 bg-white text-cyan-600 font-bold rounded-xl 
                hover:bg-gray-100 shadow-lg hover:shadow-xl 
                transition-all duration-200"
            >
              Create Support Ticket
            </button>
          </div>
        </div>
      </div>

      {/* NEW TICKET MODAL */}
      {showNewTicketModal && (
        <>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setShowNewTicketModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl 
              bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/95 dark:to-slate-800/95 
              backdrop-blur-xl 
              border border-gray-200 dark:border-slate-700/50 
              rounded-2xl shadow-2xl 
              animate-scale-in">
              
              <div className="absolute inset-0 
                bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 
                dark:from-cyan-500/5 dark:via-transparent dark:to-purple-500/5 
                pointer-events-none rounded-2xl" />

              <div className="relative p-6 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl 
                      bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-500/20 dark:to-purple-500/20 
                      flex items-center justify-center">
                      <Plus size={20} className="text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Support Ticket</h2>
                  </div>
                  <button
                    onClick={() => setShowNewTicketModal(false)}
                    className="w-8 h-8 flex items-center justify-center 
                      bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 
                      text-gray-700 dark:text-slate-300 rounded-lg 
                      transition-all duration-200"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                      Ticket Title *
                    </label>
                    <input
                      type="text"
                      placeholder="Brief description of the issue"
                      value={newTicket.title}
                      onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800/50 
                        border border-gray-300 dark:border-slate-700/50 
                        text-gray-900 dark:text-white rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-cyan-500 
                        transition-all duration-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                        Category *
                      </label>
                      <select
                        value={newTicket.category}
                        onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800/50 
                          border border-gray-300 dark:border-slate-700/50 
                          text-gray-900 dark:text-white rounded-lg 
                          focus:outline-none focus:ring-2 focus:ring-cyan-500 
                          transition-all duration-200"
                      >
                        <option>Technical Issue</option>
                        <option>Bug Report</option>
                        <option>Feature Request</option>
                        <option>Payment</option>
                        <option>Question</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                        Priority *
                      </label>
                      <select
                        value={newTicket.priority}
                        onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800/50 
                          border border-gray-300 dark:border-slate-700/50 
                          text-gray-900 dark:text-white rounded-lg 
                          focus:outline-none focus:ring-2 focus:ring-cyan-500 
                          transition-all duration-200"
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Critical</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                      Description *
                    </label>
                    <textarea
                      placeholder="Provide detailed information about your issue..."
                      value={newTicket.description}
                      onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                      rows="5"
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800/50 
                        border border-gray-300 dark:border-slate-700/50 
                        text-gray-900 dark:text-white rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-cyan-500 
                        resize-none transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowNewTicketModal(false)}
                    className="flex-1 px-6 py-3 
                      bg-white dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-700/50 
                      border border-gray-300 dark:border-slate-700/50 
                      text-gray-700 dark:text-slate-300 font-semibold rounded-xl 
                      transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateTicket}
                    disabled={!newTicket.title || !newTicket.description}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 
                      font-bold rounded-xl transition-all duration-200
                      ${newTicket.title && newTicket.description
                        ? "bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40"
                        : "bg-gray-300 dark:bg-slate-700 text-gray-500 dark:text-slate-500 cursor-not-allowed"
                      }`}
                  >
                    <Send size={18} />
                    <span>Submit Ticket</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminSupport;