// src/components/LocationPicker.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { InstituteMarkerIcon } from "../common/InstituteMarkerIcon";
import { Loader2, MapPin, AlertTriangle, Lock } from "lucide-react";

// ── Nominatim base — goes through Vite proxy to avoid CORS + rate-limit ────────
const NOMINATIM = "/nominatim/search";

// ── Debounce hook ─────────────────────────────────────────────────────────────
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ── Internal component: flies map to new position when coords change ──────────
function MapUpdater({ lat, lon }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lon) {
      map.flyTo([lat, lon], 15, { duration: 1.2 });
    }
  }, [lat, lon, map]);
  return null;
}

// ── Helper: Handles clicking on map to manually set location ──────────────────
function MapEventsHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

// ── Geocode address → lat/lon via Nominatim (4 progressive strategies) ────────
async function geocode(addressParts) {
  const { street, city, state, pin } = addressParts;

  async function tryQuery(params) {
    for (const [k, v] of [...params.entries()]) {
      if (!String(v).trim()) params.delete(k);
    }
    const res = await fetch(`${NOMINATIM}?${params.toString()}`, {
      headers: { "Accept-Language": "en" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.length ? data[0] : null;
  }

  // Strategy 1 — structured params
  const structuredParams = new URLSearchParams({
    format: "json",
    limit: "1",
    addressdetails: "1",
    country: "India",
  });
  if (street) structuredParams.set("street", street);
  if (city) structuredParams.set("city", city);
  if (state) structuredParams.set("state", state);
  if (pin) structuredParams.set("postalcode", pin);

  let hit = await tryQuery(structuredParams);

  // Strategy 2 — free-text: street + city + state
  if (!hit) {
    const q = [street, city, state, "India"].filter(Boolean).join(", ");
    hit = await tryQuery(
      new URLSearchParams({
        q,
        countrycodes: "in",
        format: "json",
        limit: "1",
        addressdetails: "1",
      }),
    );
  }

  // Strategy 3 — free-text: street + state (skip city)
  if (!hit) {
    const q = [street, state, "India"].filter(Boolean).join(", ");
    hit = await tryQuery(
      new URLSearchParams({
        q,
        countrycodes: "in",
        format: "json",
        limit: "1",
        addressdetails: "1",
      }),
    );
  }

  // Strategy 4 — bare locality + India
  if (!hit && street) {
    hit = await tryQuery(
      new URLSearchParams({
        q: `${street}, India`,
        countrycodes: "in",
        format: "json",
        limit: "1",
      }),
    );
  }

  if (!hit) throw new Error("No location found for this address");

  return {
    lat: parseFloat(hit.lat),
    lon: parseFloat(hit.lon),
    displayName: hit.display_name,
  };
}

// ── Main Component ────────────────────────────────────────────────────────────
function LocationPicker({ newInstitute, setNewInstitute }) {
  const [geoStatus, setGeoStatus] = useState(
    newInstitute.latitude && newInstitute.longitude ? "success" : "idle",
  );
  const [geoError, setGeoError] = useState("");
  const geocodeAbortRef = useRef(null);

  const addressSignal = [
    newInstitute.street_address || "",
    newInstitute.location_city || "",
    newInstitute.location_state || "",
    newInstitute.location_pin || "",
  ].join("|");

  const debouncedSignal = useDebounce(addressSignal, 2000);

  useEffect(() => {
    const parts = debouncedSignal.split("|");
    const [street, city, state, pin] = parts;

    const hasEnough =
      street.trim().length >= 3 ||
      (city.trim().length > 0 && state.trim().length > 0);

    if (!hasEnough) return;

    if (geocodeAbortRef.current) {
      geocodeAbortRef.current = false;
    }
    const thisRequest = {};
    geocodeAbortRef.current = thisRequest;

    setGeoStatus("loading");
    setGeoError("");

    geocode({ street, city, state, pin })
      .then((result) => {
        if (geocodeAbortRef.current !== thisRequest) return;
        setNewInstitute((prev) => ({
          ...prev,
          latitude: result.lat,
          longitude: result.lon,
        }));
        setGeoStatus("success");
      })
      .catch((err) => {
        if (geocodeAbortRef.current !== thisRequest) return;
        setGeoError(err.message || "Could not locate address");
        setGeoStatus("error");
      });
  }, [debouncedSignal]);

  const lat = newInstitute.latitude ? parseFloat(newInstitute.latitude) : null;
  const lon = newInstitute.longitude
    ? parseFloat(newInstitute.longitude)
    : null;

  const defaultCenter = [22.9734, 78.6569];
  const markerPosition = lat && lon ? [lat, lon] : null;

  return (
    <div className="space-y-3">
      {/* ── Status bar ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 min-h-[20px]">
        {geoStatus === "loading" && (
          <span className="flex items-center gap-1.5 text-xs text-cyan-500 dark:text-cyan-400">
            <Loader2 size={13} className="animate-spin" />
            Locating address on map…
          </span>
        )}
        {geoStatus === "success" && lat && lon && (
          <span className="flex items-center gap-1.5 text-xs text-green-500">
            <MapPin size={13} />
            Location found — you can also click on map to adjust
          </span>
        )}
        {geoStatus === "error" && (
          <span className="flex items-center gap-1.5 text-xs text-amber-500">
            <AlertTriangle size={13} />
            {geoError} — Try adjusting manually by clicking on map
          </span>
        )}
        {geoStatus === "idle" && (
          <span className="text-xs text-gray-400 dark:text-slate-500">
            Fill in details above or click map to set location
          </span>
        )}
      </div>

      {/* ── Map ─────────────────────────────────────────────────────────────── */}
      <div className="relative rounded-xl overflow-hidden border border-gray-300 dark:border-slate-700/50 shadow-inner">
        {geoStatus === "loading" && (
          <div className="absolute inset-0 z-[1000] bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm flex items-center justify-center rounded-xl">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 shadow text-sm text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700">
              <Loader2 size={15} className="animate-spin text-cyan-500" />
              Locating…
            </div>
          </div>
        )}

        <MapContainer
          center={markerPosition || defaultCenter}
          zoom={markerPosition ? 15 : 5}
          scrollWheelZoom={true}
          dragging={true}
          zoomControl={true}
          style={{ height: "220px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          <MapEventsHandler
            onLocationSelect={(coords) => {
              setNewInstitute((prev) => ({
                ...prev,
                latitude: coords.lat,
                longitude: coords.lng,
              }));
              setGeoStatus("success");
            }}
          />

          {markerPosition && (
            <>
              <Marker position={markerPosition} icon={InstituteMarkerIcon} />
              <MapUpdater lat={lat} lon={lon} />
            </>
          )}
        </MapContainer>
      </div>

      {/* ── Lat / Lng — READ ONLY ────────────────────────────────────────────── */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="flex flex-col gap-1 w-full sm:w-1/2">
          <label className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1">
            <Lock size={10} />
            Latitude (auto)
          </label>
          <input
            readOnly
            disabled
            value={lat ? lat.toFixed(6) : ""}
            placeholder="Auto-populated"
            className="w-full rounded-lg px-3 py-2 
              bg-gray-50 dark:bg-slate-800/30 
              border border-gray-200 dark:border-slate-700/30 
              text-gray-600 dark:text-slate-400 
              text-sm cursor-not-allowed select-none"
          />
        </div>
        <div className="flex flex-col gap-1 w-full sm:w-1/2">
          <label className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1">
            <Lock size={10} />
            Longitude (auto)
          </label>
          <input
            readOnly
            disabled
            value={lon ? lon.toFixed(6) : ""}
            placeholder="Auto-populated"
            className="w-full rounded-lg px-3 py-2 
              bg-gray-50 dark:bg-slate-800/30 
              border border-gray-200 dark:border-slate-700/30 
              text-gray-600 dark:text-slate-400 
              text-sm cursor-not-allowed select-none"
          />
        </div>
      </div>
    </div>
  );
}

export default LocationPicker;
