// src/components/InstitutesSection.jsx
import { useState, useEffect } from "react";
import { Eye, Edit, MoreVertical, X, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LocationPicker from "./LocationPicker";
import EditInstituteModal from "./EditInstituteModal";

const InstitutesSection = ({ mode = "full" }) => {
  const [institutes, setInstitutes] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [selectedInstitutes, setSelectedInstitutes] = useState([]);

  const [addOpen, setAddOpen] = useState(false); // add institute
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view"); // view | edit
  const [selected, setSelected] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);

  const [errors, setErrors] = useState({});

  const validateInstitute = () => {
    const newErrors = {};

    // Regex patterns
    const stringRegex = /^[A-Za-z\s]+$/; // only letters & spaces
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const numberRegex = /^\d+$/;
    const phoneRegex = /^\d{10}$/;

    // Institute Name (string)
    if (!newInstitute.institute_name.trim()) {
      newErrors.institute_name = "Institute name is required";
    } else if (!stringRegex.test(newInstitute.institute_name)) {
      newErrors.institute_name = "Institute name must contain only letters";
    }

    // Institute Email
    if (!newInstitute.institute_email.trim()) {
      newErrors.institute_email = "Institute email is required";
    } else if (!emailRegex.test(newInstitute.institute_email)) {
      newErrors.institute_email = "Invalid email format";
    }

    // Contact Person Name (string)
    if (!newInstitute.contact_person_name.trim()) {
      newErrors.contact_person_name = "Contact person name is required";
    } else if (!stringRegex.test(newInstitute.contact_person_name)) {
      newErrors.contact_person_name = "Name must contain only letters";
    }

    // Contact Person Designation (string)
    if (!newInstitute.contact_person_designation.trim()) {
      newErrors.contact_person_designation = "Designation is required";
    } else if (!stringRegex.test(newInstitute.contact_person_designation)) {
      newErrors.contact_person_designation =
        "Designation must contain only letters";
    }

    // Contact Phone (number)
    if (!newInstitute.contact_phone.trim()) {
      newErrors.contact_phone = "Contact phone is required";
    } else if (!phoneRegex.test(newInstitute.contact_phone)) {
      newErrors.contact_phone = "Phone number must be 10 digits";
    }

    // Institute Type (string)
    if (!newInstitute.institute_type.trim()) {
      newErrors.institute_type = "Institute type is required";
    } else if (!stringRegex.test(newInstitute.institute_type)) {
      newErrors.institute_type = "Institute type must contain only letters";
    }

    // City (string)
    if (!newInstitute.location_city.trim()) {
      newErrors.location_city = "City is required";
    } else if (!stringRegex.test(newInstitute.location_city)) {
      newErrors.location_city = "City must contain only letters";
    }

    // State (string)
    if (!newInstitute.location_state.trim()) {
      newErrors.location_state = "State is required";
    } else if (!stringRegex.test(newInstitute.location_state)) {
      newErrors.location_state = "State must contain only letters";
    }

    // Country (string)
    if (!newInstitute.location_country.trim()) {
      newErrors.location_country = "Country is required";
    } else if (!stringRegex.test(newInstitute.location_country)) {
      newErrors.location_country = "Country must contain only letters";
    }

    // Pin (number)
    if (!newInstitute.location_pin.trim()) {
      newErrors.location_pin = "Pin is required";
    } else if (!numberRegex.test(newInstitute.location_pin)) {
      newErrors.location_pin = "Pin must contain only numbers";
    }

    return newErrors;
  };

  // const [newInstitute, setNewInstitute] = useState({
  //   institute_name: "",
  //   institute_display_name: "",
  //   institute_email: "",
  //   institute_type: "",
  //   location_city: "",
  //   location_state: "",
  //   location_country: "India",
  //   location_pin: "",
  //   contact_person_name: "",
  //   contact_person_designation: "",
  //   contact_phone: "",
  //   contact_phone_alt: "",
  //   support_email: "",
  //   // subscription_plan: "FREE",
  //   // max_students_allowed: "",
  //   // max_exams_allowed: "",
  //   // plan_expiry_date: "",
  //   admin_notes: "",
  //   latitude: "",
  //   longitude: "",
  // });

  const initialInstitute = {
    institute_name: "",
    institute_display_name: "",
    institute_email: "",
    support_email: "",
    contact_person_name: "",
    contact_person_designation: "",
    contact_phone: "",
    contact_phone_alt: "",
    institute_type: "",
    location_city: "",
    location_state: "",
    location_country: "",
    location_pin: "",
    latitude: "",
    longitude: "",
    admin_notes: "",
    // subscription_plan: "FREE", // optional if you are using it
    // max_students_allowed: "",
    // max_exams_allowed: "",
    // plan_expiry_date: "",
  };
  const [newInstitute, setNewInstitute] = useState(initialInstitute);

  const resetForm = () => {
    setNewInstitute(initialInstitute);
    setErrors({});
  };

  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        const res = await fetch("http://localhost:3000/getInstitutes");
        const data = await res.json();

        // Normalize field names
        const normalized = data.map((inst, index) => ({
          institute_id: inst.institute_id,
          institute_name: inst.institute_name || "",
          location_city: inst.location_city || "",
          account_status: inst.account_status || "Pending",
          institute_email: inst.institute_email || "",
          // exams: inst.max_exams_allowed || 0,
          // students: inst.max_students_allowed || 0,
          // subscription: inst.subscription_plan || "null",
          // plan_expiry: inst.plan_expiry_date || "none",
          revenue: inst.revenue || "0",
          admin_notes: inst.admin_notes || "no notes",
        }));

        setInstitutes(normalized);
      } catch (err) {
        console.error("Error fetching institutes:", err);
      }
    };

    fetchInstitutes();
  }, []);

  const navigate = useNavigate();
  const isPreview = mode === "preview";

  // --- Filter and Sort ---
  const filteredInstitutes = institutes.filter((inst) => {
    const searchText = search.toLowerCase();

    return (
      (inst.institute_name ?? "").toLowerCase().includes(searchText) ||
      (inst.location_city ?? "").toLowerCase().includes(searchText) ||
      (inst.account_status ?? "").toLowerCase().includes(searchText) ||
      (inst.institute_email ?? "").toLowerCase().includes(searchText)
    );
  });

