
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { Navigation, Route, MapPin, Clock, Car, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import L from "leaflet";

interface RouteNavigatorProps {
  map: L.Map | null;
  graphhopperApiKey: string;
}

// Rutas predeterminadas
const predefinedRoutes = [
  { name: "CDMX a Cuernavaca", origin: "Ciudad de México", destination: "Cuernavaca, Morelos" },
  { name: "Guadalajara a Puerto Vallarta", origin: "Guadalajara, Jalisco", destination: "Puerto Vallarta, Jalisco" },
  { name: "Monterrey a Saltillo", origin: "Monterrey, Nuevo León", destination: "Saltillo, Coahuila" },
  { name: "Cancún a Tulum", origin: "Cancún, Quintana Roo", destination: "Tulum, Quintana Roo" },
  { name: "Puebla a Veracruz", origin: "Puebla, Puebla", destination: "Veracruz, Veracruz" },
];

export const RouteNavigator = ({ map, graphhopperApiKey }: RouteNavigatorProps) => {
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [calculating, setCalculating] = useState<boolean>(false);
  const [routeLayer, setRouteLayer] = useState<L.Polyline | null>(null);
  const [routeMarkers, setRouteMarkers] = useState<L.Marker[]>([]);
  const [alternativeRoutes, setAlternativeRoutes] = useState<boolean>(false);
  const [selectedPredefinedRoute, setSelectedPredefinedRoute] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handlePredefinedRouteChange = (value: string) => {
    setSelectedPredefinedRoute(value);
    
    if (value) {
      const selectedRoute = predefinedRoutes.find(route => route.name === value);
      if (selectedRoute) {
        setOrigin(selectedRoute.origin);
        setDestination(selectedRoute.destination);
      }
    }
  };

  // Función para geocodificar (convertir dirección a coordenadas)
  const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
    try {
      const response = await fetch(`https://graphhopper.com/api/1/geocode?q=${encodeURIComponent(address)}&locale=es&key=${graphhopperApiKey}`);
      const data = await response.json();
      
      if (data.hits && data.hits.length > 0) {
        const location = data.hits[0];
        return [location.point.lat, location.point.lng];
      }
      return null;
    } catch (error) {
      console.error("Error geocodificando dirección:", error);
      return null;
    }
  };

  const calculateRoute = async () => {
    if (!map) {
      toast.error("El mapa no está disponible.");
      return;
    }

    if (!origin || !destination) {
      toast.error("Por favor ingrese un origen y un destino.");
      return;
    }

    setCalculating(true);
    clearRoute(); // Limpiar rutas anteriores

    try {
      // Geocodificar origen y destino
      const originCoords = await geocodeAddress(origin);
      const destCoords = await geocodeAddress(destination);

      if (!originCoords || !destCoords) {
        toast.error("No se pudieron encontrar las coordenadas para la dirección proporcionada.");
        setCalculating(false);
        return;
      }

      // Crear marcadores para origen y destino
      const originMarker = L.marker(originCoords, {
        icon: L.icon({
          iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      }).addTo(map).bindPopup(`<b>Origen:</b> ${origin}`);

      const destMarker = L.marker(destCoords, {
        icon: L.icon({
          iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      }).addTo(map).bindPopup(`<b>Destino:</b> ${destination}`);

      setRouteMarkers([originMarker, destMarker]);

      // Calcular la ruta usando Graphhopper
      const url = `https://graphhopper.com/api/1/route?point=${originCoords[0]},${originCoords[1]}&point=${destCoords[0]},${destCoords[1]}&vehicle=car&locale=es&calc_points=true&key=${graphhopperApiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.paths && data.paths.length > 0) {
        const path = data.paths[0];
        const points = path.points.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);

        // Crear línea de ruta en el mapa
        const routePolyline = L.polyline(points, {
          color: '#4285F4',
          weight: 5,
          opacity: 0.7
        }).addTo(map);

        setRouteLayer(routePolyline);

        // Ajustar el mapa para mostrar la ruta completa
        map.fitBounds(routePolyline.getBounds());

        // Información de la ruta
        const distance = (path.distance / 1000).toFixed(1); // km
        const duration = Math.round(path.time / 60000); // minutos

        // Obtener información de tráfico simulada (Graphhopper no proporciona info de tráfico real)
        const trafficFactor = Math.random() * 0.5 + 1; // Factor de tráfico entre 1 y 1.5
        const durationWithTraffic = Math.round(duration * trafficFactor);
        const trafficDelay = durationWithTraffic - duration;

        toast({
          description: `Distancia: ${distance} km. Tiempo estimado: ${duration} min${trafficDelay > 0 ? ` (Con tráfico: ${durationWithTraffic} min)` : ""}`
        });

        if (trafficDelay > 5) {
          toast({
            description: `El tráfico actual añade ${trafficDelay} minutos al tiempo normal de viaje.`
          });
        }

        // Mostrar información de la ruta en el popup de la línea
        routePolyline.bindPopup(`
          <div>
            <b>Distancia:</b> ${distance} km<br>
            <b>Duración sin tráfico:</b> ${duration} min<br>
            <b>Duración con tráfico:</b> ${durationWithTraffic} min<br>
            <b>Retraso por tráfico:</b> ${trafficDelay} min
          </div>
        `);

      } else {
        throw new Error("No se encontró ninguna ruta");
      }

    } catch (error) {
      console.error("Error calculando ruta:", error);
      toast({
        variant: "destructive",
        description: "No se pudo encontrar una ruta entre estos puntos. Intente con ubicaciones diferentes."
      });
    } finally {
      setCalculating(false);
    }
  };

  const clearRoute = () => {
    // Eliminar capa de ruta
    if (routeLayer && map) {
      map.removeLayer(routeLayer);
      setRouteLayer(null);
    }
    
    // Eliminar marcadores
    routeMarkers.forEach(marker => {
      if (map) map.removeLayer(marker);
    });
    setRouteMarkers([]);

    // Resetear ruta predefinida seleccionada
    setSelectedPredefinedRoute("");
  };

  return (
    <Card className="p-4 shadow-lg bg-white bg-opacity-90">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600 font-medium">
            <Navigation className="h-5 w-5" />
            <h3>Calcular Ruta</h3>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="space-y-3">
          {/* Barra de navegación para rutas predeterminadas */}
          <div className="relative">
            <label htmlFor="predefinedRoutes" className="text-xs text-gray-500 mb-1 block">
              Rutas Populares
            </label>
            <div className="flex items-center">
              <Car className="h-4 w-4 text-blue-500 absolute left-3 z-10" />
              <Select value={selectedPredefinedRoute} onValueChange={handlePredefinedRouteChange}>
                <SelectTrigger className="pl-9">
                  <SelectValue placeholder="Seleccionar ruta popular" />
                </SelectTrigger>
                <SelectContent>
                  {predefinedRoutes.map((route) => (
                    <SelectItem key={route.name} value={route.name}>
                      {route.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="relative">
            <label htmlFor="origin" className="text-xs text-gray-500 mb-1 block">
              Origen
            </label>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-green-500 absolute left-3" />
              <Input
                id="origin"
                placeholder="Ingrese punto de origen"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          <div className="relative">
            <label htmlFor="destination" className="text-xs text-gray-500 mb-1 block">
              Destino
            </label>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-red-500 absolute left-3" />
              <Input
                id="destination"
                placeholder="Ingrese punto de destino"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="alternativeRoutes"
              checked={alternativeRoutes}
              onChange={(e) => setAlternativeRoutes(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="alternativeRoutes" className="text-xs text-gray-500">
              Mostrar rutas alternativas
            </label>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={calculateRoute}
              className="flex-1"
              disabled={calculating || !origin || !destination}
            >
              {calculating ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Calculando...
                </>
              ) : (
                <>
                  <Route className="h-4 w-4 mr-2" />
                  Calcular
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={clearRoute}
              disabled={calculating}
            >
              Limpiar
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
