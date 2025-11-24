"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom icons
const userIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const destinationIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Safe map utility functions
const safeMapOperation = (map, operation) => {
  if (map && !map._leaflet_id) {
    console.warn("Map instance is no longer valid");
    return false;
  }
  return operation();
};

// Auto-focus component to recenter map when user location changes
const MapAutoFocus = ({ userLocation }) => {
  const map = useMap();
  
  useEffect(() => {
    if (userLocation) {
      safeMapOperation(map, () => {
        map.setView([userLocation.lat, userLocation.lng], 13, {
          animate: true,
          duration: 1
        });
        return true;
      });
    }
  }, [userLocation, map]);

  return null;
};

// Intelligent location search component
const LocationSearch = ({ onLocationSelect, onGeocode }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchLocations = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
      );
      const results = await response.json();
      setSuggestions(results);
    } catch (error) {
      console.error("Geocoding error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      searchLocations(query);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query, searchLocations]);

  const handleSuggestionClick = (suggestion) => {
    const location = {
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon),
      name: suggestion.display_name
    };
    onLocationSelect(location);
    onGeocode(location);
    setQuery("");
    setSuggestions([]);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a location..."
        className="search-input"
      />
      {isLoading && <div className="loading">Searching...</div>}
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="suggestion-item"
            >
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Enhanced destination marker with intelligent routing and proper cleanup
const IntelligentDestinationMarker = ({ 
  userLocation, 
  setRouteInfo, 
  onDestinationSet,
  destination 
}) => {
  const [waypoints, setWaypoints] = useState([]);
  const routingControlRef = useRef(null);
  const map = useMapEvents({
    click(e) {
      const newWaypoint = e.latlng;
      setWaypoints(prev => [...prev, newWaypoint]);
      onDestinationSet(newWaypoint);
    },
  });

  // Safe cleanup function
  const safeCleanup = useCallback(() => {
    if (routingControlRef.current && map) {
      try {
        safeMapOperation(map, () => {
          map.removeControl(routingControlRef.current);
          return true;
        });
      } catch (error) {
        console.warn("Error during routing control cleanup:", error);
      } finally {
        routingControlRef.current = null;
        if (map._routingControl) {
          delete map._routingControl;
        }
      }
    }
  }, [map]);

  useEffect(() => {
    if (!userLocation || waypoints.length === 0) {
      safeCleanup();
      return;
    }

    let isMounted = true;
    let routingControlInstance = null;

    const calculateOptimalRoute = async () => {
      try {
        // Dynamically import leaflet-routing-machine
        await import("leaflet-routing-machine");
        
        if (!isMounted || !map) return;

        // Clean up previous routing control
        safeCleanup();

        // Create waypoints array starting from user location
        const allWaypoints = [
          L.latLng(userLocation.lat, userLocation.lng),
          ...waypoints.map(wp => L.latLng(wp.lat, wp.lng))
        ];

        // Create new routing control
        routingControlInstance = L.Routing.control({
          waypoints: allWaypoints,
          lineOptions: { 
            styles: [
              { color: "#4F46E5", weight: 6, opacity: 0.8 },
              { color: "white", weight: 2, opacity: 0.8 }
            ] 
          },
          addWaypoints: true,
          draggableWaypoints: true,
          fitSelectedRoutes: true,
          showAlternatives: false, // Reduced complexity
          routeWhileDragging: false, // Reduced complexity for stability
          show: false,
          createMarker: (i, wp) => {
            if (i === 0) {
              return L.marker(wp.latLng, { icon: userIcon })
                .bindPopup("Your Location");
            }
            return L.marker(wp.latLng, { icon: destinationIcon })
              .bindPopup(`Destination ${i}`);
          }
        });

        // Add event listeners
        routingControlInstance.on("routesfound", function (e) {
          if (!isMounted) return;
          
          const routes = e.routes;
          if (routes && routes.length > 0) {
            const optimalRoute = routes[0];
            setRouteInfo({
              distance: (optimalRoute.summary.totalDistance / 1000).toFixed(2),
              time: Math.ceil(optimalRoute.summary.totalTime / 60),
              steps: optimalRoute.instructions,
            });
          }
        });

        routingControlInstance.on("routingerror", function (e) {
          console.error("Routing error:", e.error);
          if (isMounted) {
            setRouteInfo(null);
          }
        });

        // Add to map safely
        safeMapOperation(map, () => {
          routingControlInstance.addTo(map);
          routingControlRef.current = routingControlInstance;
          map._routingControl = routingControlInstance;
          return true;
        });

      } catch (error) {
        console.error("Error loading routing machine:", error);
        if (isMounted) {
          setRouteInfo(null);
        }
      }
    };

    calculateOptimalRoute();

    // Cleanup function
    return () => {
      isMounted = false;
      safeCleanup();
    };
  }, [userLocation, waypoints, map, setRouteInfo, safeCleanup]);

  // Clear waypoints when destination changes
  useEffect(() => {
    if (destination) {
      setWaypoints([destination]);
    } else {
      setWaypoints([]);
      safeCleanup();
      setRouteInfo(null);
    }
  }, [destination, safeCleanup, setRouteInfo]);

  return null;
};

// Route instructions component
const RouteInstructions = ({ steps }) => {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="route-instructions">
      <h4>Route Instructions:</h4>
      <ol>
        {steps.slice(0, 10).map((step, index) => (
          <li key={index} dangerouslySetInnerHTML={{ __html: step.text }} />
        ))}
        {steps.length > 10 && <li>... and {steps.length - 10} more steps</li>}
      </ol>
    </div>
  );
};

// Enhanced location tracking with watchPosition and proper cleanup
const useIntelligentLocation = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationAccuracy, setLocationAccuracy] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const watchIdRef = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }

    const handleSuccess = (position) => {
      const newLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy
      };
      setUserLocation(newLocation);
      setLocationAccuracy(position.coords.accuracy);
    };

    const handleError = (error) => {
      console.error("Geolocation error:", error);
      let message = "Please allow location access to see your position on map.";
      
      switch(error.code) {
        case error.PERMISSION_DENIED:
          message = "Location access denied. Please enable location permissions.";
          break;
        case error.POSITION_UNAVAILABLE:
          message = "Location information unavailable.";
          break;
        case error.TIMEOUT:
          message = "Location request timed out.";
          break;
      }
      alert(message);
    };

    // Get initial position
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    });

    // Start watching position for real-time updates
    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      { 
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000
      }
    );

    setIsTracking(true);

    // Cleanup function
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsTracking(false);
    };
  }, []);

  return { userLocation, locationAccuracy, isTracking };
};

