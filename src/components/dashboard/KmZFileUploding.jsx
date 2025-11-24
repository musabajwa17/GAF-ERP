"use client";

import { useState } from "react";
import JSZip from "jszip";

export default function KmZFileUploding({ onShapesParsed, map }) {
  const [uploading, setUploading] = useState(false);

  const parseKml = (kmlText) => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(kmlText, "text/xml");

    let extractedShapes = [];

    const placemarks = xml.getElementsByTagName("Placemark");

    for (let p of placemarks) {
      const name = p.getElementsByTagName("name")[0]?.textContent || "Unnamed Shape";
      const coordTag = p.getElementsByTagName("coordinates")[0];
      if (!coordTag) continue;

      // Clean coordinates string
      const coordText = coordTag.textContent
        .trim()
        .replace(/\n/g, " ")
        .replace(/\t/g, " ")
        .replace(/\s+/g, " ");

      const rawPairs = coordText.split(" ");

      // Convert to [lat, lng] safely
      const coordArr = rawPairs
        .map((pair) => {
          if (!pair.includes(",")) return null;
          let [lng, lat, alt] = pair.split(",").map(Number);
          if (isNaN(lat) || isNaN(lng)) return null;
          return [lat, lng];
        })
        .filter(Boolean);

      if (coordArr.length === 0) continue;

      const isPolygon = p.getElementsByTagName("Polygon").length > 0;
      const isLine = p.getElementsByTagName("LineString").length > 0;
      const isPoint = p.getElementsByTagName("Point").length > 0;

      let type = "polygon"; // default
      if (isLine) type = "polyline";
      if (isPoint) type = "point";
      if (!isPolygon && !isLine && !isPoint && coordArr.length === 1) type = "point";

      extractedShapes.push({
        name,
        type,
        coordinates: coordArr,
        id: `uploaded-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      });
    }

    // Pass the parsed shapes back to parent component
    if (onShapesParsed) {
      onShapesParsed(extractedShapes);
    }

    return extractedShapes;
  };

  // Handle KMZ upload
  const handleKmzUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const zip = await JSZip.loadAsync(file);
      const kmlFileName = Object.keys(zip.files).find((f) => f.endsWith(".kml"));

      if (!kmlFileName) {
        alert("KMZ does not contain a KML file!");
        return;
      }

      const kmlText = await zip.files[kmlFileName].async("text");
      const shapes = parseKml(kmlText);

      // Fit map bounds to the shapes
      if (map && shapes.length > 0) {
        const L = await import("leaflet");
        const allCoords = shapes.flatMap(shape => shape.coordinates);
        if (allCoords.length > 0) {
          const bounds = L.latLngBounds(allCoords);
          map.fitBounds(bounds, { padding: [30, 30] });
        }
      }

      console.log("Parsed shapes:", shapes);
      
    } catch (err) {
      console.error("KMZ read error:", err);
      alert("Error reading KMZ file: " + err.message);
    } finally {
      setUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  return (
    <div className="sticky top-52 right-7 z-50">
      <label
        htmlFor="kmz-upload"
        className={`fixed top-[180px] right-8 flex justify-center items-center gap-2 ${
          uploading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-teal-600 hover:to-emerald-600 cursor-pointer'
        } text-white px-4 py-3 rounded-lg shadow-lg z-50 transition-all duration-300`}
      >
        {uploading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span>Upload KMZ</span>
          </>
        )}
      </label>

      <input
        id="kmz-upload"
        type="file"
        accept=".kmz"
        className="hidden"
        onChange={handleKmzUpload}
        disabled={uploading}
      />
    </div>
  );
}
