
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { RouteNavigator } from "./RouteNavigator";
import { Compass, MapPin, Navigation, Route } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface TrafficMapProps {
  apiKey: string;
  region: string;
}

export const TrafficMap = ({ apiKey, region }: TrafficMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>("");
  
  // Coordinates for Poza Rica de Hidalgo, Mexico - explicitly typed as [longitude, latitude] tuple
  const pozaRicaCoordinates: [number, number] = [-97.4584, 20.5325];

  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Use default public demo token from Mapbox
    // This is a public token that can be used for development and testing
    const token = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';
    setMapboxToken(token);
    
    // Set Mapbox access token
    mapboxgl.accessToken = token;
    
    try {
      // Create new map instance
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: pozaRicaCoordinates,
        zoom: 13
      });
      
      // Add navigation control (zoom buttons)
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Add a marker at Poza Rica
      new mapboxgl.Marker({ color: '#3FB1CE' })
        .setLngLat(pozaRicaCoordinates)
        .setPopup(new mapboxgl.Popup().setHTML('<h3>Poza Rica de Hidalgo</h3><p>Veracruz, México</p>'))
        .addTo(map.current);
        
      // Show toast when map is loaded
      map.current.on('load', () => {
        toast("Mapa cargado correctamente", {
          description: "Visualizando Poza Rica de Hidalgo, Veracruz"
        });
      });
    } catch (error) {
      console.error("Error initializing map:", error);
    }
    
    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-3xl px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Map Container */}
          <div className="w-full md:w-1/2 h-[400px]">
            <Card className="w-full h-full overflow-hidden shadow-xl">
              <div ref={mapContainer} className="w-full h-full" />
            </Card>
          </div>

          {/* Route Search Card */}
          <div className="w-full md:w-1/2">
            <RouteNavigator map={map.current} />
          </div>
        </div>
      </div>
    </div>
  );
};
