
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Navigation, Route } from "lucide-react";
import { Card } from "./ui/card";

interface RouteNavigatorProps {
  map: google.maps.Map | null;
}

export const RouteNavigator = ({ map }: RouteNavigatorProps) => {
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [calculating, setCalculating] = useState<boolean>(false);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

  const calculateRoute = () => {
    if (!map) {
      toast({
        title: "Error",
        description: "El mapa no está disponible.",
        variant: "destructive",
      });
      return;
    }

    if (!origin || !destination) {
      toast({
        title: "Campos requeridos",
        description: "Por favor ingrese un origen y un destino.",
        variant: "destructive",
      });
      return;
    }

    setCalculating(true);

    // Create DirectionsService if not already created
    const directionsService = new google.maps.DirectionsService();
    
    // Create or reuse DirectionsRenderer
    let renderer = directionsRenderer;
    if (!renderer) {
      renderer = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: "#4285F4",
          strokeWeight: 5,
          strokeOpacity: 0.8,
        },
      });
      setDirectionsRenderer(renderer);
    }

    // Calculate route
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
        drivingOptions: {
          departureTime: new Date(),
          trafficModel: google.maps.TrafficModel.BEST_GUESS,
        },
      },
      (result, status) => {
        setCalculating(false);
        
        if (status === google.maps.DirectionsStatus.OK && result) {
          renderer!.setDirections(result);
          
          // Display route info
          const route = result.routes[0];
          if (route && route.legs[0]) {
            const duration = route.legs[0].duration?.text || "N/A";
            const distance = route.legs[0].distance?.text || "N/A";
            const trafficDuration = route.legs[0].duration_in_traffic?.text;
            
            toast({
              title: "Ruta calculada",
              description: `Distancia: ${distance}. Tiempo estimado: ${duration}${trafficDuration ? ` (Con tráfico: ${trafficDuration})` : ""}`,
            });
          }
        } else {
          toast({
            title: "Error al calcular la ruta",
            description: "No se pudo encontrar una ruta entre estos puntos. Intente con ubicaciones diferentes.",
            variant: "destructive",
          });
          clearRoute();
        }
      }
    );
  };

  const clearRoute = () => {
    if (directionsRenderer) {
      directionsRenderer.setMap(null);
      setDirectionsRenderer(null);
    }
    setOrigin("");
    setDestination("");
  };

  return (
    <Card className="p-4 shadow-lg bg-white bg-opacity-90 space-y-3">
      <div className="flex items-center gap-2 text-blue-600 font-medium">
        <Navigation className="h-5 w-5" />
        <h3>Calcular Ruta</h3>
      </div>
      
      <div className="space-y-3">
        <div>
          <label htmlFor="origin" className="text-xs text-gray-500 mb-1 block">
            Origen
          </label>
          <Input
            id="origin"
            placeholder="Ingrese punto de origen"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="destination" className="text-xs text-gray-500 mb-1 block">
            Destino
          </label>
          <Input
            id="destination"
            placeholder="Ingrese punto de destino"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={calculateRoute}
            className="flex-1"
            disabled={calculating || !origin || !destination}
          >
            <Route className="h-4 w-4 mr-2" />
            {calculating ? "Calculando..." : "Calcular"}
          </Button>
          
          <Button
            variant="outline"
            onClick={clearRoute}
            disabled={calculating}
          >
            Limpiar
          </Button>
        </div>
      </div>
    </Card>
  );
};
