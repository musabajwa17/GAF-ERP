// components/EnhancedSearchControl.js
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

const EnhancedSearchControl = (props) => {
  const map = useMap();

  useEffect(() => {
    // Configure provider to prioritize smaller places and limit results
    const provider = new OpenStreetMapProvider({
      params: {
        // 'countrycodes' can be set to a specific country to narrow results
        // countrycodes: 'pk', // Example: limit searches to Pakistan
        'accept-language': 'en', // Prioritize English results
        addressdetails: 1, // Include detailed address information
      },
    });

    const searchControl = new GeoSearchControl({
      provider: provider,
      style: 'bar',
      position: 'topright',    // <-- Change the position here

      showMarker: true,
      showPopup: true,
      autoClose: true,
      retainZoomLevel: true,
      animateZoom: true,
      searchLabel: 'Enter address, village, or place...', // More descriptive placeholder
      resultFormat: ({ result }) => {
        // Custom function to format result label, showing village/town name if available
        const address = result.raw.address;
        const village = address.village || address.town || address.city;
        return village ? `${result.label} (${village})` : result.label;
      },
      ...props
    });

    map.addControl(searchControl);

    // Cleanup function
    return () => {
      if (map) {
        map.removeControl(searchControl);
      }
    };
  }, [map, props]);

  return null;

};

export default EnhancedSearchControl;
