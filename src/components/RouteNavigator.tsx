
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { Navigation, Route, MapPin, Clock, Car } from "lucide-react";
import { Card } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface RouteNavigatorProps {
  map: google.maps.Map | null;
}

// Rutas predeterminadas
const predefinedRoutes = [
  { name: "CDMX a Cuernavaca", origin: "Ciudad de México", destination: "Cuernavaca, Morelos" },
  { name: "Guadalajara a Puerto Vallarta", origin: "Guadalajara, Jalisco", destination: "Puerto Vallarta, Jalisco" },
  { name: "Monterrey a Saltillo", origin: "Monterrey, Nuevo León", destination: "Saltillo, Coahuila" },
  { name: "Cancún a Tulum", origin: "Cancún, Quintana Roo", destination: "Tulum, Quintana Roo" },
  { name: "Puebla a Veracruz", origin: "Puebla, Puebla", destination: "Veracruz, Veracruz" },
];

export const RouteNavigator = ({ map }: RouteNavigatorProps) => {
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [calculating, setCalculating] = useState<boolean>(false);
  const [routeInfo, setRouteInfo] = useState<{distance: string, duration: string} | null>(null);
  const [alternativeRoutes, setAlternativeRoutes] = useState<boolean>(false);
  const [selectedPredefinedRoute, setSelectedPredefinedRoute] = useState<string>("");

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

  const calculateRoute = () => {
    if (!origin || !destination) {
      // Fix: Use toast as a function, not as a JSX element with object props
      toast("Campos requeridos", {
        description: "Por favor ingrese un origen y un destino."
      });
      return;
    }

    setCalculating(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      // Calculate mock distance and duration based on the origin and destination strings
      // This is just for demo purposes
      const characters = (origin.length + destination.length);
      const mockDistance = Math.floor(characters * 7.5) + Math.floor(Math.random() * 50);
      const mockDuration = Math.floor(characters * 3) + Math.floor(Math.random() * 30);
      
      setRouteInfo({
        distance: `${mockDistance} km`,
        duration: `${mockDuration} minutos`
      });
      
      // Fix: Use toast as a function, not as a JSX element with object props
      toast("Ruta calculada", {
        description: `Distancia: ${mockDistance} km. Tiempo estimado: ${mockDuration} minutos`
      });
      
      setCalculating(false);
    }, 1500);
  };

  const clearRoute = () => {
    setRouteInfo(null);
    setSelectedPredefinedRoute("");
    setOrigin("");
    setDestination("");
  };

  return (
    <Card className="p-6 shadow-lg bg-white space-y-5 border-t-4 border-blue-500">
      <div className="flex items-center gap-2 text-blue-600">
        <Navigation className="h-6 w-6" />
        <h3 className="text-xl font-medium">Cálculo de Rutas</h3>
      </div>
      
      <div className="space-y-4">
        {/* Barra de navegación para rutas predeterminadas */}
        <div className="relative">
          <label htmlFor="predefinedRoutes" className="text-sm text-gray-600 mb-1 block">
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
          <label htmlFor="origin" className="text-sm text-gray-600 mb-1 block">
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
          <label htmlFor="destination" className="text-sm text-gray-600 mb-1 block">
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
          <label htmlFor="alternativeRoutes" className="text-sm text-gray-600">
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
        
        {/* Display Route Information */}
        {routeInfo && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-slate-800 mb-2">Información de Ruta</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Route className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-slate-700">
                  <strong>Distancia:</strong> {routeInfo.distance}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-slate-700">
                  <strong>Tiempo estimado:</strong> {routeInfo.duration}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
