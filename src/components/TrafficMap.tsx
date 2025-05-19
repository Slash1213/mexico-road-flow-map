
import { useEffect, useRef, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { RouteNavigator } from "./RouteNavigator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { GoogleMap, useJsApiLoader, InfoWindow } from "@react-google-maps/api";

interface TrafficMapProps {
  apiKey: string;
  region: string;
}

// Ocultar el logo de Google Maps y otros controles
const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const mapStyles = `
  .gmnoprint, .gm-style-cc {
    display: none !important;
  }
  .gm-style a[href^="https://maps.google.com/maps"] {
    display: none !important;
  }
  .gm-style-iw-a {
    position: absolute;
    width: 9999px;
    height: 9999px;
    top: 0;
    left: 0;
    pointer-events: none;
  }
`;

export const TrafficMap = ({ apiKey, region }: TrafficMapProps) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const graphhopperApiKey = "32b1ca01-f7f0-450f-b90f-f86a4d6475c1";

  // Centro de México y niveles de zoom por región
  const getRegionSettings = (region: string): { center: google.maps.LatLngLiteral, zoom: number } => {
    // Valor por defecto para todo México
    let center = { lat: 23.6345, lng: -102.5528 };
    let zoom = 5;
    
    // Centros y zooms específicos por región
    if (region !== 'all') {
      const regions: Record<string, {center: google.maps.LatLngLiteral, zoom: number}> = {
        'cdmx': { center: { lat: 19.4326, lng: -99.1332 }, zoom: 10 },
        'jalisco': { center: { lat: 20.6595, lng: -103.3494 }, zoom: 8 },
        'nuevoleon': { center: { lat: 25.6866, lng: -100.3161 }, zoom: 8 },
      };
      
      if (regions[region]) {
        return regions[region];
      }
    }
    
    return { center, zoom };
  };

  // Configuraciones iniciales del mapa
  const { center, zoom } = getRegionSettings(region);

  // Cargar API de Google Maps
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || 'AIzaSyBnpPTL-wXki-LPAXXJdGboCrvJoA_hY9M', // API key de prueba
    libraries: ['places', 'visualization', 'drawing']
  });

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setLoading(false);
    toast.success("Mapa cargado correctamente");
  }, []);

  // Actualizar mapa cuando cambia la región
  useEffect(() => {
    if (!mapRef.current) return;
    
    const { center, zoom } = getRegionSettings(region);
    mapRef.current.setCenter(center);
    mapRef.current.setZoom(zoom);
  }, [region]);

  // Manejar error de carga
  useEffect(() => {
    if (loadError) {
      console.error("Error al cargar Google Maps:", loadError);
      setError("Error al cargar el mapa. Por favor, recargue la página.");
      setLoading(false);
      toast.error("Error al inicializar el mapa");
    }
  }, [loadError]);

  if (!isLoaded) {
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
            Verifique su conexión a Internet.
          </p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      {/* CSS para ocultar el logo de Google Maps */}
      <style>{mapStyles}</style>
      
      {/* Contenedor del mapa */}
      <div className="h-full w-full">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={zoom}
          onLoad={onMapLoad}
          options={{
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            zoomControl: true,
            disableDefaultUI: false,
            styles: [
              {
                featureType: "all",
                elementType: "labels.icon",
                stylers: [{ visibility: "off" }]
              }
            ]
          }}
        >
          {/* Aquí irían marcadores y rutas si los hubiera */}
        </GoogleMap>
      </div>
      
      {/* Route Navigator - Colocado en una posición donde no interfiera con el mapa */}
      <div className="absolute bottom-20 left-4 z-10 w-80 md:w-96">
        <RouteNavigator map={mapRef.current} graphhopperApiKey={graphhopperApiKey} />
      </div>
      
      {/* Traffic Legend */}
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
