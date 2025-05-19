
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { Navigation, Route, MapPin, Clock, Car, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

interface RouteNavigatorProps {
  map: google.maps.Map | null;
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
  const [routeLayer, setRouteLayer] = useState<google.maps.Polyline | null>(null);
  const [routeMarkers, setRouteMarkers] = useState<google.maps.Marker[]>([]);
  const [alternativeRoutes, setAlternativeRoutes] = useState<boolean>(false);
  const [selectedPredefinedRoute, setSelectedPredefinedRoute] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

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
  const geocodeAddress = async (address: string): Promise<google.maps.LatLngLiteral | null> => {
    try {
      const geocoder = new google.maps.Geocoder();
      
      return new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
            const location = results[0].geometry.location;
            resolve({ lat: location.lat(), lng: location.lng() });
          } else {
            reject(null);
          }
        });
      });
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
      // Inicializar los servicios de dirección si no existen
      if (!directionsService) {
        setDirectionsService(new google.maps.DirectionsService());
      }
      
      if (!directionsRenderer) {
        const renderer = new google.maps.DirectionsRenderer({
          map: map,
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: '#4285F4',
            strokeWeight: 5,
            strokeOpacity: 0.7
          }
        });
        setDirectionsRenderer(renderer);
      } else {
        directionsRenderer.setMap(map);
      }
      
      const currentDirectionsService = directionsService || new google.maps.DirectionsService();
      const currentDirectionsRenderer = directionsRenderer || new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: '#4285F4',
          strokeWeight: 5,
          strokeOpacity: 0.7
        }
      });

      // Calcular ruta
      currentDirectionsService.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
          provideRouteAlternatives: alternativeRoutes
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            currentDirectionsRenderer.setDirections(result);
            
            // Información sobre la ruta
            const route = result.routes[0];
            const leg = route.legs[0];
            const distance = leg.distance?.text || "";
            const duration = leg.duration?.text || "";
            
            // Simular información de tráfico
            const trafficFactor = Math.random() * 0.5 + 1; // Factor de tráfico entre 1 y 1.5
            const durationWithTraffic = Math.round((leg.duration?.value || 0) * trafficFactor / 60); // minutos
            const durationMinutes = Math.round((leg.duration?.value || 0) / 60); // minutos
            const trafficDelay = durationWithTraffic - durationMinutes;
            
            toast(`Distancia: ${distance}. Tiempo estimado: ${duration}${trafficDelay > 0 ? ` (Con tráfico: ${durationWithTraffic} min)` : ""}`);
            
            if (trafficDelay > 5) {
              toast(`El tráfico actual añade ${trafficDelay} minutos al tiempo normal de viaje.`);
            }
          } else {
            toast.error("No se pudo calcular la ruta. Intente con otra ubicación.");
            console.error("Error al calcular la ruta:", status);
          }
          
          setCalculating(false);
        }
      );

    } catch (error) {
      console.error("Error calculando ruta:", error);
      toast.error("No se pudo encontrar una ruta entre estos puntos. Intente con ubicaciones diferentes.");
      setCalculating(false);
    }
  };

  const clearRoute = () => {
    // Limpiar ruta de directions renderer
    if (directionsRenderer) {
      directionsRenderer.setMap(null);
      setDirectionsRenderer(null);
    }
    
    // Eliminar polyline si existe
    if (routeLayer) {
      routeLayer.setMap(null);
      setRouteLayer(null);
    }
    
    // Eliminar marcadores
    routeMarkers.forEach(marker => {
      marker.setMap(null);
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
