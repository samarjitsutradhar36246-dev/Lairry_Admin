import { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import { AlertCircle, Loader2, Search } from "lucide-react";

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
  disabled:opacity-50 disabled:cursor-not-allowed
  max-w-full`;

const labelClass =
  "text-sm font-medium text-gray-600 dark:text-slate-400 flex items-center gap-1.5";

const ErrorMsg = ({ msg }) =>
  msg ? (
    <span className="text-red-500 dark:text-red-400 text-xs flex items-center gap-1.5">
      <AlertCircle size={12} />
      {msg}
    </span>
  ) : null;

const SmartLocationFields = ({
  newInstitute,
  setNewInstitute,
  errors,
  isSaving,
}) => {
  const [pinLoading, setPinLoading] = useState(false);
  const [pinError, setPinError] = useState("");

  const allCountries = Country.getAllCountries();

  const selectedCountry = allCountries.find(
    (c) => c.name === newInstitute.location_country,
  );

  const stateList = selectedCountry
    ? State.getStatesOfCountry(selectedCountry.isoCode)
    : [];

  const selectedState = stateList.find(
    (s) => s.name === newInstitute.location_state,
  );

  const cityList =
    selectedCountry && selectedState
      ? City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode)
      : [];

  // Default country to India on mount if empty
  useEffect(() => {
    if (!newInstitute.location_country) {
      setNewInstitute((prev) => ({ ...prev, location_country: "India" }));
    }
  }, []);

  // PIN lookup — only called explicitly via button or Enter key
  const fetchPin = async () => {
    const pin = newInstitute.location_pin?.trim();
    if (!pin || pin.length !== 6) {
      setPinError("Please enter a valid 6-digit PIN.");
      return;
    }

    setPinLoading(true);
    setPinError("");

    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();

      if (data[0]?.Status === "Success") {
        const post = data[0].PostOffice[0];
        setNewInstitute((prev) => ({
          ...prev,
          location_city: post.District || prev.location_city,
          location_state: post.State || prev.location_state,
          location_country: "India",
        }));
      } else {
        setPinError("PIN not found. Please fill manually.");
      }
    } catch {
      setPinError("Failed to fetch PIN details.");
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

  const handleCountryChange = (e) => {
    setNewInstitute((prev) => ({
      ...prev,
      location_country: e.target.value,
      location_state: "",
      location_city: "",
    }));
  };

  const handleStateChange = (e) => {
    setNewInstitute((prev) => ({
      ...prev,
      location_state: e.target.value,
      location_city: "",
    }));
  };

  const handleCityChange = (e) => {
    setNewInstitute((prev) => ({
      ...prev,
      location_city: e.target.value,
    }));
  };

  return (
    <div className="space-y-4">
      {/* Row 1: PIN + Country side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* PIN */}
        <div className="flex flex-col gap-2">
          <label className={labelClass}>
            PIN Code
            <span className="text-red-500 dark:text-red-400">*</span>
          </label>
          {/* Info text — purely informational, not clickable */}
          <p className="text-xs text-cyan-500 dark:text-cyan-400">
            Enter PIN to auto-fill city, state &amp; country
          </p>
          <div className="flex gap-2">
            <input
              placeholder="6-digit PIN"
              value={newInstitute.location_pin}
              onChange={(e) => {
                setPinError("");
                setNewInstitute((prev) => ({
                  ...prev,
                  location_pin: e.target.value,
                }));
              }}
              onKeyDown={handlePinKeyDown}
              disabled={isSaving}
              maxLength={6}
              className={inputClass}
            />
            {/* Search icon button to trigger lookup */}
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
              <AlertCircle size={12} />
              {pinError}
            </span>
          )}
          <ErrorMsg msg={errors.location_pin} />
        </div>

        {/* Country */}
        <div className="flex flex-col gap-2">
          <label className={labelClass}>
            Country
            <span className="text-red-500 dark:text-red-400">*</span>
          </label>
          {/* Spacer to vertically align with PIN info text */}
          <p className="text-xs text-transparent select-none pointer-events-none">
            _
          </p>
          <select
            value={newInstitute.location_country}
            onChange={handleCountryChange}
            disabled={isSaving}
            className={selectClass}>
            <option value="">Select country</option>
            {allCountries.map((c) => (
              <option key={c.isoCode} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <ErrorMsg msg={errors.location_country} />
        </div>
      </div>

      {/* Row 2: State + City side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* State */}
        <div className="flex flex-col gap-2">
          <label className={labelClass}>
            State
            <span className="text-red-500 dark:text-red-400">*</span>
          </label>
          {stateList.length > 0 ? (
            <select
              value={newInstitute.location_state}
              onChange={handleStateChange}
              disabled={isSaving || !selectedCountry}
              className={selectClass}>
              <option value="">Select state</option>
              {stateList.map((s) => (
                <option key={s.isoCode} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              placeholder={
                selectedCountry ? "Enter state" : "Select country first"
              }
              value={newInstitute.location_state}
              onChange={(e) =>
                setNewInstitute((prev) => ({
                  ...prev,
                  location_state: e.target.value,
                }))
              }
              disabled={isSaving || !selectedCountry}
              className={inputClass}
            />
          )}
          <ErrorMsg msg={errors.location_state} />
        </div>

        {/* City */}
        <div className="flex flex-col gap-2">
          <label className={labelClass}>
            City
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
                  placeholder="Type your city"
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
                  className={`${inputClass} text-sm py-2`}
                />
              )}
            </>
          ) : (
            <input
              placeholder={selectedState ? "Enter city" : "Select state first"}
              value={newInstitute.location_city}
              onChange={handleCityChange}
              disabled={isSaving || !selectedState}
              className={inputClass}
            />
          )}
          <ErrorMsg msg={errors.location_city} />
        </div>
      </div>
    </div>
  );
};

export default SmartLocationFields;
