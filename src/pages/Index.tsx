
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrafficMap } from "@/components/TrafficMap";
import { TrafficChart } from "@/components/TrafficChart";
import { RoadList } from "@/components/RoadList";
import { MexicoRegionSelector } from "@/components/MexicoRegionSelector";
import { MapPin, Route, ChartLine, List } from "lucide-react";

const Index = () => {
  const [selectedRegion, setSelectedRegion] = useState("all");
  // Use the hardcoded API key instead of getting it from localStorage
  const mapApiKey = "AIzaSyDXaGbgZtHs5108m67KK2oWEouSrDclWQk";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Route className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-slate-800">
                SmartRoads
              </h1>
            </div>
            <MexicoRegionSelector
              selectedRegion={selectedRegion}
              onChange={setSelectedRegion}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto py-6 px-4 md:px-6">
        <Tabs defaultValue="map" className="w-full">
          <TabsList className="mb-6 grid grid-cols-4 md:w-[400px]">
            <TabsTrigger value="map">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Mapa</span>
            </TabsTrigger>
            <TabsTrigger value="traffic">
              <ChartLine className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Tráfico</span>
            </TabsTrigger>
            <TabsTrigger value="roads">
              <List className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Carreteras</span>
            </TabsTrigger>
            <TabsTrigger value="stats">
              <ChartLine className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Estadísticas</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mapa de Carreteras</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[600px] rounded-md overflow-hidden border">
                  <TrafficMap apiKey={mapApiKey} region={selectedRegion} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="traffic" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Nivel de Tráfico Actual</CardTitle>
                </CardHeader>
                <CardContent>
                  <TrafficChart
                    type="current"
                    region={selectedRegion}
                    height={300}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Tráfico</CardTitle>
                </CardHeader>
                <CardContent>
                  <TrafficChart
                    type="historic"
                    region={selectedRegion}
                    height={300}
                  />
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Tráfico por Hora</CardTitle>
              </CardHeader>
              <CardContent>
                <TrafficChart
                  type="hourly"
                  region={selectedRegion}
                  height={400}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roads" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Listado de Carreteras</CardTitle>
              </CardHeader>
              <CardContent>
                <RoadList region={selectedRegion} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Carreteras"
                value="23,456 km"
                description="Total nacional"
              />
              <StatCard
                title="Tráfico Alto"
                value="15%"
                description="De la red vial"
                color="text-red-500"
              />
              <StatCard
                title="Tráfico Medio"
                value="35%"
                description="De la red vial"
                color="text-yellow-500"
              />
              <StatCard
                title="Tráfico Bajo"
                value="50%"
                description="De la red vial"
                color="text-green-500"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Tráfico</CardTitle>
                </CardHeader>
                <CardContent>
                  <TrafficChart
                    type="distribution"
                    region={selectedRegion}
                    height={300}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>
                    Comparativa Mensual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TrafficChart
                    type="monthly"
                    region={selectedRegion}
                    height={300}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-8 py-6">
        <div className="container mx-auto px-4 md:px-6 text-center text-slate-500 text-sm">
          &copy; 2025 SmartRoads. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};

// Stat card component
const StatCard = ({
  title,
  value,
  description,
  color = "text-blue-600",
}: {
  title: string;
  value: string;
  description: string;
  color?: string;
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-sm font-medium text-slate-500">{title}</div>
        <div className={`text-2xl font-bold mt-2 ${color}`}>{value}</div>
        <div className="text-xs text-slate-400 mt-1">{description}</div>
      </CardContent>
    </Card>
  );
};

export default Index;

