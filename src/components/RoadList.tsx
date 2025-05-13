
import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Road {
  id: string;
  name: string;
  type: string;
  length: number;
  trafficLevel: "Bajo" | "Medio" | "Alto";
  region: string;
}

interface RoadListProps {
  region: string;
}

export const RoadList = ({ region }: RoadListProps) => {
  const [roads, setRoads] = useState<Road[]>([]);
  const [filteredRoads, setFilteredRoads] = useState<Road[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Simulate loading data from an API
  useEffect(() => {
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const mockRoads = generateMockRoads();
      setRoads(mockRoads);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter roads based on search query and selected region
  useEffect(() => {
    let filtered = roads;
    
    // Filter by region if not "all"
    if (region !== "all") {
      filtered = filtered.filter((road) => 
        road.region.toLowerCase() === region.toLowerCase()
      );
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((road) => 
        road.name.toLowerCase().includes(query) || 
        road.type.toLowerCase().includes(query) ||
        road.region.toLowerCase().includes(query)
      );
    }
    
    setFilteredRoads(filtered);
  }, [roads, searchQuery, region]);

  const generateMockRoads = (): Road[] => {
    const roadTypes = ["Federal", "Estatal", "Autopista", "Urbana"];
    const trafficLevels: Array<"Bajo" | "Medio" | "Alto"> = ["Bajo", "Medio", "Alto"];
    const regions = ["CDMX", "Jalisco", "Nuevo León", "Estado de México", "Veracruz", "Puebla", "Guanajuato"];
    
    const mockRoads: Road[] = [];
    
    // Federal roads
    mockRoads.push(
      { id: "1", name: "México-Puebla", type: "Federal", length: 132, trafficLevel: "Alto", region: "CDMX" },
      { id: "2", name: "México-Querétaro", type: "Federal", length: 220, trafficLevel: "Alto", region: "Estado de México" },
      { id: "3", name: "México-Toluca", type: "Federal", length: 65, trafficLevel: "Alto", region: "Estado de México" },
      { id: "4", name: "México-Cuernavaca", type: "Federal", length: 85, trafficLevel: "Alto", region: "CDMX" },
      { id: "5", name: "Guadalajara-Tepic", type: "Federal", length: 212, trafficLevel: "Medio", region: "Jalisco" },
      { id: "6", name: "Monterrey-Saltillo", type: "Federal", length: 86, trafficLevel: "Medio", region: "Nuevo León" },
    );
    
    // Generate more random roads
    for (let i = 7; i <= 30; i++) {
      const roadType = roadTypes[Math.floor(Math.random() * roadTypes.length)];
      const trafficLevel = trafficLevels[Math.floor(Math.random() * trafficLevels.length)];
      const region = regions[Math.floor(Math.random() * regions.length)];
      
      mockRoads.push({
        id: i.toString(),
        name: `Carretera ${roadType} ${i}`,
        type: roadType,
        length: Math.floor(Math.random() * 300) + 20, // 20-320 km
        trafficLevel: trafficLevel,
        region: region,
      });
    }
    
    return mockRoads;
  };

  const getTrafficLevelColor = (level: string) => {
    switch (level) {
      case "Bajo":
        return "text-green-600 bg-green-50 border-green-100";
      case "Medio":
        return "text-yellow-600 bg-yellow-50 border-yellow-100";
      case "Alto":
        return "text-red-600 bg-red-50 border-red-100";
      default:
        return "text-slate-600 bg-slate-50 border-slate-100";
    }
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando carreteras...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          className="pl-10"
          placeholder="Buscar carreteras..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Longitud (km)</TableHead>
              <TableHead>Nivel de Tráfico</TableHead>
              <TableHead>Región</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoads.length > 0 ? (
              filteredRoads.map((road) => (
                <TableRow key={road.id}>
                  <TableCell className="font-medium">{road.name}</TableCell>
                  <TableCell>{road.type}</TableCell>
                  <TableCell className="text-right">{road.length}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getTrafficLevelColor(
                        road.trafficLevel
                      )}`}
                    >
                      {road.trafficLevel}
                    </span>
                  </TableCell>
                  <TableCell>{road.region}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  No se encontraron carreteras que coincidan con los criterios de búsqueda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-4 text-sm text-slate-500">
        Mostrando {filteredRoads.length} de {roads.length} carreteras
      </div>
    </div>
  );
};
