import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { InstituteMarkerIcon } from "../common/InstituteMarkerIcon";
function LocationPicker({ newInstitute, setNewInstitute }) {
  const defaultPosition = [23.9408, 91.9882]; // Tripura, India

  function LocationMarker() {
    const [position, setPosition] = React.useState(
      newInstitute.latitude && newInstitute.longitude
        ? [newInstitute.latitude, newInstitute.longitude]
        : defaultPosition,
    );

    useMapEvents({
      click(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        setPosition([lat, lng]);
        setNewInstitute({
          ...newInstitute,
          latitude: lat,
          longitude: lng,
        });
      },
    });

    return <Marker position={position} icon={InstituteMarkerIcon}></Marker>;
  }

  const handleManualChange = (e) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value);

    setNewInstitute({
      ...newInstitute,
      [name]: numericValue,
    });
  };

  return (
    <div>
      <MapContainer
        center={
          newInstitute.latitude && newInstitute.longitude
            ? [newInstitute.latitude, newInstitute.longitude]
            : defaultPosition
        }
        zoom={6}
        scrollWheelZoom={false}
        style={{ height: "200px", width: "100%", borderRadius: "0.5rem" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker />
      </MapContainer>

      {/* Manual Latitude / Longitude Inputs */}
      <div className="flex gap-3 mt-2">
        <div className="flex flex-col w-1/2">
          <label className="text-xs text-slate-400">Latitude</label>
          <input
            type="number"
            name="latitude"
            value={newInstitute.latitude || ""}
            onChange={handleManualChange}
            className="w-full rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/40 focus:border-cyan-400/40"
            step="0.000001"
          />
        </div>
        <div className="flex flex-col w-1/2">
          <label className="text-xs text-slate-400">Longitude</label>
          <input
            type="number"
            name="longitude"
            value={newInstitute.longitude || ""}
            onChange={handleManualChange}
            className="w-full rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/40 focus:border-cyan-400/40"
            step="0.000001"
          />
        </div>
      </div>
    </div>
  );
}

export default LocationPicker;
