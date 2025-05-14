
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Navigation, Route, MapPin, Clock } from "lucide-react";
import { Card } from "./ui/card";

interface RouteNavigatorProps {
  map: google.maps.Map | null;
}

export const RouteNavigator = ({ map }: RouteNavigatorProps) => {
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [calculating, setCalculating] = useState<boolean>(false);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [routeMarkers, setRouteMarkers] = useState<google.maps.Marker[]>([]);
  const [alternativeRoutes, setAlternativeRoutes] = useState<boolean>(false);

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
    clearRoute(); // Clear previous routes

    // Usar la Directions API para calcular la ruta
    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: alternativeRoutes,
        drivingOptions: {
          departureTime: new Date(), // Usar la hora actual
          trafficModel: google.maps.TrafficModel.BEST_GUESS
        }
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          // Get origin and destination coordinates from the result
          const originLocation = result.routes[0].legs[0].start_location;
          const destinationLocation = result.routes[0].legs[0].end_location;
          
          // Create markers for origin and destination
          const originMarker = new google.maps.Marker({
            position: originLocation,
            map: map,
            title: 'Origen',
            icon: {
              url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
              scaledSize: new google.maps.Size(40, 40)
            },
          });
          
          const destinationMarker = new google.maps.Marker({
            position: destinationLocation,
            map: map,
            title: 'Destino',
            icon: {
              url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
              scaledSize: new google.maps.Size(40, 40)
            },
          });
          
          setRouteMarkers([originMarker, destinationMarker]);
          
          // Create or reuse DirectionsRenderer
          let renderer = directionsRenderer;
          if (!renderer) {
            renderer = new google.maps.DirectionsRenderer({
              map: map,
              suppressMarkers: true, // We'll use our custom markers
              polylineOptions: {
                strokeColor: "#4285F4",
                strokeWeight: 5,
                strokeOpacity: 0.8,
              },
            });
            setDirectionsRenderer(renderer);
          }
          
          renderer.setDirections(result);
          
          // Fit the map to show the route
          const bounds = new google.maps.LatLngBounds();
          bounds.extend(originLocation);
          bounds.extend(destinationLocation);
          map.fitBounds(bounds);
          
          // Display route info
          const route = result.routes[0];
          if (route && route.legs[0]) {
            const distance = route.legs[0].distance?.text || "N/A";
            const duration = route.legs[0].duration?.text || "N/A";
            const trafficDuration = route.legs[0].duration_in_traffic?.text;
            
            toast({
              title: "Ruta calculada",
              description: `Distancia: ${distance}. Tiempo estimado: ${duration}${trafficDuration ? ` (Con tráfico: ${trafficDuration})` : ""}`,
            });
            
            // Ahora también usaremos la Distance Matrix API para obtener información más detallada
            calculateDistanceMatrix(originLocation, destinationLocation);
          }

        } else {
          toast({
            title: "Error al calcular la ruta",
            description: "No se pudo encontrar una ruta entre estos puntos. Intente con ubicaciones diferentes.",
            variant: "destructive",
          });
        }
        
        setCalculating(false);
      }
    );
  };

  const calculateDistanceMatrix = (origin: google.maps.LatLng, destination: google.maps.LatLng) => {
    const service = new google.maps.DistanceMatrixService();
    
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
        drivingOptions: {
          departureTime: new Date(),
          trafficModel: google.maps.TrafficModel.BEST_GUESS,
        },
      },
      (response, status) => {
        if (status === 'OK' && response) {
          const element = response.rows[0].elements[0];
          
          if (element.status === 'OK') {
            // Mostrar información adicional del tráfico
            const trafficInfo = {
              distance: element.distance.text,
              duration: element.duration.text,
              durationInTraffic: element.duration_in_traffic?.text
            };
            
            // Calculamos la diferencia de tiempo debido al tráfico
            if (element.duration && element.duration_in_traffic) {
              const normalSeconds = element.duration.value;
              const trafficSeconds = element.duration_in_traffic.value;
              const difference = trafficSeconds - normalSeconds;
              
              if (difference > 60) {
                const minutes = Math.floor(difference / 60);
                toast({
                  title: "Información de tráfico",
                  description: `El tráfico actual añade ${minutes} minutos al tiempo normal de viaje.`,
                });
              }
            }
            
            console.log("Distance Matrix results:", trafficInfo);
          }
        }
      }
    );
  };

  const clearRoute = () => {
    if (directionsRenderer) {
      directionsRenderer.setMap(null);
      setDirectionsRenderer(null);
    }
    
    // Clear markers
    routeMarkers.forEach(marker => marker.setMap(null));
    setRouteMarkers([]);
  };

  return (
    <Card className="p-4 shadow-lg bg-white bg-opacity-90 space-y-3">
      <div className="flex items-center gap-2 text-blue-600 font-medium">
        <Navigation className="h-5 w-5" />
        <h3>Calcular Ruta</h3>
      </div>
      
      <div className="space-y-3">
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
      </div>
    </Card>
  );
};