// Main component with error boundary
const IntelligentRoutingMap = () => {
  const { userLocation, locationAccuracy } = useIntelligentLocation();
  const [routeInfo, setRouteInfo] = useState(null);
  const [destination, setDestination] = useState(null);
  const [recentLocations, setRecentLocations] = useState([]);
  const [mapError, setMapError] = useState(null);

  const handleDestinationSet = useCallback((newDestination) => {
    setDestination(newDestination);
    setMapError(null);
    
    // Add to recent locations
    setRecentLocations(prev => {
      const filtered = prev.filter(loc => 
        loc.lat !== newDestination.lat || loc.lng !== newDestination.lng
      );
      return [newDestination, ...filtered.slice(0, 4)]; // Keep last 5
    });
  }, []);

  const handleGeocode = useCallback((location) => {
    setDestination(location);
    setMapError(null);
  }, []);

  const clearRoute = useCallback(() => {
    setRouteInfo(null);
    setDestination(null);
    setMapError(null);
  }, []);

  // Reset error state when component mounts
  useEffect(() => {
    setMapError(null);
  }, []);

  if (mapError) {
    return (
      <div className="error-container">
        <h2>Map Error</h2>
        <p>{mapError}</p>
        <button onClick={() => setMapError(null)}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="intelligent-routing-map">
      <div className="map-header">
        <h2>🚀 Intelligent Routing Map</h2>
        <div className="location-search-wrapper">
          <LocationSearch 
            onLocationSelect={handleDestinationSet}
            onGeocode={handleGeocode}
          />
        </div>
      </div>

      <div className="map-container">
        <MapContainer
          center={userLocation ? [userLocation.lat, userLocation.lng] : [31.582045, 74.329376]}
          zoom={13}
          style={{ height: "500px", width: "100%" }}
          zoomControl={true}
          key={userLocation ? `${userLocation.lat}-${userLocation.lng}` : 'default-map'}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          
          <MapAutoFocus userLocation={userLocation} />
          
          {userLocation && (
            <Marker 
              position={[userLocation.lat, userLocation.lng]} 
              icon={userIcon}
            >
              <Popup>
                <strong>Your Location</strong>
                <br />
                Accuracy: {locationAccuracy ? `${Math.round(locationAccuracy)}m` : 'Unknown'}
              </Popup>
            </Marker>
          )}
          
          {userLocation && (
            <IntelligentDestinationMarker 
              userLocation={userLocation}
              setRouteInfo={setRouteInfo}
              onDestinationSet={handleDestinationSet}
              destination={destination}
            />
          )}

          {destination && (
            <Marker 
              position={[destination.lat, destination.lng]} 
              icon={destinationIcon}
            >
              <Popup>
                <strong>Destination</strong>
                {destination.name && <div>{destination.name}</div>}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      <div className="route-info-panel">
        {routeInfo ? (
          <div className="route-details">
            <div className="route-summary">
              <h3>📍 Route Summary</h3>
              <p><strong>Distance:</strong> {routeInfo.distance} km</p>
              <p><strong>Estimated Time:</strong> {routeInfo.time} minutes</p>
              <button onClick={clearRoute} className="clear-route-btn">
                Clear Route
              </button>
            </div>
            
            <RouteInstructions steps={routeInfo.steps} />
          </div>
        ) : (
          <div className="no-route">
            <p>🗺️ Click on the map or search to set a destination</p>
            {destination && <p className="calculating">Calculating route...</p>}
          </div>
        )}
      </div>

      {recentLocations.length > 0 && (
        <div className="recent-locations">
          <h4>Recent Locations:</h4>
          <div className="recent-locations-list">
            {recentLocations.map((location, index) => (
              <button
                key={index}
                onClick={() => handleDestinationSet(location)}
                className="recent-location-btn"
              >
                {location.name ? location.name.substring(0, 30) + '...' : `Location ${index + 1}`}
              </button>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .intelligent-routing-map {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .map-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .map-header h2 {
          margin: 0;
          color: #1f2937;
        }
        
        .location-search-wrapper {
          flex: 1;
          max-width: 400px;
          min-width: 250px;
        }
        
        .search-container {
          position: relative;
        }
        
        .search-input {
          width: 100%;
          padding: 10px 15px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #4F46E5;
        }
        
        .suggestions-list {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          margin-top: 4px;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          z-index: 1000;
          max-height: 200px;
          overflow-y: auto;
        }
        
        .suggestion-item {
          padding: 10px 15px;
          cursor: pointer;
          border-bottom: 1px solid #f3f4f6;
          font-size: 14px;
        }
        
        .suggestion-item:hover {
          background-color: #f9fafb;
        }
        
        .suggestion-item:last-child {
          border-bottom: none;
        }
        
        .loading {
          padding: 10px 15px;
          color: #6b7280;
          font-size: 14px;
        }
        
        .map-container {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          margin-bottom: 20px;
        }
        
        .route-info-panel {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
          margin-bottom: 20px;
        }
        
        .route-summary {
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .route-summary h3 {
          margin: 0 0 15px 0;
          color: #1f2937;
        }
        
        .route-summary p {
          margin: 8px 0;
          color: #4b5563;
        }
        
        .clear-route-btn {
          background: #ef4444;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          margin-top: 10px;
        }
        
        .clear-route-btn:hover {
          background: #dc2626;
        }
        
        .route-instructions {
          font-size: 14px;
        }
        
        .route-instructions h4 {
          margin: 0 0 15px 0;
          color: #1f2937;
        }
        
        .route-instructions ol {
          margin: 0;
          padding-left: 20px;
        }
        
        .route-instructions li {
          margin-bottom: 8px;
          color: #4b5563;
        }
        
        .recent-locations {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
        }
        
        .recent-locations h4 {
          margin: 0 0 15px 0;
          color: #1f2937;
        }
        
        .recent-locations-list {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          color:white;
        }
        
        .recent-location-btn {
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          transition: background-color 0.2s;
        }
        
        .recent-location-btn:hover {
          background: #e5e7eb;
        }
        
        .no-route {
          text-align: center;
          color: #6b7280;
          padding: 40px 20px;
        }
        
        .calculating {
          color: #4F46E5;
          font-style: italic;
        }
        
        .error-container {
          text-align: center;
          padding: 40px;
          color: #ef4444;
        }
        
        @media (max-width: 768px) {
          .map-header {
            flex-direction: column;
            align-items: stretch;
          }
          
          .location-search-wrapper {
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
};

export default IntelligentRoutingMap;