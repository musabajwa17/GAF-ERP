import React, { useEffect, useState, useRef } from "react";
import {
  Search,
  LandPlot,
  MapPin,
  Maximize2,
  Square,
  Hexagon,
  Navigation,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ProtectedPage from "../contact/ProtectedPage/AuthorizedPage";
import History_detail_history from "../dashboard/History_detail_history";
import dynamic from 'next/dynamic';

// Dynamically import Leaflet components with no SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Polygon = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polygon),
  { ssr: false }
);
const Rectangle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Rectangle),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// Shape Details Modal Component
function ShapeDetailsModal({ shape, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    area: '',
    unit: 'hectares'
  });

  useEffect(() => {
    if (shape) {
      setFormData({
        name: `Field-${shape.id.slice(-4)}`,
        area: shape.areaHectares,
        unit: 'hectares'
      });
    }
  }, [shape]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...shape,
      name: formData.name,
      savedArea: formData.area,
      unit: formData.unit
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            Save Field Shape
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Field Name
            </label>
            <input
              type="text"
              required
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter field name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Area
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                required
                step="0.01"
                className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                value={formData.area}
                onChange={(e) => setFormData({...formData, area: e.target.value})}
              />
              <select
                className="p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
              >
                <option value="hectares">Hectares</option>
                <option value="acres">Acres</option>
                <option value="sqmeters">Square Meters</option>
              </select>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium text-green-800">Auto ID:</span>
                <p className="text-green-700">{shape?.id}</p>
              </div>
              <div>
                <span className="font-medium text-green-800">Shape Type:</span>
                <p className="text-green-700 capitalize">{shape?.type}</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              Save Field
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Custom Drawing Tools Component
function CustomDrawingTools({ onShapeCreated, farms, selectedFarm, onFarmSelect }) {
  const [drawnShapes, setDrawnShapes] = useState([]);
  const [drawingMode, setDrawingMode] = useState(null);
  const [currentShape, setCurrentShape] = useState([]);

  // Load shapes from localStorage on component mount
  useEffect(() => {
    const savedShapes = localStorage.getItem('farmShapes');
    if (savedShapes) {
      const shapes = JSON.parse(savedShapes);
      setDrawnShapes(shapes);
    }
  }, []);

  // Function to calculate area in square meters
  const calculateArea = (coordinates) => {
    if (!coordinates || coordinates.length < 3) return 0;
    
    let area = 0;
    const coords = coordinates;
    
    for (let i = 0; i < coords.length - 1; i++) {
      const [x1, y1] = [coords[i].lng, coords[i].lat];
      const [x2, y2] = [coords[i + 1].lng, coords[i + 1].lat];
      area += (x1 * y2 - x2 * y1);
    }
    
    return Math.abs(area) / 2;
  };

  const handleMapClick = (e) => {
    if (!drawingMode) return;

    const { lat, lng } = e.latlng;
    const newPoint = { lat, lng };

    if (drawingMode === 'polygon') {
      setCurrentShape(prev => [...prev, newPoint]);
    } else if (drawingMode === 'rectangle' && currentShape.length < 2) {
      const newShape = [...currentShape, newPoint];
      setCurrentShape(newShape);
      
      if (newShape.length === 2) {
        const rectCoordinates = createRectangleCoordinates(newShape[0], newShape[1]);
        finishDrawing(rectCoordinates, 'rectangle');
      }
    }
  };

  const createRectangleCoordinates = (point1, point2) => {
    return [
      point1,
      { lat: point1.lat, lng: point2.lng },
      point2,
      { lat: point2.lat, lng: point1.lng },
      point1
    ];
  };

  const finishDrawing = (coordinates, type) => {
    if (coordinates.length < 3) return;

    const area = calculateArea(coordinates);
    const newShape = {
      id: `shape-${Date.now()}`,
      type: type,
      coordinates: coordinates,
      area: area,
      areaHectares: (area / 10000).toFixed(2),
      createdAt: new Date().toISOString()
    };

    const updatedShapes = [...drawnShapes, newShape];
    setDrawnShapes(updatedShapes);
    localStorage.setItem('farmShapes', JSON.stringify(updatedShapes));
    
    onShapeCreated(newShape);
    
    setDrawingMode(null);
    setCurrentShape([]);
  };

  const completePolygon = () => {
    if (currentShape.length >= 3) {
      const closedShape = [...currentShape, currentShape[0]];
      finishDrawing(closedShape, 'polygon');
    }
  };

  const cancelDrawing = () => {
    setDrawingMode(null);
    setCurrentShape([]);
  };

  return (
    <>
      {/* Enhanced Drawing Controls */}
      <div className="leaflet-top leaflet-right">
        <div className="leaflet-control leaflet-bar bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-gray-200">
          <h4 className="font-bold text-gray-800 mb-3 text-sm">Drawing Tools</h4>
          <div className="space-y-2">
            <button
              onClick={() => setDrawingMode('polygon')}
              className={`w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                drawingMode === 'polygon' 
                  ? 'bg-green-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
              }`}
            >
              <Hexagon className="w-4 h-4" />
              Draw Polygon
            </button>
            <button
              onClick={() => setDrawingMode('rectangle')}
              className={`w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                drawingMode === 'rectangle' 
                  ? 'bg-green-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
              }`}
            >
              <Square className="w-4 h-4" />
              Draw Rectangle
            </button>
            {drawingMode && (
              <div className="pt-2 border-t border-gray-200 space-y-2">
                {drawingMode === 'polygon' && currentShape.length >= 3 && (
                  <button
                    onClick={completePolygon}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <Navigation className="w-4 h-4" />
                    Complete Polygon
                  </button>
                )}
                <button
                  onClick={cancelDrawing}
                  className="w-full px-4 py-3 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Current drawing shape */}
      {drawingMode && currentShape.length > 0 && (
        <Polygon
          positions={currentShape}
          pathOptions={{ 
            color: '#EF4444', 
            fillColor: '#EF4444', 
            fillOpacity: 0.3,
            dashArray: '8, 8',
            weight: 3
          }}
          eventHandlers={{ click: handleMapClick }}
        />
      )}
      
      {/* Render farm boundaries with selection highlighting */}
      {farms.map((farm, index) => (
        farm.coordinates && farm.coordinates.length > 0 && (
          <Polygon
            key={`farm-${index}`}
            positions={farm.coordinates.map(coord => [coord.lat, coord.lng])}
            pathOptions={{ 
              color: selectedFarm?.farm_id === farm.farm_id ? '#10B981' : '#3B82F6', 
              fillColor: selectedFarm?.farm_id === farm.farm_id ? '#10B981' : '#3B82F6',
              fillOpacity: selectedFarm?.farm_id === farm.farm_id ? 0.4 : 0.2,
              weight: selectedFarm?.farm_id === farm.farm_id ? 4 : 2
            }}
            eventHandlers={{
              click: () => {
                onFarmSelect(farm);
              }
            }}
          />
        )
      ))}
      
      {/* Render saved shapes */}
      {drawnShapes.map((shape, index) => (
        shape.type === 'polygon' ? (
          <Polygon
            key={`shape-${index}`}
            positions={shape.coordinates}
            pathOptions={{ 
              color: '#F59E0B', 
              fillColor: '#F59E0B', 
              fillOpacity: 0.4,
              weight: 2
            }}
          />
        ) : shape.type === 'rectangle' ? (
          <Rectangle
            key={`shape-${index}`}
            bounds={shape.coordinates}
            pathOptions={{ 
              color: '#F59E0B', 
              fillColor: '#F59E0B', 
              fillOpacity: 0.4,
              weight: 2
            }}
          />
        ) : null
      ))}

      {/* Selected Farm Center Marker */}
      {selectedFarm && selectedFarm.coordinates && selectedFarm.coordinates.length > 0 && (
        <Marker position={[
          selectedFarm.coordinates.reduce((sum, coord) => sum + coord.lat, 0) / selectedFarm.coordinates.length,
          selectedFarm.coordinates.reduce((sum, coord) => sum + coord.lng, 0) / selectedFarm.coordinates.length
        ]}>
          <Popup>
            <div className="text-sm font-medium">
              {selectedFarm.farm_name}
            </div>
          </Popup>
        </Marker>
      )}
    </>
  );
}

// Main Map Component
function FarmMap({ farms, onShapeCreated, selectedFarm, onFarmSelect }) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Map...</p>
        </div>
      </div>
    );
  }

  const center = selectedFarm && selectedFarm.coordinates && selectedFarm.coordinates.length > 0
    ? [
        selectedFarm.coordinates.reduce((sum, coord) => sum + coord.lat, 0) / selectedFarm.coordinates.length,
        selectedFarm.coordinates.reduce((sum, coord) => sum + coord.lng, 0) / selectedFarm.coordinates.length
      ]
    : [20.5937, 78.9629];

  return (
    <div  className="bg-white shadow-2xl overflow-hidden border border-gray-200 w-full h-[600px] mb-8">
    <MapContainer
      center={center}
      zoom={selectedFarm ? 14 : 5}
      style={{ height: '100%', width: '100%', borderRadius: '16px' }}
      
      >
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      <CustomDrawingTools 
        onShapeCreated={onShapeCreated} 
        farms={farms}
        selectedFarm={selectedFarm}
        onFarmSelect={onFarmSelect}
        />
    </MapContainer>
        </div>
  );
}

