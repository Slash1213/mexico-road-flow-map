
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { RouteNavigator } from "./RouteNavigator";
import { Compass, MapPin, Navigation, Route } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface TrafficMapProps {
  apiKey: string;
  region: string;
}

export const TrafficMap = ({ apiKey, region }: TrafficMapProps) => {
  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-3xl px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Route Search Card */}
          <div className="w-full md:w-1/2">
            <RouteNavigator map={null} />
          </div>

          {/* Information Card */}
          <div className="w-full md:w-1/2 space-y-6">
            <Card className="p-6 shadow-md bg-white">
              <div className="flex items-center gap-2 mb-4">
                <Navigation className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium text-slate-800">SmartRoads</h3>
              </div>
              
              <p className="text-slate-600 mb-4">
                Busca rutas entre diferentes ciudades de México y obtén información
                sobre distancia y tiempo de viaje estimado.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                  <Route className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-slate-800">Rutas Populares</h4>
                    <p className="text-sm text-slate-500">Selecciona entre las rutas más buscadas</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <div>
                    <h4 className="font-medium text-slate-800">Origen y Destino</h4>
                    <p className="text-sm text-slate-500">Escribe los lugares entre los que deseas viajar</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-indigo-50">
                  <Compass className="h-5 w-5 text-indigo-600" />
                  <div>
                    <h4 className="font-medium text-slate-800">Información de Viaje</h4>
                    <p className="text-sm text-slate-500">Obtén datos de distancia y tiempo estimado</p>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Traffic Legend Card */}
            <Card className="p-4 shadow-md bg-white">
              <h4 className="text-sm font-semibold mb-3 text-slate-800">Niveles de Tráfico</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="text-sm text-slate-600">Bajo - Tráfico fluido</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                  <span className="text-sm text-slate-600">Medio - Algo de congestión</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span className="text-sm text-slate-600">Alto - Tráfico congestionado</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
