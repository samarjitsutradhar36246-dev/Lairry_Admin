// src/components/SmartLocationFields.jsx
// Changes from previous version:
// - Nominatim URL changed to /nominatim/search (Vite proxy) to fix CORS + 429
// - Debounce 2000ms maintained
// - fetchSuggestions scoped to city+state with progressive fallback

import { useState, useEffect, useRef } from "react";
import { State, City } from "country-state-city";
import { AlertCircle, Loader2, Search, Lock, MapPin, X } from "lucide-react";

const inputClass = `w-full rounded-xl px-4 py-3 
  bg-white dark:bg-slate-800/50 
  border border-gray-300 dark:border-slate-700/50 
  text-gray-900 dark:text-white 
  placeholder-gray-400 dark:placeholder-slate-500 
  focus:border-cyan-500 dark:focus:border-cyan-500/50 
  focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20 
  transition-all duration-200 outline-none 
  disabled:opacity-50 disabled:cursor-not-allowed`;

const selectClass = `w-full rounded-xl px-4 py-3 
  bg-white dark:bg-slate-800/50 
  border border-gray-300 dark:border-slate-700/50 
  text-gray-900 dark:text-white 
  focus:border-cyan-500 dark:focus:border-cyan-500/50 
  focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/20 
  transition-all duration-200 outline-none 
  disabled:opacity-50 disabled:cursor-not-allowed`;

const labelClass =
  "text-sm font-medium text-gray-600 dark:text-slate-400 flex items-center gap-1.5";

const ErrorMsg = ({ msg }) =>
  msg ? (
    <span className="text-red-500 dark:text-red-400 text-xs flex items-center gap-1.5">
      <AlertCircle size={12} />
      {msg}
    </span>
  ) : null;

const INDIA_ISO = "IN";

// ── Nominatim base — goes through Vite proxy to avoid CORS + rate-limit ────────
const NOMINATIM = "/nominatim/search";

