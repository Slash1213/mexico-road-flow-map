
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TrafficChartProps {
  type: "current" | "historic" | "hourly" | "distribution" | "monthly";
  region: string;
  height?: number;
}

export const TrafficChart = ({ type, region, height = 300 }: TrafficChartProps) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would fetch data from an API
    setLoading(true);
    
    // Simulate API fetch with a timeout
    setTimeout(() => {
      setData(generateMockData(type, region));
      setLoading(false);
    }, 1000);
  }, [type, region]);

  if (loading) {
    return (
      <div
        className="w-full flex items-center justify-center bg-slate-50"
        style={{ height: `${height}px` }}
      >
        <div className="text-center">
          <div className="animate-spin h-6 w-6 border-3 border-blue-600 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-sm text-slate-500">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart(type, data)}
      </ResponsiveContainer>
    </div>
  );
};

// Render different chart types based on the 'type' prop
const renderChart = (type: string, data: any[]) => {
  const COLORS = ["#4CAF50", "#FFC107", "#F44336"]; // Green, Yellow, Red
  
  switch (type) {
    case "current":
      return (
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" name="Nivel de Tráfico (%)">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getTrafficColor(entry.value)} />
            ))}
          </Bar>
        </BarChart>
      );
      
    case "historic":
      return (
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="alto"
            name="Tráfico Alto"
            stroke="#F44336"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="medio"
            name="Tráfico Medio"
            stroke="#FFC107"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="bajo"
            name="Tráfico Bajo"
            stroke="#4CAF50"
            strokeWidth={2}
          />
        </LineChart>
      );
      
    case "hourly":
      return (
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="value"
            name="Densidad de Tráfico"
            stroke="#2196F3"
            fill="#2196F3"
            fillOpacity={0.3}
          />
        </AreaChart>
      );
      
    case "distribution":
      return (
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} km`} />
          <Legend />
        </PieChart>
      );
      
    case "monthly":
      return (
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="anterior" name="Mes Anterior" fill="#8884d8" />
          <Bar dataKey="actual" name="Mes Actual" fill="#82ca9d" />
        </BarChart>
      );
      
    default:
      return (
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      );
  }
};

// Helper function to generate appropriate mock data based on chart type
const generateMockData = (type: string, region: string) => {
  // Apply region filtering (in a real app this would be more sophisticated)
  const regionMultiplier = region === 'cdmx' ? 1.5 : 
                          region === 'jalisco' ? 1.2 : 
                          region === 'nuevoleon' ? 1.3 : 1;
  
  switch (type) {
    case "current":
      return [
        { name: "Carreteras Federales", value: Math.floor(65 * regionMultiplier) },
        { name: "Carreteras Estatales", value: Math.floor(45 * regionMultiplier) },
        { name: "Autopistas", value: Math.floor(30 * regionMultiplier) },
        { name: "Vías Urbanas", value: Math.floor(80 * regionMultiplier) },
      ];
    
    case "historic":
      return [
        { name: "Ene", alto: 40, medio: 30, bajo: 30 },
        { name: "Feb", alto: 35, medio: 35, bajo: 30 },
        { name: "Mar", alto: 45, medio: 30, bajo: 25 },
        { name: "Abr", alto: 50, medio: 25, bajo: 25 },
        { name: "May", alto: 40, medio: 35, bajo: 25 },
        { name: "Jun", alto: 35, medio: 40, bajo: 25 },
      ].map(item => ({
        ...item,
        alto: Math.floor(item.alto * regionMultiplier),
        medio: Math.floor(item.medio * regionMultiplier),
        bajo: Math.floor(item.bajo * regionMultiplier)
      }));
      
    case "hourly":
      return [
        { name: "00:00", value: 10 },
        { name: "02:00", value: 5 },
        { name: "04:00", value: 10 },
        { name: "06:00", value: 30 },
        { name: "08:00", value: 80 },
        { name: "10:00", value: 60 },
        { name: "12:00", value: 70 },
        { name: "14:00", value: 65 },
        { name: "16:00", value: 75 },
        { name: "18:00", value: 85 },
        { name: "20:00", value: 60 },
        { name: "22:00", value: 30 },
      ].map(item => ({
        ...item,
        value: Math.floor(item.value * regionMultiplier)
      }));
      
    case "distribution":
      return [
        { name: "Tráfico Bajo", value: 18500 },
        { name: "Tráfico Medio", value: 12300 },
        { name: "Tráfico Alto", value: 5600 },
      ].map(item => ({
        ...item,
        value: Math.floor(item.value * regionMultiplier)
      }));
      
    case "monthly":
      return [
        { name: "Norte", anterior: 4000, actual: 4500 },
        { name: "Centro", anterior: 6000, actual: 5800 },
        { name: "Sur", anterior: 5000, actual: 5200 },
        { name: "Este", anterior: 3500, actual: 4000 },
        { name: "Oeste", anterior: 4200, actual: 4500 },
      ].map(item => ({
        ...item,
        anterior: Math.floor(item.anterior * regionMultiplier),
        actual: Math.floor(item.actual * regionMultiplier)
      }));
      
    default:
      return [
        { name: "Categoría A", value: 400 },
        { name: "Categoría B", value: 300 },
        { name: "Categoría C", value: 200 },
        { name: "Categoría D", value: 100 },
      ];
  }
};

// Helper function to determine color based on traffic level
const getTrafficColor = (value: number) => {
  if (value <= 30) return "#4CAF50"; // Green for low traffic
  if (value <= 60) return "#FFC107"; // Yellow for medium traffic
  return "#F44336"; // Red for high traffic
};
