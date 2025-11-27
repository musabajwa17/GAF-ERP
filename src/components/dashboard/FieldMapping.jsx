
"use client";
import React, {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import SearchControl from "../dashboard/SearchControl";
import { useMap, Polygon, Polyline, Marker, Popup } from "react-leaflet";
import KmZFileUploding from "../dashboard/KmZFileUploding";
import * as turf from "@turf/turf";
import L from "leaflet";
import {
  FileText,
  Save,
  Trash2,
  Lock,
  MapPin,
  Check,
  AreaChart,
  Type,
  NotepadTextDashedIcon,
  Home,
  Upload,
  Edit3,
  ArrowLeft,
} from "lucide-react";
import ProtectedPage from "../contact/ProtectedPage/AuthorizedPage";
import SoilHealthTracker from "./SoilHealth";

/* Fix Leaflet & Leaflet-Draw Icons (MUST HAVE) */
const fixLeafletIcons = () => {
  if (typeof window === "undefined") return;

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
};

/* Dynamic Imports */
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const FeatureGroup = dynamic(
  () => import("react-leaflet").then((m) => m.FeatureGroup),
  { ssr: false }
);
const EditControl = dynamic(
  () => import("react-leaflet-draw").then((m) => m.EditControl),
  { ssr: false }
);

/* Constants */
const initialCenter = [30.157, 71.5249];

/* Utility Functions */
function km2ToHectares(km2) {
  return km2 * 100;
}
function km2ToAcres(km2) {
  return km2 * 247.105;
}
function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
function generateFarmId(coords) {
  if (!Array.isArray(coords) || coords.length === 0) return `F-${Date.now()}`;
  let lat = coords[0].lat || coords[0][0];
  let lng = coords[0].lng || coords[0][1];
  lat = Number(lat).toFixed(2);
  lng = Number(lng).toFixed(2);
  const ts = Date.now().toString().slice(-4);
  return `F-${lat.replace(".", "")}${lng.replace(".", "")}${ts}`;
}
function computePolygonAreaKm2(latlngs) {
  if (!latlngs || latlngs.length < 3) return 0;
  const R = 6378137;
  let total = 0;
  const toRad = (d) => (d * Math.PI) / 180;
  for (let i = 0, len = latlngs.length; i < len; i++) {
    const [lat1, lon1] = latlngs[i];
    const [lat2, lon2] = latlngs[(i + 1) % len];
    total +=
      toRad(lon2 - lon1) * (Math.sin(toRad(lat1)) + Math.sin(toRad(lat2)));
  }
  const area = Math.abs((total * (R * R)) / 2.0);
  return area / 1_000_000;
}
function layerCoordsToArray(layer) {
  const latlngs = [];
  try {
    const pts = layer.getLatLngs();
    const ring = Array.isArray(pts[0]) ? pts[0] : pts;
    ring.forEach((p) => latlngs.push([p.lat, p.lng]));
  } catch {
    if (layer.getBounds) {
      const b = layer.getBounds();
      latlngs.push(
        [b.getSouthWest().lat, b.getSouthWest().lng],
        [b.getSouthWest().lat, b.getNorthEast().lng],
        [b.getNorthEast().lat, b.getNorthEast().lng],
        [b.getNorthEast().lat, b.getSouthWest().lng]
      );
    }
  }
  return latlngs;
}
async function getCustomPlace(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await res.json();
    const addr = data.address || {};
    return [addr.village, addr.county, addr.state, addr.country]
      .filter(Boolean)
      .join(", ");
  } catch {
    return "Unknown location";
  }
}
function getCentroid(coords) {
  let x = 0,
    y = 0,
    n = 0;
  coords.forEach((pt) => {
    x += pt.lat || pt[0];
    y += pt.lng || pt[1];
    n++;
  });
  return { lat: x / n, lng: y / n };
}