export default function Fields() {
  const [allFields, setAllFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showhistorydetailhistory, setShowhistorydetailhistory] = useState(false);
  const [selectedShape, setSelectedShape] = useState(null);
  const [showShapeModal, setShowShapeModal] = useState(false);
  const [savedFields, setSavedFields] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);

  // Load saved fields from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedFields');
    if (saved) {
      setSavedFields(JSON.parse(saved));
    }
  }, []);

  // ✅ Fetch API data
  useEffect(() => {
    const fetchFields = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://earthscansystems.com/farmerdatauser/userfarm/",{
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch fields");
        }
        const data = await response.json();

        if (Array.isArray(data)) {
          setAllFields(data);
        } else {
          setAllFields([data]);
        }
      } catch (error) {
        console.error("Error fetching fields:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, []);

  const handleShapeCreated = (shape) => {
    setSelectedShape(shape);
    setShowShapeModal(true);
  };

  const handleSaveShape = (savedShape) => {
    const updatedFields = [...savedFields, savedShape];
    setSavedFields(updatedFields);
    localStorage.setItem('savedFields', JSON.stringify(updatedFields));
  };

  const handleFarmSelect = (farm) => {
    setSelectedFarm(farm);
  };

  const clearSelection = () => {
    setSelectedFarm(null);
  };

  // ✅ Filter logic
  const filteredFields = allFields.filter(
    (farm) =>
      farm.farm_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farm.farm_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Combine API fields and saved drawn fields
  const allDisplayFields = [...filteredFields, ...savedFields];

  // ✅ Loading UI
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-lg w-48 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 p-4"
                >
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-48"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded-full w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto p-6">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  Farm Management
                </h1>
                <p className="text-gray-600 text-lg">
                  Manage and monitor all your agricultural fields
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-700">
                    {allDisplayFields.length}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">
                    Total Fields
                  </div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by Farm ID or name..."
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-3 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200 bg-white/70 backdrop-blur-sm text-lg font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl mb-8 border border-gray-100 overflow-hidden relative">
            <div className="h-[500px] w-full">
              <FarmMap 
                farms={allFields} 
                onShapeCreated={handleShapeCreated}
                selectedFarm={selectedFarm}
                onFarmSelect={handleFarmSelect}
              />
            </div>
            
            {/* Enhanced Instructions */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-gray-200 z-[1000] max-w-xs">
              <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2 text-sm">
                <Navigation className="w-4 h-4 text-green-600" />
                Drawing Guide
              </h4>
              <div className="space-y-1 text-xs text-gray-600">
                <p>• Click <span className="font-semibold text-green-600">Draw Polygon</span> for custom shapes</p>
                <p>• Click <span className="font-semibold text-green-600">Draw Rectangle</span> for rectangular fields</p>
                <p>• Click on map to place points</p>
                <p>• Click <span className="font-semibold text-blue-600">Complete</span> to finish</p>
              </div>
            </div>

            {/* Selected Farm Info */}
            {selectedFarm && (
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-green-200 z-[1000] max-w-xs">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-green-800 flex items-center gap-2 text-sm">
                    <LandPlot className="w-4 h-4" />
                    Selected Farm
                  </h4>
                  <button
                    onClick={clearSelection}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-1 text-xs">
                  <p><span className="font-semibold">Name:</span> {selectedFarm.farm_name}</p>
                  <p><span className="font-semibold">ID:</span> {selectedFarm.farm_id}</p>
                  <p><span className="font-semibold">Area:</span> {selectedFarm.area} {selectedFarm.unit}</p>
                </div>
              </div>
            )}
          </div>

          {/* Cards Section */}
          {showhistorydetailhistory &&
            <History_detail_history setShowhistorydetailhistory={setShowhistorydetailhistory} />
          }
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Registered Fields</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allDisplayFields.length === 0 ? (
                <div className="col-span-full p-12 text-center bg-white/70 rounded-2xl border border-gray-200">
                  <LandPlot className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-500 mb-2">
                    No Fields Found
                  </h3>
                  <p className="text-gray-400 text-lg">
                    Try adjusting your search or draw new fields on the map
                  </p>
                </div>
              ) : (
                allDisplayFields.map((farm, index) => (
                  <div
                    key={farm.id || farm.farm_id || index}
                    onClick={() => {
                      if (farm.farm_id) {
                        handleFarmSelect(farm);
                      } else {
                        setShowhistorydetailhistory(true);
                      }
                    }}
                    className={`group cursor-pointer transform transition-all duration-300 hover:scale-105 active:scale-95 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 overflow-hidden hover:shadow-2xl ${
                      selectedFarm?.farm_id === farm.farm_id 
                        ? 'border-green-500 ring-4 ring-green-500/20' 
                        : 'border-gray-100 hover:border-green-300'
                    } ${
                      !farm.farm_id ? 'border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    {/* Card Header */}
                    <div className={`p-4 text-white relative ${
                      farm.farm_id 
                        ? selectedFarm?.farm_id === farm.farm_id 
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
                          : 'bg-gradient-to-r from-blue-600 to-cyan-600'
                        : 'bg-gradient-to-r from-orange-500 to-amber-500'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        {farm.type ? (
                          farm.type === 'rectangle' ? 
                            <Square className="w-6 h-6 text-white/90" /> : 
                            <Hexagon className="w-6 h-6 text-white/90" />
                        ) : (
                          <LandPlot className="w-6 h-6 text-white/90" />
                        )}
                        <div className="text-right">
                          <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">
                            {farm.farm_id || farm.id}
                          </span>
                          {farm.type && (
                            <span className="text-xs bg-white/30 px-2 py-1 rounded-full block mt-1 capitalize">
                              {farm.type}
                            </span>
                          )}
                        </div>
                      </div>
                      <h2 className="text-lg font-bold truncate">{farm.farm_name || farm.name}</h2>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 space-y-3">
                      {/* Area */}
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                        <Maximize2 className="w-5 h-5 text-emerald-600" />
                        <div>
                          <p className="text-xl font-bold text-gray-900">
                            {farm.savedArea || farm.area}
                          </p>
                          <p className="text-sm text-gray-500 font-medium">{farm.unit || 'units'}</p>
                        </div>
                      </div>

                      {/* Coordinates - Only for API farms */}
                      {farm.coordinates && Array.isArray(farm.coordinates) && farm.coordinates[0] && farm.coordinates[0].lat && (
                        <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-blue-700" />
                            <h4 className="font-semibold text-blue-800 text-xs uppercase tracking-wide">
                              Coordinates
                            </h4>
                          </div>
                          <div className="max-h-20 overflow-y-auto scrollbar-hide space-y-1">
                            {farm.coordinates.slice(0, 3).map((coord, coordIndex) => (
                              <div
                                key={coordIndex}
                                className="text-xs text-blue-700 font-mono"
                              >
                                {coord.lat.toFixed(6)}, {coord.lng.toFixed(6)}
                              </div>
                            ))}
                            {farm.coordinates.length > 3 && (
                              <div className="text-xs text-blue-600 font-medium">
                                +{farm.coordinates.length - 3} more points
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Shape Details Modal */}
        <ShapeDetailsModal
          shape={selectedShape}
          isOpen={showShapeModal}
          onClose={() => setShowShapeModal(false)}
          onSave={handleSaveShape}
        />
      </div>
    </ProtectedPage>
  );
}