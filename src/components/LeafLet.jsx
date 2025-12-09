import { useEffect, useRef } from "react";
import L from "leaflet";

// Load Leaflet CSS
import "leaflet/dist/leaflet.css";

// Load Leaflet Draw JS + CSS (THIS IS REQUIRED)
import "leaflet-draw/dist/leaflet.draw.js";
import "leaflet-draw/dist/leaflet.draw.css";

export default function LeafletMap({ onShapeComplete = () => {}, onShapeEdited = () => {} }) {
  const mapRef = useRef(null);
  const drawnItems = useRef(new L.FeatureGroup());

  useEffect(() => {
    mapRef.current = L.map("leaflet-map", {
      center: [31.5204, 74.3587], // Lahore default
      zoom: 13,
    });

    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { attribution: "Tiles © Esri" }
    ).addTo(mapRef.current);

    drawnItems.current.addTo(mapRef.current);

    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems.current,
        edit: true,
        remove: true,
      },
      draw: {
        marker: false,
        circle: false,
        circlemarker: false,
        polyline: false,
        polygon: true,
        rectangle: true,
      },
    });

    mapRef.current.addControl(drawControl);

    mapRef.current.on(L.Draw.Event.CREATED, function (e) {
      const layer = e.layer;
      drawnItems.current.addLayer(layer);

      const coords = layer.getLatLngs().flat(2).map((p) => ({
        lat: p.lat,
        lng: p.lng,
      }));

      onShapeComplete({
        type: layer instanceof L.Rectangle ? "rectangle" : "polygon",
        coordinates: coords,
      });
    });

    return () => mapRef.current.remove();
  }, []);

  return <div id="leaflet-map" style={{ height: "500px", width: "100%" }}></div>;
}
