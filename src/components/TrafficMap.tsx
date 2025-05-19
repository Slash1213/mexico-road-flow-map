
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { RouteNavigator } from "./RouteNavigator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";

interface TrafficMapProps {
  apiKey: string;
  region: string;
}

export const TrafficMap = ({ apiKey, region }: TrafficMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const graphhopperApiKey = "32b1ca01-f7f0-450f-b90f-f86a4d6475c1";

  // Inicializar el mapa Leaflet con Graphhopper
  useEffect(() => {
    if (!mapRef.current || map) return;

    try {
      console.log("Inicializando mapa de Leaflet...");
      
      // Centro de México
      let center = [23.6345, -102.5528]; // [lat, lng]
      let zoomLevel = 5; // Default para todo México
      
      // Ajustar centro y zoom basado en la región
      if (region !== 'all') {
        // Coordenadas de regiones
        const regions: Record<string, {center: [number, number], zoom: number}> = {
          'cdmx': { center: [19.4326, -99.1332], zoom: 10 },
          'jalisco': { center: [20.6595, -103.3494], zoom: 8 },
          'nuevoleon': { center: [25.6866, -100.3161], zoom: 8 },
        };
        
        if (regions[region]) {
          center = regions[region].center;
          zoomLevel = regions[region].zoom;
        }
      }
      
      // Crear el mapa
      const newMap = L.map(mapRef.current, {
        center: center,
        zoom: zoomLevel,
        layers: [
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          })
        ],
        zoomControl: true,
      });
      
      // Añadir control de escala
      L.control.scale().addTo(newMap);
      
      setMap(newMap);
      setLoading(false);
      console.log("Mapa inicializado correctamente");
      toast.success("Mapa cargado correctamente");
    } catch (err) {
      console.error("Error al inicializar el mapa:", err);
      setError("Error al inicializar el mapa. Por favor, recargue la página.");
      setLoading(false);
      toast.error("Error al inicializar el mapa");
    }
  }, [region, map]);

  // Actualizar mapa cuando cambia la región
  useEffect(() => {
    if (!map) return;

    // Centro por defecto de México
    let center: [number, number] = [23.6345, -102.5528];
    let zoom = 5;
    
    // Centros y zooms específicos por región
    if (region !== 'all') {
      const regions: Record<string, {center: [number, number], zoom: number}> = {
        'cdmx': { center: [19.4326, -99.1332], zoom: 10 },
        'jalisco': { center: [20.6595, -103.3494], zoom: 8 },
        'nuevoleon': { center: [25.6866, -100.3161], zoom: 8 },
      };
      
      if (regions[region]) {
        center = regions[region].center;
        zoom = regions[region].zoom;
      }
    }
    
    map.setView(center, zoom);
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
      {/* Mapa con tamaño ajustado - más pequeño para no interferir con la interfaz de rutas */}
      <div ref={mapRef} className="h-full w-full" />
      
      {/* Route Navigator - Colocado en una posición donde no interfiera con el mapa */}
      <div className="absolute bottom-20 left-4 z-10 w-80 md:w-96">
        <RouteNavigator map={map} graphhopperApiKey={graphhopperApiKey} />
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