const sortedInstitutes = [...filteredInstitutes].sort((a, b) => {
  switch (sortOption) {
    case "name-asc":
      return (a.institute_name || "").localeCompare(b.institute_name || "");
    case "name-desc":
      return (b.institute_name || "").localeCompare(a.institute_name || "");
    // case "exams-asc":
    //   return a.exams - b.exams;
    // case "exams-desc":
    //   return b.exams - a.exams;
    case "revenue-asc":
      return (
        parseInt(a.revenue?.replace(/[^0-9]/g, "") || "0") -
        parseInt(b.revenue?.replace(/[^0-9]/g, "") || "0")
      );
    case "revenue-desc":
      return (
        parseInt(b.revenue?.replace(/[^0-9]/g, "") || "0") -
        parseInt(a.revenue?.replace(/[^0-9]/g, "") || "0")
      );
    default:
      return 0;
  }
});


  // --- Bulk Actions ---
  const handleSelectInstitute = (id) => {
    if (selectedInstitutes.includes(id)) {
      setSelectedInstitutes(selectedInstitutes.filter((i) => i !== id));
    } else {
      setSelectedInstitutes([...selectedInstitutes, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedInstitutes.length === sortedInstitutes.length) {
      setSelectedInstitutes([]);
    } else {
      setSelectedInstitutes(sortedInstitutes.map((i) => i.institute_id));
    }
  };

  const blockSelected = () => {
    setInstitutes((prev) =>
      prev.map((i) =>
        selectedInstitutes.includes(i.institute_id) ? { ...i, status: "Suspended" } : i
      )
    );
    setSelectedInstitutes([]);
    alert("Selected institutes have been suspended!");
  };

  const sendEmail = () => {
    alert(`Send email to: ${selectedInstitutes.join(", ")}`);
  };

  const exportCSV = () => {
    if (sortedInstitutes.length === 0) {
      alert("No institutes to export!");
      return;
    }

    const headers = [
      "ID",
      "Name",
      "City",
      "Exams",
      "Revenue",
      "Status",
      "Email",
      "Phone",
      "Founded",
      "Type",
      "Students",
    ];

    const rows = sortedInstitutes.map((i) => [
      i.institute_id,
      i.institute_name,
      i.location_city,
      i.exams,
      i.revenue,
      i.account_status,
      i.institute_email,
      i.contact_phone,
      i.founded,
      i.institute_type,
      i.students,
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "institutes_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Open Edit ---
  const openEdit = (inst) => {
    setSelected({ ...inst });
    setModalMode("edit");
    setModalOpen(true);
  };

  return (
    <section
      className="space-y-6 max-w-7xl mx-auto"
      onClick={
        isPreview ? () => navigate("/admin/institutes-management") : undefined
      }
    >
      {/* HEADER */}
      {!isPreview && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Institutes Management</h2>
            <p className="text-xs text-slate-400 mt-1">
              Monitor institute performance, exam activity, and revenue metrics.
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setAddOpen(true);
            }}
            className="px-4 py-2 text-sm rounded-lg bg-cyan-500 hover:bg-cyan-600 transition"
          >
            + Add Institute
          </button>
        </div>
      )}

      {/* Header in preview */}
      {isPreview && (
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Institutes Overview</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate("/admin/institutes-management");
            }}
            className="text-cyan-400 text-sm"
          >
            View Full →
          </button>
        </div>
      )}

      {/* SEARCH + SORT + EXPORT */}
      <div className="glass rounded-xl p-4 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="relative w-full md:w-80">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, city, status, or email..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-cyan-400/40 text-slate-200"
          />
        </div>

        <div className="flex gap-2 items-center relative">
          <label htmlFor="sort" className="text-sm text-slate-400 mr-2">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="appearance-none bg-white/5 backdrop-blur-md border border-white/10 rounded-lg px-3 py-1 text-sm text-slate-200 focus:outline-none focus:border-cyan-400/40 pr-8"
          >
            <option value="" className="bg-slate-800">
              None
            </option>
            <option value="name-asc" className="bg-slate-800">
              Name A-Z
            </option>
            <option value="name-desc" className="bg-slate-800">
              Name Z-A
            </option>
            {/* <option value="exams-asc" className="bg-slate-800">
              Exams Asc
            </option>
            <option value="exams-desc" className="bg-slate-800">
              Exams Desc
            </option> */}
            <option value="revenue-asc" className="bg-slate-800">
              Revenue Asc
            </option>
            <option value="revenue-desc" className="bg-slate-800">
              Revenue Desc
            </option>
          </select>
          <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
            ▼
          </div>
        </div>

        <button
          onClick={exportCSV}
          className="px-3 py-1 bg-slate-500/30 text-white rounded hover:bg-slate-500/20 transition text-sm"
        >
          Export CSV
        </button>
      </div>

      {/* BULK ACTIONS */}
      {selectedInstitutes.length > 0 && (
        <div className="glass rounded-xl p-3 flex gap-3 items-center">
          <span className="text-sm text-slate-400">
            {selectedInstitutes.length} selected
          </span>
          <button
            onClick={blockSelected}
            className="px-3 py-1 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition text-sm"
          >
            Suspend Selected
          </button>
          <button
            onClick={sendEmail}
            className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded hover:bg-cyan-500/20 transition text-sm"
          >
            Send Email
          </button>
        </div>
      )}

      {/* TABLE */}
      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-slate-400 text-xs">
            <tr>
              <th className="px-6 py-4 text-center">
                <input
                  type="checkbox"
                  checked={
                    selectedInstitutes.length === sortedInstitutes.length &&
                    sortedInstitutes.length > 0
                  }
                  onChange={handleSelectAll}
                  className="accent-cyan-400 w-4 h-4"
                />
              </th>
              <th className="px-6 py-4 text-left">Institute</th>
              <th className="px-6 py-4 text-left">City</th>
              {/* <th className="px-6 py-4 text-center">Max Exams Allowed</th> */}
              {/* <th className="px-6 py-4 text-center">Max Students Allowed</th> */}
              {/* <th className="px-6 py-4 text-center">Subscription</th> */}
              {/* <th className="px-6 py-4 text-center">Plan Expiry</th> */}
              <th className="px-6 py-4 text-center">Revenue</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Notes</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {(isPreview ? sortedInstitutes.slice(0, 5) : sortedInstitutes).map(
              (inst, idx) => (
                <tr
                  key={inst.institute_id}
                  className={`group border-t border-white/5 ${
                    inst.highlight ? "bg-cyan-500/5" : "hover:bg-white/5"
                  }`}
                >
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectedInstitutes.includes(inst.institute_id)}
                      onChange={() => handleSelectInstitute(inst.institute_id)}
                      className="accent-cyan-400 w-4 h-4"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">{inst.institute_name}</td>
                  <td className="px-6 py-4 text-slate-300">{inst.location_city}</td>
                  {/* <td className="px-6 py-4 text-center">{inst.exams}</td> */}
                  {/* <td className="px-6 py-4 text-center font-medium">
                    {inst.students}
                  </td> */}
                  {/* <td className="px-6 py-4 text-center font-medium">
                    {inst.subscription}
                  </td> */}
                  {/* <td className="px-6 py-4 text-center font-medium">
                    {inst.plan_expiry}
                  </td> */}
                  <td className="px-6 py-4 text-center font-medium">
                    {inst.revenue}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs
                      ${
                        inst.account_status === "ACTIVE" &&
                        "bg-green-500/10 text-green-400"
                      }
                      ${
                        inst.account_status === "INVITED" &&
                        "bg-yellow-500/10 text-yellow-400"
                      }
                      ${
                        inst.account_status === "SUSPENDED" &&
                        "bg-red-500/10 text-red-400"
                      }
                    `}
                    >
                      {inst.account_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-medium">
                    {inst.admin_notes}
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <div className="flex justify-end gap-3 opacity-100 group-hover:opacity-80 transition">
                      <button
                        onClick={() =>
                          navigate(`/admin/institutes-management/${inst.institute_id}`, {
                            state: inst,
                          })
                        }
                      >
                        <Eye size={16} />
                      </button>
                      <button onClick={() => openEdit(inst)}>
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() =>
                          setMenuOpenId(menuOpenId === inst.institute_id ? null : inst.institute_id)
                        }
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>

                    {menuOpenId === inst.institute_id && (
                      <div className="absolute right-6 mt-2 w-32 rounded-lg bg-slate-900 border border-white/10 shadow-lg z-10">
                        <button className="block w-full px-4 py-2 text-left hover:bg-white/10">
                          Duplicate
                        </button>
                        <button className="block w-full px-4 py-2 text-left hover:bg-white/10">
                          Archive
                        </button>
                        <button className="block w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/10">
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
      {/* ADD INSTITUTE MODAL */}
      {addOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="glass w-full max-w-3xl max-h-[81vh] flex flex-col rounded-xl relative">
            {/* Close */}
            <button
              onClick={() => {
                setAddOpen(false);
                resetForm(); // reset on close
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <h3 className="text-lg font-semibold text-slate-100">
                Add New Institute
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter institute and contact details
              </p>
              {Object.keys(errors).length > 0 && (
                <span className="text-xs text-red-400">
                  Please check the form. Some required fields are invalid.
                </span>
              )}
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {/* Institute Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium tracking-wide text-slate-400">
                    Institute Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    placeholder="Enter here"
                    value={newInstitute.institute_name}
                    onChange={(e) =>
                      setNewInstitute({
                        ...newInstitute,
                        institute_name: e.target.value,
                      })
                    }
                    className="w-full rounded-lg px-4 py-2.5 bg-white/5 border border-white/10
                         text-slate-200 text-sm placeholder-slate-500
                         focus:outline-none focus:ring-1 focus:ring-cyan-400/40
                         focus:border-cyan-400/40 hover:border-white/20"
                  />
                  {errors.institute_name && (
                    <span className="text-red-400 text-xs mt-1">
                      {errors.institute_name}
                    </span>
                  )}
                </div>

                {/* Display Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium tracking-wide text-slate-400">
                    Institute Display Name
                  </label>
                  <input
                    placeholder="Enter here"
                    value={newInstitute.institute_display_name}
                    onChange={(e) =>
                      setNewInstitute({
                        ...newInstitute,
                        institute_display_name: e.target.value,
                      })
                    }
                    className="w-full rounded-lg px-4 py-2.5 bg-white/5 border border-white/10
                         text-slate-200 text-sm placeholder-slate-500
                         focus:outline-none focus:ring-1 focus:ring-cyan-400/40
                         focus:border-cyan-400/40 hover:border-white/20"
                  />
                </div>

                {/* Institute Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium tracking-wide text-slate-400">
                    Institute Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter here"
                    value={newInstitute.institute_email}
                    onChange={(e) =>
                      setNewInstitute({
                        ...newInstitute,
                        institute_email: e.target.value,
                      })
                    }
                    className="w-full rounded-lg px-4 py-2.5 bg-white/5 border border-white/10
                         text-slate-200 text-sm placeholder-slate-500
                         focus:outline-none focus:ring-1 focus:ring-cyan-400/40
                         focus:border-cyan-400/40 hover:border-white/20"
                  />
                  {errors.institute_email && (
                    <span className="text-red-400 text-xs mt-1">
                      {errors.institute_email}
                    </span>
                  )}
                </div>

                {/* Support Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium tracking-wide text-slate-400">
                    Support Email
                  </label>
                  <input
                    placeholder="Enter here"
                    value={newInstitute.support_email}
                    onChange={(e) =>
                      setNewInstitute({
                        ...newInstitute,
                        support_email: e.target.value,
                      })
                    }
                    className="w-full rounded-lg px-4 py-2.5 bg-white/5 border border-white/10
                         text-slate-200 text-sm placeholder-slate-500
                         focus:outline-none focus:ring-1 focus:ring-cyan-400/40
                         focus:border-cyan-400/40 hover:border-white/20"
                  />
                </div>

                {/* Section: Contact Info */}
                <div className="md:col-span-2 mt-3">
                  <h4 className="text-sm font-semibold text-slate-300">
                    Contact Information
                  </h4>
                </div>

                {/* Contact Person */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium tracking-wide text-slate-400">
                    Contact Person Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    placeholder="Enter here"
                    value={newInstitute.contact_person_name}
                    onChange={(e) =>
                      setNewInstitute({
                        ...newInstitute,
                        contact_person_name: e.target.value,
                      })
                    }
                    className="w-full rounded-lg px-4 py-2.5 bg-white/5 border border-white/10
                         text-slate-200 text-sm placeholder-slate-500
                         focus:outline-none focus:ring-1 focus:ring-cyan-400/40
                         focus:border-cyan-400/40 hover:border-white/20"
                  />
                  {errors.contact_person_name && (
                    <span className="text-red-400 text-xs mt-1">
                      {errors.contact_person_name}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium tracking-wide text-slate-400">
                    Contact Person Designation{" "}
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    placeholder="Enter here"
                    value={newInstitute.contact_person_designation}
                    onChange={(e) =>
                      setNewInstitute({
                        ...newInstitute,
                        contact_person_designation: e.target.value,
                      })
                    }
                    className="w-full rounded-lg px-4 py-2.5 bg-white/5 border border-white/10
                         text-slate-200 text-sm placeholder-slate-500
                         focus:outline-none focus:ring-1 focus:ring-cyan-400/40
                         focus:border-cyan-400/40 hover:border-white/20"
                  />
                  {errors.contact_person_designation && (
                    <span className="text-red-400 text-xs mt-1">
                      {errors.contact_person_designation}
                    </span>
                  )}
                </div>

                {/* Contact Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium tracking-wide text-slate-400">
                    Contact Phone <span className="text-red-400">*</span>
                  </label>
                  <input
                    placeholder="Enter here"
                    value={newInstitute.contact_phone}
                    onChange={(e) =>
                      setNewInstitute({
                        ...newInstitute,
                        contact_phone: e.target.value,
                      })
                    }
                    className="w-full rounded-lg px-4 py-2.5 bg-white/5 border border-white/10
                         text-slate-200 text-sm placeholder-slate-500
                         focus:outline-none focus:ring-1 focus:ring-cyan-400/40
                         focus:border-cyan-400/40 hover:border-white/20"
                  />
                  {errors.contact_phone && (
                    <span className="text-red-400 text-xs mt-1">
                      {errors.contact_phone}
                    </span>
                  )}
                </div>

                {/* Alternate Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium tracking-wide text-slate-400">
                    Alternate Contact Phone
                  </label>
                  <input
                    placeholder="Enter here"
                    value={newInstitute.contact_phone_alt}
                    onChange={(e) =>
                      setNewInstitute({
                        ...newInstitute,
                        contact_phone_alt: e.target.value,
                      })
                    }
                    className="w-full rounded-lg px-4 py-2.5 bg-white/5 border border-white/10
                         text-slate-200 text-sm placeholder-slate-500
                         focus:outline-none focus:ring-1 focus:ring-cyan-400/40
                         focus:border-cyan-400/40 hover:border-white/20"
                  />
                </div>

                {/* Institute Type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium tracking-wide text-slate-400">
                    Institute Type <span className="text-red-400">*</span>
                  </label>
                  <input
                    placeholder="Enter here"
                    value={newInstitute.institute_type}
                    onChange={(e) =>
                      setNewInstitute({
                        ...newInstitute,
                        institute_type: e.target.value,
                      })
                    }
                    className="w-full rounded-lg px-4 py-2.5 bg-white/5 border border-white/10
                         text-slate-200 text-sm placeholder-slate-500
                         focus:outline-none focus:ring-1 focus:ring-cyan-400/40
                         focus:border-cyan-400/40 hover:border-white/20"
                  />
                  {errors.institute_type && (
                    <span className="text-red-400 text-xs mt-1">
                      {errors.institute_type}
                    </span>
                  )}
                </div>

                {/* City */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium tracking-wide text-slate-400">
                    City <span className="text-red-400">*</span>
                  </label>
                  <input
                    placeholder="Enter here"
                    value={newInstitute.location_city}
                    onChange={(e) =>
                      setNewInstitute({
                        ...newInstitute,
                        location_city: e.target.value,
                      })
                    }
                    className="w-full rounded-lg px-4 py-2.5 bg-white/5 border border-white/10
                         text-slate-200 text-sm placeholder-slate-500
                         focus:outline-none focus:ring-1 focus:ring-cyan-400/40
                         focus:border-cyan-400/40 hover:border-white/20"
                  />
                  {errors.location_city && (
                    <span className="text-red-400 text-xs mt-1">
                      {errors.location_city}
                    </span>
                  )}
                </div>

                {/* State */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium tracking-wide text-slate-400">
                    State <span className="text-red-400">*</span>
                  </label>
                  <input
                    placeholder="Enter here"
                    value={newInstitute.location_state}
                    onChange={(e) =>
                      setNewInstitute({
                        ...newInstitute,
                        location_state: e.target.value,
                      })
                    }
                    className="w-full rounded-lg px-4 py-2.5 bg-white/5 border border-white/10
                         text-slate-200 text-sm placeholder-slate-500
                         focus:outline-none focus:ring-1 focus:ring-cyan-400/40
                         focus:border-cyan-400/40 hover:border-white/20"
                  />
                  {errors.location_state && (
                    <span className="text-red-400 text-xs mt-1">
                      {errors.location_state}
                    </span>
                  )}
                </div>

                {/* Country */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium tracking-wide text-slate-400">
                    Country <span className="text-red-400">*</span>
                  </label>
                  <input
                    placeholder="Enter here"
                    value={newInstitute.location_country}
                    onChange={(e) =>
                      setNewInstitute({
                        ...newInstitute,
                        location_country: e.target.value,
                      })
                    }
                    className="w-full rounded-lg px-4 py-2.5 bg-white/5 border border-white/10
                         text-slate-200 text-sm placeholder-slate-500
                         focus:outline-none focus:ring-1 focus:ring-cyan-400/40
                         focus:border-cyan-400/40 hover:border-white/20"
                  />
                  {errors.location_country && (
                    <span className="text-red-400 text-xs mt-1">
                      {errors.location_country}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium tracking-wide text-slate-400">
                    Pin <span className="text-red-400">*</span>
                  </label>
                  <input
                    placeholder="Enter here"
                    value={newInstitute.location_pin}
                    onChange={(e) =>
                      setNewInstitute({
                        ...newInstitute,
                        location_pin: e.target.value,
                      })
                    }
                    className="w-full rounded-lg px-4 py-2.5 bg-white/5 border border-white/10
                         text-slate-200 text-sm placeholder-slate-500
                         focus:outline-none focus:ring-1 focus:ring-cyan-400/40
                         focus:border-cyan-400/40 hover:border-white/20"
                  />
                  {errors.location_pin && (
                    <span className="text-red-400 text-xs mt-1">
                      {errors.location_pin}
                    </span>
                  )}
                </div>
                <div className="md:col-span-2 mt-3">
                  <h4 className="text-sm font-semibold text-slate-300">
                    Location Picker
                  </h4>
                  <LocationPicker
                    newInstitute={newInstitute}
                    setNewInstitute={setNewInstitute}
                  />
                  <div className="flex gap-4 mt-2 text-slate-200 text-sm">
                    <div>
                      Latitude: {newInstitute.latitude || "Not selected"}
                    </div>
                    <div>
                      Longitude: {newInstitute.longitude || "Not selected"}
                    </div>
                  </div>
                </div>

                {/* Subscription */}
                {/* <div className="md:col-span-2 mt-3">
                  <h4 className="text-sm font-semibold text-slate-300">
                    Subscription
                  </h4>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium tracking-wide text-slate-400">
                    Subscription Plan
                  </label>
                  <select
                    value={newInstitute.subscription_plan}
                    onChange={(e) =>
                      setNewInstitute({
                        ...newInstitute,
                        subscription_plan: e.target.value,
                      })
                    }
                    className="w-full rounded-lg px-4 py-2.5 bg-white/5 border border-white/10
                         text-slate-200 text-sm
                         focus:outline-none focus:ring-1 focus:ring-cyan-400/40
                         focus:border-cyan-400/40 hover:border-white/20"
                  >
                    <option value="FREE" className="bg-slate-800">
                      Free
                    </option>
                    <option value="TRIAL" className="bg-slate-800">
                      Trial
                    </option>
                    <option value="PREMIUM" className="bg-slate-800">
                      Premium
                    </option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium tracking-wide text-slate-400">
                    Max Students Allowed
                  </label>
                  <input
                    type="number"
                    placeholder="Enter here"
                    value={newInstitute.max_students_allowed}
                    onChange={(e) =>
                      setNewInstitute({
                        ...newInstitute,
                        max_students_allowed: e.target.value,
                      })
                    }
                    className="w-full rounded-lg px-4 py-2.5 bg-white/5 border border-white/10
                         text-slate-200 text-sm placeholder-slate-500
                         focus:outline-none focus:ring-1 focus:ring-cyan-400/40
                         focus:border-cyan-400/40 hover:border-white/20"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium tracking-wide text-slate-400">
                    Max Exams Allowed
                  </label>
                  <input
                    type="number"
                    placeholder="Enter here"
                    value={newInstitute.max_exams_allowed}
                    onChange={(e) =>
                      setNewInstitute({
                        ...newInstitute,
                        max_exams_allowed: e.target.value,
                      })
                    }
                    className="w-full rounded-lg px-4 py-2.5 bg-white/5 border border-white/10
                         text-slate-200 text-sm placeholder-slate-500
                         focus:outline-none focus:ring-1 focus:ring-cyan-400/40
                         focus:border-cyan-400/40 hover:border-white/20"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium tracking-wide text-slate-400">
                    Plan Expiry Date
                  </label>
                  <input
                    type="date"
                    value={newInstitute.plan_expiry_date}
                    onChange={(e) =>
                      setNewInstitute({
                        ...newInstitute,
                        plan_expiry_date: e.target.value,
                      })
                    }
                    className="w-full rounded-lg px-4 py-2.5 bg-white/5 border border-white/10
                         text-slate-200 text-sm
                         focus:outline-none focus:ring-1 focus:ring-cyan-400/40
                         focus:border-cyan-400/40 hover:border-white/20"
                  />
                </div> */}

                {/* Notes */}
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-medium tracking-wide text-slate-400">
                    Admin Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter here"
                    value={newInstitute.admin_notes}
                    onChange={(e) =>
                      setNewInstitute({
                        ...newInstitute,
                        admin_notes: e.target.value,
                      })
                    }
                    className="w-full rounded-lg px-4 py-2.5 bg-white/5 border border-white/10
                         text-slate-200 text-sm placeholder-slate-500 resize-none
                         focus:outline-none focus:ring-1 focus:ring-cyan-400/40
                         focus:border-cyan-400/40 hover:border-white/20"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 flex justify-end gap-3">
              <button
                onClick={() => {
                  setAddOpen(false);
                  resetForm(); // reset on close
                }}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  const validationErrors = validateInstitute();
                  if (Object.keys(validationErrors).length > 0) {
                    setErrors(validationErrors);
                    return; // stop API call
                  }

                  try {
                    const res = await fetch(
                      "http://localhost:3000/addInstitute",
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(newInstitute),
                      }
                    );
                    const data = await res.json();

                    if (data.success) {
                      alert(
                        "Institute added! Temp password: " + data.tempPassword
                      );
                      const inst = data.institute;

                      const normalizedInstitute = {
                        institute_id: inst.institute_id,
                        institute_name: inst.institute_name,
                        location_city: inst.location_city,
                        account_status: inst.account_status,
                        institute_email: inst.institute_email,
                        revenue: inst.revenue || "0",
                        admin_notes: inst.admin_notes || "",
                      };

                      setInstitutes((prev) => [...prev, normalizedInstitute]);

                      resetForm();
                      setAddOpen(false);
                    } else {
                      alert("Error: " + data.error);
                    }
                  } catch (err) {
                    alert("Error: " + err.message);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 transition"
              >
                Save Institute
              </button>
            </div>
          </div>
        </div>
      )}

<EditInstituteModal
  open={modalOpen}
  institute={selected}
  mode="quick" // Table quick edit
  onClose={() => setModalOpen(false)}
  onChange={(field, value) =>
    setSelected({ ...selected, [field]: value })
  }
  onSave={async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/updateInstitute/${selected.institute_id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          
          body: JSON.stringify(selected),
        }
      );
      const data = await res.json();

if (data.success) {
  setInstitutes((prev) =>
    prev.map((inst) =>
      inst.institute_id === selected.institute_id
        ? data.institute // <-- use backend response
        : inst
    )
  );

        setModalOpen(false);
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  }}
/>



    </section>
  );
};

export default InstitutesSection;
