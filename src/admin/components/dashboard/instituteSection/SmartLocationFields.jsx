// src/components/SmartLocationFields.jsx
import { useState, useEffect, useRef } from "react";
import { State, City } from "country-state-city";
import { AlertCircle, Loader2, Search, Lock, X } from "lucide-react";

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

// ── Debounce hook ─────────────────────────────────────────────────────────────
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  const placeAtRef = useRef(null);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ── Nominatim search — scoped to city+state for hyper-local results ───────────
// Strategy: Try narrow query (locality + city + state) first.
// If results < 2, fall back to broader query (locality + state).
async function searchLocality(query, city, state) {
  if (!query || query.trim().length < 2) return [];

  const makeParams = (q) =>
    new URLSearchParams({
      q,
      countrycodes: "in",
      format: "json",
      limit: "7",
      addressdetails: "1",
    });

  // Narrow: "Battala, Agartala, Tripura, India"
  const narrowParts = [query.trim(), city, state, "India"].filter(Boolean);
  const narrowQuery = narrowParts.join(", ");

  try {
    const res = await fetch(`/nominatim/search?${makeParams(narrowQuery)}`, {
      headers: { "Accept-Language": "en" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (Array.isArray(data) && data.length >= 2) return data;

    // Fallback: "Battala, Tripura, India" (drop city, keep state)
    const broadParts = [query.trim(), state, "India"].filter(Boolean);
    const broadQuery = broadParts.join(", ");
    const res2 = await fetch(`/nominatim/search?${makeParams(broadQuery)}`, {
      headers: { "Accept-Language": "en" },
    });
    if (!res2.ok) return data ?? [];
    const data2 = await res2.json();
    // Merge and deduplicate by place_id
    const merged = [...(data ?? []), ...(Array.isArray(data2) ? data2 : [])];
    const seen = new Set();
    return merged.filter((p) => {
      if (seen.has(p.place_id)) return false;
      seen.add(p.place_id);
      return true;
    });
  } catch {
    return [];
  }
}

// Show first 3–4 meaningful parts of a Nominatim display_name
function shortenName(displayName = "") {
  return displayName.split(", ").slice(0, 4).join(", ");
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
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Live debounced search — fires automatically as user types (600ms)
  const debouncedValue = useDebounce(value, 600);

  useEffect(() => {
    if (!debouncedValue || debouncedValue.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    searchLocality(debouncedValue, city, state).then((results) => {
      if (cancelled) return;
      setSuggestions(results);
      setOpen(results.length > 0);
      setHighlightedIdx(-1);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [debouncedValue, city, state]);

  // Manual search — Search button / Enter key (no debounce wait)
  const runSearch = async () => {
    if (!value || value.trim().length < 2) return;
    setLoading(true);
    setOpen(false);
    const results = await searchLocality(value, city, state);
    setSuggestions(results);
    setOpen(results.length > 0);
    setHighlightedIdx(-1);
    setLoading(false);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (open && highlightedIdx >= 0) {
        e.preventDefault();
        handleSelect(suggestions[highlightedIdx]);
      } else {
        e.preventDefault();
        runSearch();
      }
      return;
    }
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const handleSelect = (suggestion) => {
    const shortName = shortenName(suggestion.display_name);
    onChange(shortName);
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
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <input
          ref={inputRef}
          placeholder="e.g. Battala, MG Road, Ramnagar Chowmuhani"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          disabled={disabled}
          autoComplete="off"
          className={`${inputClass} pr-20`}
        />

        {/* Action buttons */}
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
            onClick={runSearch}
            disabled={loading || !value || disabled}
            title="Search this locality"
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

      {/* Dropdown */}
      {open && suggestions.length > 0 && (
        <ul
          className="absolute z-[9999] top-full left-0 right-0 mt-1 rounded-xl
          bg-white dark:bg-slate-900 
          border border-gray-200 dark:border-slate-700 
          shadow-xl max-h-60 overflow-y-auto">
          {suggestions.map((place, i) => {
            const parts = (place.display_name || "").split(", ");
            const title = parts.slice(0, 2).join(", ");
            const subtitle = parts.slice(2, 5).join(", ");
            return (
              <li
                key={place.place_id ?? i}
                onMouseDown={() => handleSelect(place)}
                className={`px-4 py-3 cursor-pointer border-b border-gray-100 dark:border-slate-800 
                  last:border-0 transition-colors
                  ${
                    highlightedIdx === i
                      ? "bg-cyan-50 dark:bg-cyan-500/10"
                      : "hover:bg-gray-50 dark:hover:bg-slate-800/60"
                  }`}>
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {title}
                </div>
                {subtitle && (
                  <div className="text-xs text-gray-500 dark:text-slate-400 truncate mt-0.5">
                    {subtitle}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {error && <ErrorMsg msg={error} />}
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

  // Always India
  useEffect(() => {
    if (newInstitute.location_country !== "India") {
      setNewInstitute((prev) => ({ ...prev, location_country: "India" }));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    // Map ko directly fly karo — no debounce wait
    if (placeAtRef.current) placeAtRef.current(lat, lon);
  };

  return (
    <div className="space-y-4">
      {/* ── Row 1: PIN + Country ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* PIN */}
        <div className="flex flex-col gap-2">
          <label className={labelClass}>
            PIN Code <span className="text-red-500 dark:text-red-400">*</span>
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
              disabled={
                isSaving || !!(newInstitute.latitude && newInstitute.longitude)
              }
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

        {/* Country — fixed to India */}
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

      {/* ── Row 2: State + City ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* State */}
        <div className="flex flex-col gap-2">
          <label className={labelClass}>
            State <span className="text-red-500 dark:text-red-400">*</span>
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
            City / District{" "}
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

      {/* ── Street / Locality with live autocomplete ───────────────────── */}
      <div className="flex flex-col gap-2">
        <label className={labelClass}>
          Street / Locality / Landmark
          <span className="text-red-500 dark:text-red-400">*</span>
        </label>
        <p className="text-xs text-cyan-500 dark:text-cyan-400">
          Type locality name — dropdown will appear, select to auto-pin on map
        </p>
        <StreetAutocomplete
          value={newInstitute.street_address || ""}
          onChange={(val) =>
            setNewInstitute((prev) => ({ ...prev, street_address: val }))
          }
          onSelect={handleStreetSelect}
          city={newInstitute.location_city}
          state={newInstitute.location_state}
          disabled={
            isSaving || !!(newInstitute.latitude && newInstitute.longitude)
          }
          error={errors.street_address}
        />
        {!!(newInstitute.latitude && newInstitute.longitude) && (
          <span className="text-xs text-cyan-400 flex items-center gap-1 mt-1">
            📍 Map se auto-filled — pin reset karein to edit karein
          </span>
        )}
      </div>
    </div>
  );
};

export default SmartLocationFields;