/* Auto-fit bounds component for uploaded shapes */
function FitUploadedBounds({ shapes }) {
  const map = useMap();

  React.useEffect(() => {
    if (shapes.length === 0) return;

    const allPoints = shapes.flatMap(shape => shape.coordinates);
    if (allPoints.length > 0) {
      const bounds = L.latLngBounds(allPoints);
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [shapes, map]);

  return null;
}

/* Main Component */
const FieldMapping = forwardRef(({ onAreaData, searchLocation }, ref) => {
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);
  const featureGroupRef = useRef(null);
  const [areaInfo, setAreaInfo] = useState(null);
  const [selectedTool, setSelectedTool] = useState("hand");
  const [areaUnit, setAreaUnit] = useState("ac");
  const [searchMarker, setSearchMarker] = useState(null);
  const [forms, setForms] = useState([]);
  const [uploadedShapes, setUploadedShapes] = useState([]);
  const [editableLayers, setEditableLayers] = useState(new Map());

  /* Fix icons on mount */
  useEffect(() => {
    fixLeafletIcons();
  }, []);

  /* Load saved data */
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("mapAreaInfo");
      if (saved) setAreaInfo(JSON.parse(saved));
      const unit = localStorage.getItem("areaUnit");
      if (unit === "ha" || unit === "ac") setAreaUnit(unit);
    } catch (e) {
      console.warn("Failed to load saved data", e);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (areaInfo) localStorage.setItem("mapAreaInfo", JSON.stringify(areaInfo));
    else localStorage.removeItem("mapAreaInfo");
  }, [areaInfo]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("areaUnit", areaUnit);
  }, [areaUnit]);

  /* Search location */
  useEffect(() => {
    if (!searchLocation || !mapRef.current) return;
    const { lat, lng } = searchLocation;
    mapRef.current.setView([lat, lng], 16);
    if (searchMarker) mapRef.current.removeLayer(searchMarker);
    const m = L.marker([lat, lng]).addTo(mapRef.current);
    setSearchMarker(m);
  }, [searchLocation]);

  const updatePolygonDetails = (latlngsArr) => {
    const areaKm2 = computePolygonAreaKm2(latlngsArr);
    const coordsObjects = latlngsArr.map((p) => ({ lat: p[0], lng: p[1] }));
    const farmId = generateFarmId(coordsObjects);
    const data = {
      type: "polygon",
      coordinates: coordsObjects,
      areaKm2,
      areaHectares: km2ToHectares(areaKm2).toFixed(2),
      areaAcres: km2ToAcres(areaKm2).toFixed(2),
      farmId,
    };
    setAreaInfo(data);
    onAreaData?.(data);
    localStorage.setItem("mapAreaInfo", JSON.stringify(data));
  };

  const updateRectangleDetails = (latlngsArr) => {
    let minLat = 90,
      maxLat = -90,
      minLng = 180,
      maxLng = -180;
    latlngsArr.forEach(([lat, lng]) => {
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
    });
    const width = getDistance(minLat, minLng, minLat, maxLng);
    const height = getDistance(minLat, minLng, maxLat, minLng);
    const areaKm2 = width * height;
    const coordsObjects = latlngsArr.map((p) => ({ lat: p[0], lng: p[1] }));
    const farmId = generateFarmId(coordsObjects);
    const data = {
      type: "rectangle",
      width: width.toFixed(2),
      height: height.toFixed(2),
      areaKm2,
      areaHectares: km2ToHectares(areaKm2).toFixed(2),
      areaAcres: km2ToAcres(areaKm2).toFixed(2),
      coordinates: coordsObjects,
      farmId,
    };
    setAreaInfo(data);
    onAreaData?.(data);
    localStorage.setItem("mapAreaInfo", JSON.stringify(data));
  };

  const updateEditDetails = (layer) => {
    let coords = [];

    if (layer instanceof L.Rectangle || !layer.getLatLngs()[0]) {
      const bounds = layer.getBounds();
      coords = [
        [bounds.getSouthWest().lat, bounds.getSouthWest().lng],
        [bounds.getSouthWest().lat, bounds.getNorthEast().lng],
        [bounds.getNorthEast().lat, bounds.getNorthEast().lng],
        [bounds.getNorthEast().lat, bounds.getSouthWest().lng],
      ];
    } else {
      coords = layer.getLatLngs()[0].map((p) => [p.lat, p.lng]);
    }

    const type = coords.length === 4 ? "rectangle" : "polygon";

    if (type === "rectangle") {
      let minLat = 90,
        maxLat = -90,
        minLng = 180,
        maxLng = -180;
      coords.forEach(([lat, lng]) => {
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
        minLng = Math.min(minLng, lng);
        maxLng = Math.max(maxLng, lng);
      });
      const width = getDistance(minLat, minLng, minLat, maxLng);
      const height = getDistance(minLat, minLng, maxLat, minLng);
      const areaKm2 = width * height;
      const data = {
        type: "rectangle",
        width: width.toFixed(2),
        height: height.toFixed(2),
        areaKm2,
        areaHectares: km2ToHectares(areaKm2).toFixed(2),
        areaAcres: km2ToAcres(areaKm2).toFixed(2),
        coordinates: coords.map(([lat, lng]) => ({ lat, lng })),
        farmId: generateFarmId(coords),
      };
      setAreaInfo(data);
      onAreaData?.(data);
      localStorage.setItem("mapAreaInfo", JSON.stringify(data));
    } else {
      const areaKm2 = computePolygonAreaKm2(coords);
      const data = {
        type: "polygon",
        coordinates: coords.map(([lat, lng]) => ({ lat, lng })),
        areaKm2,
        areaHectares: km2ToHectares(areaKm2).toFixed(2),
        areaAcres: km2ToAcres(areaKm2).toFixed(2),
        farmId: generateFarmId(coords),
      };
      setAreaInfo(data);
      onAreaData?.(data);
      localStorage.setItem("mapAreaInfo", JSON.stringify(data));
    }
  };

  const _onCreated = (e) => {
    const layer = e.layer;
    featureGroupRef.current?.addLayer(layer);
    const type = e.layerType;

    if (type === "polygon" || type === "rectangle") {
      const coords = layerCoordsToArray(layer);
      if (type === "rectangle" || coords.length === 4) {
        updateRectangleDetails(coords);
      } else {
        updatePolygonDetails(coords);
      }
    }
  };

  const _onEdited = (e) => {
    const layers = e.layers;
    layers.eachLayer((layer) => {
      updateEditDetails(layer);
      
      // Also update uploaded shapes if they were edited
      const layerId = layer._leaflet_id;
      if (editableLayers.has(layerId)) {
        const shapeData = editableLayers.get(layerId);
        const updatedCoords = layerCoordsToArray(layer);
        
        // Update the uploaded shapes state
        setUploadedShapes(prev => 
          prev.map(shape => 
            shape.id === shapeData.id 
              ? { ...shape, coordinates: updatedCoords }
              : shape
          )
        );
      }
    });
  };

  const _onDeleted = (e) => {
    const layers = e.layers;
    layers.eachLayer((layer) => {
      // Remove from editable layers if it was an uploaded shape
      const layerId = layer._leaflet_id;
      if (editableLayers.has(layerId)) {
        const shapeData = editableLayers.get(layerId);
        setUploadedShapes(prev => prev.filter(shape => shape.id !== shapeData.id));
        setEditableLayers(prev => {
          const newMap = new Map(prev);
          newMap.delete(layerId);
          return newMap;
        });
      }
    });

    const remainingLayers = featureGroupRef.current?.getLayers() || [];
    if (remainingLayers.length === 0) {
      setAreaInfo(null);
      localStorage.removeItem("mapAreaInfo");
    } else {
      const layer = remainingLayers[remainingLayers.length - 1];
      const coords = layerCoordsToArray(layer);
      if (coords.length === 4) updateRectangleDetails(coords);
      else updatePolygonDetails(coords);
    }
  };

  const onMapCreated = (map) => {
    mapRef.current = map;

    // restore shapes (if present)
    if (areaInfo?.coordinates?.length) {
      const coords = areaInfo.coordinates.map((c) => [c.lat, c.lng]);
      const poly = L.polygon(coords, { color: "#2563eb", fillOpacity: 0.35 });
      poly.addTo(map);
      featureGroupRef.current?.addLayer(poly);
      map.fitBounds(poly.getBounds());
    }

    // Add search control
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: true,
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
    });
    map.addControl(searchControl);

    map.on("geosearch/showlocation", function (result) {
      const { x: lng, y: lat } = result.location;
      if (searchMarker) map.removeLayer(searchMarker);
      const m = L.marker([lat, lng]).addTo(map);
      setSearchMarker(m);
      map.setView([lat, lng], 16);
    });
  };

  useImperativeHandle(ref, () => ({
    getMap: () => mapRef.current,
    clearShapes: () => {
      featureGroupRef.current?.clearLayers();
      setAreaInfo(null);
      setUploadedShapes([]);
      setEditableLayers(new Map());
      localStorage.removeItem("mapAreaInfo");
    },
  }));

  /* Handle shapes parsed from KMZ upload */
  const handleShapesParsed = (shapes) => {
    setUploadedShapes(shapes);
    
    // If there are polygons, use the first one as the main area
    const polygons = shapes.filter(shape => shape.type === "polygon");
    if (polygons.length > 0) {
      const firstPolygon = polygons[0];
      const coords = firstPolygon.coordinates;
      const areaKm2 = computePolygonAreaKm2(coords);
      const coordsObjects = coords.map(p => ({ lat: p[0], lng: p[1] }));
      const farmId = generateFarmId(coordsObjects);
      
      const data = {
        type: "polygon",
        coordinates: coordsObjects,
        areaKm2,
        areaHectares: km2ToHectares(areaKm2).toFixed(2),
        areaAcres: km2ToAcres(areaKm2).toFixed(2),
        farmId,
      };
      
      setAreaInfo(data);
      onAreaData?.(data);
      localStorage.setItem("mapAreaInfo", JSON.stringify(data));
    }
  };

  // Function to make uploaded shapes editable
  const makeShapeEditable = (shape, layer) => {
    if (layer && featureGroupRef.current) {
      // Add the layer to the feature group for editing
      featureGroupRef?.current?.addLayer(layer);
      
      // Store reference to this layer
      setEditableLayers(prev => {
        const newMap = new Map(prev);
        newMap.set(layer._leaflet_id, shape);
        return newMap;
      });
    }
  };

  // Function to remove shape from editable state
  const removeShapeFromEditing = (layerId) => {
    setEditableLayers(prev => {
      const newMap = new Map(prev);
      newMap.delete(layerId);
      return newMap;
    });
  };

  const getAreaInSelectedUnit = () => {
    if (!areaInfo || !areaInfo.areaKm2) return 0;
    const km2 = Number(areaInfo.areaKm2);
    if (areaUnit === "ac") return Number((km2 * 247.105).toFixed(2));
    if (areaUnit === "ha") return Number((km2 * 100).toFixed(2));
    return Number(km2.toFixed(6));
  };

  // KML file upload functionality
  async function handleKmlUpload(file) {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (e) => {
      const text = e.target.result;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, "application/xml");

      const coordsNodes = xmlDoc.getElementsByTagName("coordinates");
      if (!coordsNodes.length) return;

      const newShapes = [];

      for (let i = 0; i < coordsNodes.length; i++) {
        const rawCoords = coordsNodes[i].textContent.trim();

        const coordsArray = rawCoords
          .split(/\s+/)
          .map((pair) => {
            const [lng, lat] = pair.split(",").map(Number);
            return [lat, lng];
          })
          .filter(([lat, lng]) => !isNaN(lat) && !isNaN(lng));

        if (coordsArray.length < 3) continue;

        const areaKm2 = computePolygonAreaKm2(coordsArray);
        const coordsObjects = coordsArray.map((p) => ({ lat: p[0], lng: p[1] }));
        const farmId = generateFarmId(coordsObjects);

        const polygonData = {
          type: "polygon",
          coordinates: coordsObjects,
          areaKm2,
          areaHectares: km2ToHectares(areaKm2).toFixed(2),
          areaAcres: km2ToAcres(areaKm2).toFixed(2),
          farmId,
          id: `kml-${Date.now()}-${i}`
        };

        newShapes.push(polygonData);
      }

      if (!newShapes.length) return;

      setUploadedShapes(newShapes);
      const lastPolygon = newShapes[newShapes.length - 1];
      setAreaInfo(lastPolygon);
      onAreaData?.(lastPolygon);
    };

    reader.readAsText(file);
  }

  return (
    <ProtectedPage>
      <div className="flex w-full overflow-hidden bg-gray-50">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {/* KMZ Upload Component */}
            <KmZFileUploding 
              map={mapRef.current} 
              onShapesParsed={handleShapesParsed}
            />


            {/* KML Upload Button */}
            <div className="sticky top-32 right-7  z-50">
              <label
                htmlFor="kml-upload"
                className="fixed top-[233px] right-8 flex justify-center items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 cursor-pointer py-3 rounded-lg shadow-lg z-50 hover:from-emerald-700 hover:to-teal-700 transition-all duration-300"
              >
                <Upload className="w-5 h-5" />
                Upload KML
              </label>

              <input
                id="kml-upload"
                type="file"
                accept=".kml"
                className="hidden"
                onChange={(e) => handleKmlUpload(e.target.files[0])}
              />
            </div>

            {/* Clear All Button */}
            <div className="sticky top-72 right-7 z-50">
              <button
                onClick={() => {
                  featureGroupRef.current?.clearLayers();
                  setAreaInfo(null);
                  setUploadedShapes([]);
                  setEditableLayers(new Map());
                  localStorage.removeItem("mapAreaInfo");
                }}
                className="fixed top-[285px] right-8 flex justify-center items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 cursor-pointer py-3 rounded-lg shadow-lg z-50 hover:from-red-700 hover:to-orange-700 transition-all duration-300"
              >
                <Trash2 className="w-5 h-5" />
                Clear All
              </button>
            </div>

            {/* Map */}
            <div className="bg-white shadow-2xl overflow-hidden border border-gray-200 h-[600px] mb-8">
              {typeof window !== "undefined" && (
                <MapContainer
                  center={initialCenter}
                  zoom={13}
                  style={{ height: "100%", width: "100%", zIndex: "1" }}
                  whenCreated={onMapCreated}
                >
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution="Esri World Imagery"
                  />

                  <FeatureGroup ref={featureGroupRef}>
                    <EditControl
                      key={selectedTool}
                      position="topleft"
                      onCreated={_onCreated}
                      onEdited={_onEdited}
                      onDeleted={_onDeleted}
                      draw={{
                        rectangle: true,
                        polygon: true,
                        circle: false,
                        marker: false,
                        polyline: false,
                        circlemarker: false,
                      }}
                      edit={{
                        edit: true,
                        remove: true,
                      }}
                    />
                  </FeatureGroup>

                  {/* Render uploaded KMZ shapes */}
                  {uploadedShapes.map((shape, index) => {
                    if (shape.type === "polygon") {
                      return (
                        <Polygon 
                          key={shape.id} 
                          positions={shape.coordinates}
                          color="blue"
                          fillOpacity={0.3}
                          eventHandlers={{
                            click: (e) => {
                              const layer = e.target;
                              makeShapeEditable(shape, layer);
                            }
                          }}
                        >
                          <Popup>
                            <div className="p-2">
                              <h3 className="font-bold">{shape.name}</h3>
                              {/* <p>Type: Polygon</p>
                              <p>Points: {shape.coordinates.length}</p> */}
                              <p className="flex justify-center items-center gap-10">
                                <ArrowLeft/>
                                 Click the Edit button</p>
                              {/* <button
                                onClick={(e) => {
                                  const layer = e.target;
                                  makeShapeEditable(shape, layer);
                                }}
                                className="mt-2 flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                              >
                                <Edit3 className="w-3 h-3" />
                                Edit Shape
                              </button> */}
                            </div>
                          </Popup>
                        </Polygon>
                      );
                    }
                    
                    if (shape.type === "polyline") {
                      return (
                        <Polyline 
                          key={shape.id} 
                          positions={shape.coordinates}
                          color="red"
                          weight={3}
                          eventHandlers={{
                            click: (e) => {
                              const layer = e.target;
                              makeShapeEditable(shape, layer);
                            }
                          }}
                        >
                          <Popup>
                            <div className="p-2">
                              <h3 className="font-bold">{shape.name}</h3>
                              <p>Type: Polyline</p>
                              <button
                                onClick={() => {
                                  const layer = e.target;
                                  makeShapeEditable(shape, layer);
                                }}
                                className="mt-2 flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                              >
                                <Edit3 className="w-3 h-3" />
                                Edit Shape
                              </button>
                            </div>
                          </Popup>
                        </Polyline>
                      );
                    }
                    
                    if (shape.type === "point") {
                      return (
                        <Marker 
                          key={shape.id} 
                          position={shape.coordinates[0]}
                          eventHandlers={{
                            click: (e) => {
                              const layer = e.target;
                              makeShapeEditable(shape, layer);
                            }
                          }}
                        >
                          <Popup>
                            <div className="p-2">
                              <h3 className="font-bold">{shape.name}</h3>
                              <p>Type: Point</p>
                              <button
                                onClick={() => {
                                  const layer = e.target;
                                  makeShapeEditable(shape, layer);
                                }}
                                className="mt-2 flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                              >
                                <Edit3 className="w-3 h-3" />
                                Edit Point
                              </button>
                            </div>
                          </Popup>
                        </Marker>
                      );
                    }
                    
                    return null;
                  })}

                  {areaInfo?.coordinates && (
                    <Marker
                      position={[
                        getCentroid(areaInfo.coordinates).lat,
                        getCentroid(areaInfo.coordinates).lng,
                      ]}
                    />
                  )}

                  <SearchControl
                    style="bar"
                    showMarker={true}
                    autoClose={true}
                    searchLabel="Enter address to search"
                    retainZoomLevel={false}
                  />

                  {/* Auto-fit bounds for uploaded shapes */}
                  <FitUploadedBounds shapes={uploadedShapes} />
                </MapContainer>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <MapDetail
        mapAreaInfo={areaInfo || {}}
        selectedUnit={areaUnit}
        setSelectedUnit={setAreaUnit}
        farmId={areaInfo?.farmId || `F-${Date.now()}`}
        getAreaInSelectedUnit={getAreaInSelectedUnit}
        forms={forms}
        uploadedShapesCount={uploadedShapes.length}
        postFields={async (payload) => {
          setLoading(true);
          try {
            console.log("POST payload ->", payload);
            const res = await fetch(
              "https://earthscansystems.com/farmerdatauser/userfarm/",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("access")}`,
                },
                body: JSON.stringify(payload),
              }
            );
            const text = await res.text();
            let data;
            try {
              data = JSON.parse(text);
            } catch {
              data = { raw: text };
            }
            if (!res.ok) {
              console.error("Server error:", res.status, data);
              throw new Error(
                `Server responded ${res.status} - ${JSON.stringify(data)}`
              );
            }
            setForms((p) => [data, ...p]);
            return data;
          } finally {
            setLoading(false);
          }
        }}
      />
    </ProtectedPage>
  );
});

FieldMapping.displayName = "FieldMapping";
export default FieldMapping;

/* MapDetail component */
function MapDetail({
  mapAreaInfo = {},
  setSelectedUnit = () => { },
  selectedUnit = "ac",
  farmId = null,
  getAreaInSelectedUnit = null,
  postFields = async () => { },
  loading = false,
  uploadedShapesCount = 0,
}) {
  const [finalPlace, setFinalPlace] = useState("");
  const [field, setField] = useState(mapAreaInfo || {});
  const [showSoilModal, setShowSoilModal] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loadingReport, setLoadingReport] = useState(false);
  const [reportResult, setReportResult] = useState(null);
  const [formData, setFormData] = useState({
    farm_name: "",
    turbine_number:"",
    notes: "",
    area: getAreaInSelectedUnit ? getAreaInSelectedUnit() : 0,
    unit: selectedUnit,
    farm_id: farmId,
    user: 1,
  });
  const [submitting, setSubmitting] = useState(false);
  const [parsedCoordinates, setParsedCoordinates] = useState([]);
  const [copied, setCopied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!mapAreaInfo) return;
    if (mapAreaInfo.coordinates) {
      setParsedCoordinates(mapAreaInfo.coordinates);
    } else {
      setParsedCoordinates([]);
    }

    const computedArea = getAreaInSelectedUnit
      ? getAreaInSelectedUnit()
      : mapAreaInfo.areaKm2
        ? selectedUnit === "ac"
          ? Number((mapAreaInfo.areaKm2 * 247.105).toFixed(2))
          : selectedUnit === "ha"
            ? Number((mapAreaInfo.areaKm2 * 100).toFixed(2))
            : Number(mapAreaInfo.areaKm2.toFixed(6))
        : 0;

    setFormData((prev) => ({
      ...prev,
      area: computedArea,
      unit: selectedUnit,
      farm_id: farmId,
    }));
  }, [mapAreaInfo, selectedUnit, farmId, getAreaInSelectedUnit]);

  useEffect(() => {
    if (!parsedCoordinates?.length) return;
    async function loadPlace() {
      const center = getCentroid(parsedCoordinates);
      const location = await getCustomPlace(center.lat, center.lng);
      setFinalPlace(location);
    }
    loadPlace();
  }, [JSON.stringify(parsedCoordinates)]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };
  const handleNotes = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setFileName(selected.name);
    setReportResult(null);
  };

  const onSubmitFile = async () => {
    if (!file) return;
    setLoadingReport(true);
    setTimeout(() => {
      const isGood = Math.random() > 0.5;
      setReportResult(isGood ? "Good" : "Bad");
      setLoadingReport(false);
    }, 2000);
  };

  const handleSubmit = async () => {
    if (!formData.farm_name) return alert("Please enter farm name");

    const payload = {
      ...formData,
      shape_type: mapAreaInfo.type || "rectangle",
      coordinates: parsedCoordinates,
      width: mapAreaInfo.width || null,
      height: mapAreaInfo.height || null,
      area: formData.area,
    };

    try {
      setSubmitting(true);
      console.log("Submitting payload:", payload);
      const data = await postFields(payload);
      console.log("Server response:", data);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setFormData((p) => ({ ...p, farm_name: "" }));
      localStorage.removeItem("mapAreaInfo");
      setTimeout(() => window.location.reload(), 1200);
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Submit failed: " + (err.message || err));
    } finally {
      setSubmitting(false);
    }
  };

  const discard = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("mapAreaInfo");
      window.location.reload();
    }
  };

  const areaTypes = ["Flood", "ICP", "Trial", "Drip"];
  const handleTypeChange = (e) => {
    setField((prev) => ({ ...prev, type: e.target.value }));
  };

  const fieldInputs = [
    {
      key: "place",
      label: "Place:",
      icon: <MapPin className="text-emerald-600 w-5 h-5" />,
      inputProps: {
        disabled: true,
        value: finalPlace || "loading place…",
      },
      paddingLeft: "pl-32",
    },
    {
      key: "notes",
      label: "Notes:",
      icon: <NotepadTextDashedIcon className="text-emerald-600 w-5 h-5" />,
      inputProps: {
        name: "notes",
        value: formData.notes,
        onChange: handleNotes,
        placeholder: "Enter any notes...",
      },
      paddingLeft: "pl-24",
    },
    {
      key: "farm_name",
      label: "Farm Name:",
      icon: <Home className="text-emerald-600 w-5 h-5" />,
      inputProps: {
        name: "farm_name",
        value: formData.farm_name,
        onChange: handleChange,
        placeholder: "Enter your farm name...",
      },
      paddingLeft: "pl-[130px]",
    },
    {
      key: "Turbine Number",
      label: "Turbine Number:",
      icon: <Home className="text-emerald-600 w-5 h-5" />,
      inputProps: {
        name: "turbine_number",
        value: formData.turbine_numner,
        onChange: handleChange,
        placeholder: "Enter your Turbine number...",
      },
      paddingLeft: "pl-[160px]",
    },
  ];

  return (
    <>
      {showSuccess && (
        <div className="fixed  top-4 right-4 z-50 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-down">
          <Check className="w-6 h-6" />
          <span className="font-semibold">Field saved successfully!</span>
        </div>
      )}
      {(mapAreaInfo && Object.keys(mapAreaInfo).length > 0) || uploadedShapesCount > 0 ? (
        <div className=" bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/30 rounded-3xl shadow-2xl border border-emerald-100 p-8 overflow-hidden transform  transition-all duration-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse"></div>

          <div className="relative flex items-center justify-between border-b border-emerald-200 pb-6 mb-8">
            <h2 className="font-bold text-3xl text-gray-800 flex items-center gap-3">
              <span className="text-4xl">🌾</span>
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Field Information
              </span>
            </h2>
            {uploadedShapesCount > 0 && (
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {uploadedShapesCount} shape{uploadedShapesCount !== 1 ? 's' : ''} loaded
              </div>
            )}
          </div>

          {mapAreaInfo && Object.keys(mapAreaInfo).length > 0 ? (
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-5">
                {[{
                  label: "Farm ID",
                  value: mapAreaInfo.farmId ? `${mapAreaInfo.farmId}` : "-",
                  icon: (
                    <Lock width={18} height={18} className="text-gray-500" />
                  ),
                },
                {
                  label: "Area",
                  value: mapAreaInfo.areaKm2
                    ? selectedUnit === "ac"
                      ? ` ${(mapAreaInfo.areaKm2 * 247.105).toFixed(2)} ac`
                      : selectedUnit === "ha"
                        ? `${(mapAreaInfo.areaKm2 * 100).toFixed(2)} ha`
                        : `${mapAreaInfo.areaKm2} km²`
                    : "-",
                  icon: (
                    <AreaChart
                      width={18}
                      height={18}
                      className="text-gray-500"
                    />
                  ),
                },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100 shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <span className="flex items-center gap-2 text-gray-600 font-medium">
                      <span className="text-2xl">{item.icon}</span>
                      {item.label}
                    </span>
                    <span className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      {item.value}
                    </span>
                  </div>
                ))}

                <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100 shadow-md hover:shadow-xl transition-all duration-300">
                  <span className="flex items-center gap-2 text-gray-600 font-medium">
                    <span className="text-2xl">
                      <Type width={18} height={18} className="text-gray-500" />
                    </span>
                    Area Type 
                  </span>

                  <select
                    value={field.type || ""}
                    onChange={handleTypeChange}
                    className="font-bold text-lg bg-transparent border-none focus:ring-0 outline-none text-emerald-700"
                  >
                    <option value="" disabled>
                      Select Type
                    </option>
                    {["Flood", "ICP", "Trial", "Drip"].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                {fieldInputs.map((item, idx) => (
                  <div key={idx} className="my-3">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2">
                        {item.icon}
                      </span>

                      <span className="absolute left-12 top-1/2 -translate-y-1/2 
                        text-gray-700 font-semibold text-sm">
                        {item.label}
                      </span>

                      <input
                        {...item.inputProps}
                        className={`w-full ${item.paddingLeft} pr-4 py-4 rounded-2xl border-2 border-emerald-200
                      focus:ring-4 focus:ring-emerald-300 focus:border-emerald-500
                      text-gray-800 shadow-lg transition-all duration-300
                      placeholder:text-gray-400
                      ${item.inputProps.disabled ? "bg-gradient-to-br from-gray-50 to-emerald-50" : ""}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 animate-bounce">🗺️</div>
              <p className="text-gray-500 text-lg font-medium">
                {uploadedShapesCount > 0 
                  ? `${uploadedShapesCount} shape${uploadedShapesCount !== 1 ? 's' : ''} loaded from file. Click "Edit Shape" on any shape to modify it.`
                  : 'Draw a shape or upload a KML/KMZ to see field details'
                }
              </p>
            </div>
          )}

          <SoilHealthTracker />

          <div className="relative space-y-6 mt-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-yellow-800">
                <Edit3 className="w-4 h-4" />
                <span className="font-semibold">Editing Instructions:</span>
              </div>
              <p className="text-yellow-700 text-sm mt-1">
                Click on any uploaded shape and select "Edit Shape" to make it editable. 
                Use the edit tools that appear on the map to modify the shape.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <button
                onClick={() => {
                  handleSubmit();
                }}
                disabled={submitting}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl text-base font-bold shadow-xl hover:shadow-2xl hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Save Field</span>
                  </>
                )}
              </button>

              <button
                onClick={discard}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-gray-300 rounded-2xl text-base font-bold hover:bg-gray-50 hover:border-gray-400 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Trash2 className="w-5 h-5" />
                <span>Discard</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}






// "use client";
// import React, {
//   useState,
//   useRef,
//   useEffect,
//   useImperativeHandle,
//   forwardRef,
// } from "react";
// import dynamic from "next/dynamic";
// import "leaflet/dist/leaflet.css";
// import "leaflet-draw/dist/leaflet.draw.css";
// import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
// import "leaflet-geosearch/dist/geosearch.css";
// import SearchControl from "../dashboard/SearchControl";
// import { useMap, Polygon, Polyline, Marker, Popup } from "react-leaflet";
// import KmZFileUploding from "../dashboard/KmZFileUploding";
// import * as turf from "@turf/turf";
// import L from "leaflet";
// import {
//   FileText,
//   Save,
//   Trash2,
//   Lock,
//   MapPin,
//   Check,
//   AreaChart,
//   Type,
//   NotepadTextDashedIcon,
//   Home,
//   Upload,
//   Edit3,
//   ArrowLeft,
// } from "lucide-react";
// import ProtectedPage from "../contact/ProtectedPage/AuthorizedPage";
// import SoilHealthTracker from "./SoilHealth";

// /* Fix Leaflet & Leaflet-Draw Icons (MUST HAVE) */
// const fixLeafletIcons = () => {
//   if (typeof window === "undefined") return;

//   delete L.Icon.Default.prototype._getIconUrl;
//   L.Icon.Default.mergeOptions({
//     iconRetinaUrl:
//       "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
//     iconUrl:
//       "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
//     shadowUrl:
//       "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
//   });
// };

// /* Dynamic Imports */
// const MapContainer = dynamic(
//   () => import("react-leaflet").then((m) => m.MapContainer),
//   { ssr: false }
// );
// const TileLayer = dynamic(
//   () => import("react-leaflet").then((m) => m.TileLayer),
//   { ssr: false }
// );
// const FeatureGroup = dynamic(
//   () => import("react-leaflet").then((m) => m.FeatureGroup),
//   { ssr: false }
// );
// const EditControl = dynamic(
//   () => import("react-leaflet-draw").then((m) => m.EditControl),
//   { ssr: false }
// );

// /* Constants */
// const initialCenter = [30.157, 71.5249];

// /* Utility Functions */
// function km2ToHectares(km2) {
//   return km2 * 100;
// }
// function km2ToAcres(km2) {
//   return km2 * 247.105;
// }
// function getDistance(lat1, lng1, lat2, lng2) {
//   const R = 6371;
//   const dLat = ((lat2 - lat1) * Math.PI) / 180;
//   const dLng = ((lng2 - lng1) * Math.PI) / 180;
//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos((lat1 * Math.PI) / 180) *
//     Math.cos((lat2 * Math.PI) / 180) *
//     Math.sin(dLng / 2) ** 2;
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// }
// function generateFarmId(coords) {
//   if (!Array.isArray(coords) || coords.length === 0) return `F-${Date.now()}`;
//   let lat = coords[0].lat || coords[0][0];
//   let lng = coords[0].lng || coords[0][1];
//   lat = Number(lat).toFixed(2);
//   lng = Number(lng).toFixed(2);
//   const ts = Date.now().toString().slice(-4);
//   return `F-${lat.replace(".", "")}${lng.replace(".", "")}${ts}`;
// }
// function computePolygonAreaKm2(latlngs) {
//   if (!latlngs || latlngs.length < 3) return 0;
//   const R = 6378137;
//   let total = 0;
//   const toRad = (d) => (d * Math.PI) / 180;
//   for (let i = 0, len = latlngs.length; i < len; i++) {
//     const [lat1, lon1] = latlngs[i];
//     const [lat2, lon2] = latlngs[(i + 1) % len];
//     total +=
//       toRad(lon2 - lon1) * (Math.sin(toRad(lat1)) + Math.sin(toRad(lat2)));
//   }
//   const area = Math.abs((total * (R * R)) / 2.0);
//   return area / 1_000_000;
// }
// function layerCoordsToArray(layer) {
//   const latlngs = [];
//   try {
//     const pts = layer.getLatLngs();
//     const ring = Array.isArray(pts[0]) ? pts[0] : pts;
//     ring.forEach((p) => latlngs.push([p.lat, p.lng]));
//   } catch {
//     if (layer.getBounds) {
//       const b = layer.getBounds();
//       latlngs.push(
//         [b.getSouthWest().lat, b.getSouthWest().lng],
//         [b.getSouthWest().lat, b.getNorthEast().lng],
//         [b.getNorthEast().lat, b.getNorthEast().lng],
//         [b.getNorthEast().lat, b.getSouthWest().lng]
//       );
//     }
//   }
//   return latlngs;
// }
// async function getCustomPlace(lat, lng) {
//   try {
//     const res = await fetch(
//       `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
//     );
//     const data = await res.json();
//     const addr = data.address || {};
//     return [addr.village, addr.county, addr.state, addr.country]
//       .filter(Boolean)
//       .join(", ");
//   } catch {
//     return "Unknown location";
//   }
// }
// function getCentroid(coords) {
//   let x = 0,
//     y = 0,
//     n = 0;
//   coords.forEach((pt) => {
//     x += pt.lat || pt[0];
//     y += pt.lng || pt[1];
//     n++;
//   });
//   return { lat: x / n, lng: y / n };
// }

// /* Auto-fit bounds component for uploaded shapes */
// function FitUploadedBounds({ shapes }) {
//   const map = useMap();

//   React.useEffect(() => {
//     if (shapes.length === 0) return;

//     const allPoints = shapes.flatMap(shape => shape.coordinates);
//     if (allPoints.length > 0) {
//       const bounds = L.latLngBounds(allPoints);
//       map.fitBounds(bounds, { padding: [20, 20] });
//     }
//   }, [shapes, map]);

//   return null;
// }

// /* Main Component */
// const FieldMapping = forwardRef(({ onAreaData, searchLocation }, ref) => {
//   const [loading, setLoading] = useState(false);
//   const mapRef = useRef(null);
//   const featureGroupRef = useRef(null);
//   const [areaInfo, setAreaInfo] = useState(null);
//   const [selectedTool, setSelectedTool] = useState("hand");
//   const [areaUnit, setAreaUnit] = useState("ac");
//   const [searchMarker, setSearchMarker] = useState(null);
//   const [forms, setForms] = useState([]);
//   const [uploadedShapes, setUploadedShapes] = useState([]);
//   const [editableLayers, setEditableLayers] = useState(new Map());

//   /* Fix icons on mount */
//   useEffect(() => {
//     fixLeafletIcons();
//   }, []);

//   /* Load saved data */
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     try {
//       const saved = localStorage.getItem("mapAreaInfo");
//       if (saved) setAreaInfo(JSON.parse(saved));
//       const unit = localStorage.getItem("areaUnit");
//       if (unit === "ha" || unit === "ac") setAreaUnit(unit);
//     } catch (e) {
//       console.warn("Failed to load saved data", e);
//     }
//   }, []);

//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     if (areaInfo) localStorage.setItem("mapAreaInfo", JSON.stringify(areaInfo));
//     else localStorage.removeItem("mapAreaInfo");
//   }, [areaInfo]);

//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     localStorage.setItem("areaUnit", areaUnit);
//   }, [areaUnit]);

//   /* Search location */
//   useEffect(() => {
//     if (!searchLocation || !mapRef.current) return;
//     const { lat, lng } = searchLocation;
//     mapRef.current.setView([lat, lng], 16);
//     if (searchMarker) mapRef.current.removeLayer(searchMarker);
//     const m = L.marker([lat, lng]).addTo(mapRef.current);
//     setSearchMarker(m);
//   }, [searchLocation]);

//   const updatePolygonDetails = (latlngsArr) => {
//     const areaKm2 = computePolygonAreaKm2(latlngsArr);
//     const coordsObjects = latlngsArr.map((p) => ({ lat: p[0], lng: p[1] }));
//     const farmId = generateFarmId(coordsObjects);
//     const data = {
//       type: "polygon",
//       coordinates: coordsObjects,
//       areaKm2,
//       areaHectares: km2ToHectares(areaKm2).toFixed(2),
//       areaAcres: km2ToAcres(areaKm2).toFixed(2),
//       farmId,
//     };
//     setAreaInfo(data);
//     onAreaData?.(data);
//     localStorage.setItem("mapAreaInfo", JSON.stringify(data));
//   };

//   const updateRectangleDetails = (latlngsArr) => {
//     let minLat = 90,
//       maxLat = -90,
//       minLng = 180,
//       maxLng = -180;
//     latlngsArr.forEach(([lat, lng]) => {
//       minLat = Math.min(minLat, lat);
//       maxLat = Math.max(maxLat, lat);
//       minLng = Math.min(minLng, lng);
//       maxLng = Math.max(maxLng, lng);
//     });
//     const width = getDistance(minLat, minLng, minLat, maxLng);
//     const height = getDistance(minLat, minLng, maxLat, minLng);
//     const areaKm2 = width * height;
//     const coordsObjects = latlngsArr.map((p) => ({ lat: p[0], lng: p[1] }));
//     const farmId = generateFarmId(coordsObjects);
//     const data = {
//       type: "rectangle",
//       width: width.toFixed(2),
//       height: height.toFixed(2),
//       areaKm2,
//       areaHectares: km2ToHectares(areaKm2).toFixed(2),
//       areaAcres: km2ToAcres(areaKm2).toFixed(2),
//       coordinates: coordsObjects,
//       farmId,
//     };
//     setAreaInfo(data);
//     onAreaData?.(data);
//     localStorage.setItem("mapAreaInfo", JSON.stringify(data));
//   };

//   const updateEditDetails = (layer) => {
//     let coords = [];

//     if (layer instanceof L.Rectangle || !layer.getLatLngs()[0]) {
//       const bounds = layer.getBounds();
//       coords = [
//         [bounds.getSouthWest().lat, bounds.getSouthWest().lng],
//         [bounds.getSouthWest().lat, bounds.getNorthEast().lng],
//         [bounds.getNorthEast().lat, bounds.getNorthEast().lng],
//         [bounds.getNorthEast().lat, bounds.getSouthWest().lng],
//       ];
//     } else {
//       coords = layer.getLatLngs()[0].map((p) => [p.lat, p.lng]);
//     }

//     const type = coords.length === 4 ? "rectangle" : "polygon";

//     if (type === "rectangle") {
//       let minLat = 90,
//         maxLat = -90,
//         minLng = 180,
//         maxLng = -180;
//       coords.forEach(([lat, lng]) => {
//         minLat = Math.min(minLat, lat);
//         maxLat = Math.max(maxLat, lat);
//         minLng = Math.min(minLng, lng);
//         maxLng = Math.max(maxLng, lng);
//       });
//       const width = getDistance(minLat, minLng, minLat, maxLng);
//       const height = getDistance(minLat, minLng, maxLat, minLng);
//       const areaKm2 = width * height;
//       const data = {
//         type: "rectangle",
//         width: width.toFixed(2),
//         height: height.toFixed(2),
//         areaKm2,
//         areaHectares: km2ToHectares(areaKm2).toFixed(2),
//         areaAcres: km2ToAcres(areaKm2).toFixed(2),
//         coordinates: coords.map(([lat, lng]) => ({ lat, lng })),
//         farmId: generateFarmId(coords),
//       };
//       setAreaInfo(data);
//       onAreaData?.(data);
//       localStorage.setItem("mapAreaInfo", JSON.stringify(data));
//     } else {
//       const areaKm2 = computePolygonAreaKm2(coords);
//       const data = {
//         type: "polygon",
//         coordinates: coords.map(([lat, lng]) => ({ lat, lng })),
//         areaKm2,
//         areaHectares: km2ToHectares(areaKm2).toFixed(2),
//         areaAcres: km2ToAcres(areaKm2).toFixed(2),
//         farmId: generateFarmId(coords),
//       };
//       setAreaInfo(data);
//       onAreaData?.(data);
//       localStorage.setItem("mapAreaInfo", JSON.stringify(data));
//     }
//   };

//   const _onCreated = (e) => {
//     const layer = e.layer;
//     featureGroupRef.current?.addLayer(layer);
//     const type = e.layerType;

//     if (type === "polygon" || type === "rectangle") {
//       const coords = layerCoordsToArray(layer);
//       if (type === "rectangle" || coords.length === 4) {
//         updateRectangleDetails(coords);
//       } else {
//         updatePolygonDetails(coords);
//       }
//     }
//   };

//   const _onEdited = (e) => {
//     const layers = e.layers;
//     layers.eachLayer((layer) => {
//       updateEditDetails(layer);
      
//       // Also update uploaded shapes if they were edited
//       const layerId = layer._leaflet_id;
//       if (editableLayers.has(layerId)) {
//         const shapeData = editableLayers.get(layerId);
//         const updatedCoords = layerCoordsToArray(layer);
        
//         // Update the uploaded shapes state
//         setUploadedShapes(prev => 
//           prev.map(shape => 
//             shape.id === shapeData.id 
//               ? { ...shape, coordinates: updatedCoords }
//               : shape
//           )
//         );
//       }
//     });
//   };

//   const _onDeleted = (e) => {
//     const layers = e.layers;
//     layers.eachLayer((layer) => {
//       // Remove from editable layers if it was an uploaded shape
//       const layerId = layer._leaflet_id;
//       if (editableLayers.has(layerId)) {
//         const shapeData = editableLayers.get(layerId);
//         setUploadedShapes(prev => prev.filter(shape => shape.id !== shapeData.id));
//         setEditableLayers(prev => {
//           const newMap = new Map(prev);
//           newMap.delete(layerId);
//           return newMap;
//         });
//       }
//     });

//     const remainingLayers = featureGroupRef.current?.getLayers() || [];
//     if (remainingLayers.length === 0) {
//       setAreaInfo(null);
//       localStorage.removeItem("mapAreaInfo");
//     } else {
//       const layer = remainingLayers[remainingLayers.length - 1];
//       const coords = layerCoordsToArray(layer);
//       if (coords.length === 4) updateRectangleDetails(coords);
//       else updatePolygonDetails(coords);
//     }
//   };

//   const onMapCreated = (map) => {
//     mapRef.current = map;

//     // restore shapes (if present)
//     if (areaInfo?.coordinates?.length) {
//       const coords = areaInfo.coordinates.map((c) => [c.lat, c.lng]);
//       const poly = L.polygon(coords, { color: "#2563eb", fillOpacity: 0.35 });
//       poly.addTo(map);
//       featureGroupRef.current?.addLayer(poly);
//       map.fitBounds(poly.getBounds());
//     }

//     // Add search control
//     const provider = new OpenStreetMapProvider();
//     const searchControl = new GeoSearchControl({
//       provider,
//       style: "bar",
//       showMarker: true,
//       showPopup: false,
//       autoClose: true,
//       retainZoomLevel: false,
//     });
//     map.addControl(searchControl);

//     map.on("geosearch/showlocation", function (result) {
//       const { x: lng, y: lat } = result.location;
//       if (searchMarker) map.removeLayer(searchMarker);
//       const m = L.marker([lat, lng]).addTo(map);
//       setSearchMarker(m);
//       map.setView([lat, lng], 16);
//     });
//   };

//   useImperativeHandle(ref, () => ({
//     getMap: () => mapRef.current,
//     clearShapes: () => {
//       featureGroupRef.current?.clearLayers();
//       setAreaInfo(null);
//       setUploadedShapes([]);
//       setEditableLayers(new Map());
//       localStorage.removeItem("mapAreaInfo");
//     },
//   }));

//   /* Handle shapes parsed from KMZ upload */
//   const handleShapesParsed = (shapes) => {
//     setUploadedShapes(shapes);
    
//     // If there are polygons, use the first one as the main area
//     const polygons = shapes.filter(shape => shape.type === "polygon");
//     if (polygons.length > 0) {
//       const firstPolygon = polygons[0];
//       const coords = firstPolygon.coordinates;
//       const areaKm2 = computePolygonAreaKm2(coords);
//       const coordsObjects = coords.map(p => ({ lat: p[0], lng: p[1] }));
//       const farmId = generateFarmId(coordsObjects);
      
//       const data = {
//         type: "polygon",
//         coordinates: coordsObjects,
//         areaKm2,
//         areaHectares: km2ToHectares(areaKm2).toFixed(2),
//         areaAcres: km2ToAcres(areaKm2).toFixed(2),
//         farmId,
//       };
      
//       setAreaInfo(data);
//       onAreaData?.(data);
//       localStorage.setItem("mapAreaInfo", JSON.stringify(data));
//     }
//   };

//   // Function to make uploaded shapes editable
//   const makeShapeEditable = (shape, layer) => {
//     if (layer && featureGroupRef.current) {
//       // Add the layer to the feature group for editing
//       featureGroupRef?.current?.addLayer(layer);
      
//       // Store reference to this layer
//       setEditableLayers(prev => {
//         const newMap = new Map(prev);
//         newMap.set(layer._leaflet_id, shape);
//         return newMap;
//       });
//     }
//   };

//   // Function to remove shape from editable state
//   const removeShapeFromEditing = (layerId) => {
//     setEditableLayers(prev => {
//       const newMap = new Map(prev);
//       newMap.delete(layerId);
//       return newMap;
//     });
//   };

//   const getAreaInSelectedUnit = () => {
//     if (!areaInfo || !areaInfo.areaKm2) return 0;
//     const km2 = Number(areaInfo.areaKm2);
//     if (areaUnit === "ac") return Number((km2 * 247.105).toFixed(2));
//     if (areaUnit === "ha") return Number((km2 * 100).toFixed(2));
//     return Number(km2.toFixed(6));
//   };

//   // KML file upload functionality
//   async function handleKmlUpload(file) {
//     if (!file) return;

//     const reader = new FileReader();

//     reader.onload = async (e) => {
//       const text = e.target.result;
//       const parser = new DOMParser();
//       const xmlDoc = parser.parseFromString(text, "application/xml");

//       const coordsNodes = xmlDoc.getElementsByTagName("coordinates");
//       if (!coordsNodes.length) return;

//       const newShapes = [];

//       for (let i = 0; i < coordsNodes.length; i++) {
//         const rawCoords = coordsNodes[i].textContent.trim();

//         const coordsArray = rawCoords
//           .split(/\s+/)
//           .map((pair) => {
//             const [lng, lat] = pair.split(",").map(Number);
//             return [lat, lng];
//           })
//           .filter(([lat, lng]) => !isNaN(lat) && !isNaN(lng));

//         if (coordsArray.length < 3) continue;

//         const areaKm2 = computePolygonAreaKm2(coordsArray);
//         const coordsObjects = coordsArray.map((p) => ({ lat: p[0], lng: p[1] }));
//         const farmId = generateFarmId(coordsObjects);

//         const polygonData = {
//           type: "polygon",
//           coordinates: coordsObjects,
//           areaKm2,
//           areaHectares: km2ToHectares(areaKm2).toFixed(2),
//           areaAcres: km2ToAcres(areaKm2).toFixed(2),
//           farmId,
//           id: `kml-${Date.now()}-${i}`
//         };

//         newShapes.push(polygonData);
//       }

//       if (!newShapes.length) return;

//       setUploadedShapes(newShapes);
//       const lastPolygon = newShapes[newShapes.length - 1];
//       setAreaInfo(lastPolygon);
//       onAreaData?.(lastPolygon);
//     };

//     reader.readAsText(file);
//   }

//   return (
//     <ProtectedPage>
//       <div className="flex w-full overflow-hidden bg-gray-50">
//         <div className="flex-1 flex flex-col overflow-hidden">
//           <div className="flex-1 overflow-y-auto">
//             {/* KMZ Upload Component */}
//             <KmZFileUploding 
//               map={mapRef.current} 
//               onShapesParsed={handleShapesParsed}
//             />


//             {/* KML Upload Button */}
//             <div className="sticky top-32 right-7  z-50">
//               <label
//                 htmlFor="kml-upload"
//                 className="fixed top-[233px] right-8 flex justify-center items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 cursor-pointer py-3 rounded-lg shadow-lg z-50 hover:from-emerald-700 hover:to-teal-700 transition-all duration-300"
//               >
//                 <Upload className="w-5 h-5" />
//                 Upload KML
//               </label>

//               <input
//                 id="kml-upload"
//                 type="file"
//                 accept=".kml"
//                 className="hidden"
//                 onChange={(e) => handleKmlUpload(e.target.files[0])}
//               />
//             </div>

//             {/* Clear All Button */}
//             <div className="sticky top-72 right-7 z-50">
//               <button
//                 onClick={() => {
//                   featureGroupRef.current?.clearLayers();
//                   setAreaInfo(null);
//                   setUploadedShapes([]);
//                   setEditableLayers(new Map());
//                   localStorage.removeItem("mapAreaInfo");
//                 }}
//                 className="fixed top-[285px] right-8 flex justify-center items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 cursor-pointer py-3 rounded-lg shadow-lg z-50 hover:from-red-700 hover:to-orange-700 transition-all duration-300"
//               >
//                 <Trash2 className="w-5 h-5" />
//                 Clear All
//               </button>
//             </div>

//             {/* Map */}
//             <div className="bg-white shadow-2xl overflow-hidden border border-gray-200 h-[600px] mb-8">
//               {typeof window !== "undefined" && (
//                 <MapContainer
//                   center={initialCenter}
//                   zoom={13}
//                   style={{ height: "100%", width: "100%", zIndex: "1" }}
//                   whenCreated={onMapCreated}
//                 >
//                   <TileLayer
//                     url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
//                     attribution="Esri World Imagery"
//                   />

//                   <FeatureGroup ref={featureGroupRef}>
//                     <EditControl
//                       key={selectedTool}
//                       position="topleft"
//                       onCreated={_onCreated}
//                       onEdited={_onEdited}
//                       onDeleted={_onDeleted}
//                       draw={{
//                         rectangle: true,
//                         polygon: true,
//                         circle: false,
//                         marker: false,
//                         polyline: false,
//                         circlemarker: false,
//                       }}
//                       edit={{
//                         edit: true,
//                         remove: true,
//                       }}
//                     />
//                   </FeatureGroup>

//                   {/* Render uploaded KMZ shapes */}
//                   {uploadedShapes.map((shape, index) => {
//                     if (shape.type === "polygon") {
//                       return (
//                         <Polygon 
//                           key={shape.id} 
//                           positions={shape.coordinates}
//                           color="blue"
//                           fillOpacity={0.3}
//                           eventHandlers={{
//                             click: (e) => {
//                               const layer = e.target;
//                               makeShapeEditable(shape, layer);
//                             }
//                           }}
//                         >
//                           <Popup>
//                             <div className="p-2">
//                               <h3 className="font-bold">{shape.name}</h3>
//                               {/* <p>Type: Polygon</p>
//                               <p>Points: {shape.coordinates.length}</p> */}
//                               <p className="flex justify-center items-center gap-10">
//                                 <ArrowLeft/>
//                                  Click the Edit button</p>
//                               {/* <button
//                                 onClick={(e) => {
//                                   const layer = e.target;
//                                   makeShapeEditable(shape, layer);
//                                 }}
//                                 className="mt-2 flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
//                               >
//                                 <Edit3 className="w-3 h-3" />
//                                 Edit Shape
//                               </button> */}
//                             </div>
//                           </Popup>
//                         </Polygon>
//                       );
//                     }
                    
//                     if (shape.type === "polyline") {
//                       return (
//                         <Polyline 
//                           key={shape.id} 
//                           positions={shape.coordinates}
//                           color="red"
//                           weight={3}
//                           eventHandlers={{
//                             click: (e) => {
//                               const layer = e.target;
//                               makeShapeEditable(shape, layer);
//                             }
//                           }}
//                         >
//                           <Popup>
//                             <div className="p-2">
//                               <h3 className="font-bold">{shape.name}</h3>
//                               <p>Type: Polyline</p>
//                               <button
//                                 onClick={() => {
//                                   const layer = e.target;
//                                   makeShapeEditable(shape, layer);
//                                 }}
//                                 className="mt-2 flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
//                               >
//                                 <Edit3 className="w-3 h-3" />
//                                 Edit Shape
//                               </button>
//                             </div>
//                           </Popup>
//                         </Polyline>
//                       );
//                     }
                    
//                     if (shape.type === "point") {
//                       return (
//                         <Marker 
//                           key={shape.id} 
//                           position={shape.coordinates[0]}
//                           eventHandlers={{
//                             click: (e) => {
//                               const layer = e.target;
//                               makeShapeEditable(shape, layer);
//                             }
//                           }}
//                         >
//                           <Popup>
//                             <div className="p-2">
//                               <h3 className="font-bold">{shape.name}</h3>
//                               <p>Type: Point</p>
//                               <button
//                                 onClick={() => {
//                                   const layer = e.target;
//                                   makeShapeEditable(shape, layer);
//                                 }}
//                                 className="mt-2 flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
//                               >
//                                 <Edit3 className="w-3 h-3" />
//                                 Edit Point
//                               </button>
//                             </div>
//                           </Popup>
//                         </Marker>
//                       );
//                     }
                    
//                     return null;
//                   })}

//                   {areaInfo?.coordinates && (
//                     <Marker
//                       position={[
//                         getCentroid(areaInfo.coordinates).lat,
//                         getCentroid(areaInfo.coordinates).lng,
//                       ]}
//                     />
//                   )}

//                   <SearchControl
//                     style="bar"
//                     showMarker={true}
//                     autoClose={true}
//                     searchLabel="Enter address to search"
//                     retainZoomLevel={false}
//                   />

//                   {/* Auto-fit bounds for uploaded shapes */}
//                   <FitUploadedBounds shapes={uploadedShapes} />
//                 </MapContainer>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Details */}
//       <MapDetail
//         mapAreaInfo={areaInfo || {}}
//         selectedUnit={areaUnit}
//         setSelectedUnit={setAreaUnit}
//         farmId={areaInfo?.farmId || `F-${Date.now()}`}
//         getAreaInSelectedUnit={getAreaInSelectedUnit}
//         forms={forms}
//         uploadedShapesCount={uploadedShapes.length}
//         postFields={async (payload) => {
//           setLoading(true);
//           try {
//             console.log("POST payload ->", payload);
//             const res = await fetch(
//               "https://earthscansystems.com/farmerdatauser/userfarm/",
//               {
//                 method: "POST",
//                 headers: {
//                   "Content-Type": "application/json",
//                   Authorization: `Bearer ${localStorage.getItem("access")}`,
//                 },
//                 body: JSON.stringify(payload),
//               }
//             );
//             const text = await res.text();
//             let data;
//             try {
//               data = JSON.parse(text);
//             } catch {
//               data = { raw: text };
//             }
//             if (!res.ok) {
//               console.error("Server error:", res.status, data);
//               throw new Error(
//                 `Server responded ${res.status} - ${JSON.stringify(data)}`
//               );
//             }
//             setForms((p) => [data, ...p]);
//             return data;
//           } finally {
//             setLoading(false);
//           }
//         }}
//       />
//     </ProtectedPage>
//   );
// });

// FieldMapping.displayName = "FieldMapping";
// export default FieldMapping;

// /* MapDetail component */
// function MapDetail({
//   mapAreaInfo = {},
//   setSelectedUnit = () => { },
//   selectedUnit = "ac",
//   farmId = null,
//   getAreaInSelectedUnit = null,
//   postFields = async () => { },
//   loading = false,
//   uploadedShapesCount = 0,
// }) {
//   const [finalPlace, setFinalPlace] = useState("");
//   const [field, setField] = useState(mapAreaInfo || {});
//   const [showSoilModal, setShowSoilModal] = useState(false);
//   const [file, setFile] = useState(null);
//   const [fileName, setFileName] = useState("");
//   const [loadingReport, setLoadingReport] = useState(false);
//   const [reportResult, setReportResult] = useState(null);
//   const [formData, setFormData] = useState({
//     farm_name: "",
//     notes: "",
//     area: getAreaInSelectedUnit ? getAreaInSelectedUnit() : 0,
//     unit: selectedUnit,
//     farm_id: farmId,
//     user: 1,
//   });
//   const [submitting, setSubmitting] = useState(false);
//   const [parsedCoordinates, setParsedCoordinates] = useState([]);
//   const [copied, setCopied] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);

//   useEffect(() => {
//     if (!mapAreaInfo) return;
//     if (mapAreaInfo.coordinates) {
//       setParsedCoordinates(mapAreaInfo.coordinates);
//     } else {
//       setParsedCoordinates([]);
//     }

//     const computedArea = getAreaInSelectedUnit
//       ? getAreaInSelectedUnit()
//       : mapAreaInfo.areaKm2
//         ? selectedUnit === "ac"
//           ? Number((mapAreaInfo.areaKm2 * 247.105).toFixed(2))
//           : selectedUnit === "ha"
//             ? Number((mapAreaInfo.areaKm2 * 100).toFixed(2))
//             : Number(mapAreaInfo.areaKm2.toFixed(6))
//         : 0;

//     setFormData((prev) => ({
//       ...prev,
//       area: computedArea,
//       unit: selectedUnit,
//       farm_id: farmId,
//     }));
//   }, [mapAreaInfo, selectedUnit, farmId, getAreaInSelectedUnit]);

//   useEffect(() => {
//     if (!parsedCoordinates?.length) return;
//     async function loadPlace() {
//       const center = getCentroid(parsedCoordinates);
//       const location = await getCustomPlace(center.lat, center.lng);
//       setFinalPlace(location);
//     }
//     loadPlace();
//   }, [JSON.stringify(parsedCoordinates)]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((p) => ({ ...p, [name]: value }));
//   };
//   const handleNotes = (e) => {
//     const { name, value } = e.target;
//     setFormData((p) => ({ ...p, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const selected = e.target.files[0];
//     if (!selected) return;
//     setFile(selected);
//     setFileName(selected.name);
//     setReportResult(null);
//   };

//   const onSubmitFile = async () => {
//     if (!file) return;
//     setLoadingReport(true);
//     setTimeout(() => {
//       const isGood = Math.random() > 0.5;
//       setReportResult(isGood ? "Good" : "Bad");
//       setLoadingReport(false);
//     }, 2000);
//   };

//   const handleSubmit = async () => {
//     if (!formData.farm_name) return alert("Please enter farm name");

//     const payload = {
//       ...formData,
//       shape_type: mapAreaInfo.type || "rectangle",
//       coordinates: parsedCoordinates,
//       width: mapAreaInfo.width || null,
//       height: mapAreaInfo.height || null,
//       area: formData.area,
//     };

//     try {
//       setSubmitting(true);
//       console.log("Submitting payload:", payload);
//       const data = await postFields(payload);
//       console.log("Server response:", data);
//       setShowSuccess(true);
//       setTimeout(() => setShowSuccess(false), 3000);
//       setFormData((p) => ({ ...p, farm_name: "" }));
//       localStorage.removeItem("mapAreaInfo");
//       setTimeout(() => window.location.reload(), 1200);
//     } catch (err) {
//       console.error("Submit failed:", err);
//       alert("Submit failed: " + (err.message || err));
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const discard = () => {
//     if (typeof window !== "undefined") {
//       localStorage.removeItem("mapAreaInfo");
//       window.location.reload();
//     }
//   };

//   const areaTypes = ["Flood", "ICP", "Trial", "Drip"];
//   const handleTypeChange = (e) => {
//     setField((prev) => ({ ...prev, type: e.target.value }));
//   };

//   const fieldInputs = [
//     {
//       key: "place",
//       label: "Place:",
//       icon: <MapPin className="text-emerald-600 w-5 h-5" />,
//       inputProps: {
//         disabled: true,
//         value: finalPlace || "loading place…",
//       },
//       paddingLeft: "pl-32",
//     },
//     {
//       key: "notes",
//       label: "Notes:",
//       icon: <NotepadTextDashedIcon className="text-emerald-600 w-5 h-5" />,
//       inputProps: {
//         name: "notes",
//         value: formData.notes,
//         onChange: handleNotes,
//         placeholder: "Enter any notes...",
//       },
//       paddingLeft: "pl-24",
//     },
//     {
//       key: "farm_name",
//       label: "Turbin Number:",
//       icon: <Home className="text-emerald-600 w-5 h-5" />,
//       inputProps: {
//         name: "farm_name",
//         value: formData.farm_name,
//         onChange: handleChange,
//         placeholder: "Enter your farm name...",
//       },
//       paddingLeft: "pl-[152px]",
//     },
//     {
//       key: "Turbin Number",
//       label: "Farm Name:",
//       icon: <Home className="text-emerald-600 w-5 h-5" />,
//       inputProps: {
//         name: "Turbin Number",
//         value: formData.farm_name,
//         onChange: handleChange,
//         placeholder: "Enter your Turbin number...",
//       },
//       paddingLeft: "pl-36",
//     },
//   ];

//   return (
//     <>
//       {showSuccess && (
//         <div className="fixed  top-4 right-4 z-50 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-down">
//           <Check className="w-6 h-6" />
//           <span className="font-semibold">Field saved successfully!</span>
//         </div>
//       )}
//       {(mapAreaInfo && Object.keys(mapAreaInfo).length > 0) || uploadedShapesCount > 0 ? (
//         <div className=" bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/30 rounded-3xl shadow-2xl border border-emerald-100 p-8 overflow-hidden transform  transition-all duration-500">
//           <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse"></div>
//           <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse"></div>

//           <div className="relative flex items-center justify-between border-b border-emerald-200 pb-6 mb-8">
//             <h2 className="font-bold text-3xl text-gray-800 flex items-center gap-3">
//               <span className="text-4xl">🌾</span>
//               <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
//                 Field Information
//               </span>
//             </h2>
//             {uploadedShapesCount > 0 && (
//               <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
//                 {uploadedShapesCount} shape{uploadedShapesCount !== 1 ? 's' : ''} loaded
//               </div>
//             )}
//           </div>

//           {mapAreaInfo && Object.keys(mapAreaInfo).length > 0 ? (
//             <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8">
//               <div className="space-y-5">
//                 {[{
//                   label: "Farm ID",
//                   value: mapAreaInfo.farmId ? `${mapAreaInfo.farmId}` : "-",
//                   icon: (
//                     <Lock width={18} height={18} className="text-gray-500" />
//                   ),
//                 },
//                 {
//                   label: "Area",
//                   value: mapAreaInfo.areaKm2
//                     ? selectedUnit === "ac"
//                       ? ` ${(mapAreaInfo.areaKm2 * 247.105).toFixed(2)} ac`
//                       : selectedUnit === "ha"
//                         ? `${(mapAreaInfo.areaKm2 * 100).toFixed(2)} ha`
//                         : `${mapAreaInfo.areaKm2} km²`
//                     : "-",
//                   icon: (
//                     <AreaChart
//                       width={18}
//                       height={18}
//                       className="text-gray-500"
//                     />
//                   ),
//                 },
//                 ].map((item, idx) => (
//                   <div
//                     key={idx}
//                     className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100 shadow-md hover:shadow-xl transition-all duration-300"
//                   >
//                     <span className="flex items-center gap-2 text-gray-600 font-medium">
//                       <span className="text-2xl">{item.icon}</span>
//                       {item.label}
//                     </span>
//                     <span className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
//                       {item.value}
//                     </span>
//                   </div>
//                 ))}

//                 <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100 shadow-md hover:shadow-xl transition-all duration-300">
//                   <span className="flex items-center gap-2 text-gray-600 font-medium">
//                     <span className="text-2xl">
//                       <Type width={18} height={18} className="text-gray-500" />
//                     </span>
//                     Type
//                   </span>

//                   <select
//                     value={field.type || ""}
//                     onChange={handleTypeChange}
//                     className="font-bold text-lg bg-transparent border-none focus:ring-0 outline-none text-emerald-700"
//                   >
//                     <option value="" disabled>
//                       Select Type
//                     </option>
//                     {["Flood", "ICP", "Trial", "Drip"].map((t) => (
//                       <option key={t} value={t}>
//                         {t}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 {fieldInputs.map((item, idx) => (
//                   <div key={idx} className="my-3">
//                     <div className="relative">
//                       <span className="absolute left-4 top-1/2 -translate-y-1/2">
//                         {item.icon}
//                       </span>

//                       <span className="absolute left-12 top-1/2 -translate-y-1/2 
//                         text-gray-700 font-semibold text-sm">
//                         {item.label}
//                       </span>

//                       <input
//                         {...item.inputProps}
//                         className={`w-full ${item.paddingLeft} pr-4 py-4 rounded-2xl border-2 border-emerald-200
//                       focus:ring-4 focus:ring-emerald-300 focus:border-emerald-500
//                       text-gray-800 shadow-lg transition-all duration-300
//                       placeholder:text-gray-400
//                       ${item.inputProps.disabled ? "bg-gradient-to-br from-gray-50 to-emerald-50" : ""}`}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>

//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <div className="text-6xl mb-4 animate-bounce">🗺️</div>
//               <p className="text-gray-500 text-lg font-medium">
//                 {uploadedShapesCount > 0 
//                   ? `${uploadedShapesCount} shape${uploadedShapesCount !== 1 ? 's' : ''} loaded from file. Click "Edit Shape" on any shape to modify it.`
//                   : 'Draw a shape or upload a KML/KMZ to see field details'
//                 }
//               </p>
//             </div>
//           )}

//           <SoilHealthTracker />

//           <div className="relative space-y-6 mt-6">
//             <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
//               <div className="flex items-center gap-2 text-yellow-800">
//                 <Edit3 className="w-4 h-4" />
//                 <span className="font-semibold">Editing Instructions:</span>
//               </div>
//               <p className="text-yellow-700 text-sm mt-1">
//                 Click on any uploaded shape and select "Edit Shape" to make it editable. 
//                 Use the edit tools that appear on the map to modify the shape.
//               </p>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//               <button
//                 onClick={() => {
//                   handleSubmit();
//                 }}
//                 disabled={submitting}
//                 className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl text-base font-bold shadow-xl hover:shadow-2xl hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {submitting ? (
//                   <>
//                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     <span>Saving...</span>
//                   </>
//                 ) : (
//                   <>
//                     <Save className="w-5 h-5" />
//                     <span>Save Field</span>
//                   </>
//                 )}
//               </button>

//               <button
//                 onClick={discard}
//                 className="flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-gray-300 rounded-2xl text-base font-bold hover:bg-gray-50 hover:border-gray-400 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
//               >
//                 <Trash2 className="w-5 h-5" />
//                 <span>Discard</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : null}
//     </>
//   );
// }

