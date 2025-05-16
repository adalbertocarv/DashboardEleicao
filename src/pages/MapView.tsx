import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  useMap,
  Circle
} from 'react-leaflet';
import { RemoveFormatting as Format, Calendar, UserCheck, Filter, ChevronDown, MapPin, Map, Heater as HeatMap } from 'lucide-react';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { getMapPoints, getHeatmapData, getResearchers } from '../api';
import { SurveyFilters } from '../types';
import L from 'leaflet';

// Custom marker icon
const createMarkerIcon = () => {
  return L.divIcon({
    html: `<div class="bg-blue-900 text-white p-1 rounded-full flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z"/></svg>
           </div>`,
    className: 'custom-marker-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24]
  });
};

// HeatmapLayer component
const HeatmapLayer = ({ data }: { data: [number, number, number][] }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!data || data.length === 0) return;
    
    // @ts-ignore - L.heatLayer is added by the Leaflet.heat plugin
    // In a real app, you would properly import and configure this
    if (window.L && L.heatLayer) {
      const heatLayer = L.heatLayer(data, { radius: 25 });
      heatLayer.addTo(map);
      
      return () => {
        map.removeLayer(heatLayer);
      };
    }
  }, [map, data]);
  
  return null;
};

// For the purposes of this demo, we'll simulate the heat map with circles
const HeatmapSimulation = ({ data }: { data: [number, number, number][] }) => {
  if (!data || data.length === 0) return null;
  
  return (
    <>
      {data.map((point, index) => (
        <Circle
          key={index}
          center={[point[0], point[1]]}
          radius={300}
          pathOptions={{
            fillColor: '#1E40AF',
            fillOpacity: 0.3,
            weight: 0,
          }}
        />
      ))}
    </>
  );
};

const MapView = () => {
  const [filters, setFilters] = useState<SurveyFilters>({});
  const [mapView, setMapView] = useState<'points' | 'heatmap'>('points');
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // Get researchers for filter dropdown
  const { data: researchers } = useQuery({
    queryKey: ['researchers'],
    queryFn: getResearchers,
  });
  
  // Get map points
  const { data: mapPoints, isLoading: isLoadingPoints } = useQuery({
    queryKey: ['mapPoints', filters],
    queryFn: () => getMapPoints(filters),
  });
  
  // Get heatmap data
  const { data: heatmapData, isLoading: isLoadingHeatmap } = useQuery({
    queryKey: ['heatmapData', filters],
    queryFn: () => getHeatmapData(filters),
    enabled: mapView === 'heatmap',
  });
  
  const toggleFilters = () => {
    setFiltersOpen(!filtersOpen);
  };
  
  const handleFilterChange = (key: keyof SurveyFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const clearFilters = () => {
    setFilters({});
  };
  
  const isLoading = mapView === 'points' ? isLoadingPoints : isLoadingHeatmap;
  
  // Initial map position - centered on Brazil
  const initialPosition = [-15.8267, -47.9218]; // Brasília
  const zoom = 5;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Mapa de Pesquisas</h1>
        
        <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="flex space-x-2">
            <button
              className={`btn ${mapView === 'points' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setMapView('points')}
            >
              <MapPin size={16} className="mr-1" />
              Pontos
            </button>
            <button
              className={`btn ${mapView === 'heatmap' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setMapView('heatmap')}
            >
              <HeatMap size={16} className="mr-1" />
              Mapa de Calor
            </button>
          </div>
          
          <button
            className="btn btn-outline flex items-center"
            onClick={toggleFilters}
          >
            <Filter size={16} className="mr-1" />
            Filtros
            <ChevronDown size={16} className="ml-1" />
          </button>
        </div>
      </div>
      
      {/* Filters Panel */}
      {filtersOpen && (
        <Card className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="startDate" className="label">
                Data Inicial
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                  <Calendar size={16} />
                </span>
                <input
                  id="startDate"
                  type="date"
                  className="input rounded-l-none"
                  value={filters.startDate || ''}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="endDate" className="label">
                Data Final
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                  <Calendar size={16} />
                </span>
                <input
                  id="endDate"
                  type="date"
                  className="input rounded-l-none"
                  value={filters.endDate || ''}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="researcherId" className="label">
                Pesquisador
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                  <UserCheck size={16} />
                </span>
                <select
                  id="researcherId"
                  className="input rounded-l-none"
                  value={filters.researcherId || ''}
                  onChange={(e) => handleFilterChange('researcherId', e.target.value ? parseInt(e.target.value) : undefined)}
                >
                  <option value="">Todos</option>
                  {researchers?.map((researcher) => (
                    <option key={researcher.id} value={researcher.id}>
                      {researcher.usuario?.nome || `Pesquisador ${researcher.id}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="gender" className="label">
                Gênero
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                  <Format size={16} />
                </span>
                <select
                  id="gender"
                  className="input rounded-l-none"
                  value={filters.gender || ''}
                  onChange={(e) => handleFilterChange('gender', e.target.value || undefined)}
                >
                  <option value="">Todos</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                  <option value="Prefiro não informar">Prefiro não informar</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end space-x-2">
            <button
              className="btn btn-outline"
              onClick={clearFilters}
            >
              Limpar Filtros
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setFiltersOpen(false)}
            >
              Aplicar Filtros
            </button>
          </div>
        </Card>
      )}
      
      {/* Map Card */}
      <Card className="h-[calc(100vh-16rem)]">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <MapContainer
            center={initialPosition}
            zoom={zoom}
            scrollWheelZoom
            style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {mapView === 'points' && mapPoints?.map((point) => (
              <Marker 
                key={point.id} 
                position={[point.lat, point.lng]}
                icon={createMarkerIcon()}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-medium">{point.info.pesquisador}</p>
                    <p className="text-gray-600">{new Date(point.info.dataHora).toLocaleString('pt-BR')}</p>
                    {point.info.idade && point.info.sexo && (
                      <p className="text-gray-600 mt-1">
                        {point.info.idade} anos, {point.info.sexo}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
            
            {mapView === 'heatmap' && heatmapData?.points && (
              <HeatmapSimulation data={heatmapData.points} />
            )}
          </MapContainer>
        )}
      </Card>
      
      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full mr-4">
              <Map size={20} className="text-blue-900" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total de Pontos no Mapa</p>
              <p className="text-xl font-semibold">{mapPoints?.length || 0}</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-teal-100 rounded-full mr-4">
              <UserCheck size={20} className="text-teal-700" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pesquisadores Ativos</p>
              <p className="text-xl font-semibold">
                {new Set(mapPoints?.map(p => p.info.pesquisador)).size || 0}
              </p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-amber-100 rounded-full mr-4">
              <Filter size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Filtros Aplicados</p>
              <p className="text-xl font-semibold">
                {Object.keys(filters).filter(k => filters[k as keyof SurveyFilters] !== undefined).length}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MapView;