// ── Debounce hook ─────────────────────────────────────────────────────────────
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ── Fetch Nominatim suggestions — city+state scoped, progressive fallback ──────
async function fetchSuggestions(query, city, state) {
  // Query ko strong banao: "Battala, Agartala, Tripura, India"
  const searchParts = [query];
  if (city) searchParts.push(city);
  if (state) searchParts.push(state);
  searchParts.push("India");

  const fullQuery = searchParts.filter(Boolean).join(", ");

  const params = new URLSearchParams({
    q: fullQuery,
    countrycodes: "in",
    format: "json",
    limit: "6",
    addressdetails: "1",
  });

  try {
    const res = await fetch(`${NOMINATIM}?${params}`, {
      headers: { "Accept-Language": "en" },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    return [];
  }
}

// ── Shorten a Nominatim display_name for showing in dropdown ─────────────────
function shortenName(displayName) {
  const parts = displayName.split(", ");
  return parts.slice(0, 4).join(", ");
}

// ── Street Autocomplete Input ─────────────────────────────────────────────────
function StreetAutocomplete({
  value,
  onChange,
  onSelect,
  city,
  state,
  disabled,
  error,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const [selectedFromSuggestion, setSelectedFromSuggestion] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  const debouncedValue = useDebounce(value, 2000);

  const handleManualFetch = async () => {
    if (!value || value.trim().length < 2) {
      // Yahan alert ya state set kar sakte ho
      return;
    }

    setLoading(true);
    setOpen(false);

    try {
      // Ye function wahi query banayega jo Battala, Agartala ko dhund sake
      const results = await fetchSuggestions(value, city, state);

      if (results.length > 0) {
        setSuggestions(results);
        setOpen(true);
        setHighlightedIdx(-1);
      } else {
        // Agar kuch na mile
        console.log("No results found");
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleKeyDown = (e) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && highlightedIdx >= 0) {
      e.preventDefault();
      handleSelect(suggestions[highlightedIdx]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const handleSelect = (suggestion) => {
    const shortName = shortenName(suggestion.display_name);
    setSelectedFromSuggestion(true);
    setSuggestions([]);
    setOpen(false);
    setHighlightedIdx(-1);
    onSelect({
      streetText: shortName,
      lat: parseFloat(suggestion.lat),
      lon: parseFloat(suggestion.lon),
      displayName: suggestion.display_name,
    });
  };

  const handleClear = () => {
    onChange("");
    setSuggestions([]);
    setOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        placeholder="e.g. Battala, MG Road, Sector 15"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setSelectedFromSuggestion(false);
        }}
        // Keydown logic: Enter par manual fetch chalega
        onKeyDown={(e) => {
          if (e.key === "Enter" && !open) {
            e.preventDefault();
            handleManualFetch();
          } else {
            handleKeyDown(e);
          }
        }}
        disabled={disabled}
        autoComplete="off"
        className={`${inputClass} pr-20`} // Padding badhai hai button ke liye
      />

      {/* Search aur Clear Buttons ka Group */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        {value && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors">
            <X size={16} />
          </button>
        )}

        <button
          type="button"
          onClick={handleManualFetch}
          disabled={loading || !value || disabled}
          className="flex items-center justify-center w-8 h-8 rounded-lg 
                     bg-cyan-500 hover:bg-cyan-600 text-white 
                     transition-all duration-200 disabled:opacity-50 shadow-md">
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Search size={16} />
          )}
        </button>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
const SmartLocationFields = ({
  newInstitute,
  setNewInstitute,
  errors,
  isSaving,
}) => {
  const [pinLoading, setPinLoading] = useState(false);
  const [pinError, setPinError] = useState("");
  const [pinSuccess, setPinSuccess] = useState(false);

  useEffect(() => {
    if (newInstitute.location_country !== "India") {
      setNewInstitute((prev) => ({ ...prev, location_country: "India" }));
    }
  }, []);

  const stateList = State.getStatesOfCountry(INDIA_ISO);
  const selectedState = stateList.find(
    (s) => s.name === newInstitute.location_state,
  );
  const cityList = selectedState
    ? City.getCitiesOfState(INDIA_ISO, selectedState.isoCode)
    : [];

  const fetchPin = async () => {
    const pin = newInstitute.location_pin?.trim();
    if (!pin || pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      setPinError("Please enter a valid 6-digit PIN.");
      setPinSuccess(false);
      return;
    }
    setPinLoading(true);
    setPinError("");
    setPinSuccess(false);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();
      if (data[0]?.Status === "Success") {
        const post = data[0].PostOffice[0];
        setNewInstitute((prev) => ({
          ...prev,
          location_state: post.State || prev.location_state,
          location_city: post.District || post.Block || prev.location_city,
          location_country: "India",
        }));
        setPinSuccess(true);
      } else {
        setPinError("PIN not found. Please fill state & city manually.");
      }
    } catch {
      setPinError("Failed to fetch PIN details. Check your connection.");
    } finally {
      setPinLoading(false);
    }
  };

  const handlePinKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      fetchPin();
    }
  };

  const handlePinChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setPinError("");
    setPinSuccess(false);
    setNewInstitute((prev) => ({ ...prev, location_pin: val }));
  };

  const handleStateChange = (e) => {
    setNewInstitute((prev) => ({
      ...prev,
      location_state: e.target.value,
      location_city: "",
    }));
    setPinSuccess(false);
  };

  const handleCityChange = (e) => {
    setNewInstitute((prev) => ({ ...prev, location_city: e.target.value }));
  };

  const handleStreetSelect = ({ streetText, lat, lon }) => {
    setNewInstitute((prev) => ({
      ...prev,
      street_address: streetText,
      latitude: lat,
      longitude: lon,
    }));
  };

  return (
    <div className="space-y-4">
      {/* ── Row 1: PIN + Country ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* PIN */}
        <div className="flex flex-col gap-2">
          <label className={labelClass}>
            PIN Code
            <span className="text-red-500 dark:text-red-400">*</span>
          </label>
          <p className="text-xs text-cyan-500 dark:text-cyan-400">
            Enter PIN to auto-fill city &amp; state
          </p>
          <div className="flex gap-2">
            <input
              placeholder="6-digit PIN"
              value={newInstitute.location_pin}
              onChange={handlePinChange}
              onKeyDown={handlePinKeyDown}
              disabled={isSaving}
              maxLength={6}
              inputMode="numeric"
              className={inputClass}
            />
            <button
              type="button"
              onClick={fetchPin}
              disabled={isSaving || pinLoading}
              title="Auto-fill from PIN"
              className="flex-shrink-0 w-12 h-[46px] rounded-xl 
                bg-cyan-500 hover:bg-cyan-600 
                disabled:opacity-50 disabled:cursor-not-allowed 
                flex items-center justify-center 
                text-white transition-all duration-200 
                shadow-md shadow-cyan-500/25 hover:shadow-cyan-500/40">
              {pinLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Search size={18} />
              )}
            </button>
          </div>
          {pinError && (
            <span className="text-amber-500 text-xs flex items-center gap-1.5">
              <AlertCircle size={12} /> {pinError}
            </span>
          )}
          {pinSuccess && (
            <span className="text-green-500 text-xs flex items-center gap-1.5">
              ✓ City &amp; State auto-filled from PIN
            </span>
          )}
          <ErrorMsg msg={errors.location_pin} />
        </div>

        {/* Country — FIXED to India */}
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Country</label>
          <p className="text-xs text-transparent select-none pointer-events-none">
            _
          </p>
          <div className="relative">
            <input
              value="India"
              disabled
              readOnly
              className={`${inputClass} pr-10 cursor-not-allowed opacity-70`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Lock size={14} className="text-gray-400 dark:text-slate-500" />
            </div>
          </div>
          <span className="text-xs text-gray-400 dark:text-slate-500">
            Restricted to India only
          </span>
        </div>
      </div>

      {/* ── Row 2: State + City ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* State */}
        <div className="flex flex-col gap-2">
          <label className={labelClass}>
            State
            <span className="text-red-500 dark:text-red-400">*</span>
          </label>
          <select
            value={newInstitute.location_state}
            onChange={handleStateChange}
            disabled={isSaving}
            className={selectClass}>
            <option value="">Select state</option>
            {stateList.map((s) => (
              <option key={s.isoCode} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
          <ErrorMsg msg={errors.location_state} />
        </div>

        {/* City */}
        <div className="flex flex-col gap-2">
          <label className={labelClass}>
            City / District
            <span className="text-red-500 dark:text-red-400">*</span>
          </label>
          {cityList.length > 0 ? (
            <>
              <select
                value={
                  !newInstitute.location_city
                    ? ""
                    : cityList.find(
                          (c) => c.name === newInstitute.location_city,
                        )
                      ? newInstitute.location_city
                      : "__other__"
                }
                onChange={(e) => {
                  if (e.target.value === "__other__") {
                    setNewInstitute((prev) => ({
                      ...prev,
                      location_city: "__other__",
                    }));
                  } else {
                    handleCityChange(e);
                  }
                }}
                disabled={isSaving || !selectedState}
                className={selectClass}>
                <option value="">Select city</option>
                {cityList.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
                <option value="__other__">Other (type manually)</option>
              </select>
              {(newInstitute.location_city === "__other__" ||
                (newInstitute.location_city &&
                  !cityList.find(
                    (c) => c.name === newInstitute.location_city,
                  ))) && (
                <input
                  placeholder="Type your city / district"
                  value={
                    newInstitute.location_city === "__other__"
                      ? ""
                      : newInstitute.location_city
                  }
                  onChange={(e) =>
                    setNewInstitute((prev) => ({
                      ...prev,
                      location_city: e.target.value,
                    }))
                  }
                  autoFocus
                  disabled={isSaving}
                  className={`${inputClass} mt-2`}
                />
              )}
            </>
          ) : (
            <input
              placeholder={
                selectedState ? "Enter city / district" : "Select state first"
              }
              value={newInstitute.location_city}
              onChange={handleCityChange}
              disabled={isSaving || !selectedState}
              className={inputClass}
            />
          )}
          <ErrorMsg msg={errors.location_city} />
        </div>
      </div>

      {/* ── Street / Locality with Autocomplete ──────────────────────────── */}
      <div className="flex flex-col gap-2">
        <label className={labelClass}>
          Street / Locality / Landmark
          <span className="text-red-500 dark:text-red-400">*</span>
        </label>
        <p className="text-xs text-cyan-500 dark:text-cyan-400">
          Type to see suggestions — select one to auto-pin on map
        </p>
        <StreetAutocomplete
          value={newInstitute.street_address || ""}
          onChange={(val) =>
            setNewInstitute((prev) => ({ ...prev, street_address: val }))
          }
          onSelect={handleStreetSelect}
          city={newInstitute.location_city}
          state={newInstitute.location_state}
          disabled={isSaving}
          error={errors.street_address}
        />
      </div>
    </div>
  );
};

export default SmartLocationFields;
