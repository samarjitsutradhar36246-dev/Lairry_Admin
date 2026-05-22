// src/components/LocationPicker.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import { Loader2, MapPin, AlertTriangle, Search, X, Lock } from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's broken default icon paths with Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Google Maps tiles — mt0–mt3 subdomains for fast parallel loading
const GOOGLE_TILE_URL = "https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}";

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

async function fetchSuggestions(query) {
  if (!query || query.trim().length < 2) return [];
  try {
    const params = new URLSearchParams({
      q: query,
      format: "json",
      addressdetails: "1",
      limit: "8",
      countrycodes: "in",
    });
    const res = await fetch(`/nominatim/search?${params}`, {
      headers: { "Accept-Language": "en" },
    });
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function geocodeAddress({ street, city, state, pin }) {
  const parts = [street, city, state, pin, "India"].filter(Boolean);
  const query = parts.join(", ");
  try {
    const params = new URLSearchParams({
      q: query,
      format: "json",
      limit: "1",
      countrycodes: "in",
    });
    const res = await fetch(`/nominatim/search?${params}`, {
      headers: { "Accept-Language": "en" },
    });
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error("Not found");
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    throw new Error("Could not locate address");
  }
}

async function reverseGeocode(lat, lng) {
  try {
    const params = new URLSearchParams({
      lat,
      lon: lng,
      format: "json",
      addressdetails: "1",
    });
    const res = await fetch(`/nominatim/reverse?${params}`, {
      headers: { "Accept-Language": "en" },
    });
    const data = await res.json();
    return data?.address || null;
  } catch {
    return null;
  }
}

// Handles map clicks + programmatic flyTo from inside MapContainer
function MapController({ onMapClick, flyTo }) {
  const map = useMap();

  useEffect(() => {
    if (flyTo) {
      map.flyTo([flyTo.lat, flyTo.lng], 16, { duration: 1 });
    }
  }, [flyTo, map]);

  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

export default function LocationPicker({
  newInstitute,
  setNewInstitute,
  onReady,
}) {
  const hasInitialCoords = newInstitute.latitude && newInstitute.longitude;

  const [markerPos, setMarkerPos] = useState(
    hasInitialCoords
      ? {
          lat: parseFloat(newInstitute.latitude),
          lng: parseFloat(newInstitute.longitude),
        }
      : null,
  );
  const [flyTo, setFlyTo] = useState(null);
  const [geoStatus, setGeoStatus] = useState(
    hasInitialCoords ? "success" : "idle",
  );
  const [geoError, setGeoError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [sugLoading, setSugLoading] = useState(false);
  const [showSug, setShowSug] = useState(false);
  const searchBoxRef = useRef(null);

  const debouncedSearch = useDebounce(searchQuery, 400);

  const addressSignal = [
    newInstitute.street_address || "",
    newInstitute.location_city || "",
    newInstitute.location_state || "",
    newInstitute.location_pin || "",
  ].join("|");
  const debouncedAddress = useDebounce(addressSignal, 2000);

  // Place marker + update parent + fly map
  const placeAt = useCallback(
    async (lat, lng, skipReverse = false) => {
      setMarkerPos({ lat, lng });
      setFlyTo({ lat, lng });
      setNewInstitute((prev) => ({ ...prev, latitude: lat, longitude: lng }));
      setGeoStatus("success");
      setGeoError("");

      if (!skipReverse) {
        const addr = await reverseGeocode(lat, lng);
        const street = addr
          ? [addr.road, addr.neighbourhood, addr.suburb]
              .filter(Boolean)
              .join(", ") ||
            addr.county ||
            ""
          : "";
        setNewInstitute((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          street_address: street || prev.street_address,
        }));
      }
    },
    [setNewInstitute],
  );

  useEffect(() => {
    if (onReady) onReady(placeAt);
  }, [onReady, placeAt]);

  // Auto-geocode when address fields change
  useEffect(() => {
    const [street, city, state, pin] = debouncedAddress.split("|");
    const hasEnough =
      street.trim().length >= 3 ||
      (city.trim().length > 0 && state.trim().length > 0);
    if (!hasEnough) return;

    setGeoStatus("loading");
    setGeoError("");
    geocodeAddress({ street, city, state, pin })
      .then(({ lat, lng }) => placeAt(lat, lng, true))
      .catch((err) => {
        setGeoError(err.message);
        setGeoStatus("error");
      });
  }, [debouncedAddress]); // eslint-disable-line react-hooks/exhaustive-deps

  // Search suggestions
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setSuggestions([]);
      setShowSug(false);
      return;
    }
    setSugLoading(true);
    fetchSuggestions(debouncedSearch).then((res) => {
      setSuggestions(res);
      setShowSug(res.length > 0);
      setSugLoading(false);
    });
  }, [debouncedSearch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target))
        setShowSug(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function selectSuggestion(place) {
    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);
    if (isNaN(lat) || isNaN(lng)) return;
    placeAt(lat, lng);
    const parts = (place.display_name || "").split(", ");
    setSearchQuery(parts.slice(0, 3).join(", "));
    setShowSug(false);
    setSuggestions([]);
  }

  const lat = newInstitute.latitude ? parseFloat(newInstitute.latitude) : null;
  const lng = newInstitute.longitude
    ? parseFloat(newInstitute.longitude)
    : null;

  // Default: Agartala — relevant for NE India institutes
  const defaultCenter = hasInitialCoords
    ? [parseFloat(newInstitute.latitude), parseFloat(newInstitute.longitude)]
    : [23.8315, 91.2868];
  const defaultZoom = hasInitialCoords ? 16 : 13;

  return (
    <div className="space-y-3 mt-2">
      {/* Search bar */}
      <div className="relative" ref={searchBoxRef}>
        <div className="flex items-center gap-2 w-full rounded-lg px-3 py-2 bg-white/5 border border-white/10 focus-within:border-cyan-400/40 transition">
          <Search size={14} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search any town, village, locality in India…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSug(true)}
            className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none"
          />
          {sugLoading && (
            <Loader2
              size={13}
              className="animate-spin text-cyan-400 shrink-0"
            />
          )}
          {searchQuery && !sugLoading && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSuggestions([]);
                setShowSug(false);
              }}>
              <X size={13} className="text-slate-400 hover:text-white" />
            </button>
          )}
        </div>

        {showSug && suggestions.length > 0 && (
          <ul className="absolute z-[9999] top-full left-0 right-0 mt-1 rounded-lg bg-slate-900 border border-white/10 shadow-xl max-h-52 overflow-y-auto">
            {suggestions.map((place, i) => {
              const parts = (place.display_name || "").split(", ");
              const title = parts.slice(0, 2).join(", ");
              const subtitle = parts.slice(2).join(", ");
              return (
                <li
                  key={i}
                  onMouseDown={() => selectSuggestion(place)}
                  className="px-4 py-2.5 text-sm text-slate-200 hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-0">
                  <div className="font-medium truncate">{title}</div>
                  {subtitle && (
                    <div className="text-xs text-slate-400 truncate mt-0.5">
                      {subtitle}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-2 min-h-[18px]">
        {geoStatus === "loading" && (
          <span className="flex items-center gap-1.5 text-xs text-cyan-400">
            <Loader2 size={12} className="animate-spin" /> Locating address…
          </span>
        )}
        {geoStatus === "success" && lat && lng && (
          <span className="flex items-center gap-1.5 text-xs text-green-400">
            <MapPin size={12} /> Location found — click map or drag pin to
            adjust
          </span>
        )}
        {geoStatus === "error" && (
          <span className="flex items-center gap-1.5 text-xs text-amber-400">
            <AlertTriangle size={12} /> {geoError} — use search bar or click map
          </span>
        )}
        {geoStatus === "idle" && (
          <span className="text-xs text-slate-500">
            Fill address fields or search above to pin location
          </span>
        )}
      </div>

      {/* Map */}
      <div
        className="relative rounded-xl overflow-hidden border border-white/10 shadow-inner"
        style={{ height: 240 }}>
        {geoStatus === "loading" && (
          <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-slate-900/50 rounded-xl pointer-events-none">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-white/10 text-sm text-slate-300">
              <Loader2 size={15} className="animate-spin text-cyan-400" />
              Locating…
            </div>
          </div>
        )}
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom>
          <TileLayer
            url={GOOGLE_TILE_URL}
            attribution="&copy; Google Maps"
            maxZoom={20}
            subdomains={["mt0", "mt1", "mt2", "mt3"]}
          />
          <MapController flyTo={flyTo} onMapClick={placeAt} />
          {markerPos && (
            <Marker
              position={[markerPos.lat, markerPos.lng]}
              draggable
              eventHandlers={{
                dragend(e) {
                  const pos = e.target.getLatLng();
                  placeAt(pos.lat, pos.lng);
                },
              }}
            />
          )}
        </MapContainer>
      </div>

      {/* Lat/Lng read-only */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="flex flex-col gap-1 w-full sm:w-1/2">
          <label className="text-xs text-slate-400 flex items-center gap-1">
            <Lock size={10} /> Latitude (auto)
          </label>
          <input
            readOnly
            disabled
            value={lat ? lat.toFixed(6) : ""}
            placeholder="Auto-populated"
            className="w-full rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-slate-400 text-sm cursor-not-allowed"
          />
        </div>
        <div className="flex flex-col gap-1 w-full sm:w-1/2">
          <label className="text-xs text-slate-400 flex items-center gap-1">
            <Lock size={10} /> Longitude (auto)
          </label>
          <input
            readOnly
            disabled
            value={lng ? lng.toFixed(6) : ""}
            placeholder="Auto-populated"
            className="w-full rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-slate-400 text-sm cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
}
