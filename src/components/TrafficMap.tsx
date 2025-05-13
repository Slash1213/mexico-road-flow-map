
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";

interface TrafficMapProps {
  apiKey: string;
  region: string;
}

export const TrafficMap = ({ apiKey, region }: TrafficMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,visualization&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      // Create global init function
      window.initMap = () => {
        setLoading(false);
      };
      
      script.onerror = () => {
        setError("Failed to load Google Maps API");
        setLoading(false);
      };
      
      document.head.appendChild(script);
      
      return () => {
        // Cleanup
        document.head.removeChild(script);
        delete window.initMap;
      };
    };
    
    loadGoogleMapsScript();
  }, [apiKey]);

  // Initialize map after script loads
  useEffect(() => {
    if (!loading && !error && mapRef.current && !map) {
      try {
        // Center of Mexico
        const mexicoCenter = { lat: 23.6345, lng: -102.5528 };
        
        // Set custom zoom level based on region selection
        let zoomLevel = 5; // Default for all Mexico
        let mapCenter = mexicoCenter;
        
        // Adjust center and zoom based on region
        if (region !== 'all') {
          // This would be replaced with proper region coordinates
          const regions: Record<string, {center: {lat: number, lng: number}, zoom: number}> = {
            'cdmx': { center: {lat: 19.4326, lng: -99.1332}, zoom: 10 },
            'jalisco': { center: {lat: 20.6595, lng: -103.3494}, zoom: 8 },
            'nuevoleon': { center: {lat: 25.6866, lng: -100.3161}, zoom: 8 },
            // Add more regions as needed
          };
          
          if (regions[region]) {
            mapCenter = regions[region].center;
            zoomLevel = regions[region].zoom;
          }
        }
        
        // Create the map
        const newMap = new google.maps.Map(mapRef.current, {
          center: mapCenter,
          zoom: zoomLevel,
          mapTypeId: 'roadmap',
          mapTypeControl: true,
          fullscreenControl: true,
          streetViewControl: false,
          rotateControl: false,
        });
        
        // Add traffic layer
        const trafficLayer = new google.maps.TrafficLayer();
        trafficLayer.setMap(newMap);
        
        setMap(newMap);
      } catch (err) {
        setError("Error initializing map");
        console.error("Map initialization error:", err);
      }
    }
  }, [loading, error, region, map]);

  // Update map when region changes
  useEffect(() => {
    if (map && region) {
      // Default center of Mexico
      let center = { lat: 23.6345, lng: -102.5528 };
      let zoom = 5;
      
      // Region-specific centers and zooms
      if (region !== 'all') {
        const regions: Record<string, {center: {lat: number, lng: number}, zoom: number}> = {
          'cdmx': { center: {lat: 19.4326, lng: -99.1332}, zoom: 10 },
          'jalisco': { center: {lat: 20.6595, lng: -103.3494}, zoom: 8 },
          'nuevoleon': { center: {lat: 25.6866, lng: -100.3161}, zoom: 8 },
          // Add more regions as needed
        };
        
        if (regions[region]) {
          center = regions[region].center;
          zoom = regions[region].zoom;
        }
      }
      
      map.setCenter(center);
      map.setZoom(zoom);
    }
  }, [region, map]);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-red-50">
        <div className="text-center p-6">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-700 mb-2">Error al cargar el mapa</h3>
          <p className="text-red-600">{error}</p>
          <p className="text-sm text-red-500 mt-4">
            Verifique su clave de API y la conexión a Internet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div ref={mapRef} className="h-full w-full" />
      <div className="absolute bottom-4 right-4 z-10">
        <Card className="p-2 shadow-lg bg-white bg-opacity-90">
          <div className="text-xs font-semibold mb-1">Niveles de Tráfico</div>
          <div className="flex gap-3">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
              <span className="text-xs">Bajo</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
              <span className="text-xs">Medio</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
              <span className="text-xs">Alto</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Add TypeScript type definition for window.initMap
declare global {
  interface Window {
    initMap: () => void;
  }
}
