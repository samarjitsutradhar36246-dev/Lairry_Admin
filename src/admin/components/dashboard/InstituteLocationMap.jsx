// src/admin/components/dashboard/InstituteLocationMap.jsx
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ArrowLeft, ArrowRight, MapPin, Globe, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase/SupabaseClient";
import Loading from "../common/Loading";
import { InstituteMarkerIcon } from "../common/InstituteMarkerIcon";

// Google Maps tiles — shows small towns, villages, localities
const GOOGLE_TILE_URL = "https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}";

// Programmatically fit the map bounds when institutes list changes
function BoundsFitter({ institutes }) {
  const map = useMap();

  useEffect(() => {
    const valid = institutes.filter((i) => i.latitude && i.longitude);
    if (valid.length > 1) {
      const bounds = L.latLngBounds(
        valid.map((i) => [Number(i.latitude), Number(i.longitude)]),
      );
      map.fitBounds(bounds, { padding: [60, 60] });
    } else if (valid.length === 1) {
      map.setView([Number(valid[0].latitude), Number(valid[0].longitude)], 12);
    }
  }, [institutes, map]);

  return null;
}

const InstituteLocationMap = ({ mode = "full" }) => {
  const navigate = useNavigate();
  const isPreview = mode === "preview";
  const PAGE_SIZE = isPreview ? 5 : 10;

  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    const fetchInstitutes = async () => {
      setLoading(true);

      let query = supabase
        .from("institutes")
        .select("id, latitude, longitude, institute_name, location_city")
        .not("latitude", "is", null)
        .not("longitude", "is", null)
        .not("activated_at", "is", null)
        .order("activated_at", { ascending: false });

      if (isPreview) {
        query = query.range(0, PAGE_SIZE - 1);
      } else if (showAll) {
        // no range — fetch all
      } else {
        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE;
        query = query.range(from, to);
      }

      const { data, error } = await query;
      let fetched = [];
      if (error) {
        console.error("Error fetching institutes:", error);
      } else {
        fetched = data || [];
        setHasNextPage(fetched.length > PAGE_SIZE);
        setInstitutes(fetched.slice(0, PAGE_SIZE));
      }
      setLoading(false);
    };

    fetchInstitutes();
  }, [page, isPreview, PAGE_SIZE, showAll]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* BACK BUTTON — FULL MODE ONLY */}
      {!isPreview && (
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-sm 
            text-gray-600 dark:text-slate-400 
            hover:text-cyan-500 dark:hover:text-cyan-400 
            transition-all duration-200 cursor-pointer">
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform duration-200"
          />
          <span className="font-medium">Back</span>
        </button>
      )}

      {/* MAP CARD */}
      <div
        className={`relative overflow-hidden rounded-2xl 
          bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
          backdrop-blur-xl 
          border border-gray-200 dark:border-slate-700/50 
          shadow-xl dark:shadow-2xl 
          flex flex-col 
          transition-all duration-300 ${
            isPreview &&
            "cursor-pointer hover:border-cyan-500/50 hover:shadow-2xl dark:hover:shadow-cyan-500/10"
          }`}>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 dark:from-cyan-500/5 dark:via-transparent dark:to-purple-500/5 pointer-events-none" />

        {/* HEADER */}
        <div className="relative flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-500/20 dark:to-purple-500/20 flex items-center justify-center">
              <MapPin size={20} className="text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Institute Location Map
              </h3>
              {!isPreview && (
                <p className="text-xs text-gray-600 dark:text-slate-400 mt-0.5">
                  Visualize all institute locations on an interactive map
                </p>
              )}
            </div>
          </div>

          {isPreview ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate("/admin/institute-location-map");
              }}
              className="group flex items-center gap-2 px-4 py-2 rounded-xl 
                bg-cyan-50 dark:bg-cyan-500/10 
                border border-cyan-200 dark:border-cyan-500/20 
                text-cyan-600 dark:text-cyan-400 
                hover:bg-cyan-100 dark:hover:bg-cyan-500/20 
                hover:border-cyan-300 dark:hover:border-cyan-500/30 
                transition-all duration-200 text-sm font-medium cursor-pointer">
              <span>View Full</span>
              <ArrowRight
                size={16}
                className="group-hover:translate-x-0.5 transition-transform duration-200"
              />
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20">
              <span className="h-2 w-2 rounded-full bg-green-500 dark:bg-green-400 animate-pulse" />
              <span className="text-xs font-medium text-green-600 dark:text-green-400">
                Real Data
              </span>
            </div>
          )}
        </div>

        {/* CONTROLS — FULL MODE ONLY */}
        {!isPreview && (
          <div className="relative flex gap-3 px-6 py-4 justify-end bg-gray-50 dark:bg-slate-800/30 border-b border-gray-200 dark:border-slate-700/30 flex-wrap">
            <button
              disabled={page === 1 || showAll}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="group flex items-center gap-2 px-4 py-2 rounded-xl 
                bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 
                text-gray-700 dark:text-slate-300 font-medium transition-all duration-200 
                hover:bg-gray-50 dark:hover:bg-slate-700/50 
                disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-0.5 transition-transform duration-200"
              />
              <span className="text-sm">Prev {PAGE_SIZE}</span>
            </button>

            <button
              disabled={!hasNextPage || showAll}
              onClick={() => setPage((p) => p + 1)}
              className="group flex items-center gap-2 px-4 py-2 rounded-xl 
                bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 
                text-gray-700 dark:text-slate-300 font-medium transition-all duration-200 
                hover:bg-gray-50 dark:hover:bg-slate-700/50 
                disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
              <span className="text-sm">Next {PAGE_SIZE}</span>
              <ArrowRight
                size={16}
                className="group-hover:translate-x-0.5 transition-transform duration-200"
              />
            </button>

            <button
              onClick={() => {
                setShowAll((v) => !v);
                setPage(1);
              }}
              className={`group flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                showAll
                  ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/25"
                  : "bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer"
              }`}>
              <Layers size={16} />
              <span className="text-sm">
                {showAll ? "Back to 10 per page" : "All Locations"}
              </span>
            </button>
          </div>
        )}

        {/* MAP */}
        <div className={`relative ${isPreview ? "h-[400px]" : "h-[450px]"}`}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loading message="Loading institute locations..." />
            </div>
          ) : (
            <MapContainer
              center={[23.9408, 91.9882]}
              zoom={isPreview ? 7 : 8}
              scrollWheelZoom={!isPreview}
              className="h-full w-full z-0">
              <TileLayer
                url={GOOGLE_TILE_URL}
                attribution="&copy; Google Maps"
                maxZoom={20}
                subdomains={["0", "1", "2", "3"]}
              />
              <BoundsFitter institutes={institutes} />
              {institutes
                .filter((i) => i.latitude !== null && i.longitude !== null)
                .map((i) => (
                  <Marker
                    key={i.id}
                    position={[Number(i.latitude), Number(i.longitude)]}
                    icon={InstituteMarkerIcon}>
                    <Popup>
                      <div className="min-w-[50px] space-y-1">
                        <div className="flex text-sm font-semibold justify-center text-gray-900">
                          {i.institute_name}
                        </div>
                        <div className="flex items-center justify-center gap-1 text-xs text-gray-600">
                          <MapPin size={12} className="mt-0.5 text-cyan-600" />
                          <span>{i.location_city || ""}</span>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
            </MapContainer>
          )}
        </div>

        {/* FOOTER */}
        {!loading && (
          <div className="relative flex items-center justify-between px-6 py-3 bg-gray-50 dark:bg-slate-800/30 border-t border-gray-200 dark:border-slate-700/30">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
              <Globe size={14} className="text-cyan-500 dark:text-cyan-400" />
              <span>
                Showing{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {institutes.length}
                </span>{" "}
                {institutes.length === 1 ? "institute" : "institutes"}
                {showAll && " (All Locations)"}
              </span>

              {isPreview && (
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 overflow-hidden max-w-xl ml-4">
                  <div className="overflow-hidden whitespace-nowrap flex-1 relative">
                    <span
                      className="inline-block text-xs font-medium text-cyan-700 dark:text-cyan-300"
                      style={{
                        animation: "previewMarquee 12s linear infinite",
                      }}>
                      Preview shows 5 institute locations
                      only&nbsp;&nbsp;·&nbsp;&nbsp;Switch to Full Mode to
                      explore all institute locations on the
                      map&nbsp;&nbsp;&nbsp;&nbsp;
                    </span>
                    <style>{`
                      @keyframes previewMarquee {
                        0%   { transform: translateX(100%); }
                        100% { transform: translateX(-100%); }
                      }
                    `}</style>
                  </div>
                </div>
              )}
            </div>

            {!isPreview && !showAll && (
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-500">
                <span>Page {page}</span>
                <span>•</span>
                <span>{PAGE_SIZE} per page</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstituteLocationMap;
