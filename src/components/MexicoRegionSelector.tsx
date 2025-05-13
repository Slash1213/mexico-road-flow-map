
import { useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface MexicoRegionSelectorProps {
  selectedRegion: string;
  onChange: (region: string) => void;
}

export const MexicoRegionSelector = ({ selectedRegion, onChange }: MexicoRegionSelectorProps) => {
  const regions = [
    { id: 'all', name: 'Todo México' },
    { id: 'cdmx', name: 'Ciudad de México' },
    { id: 'jalisco', name: 'Jalisco' },
    { id: 'nuevoleon', name: 'Nuevo León' },
    { id: 'estadodemexico', name: 'Estado de México' },
    { id: 'veracruz', name: 'Veracruz' },
    { id: 'puebla', name: 'Puebla' },
    { id: 'guanajuato', name: 'Guanajuato' },
  ];

  return (
    <div className="w-full md:w-60">
      <Select value={selectedRegion} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleccionar región" />
        </SelectTrigger>
        <SelectContent>
          {regions.map((region) => (
            <SelectItem key={region.id} value={region.id}>
              {region.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
