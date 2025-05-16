import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  FileText, 
  Download, 
  Filter, 
  ChevronDown, 
  Calendar,
  Users,
  MapPin
} from 'lucide-react';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { getSurveys } from '../api';
import { SurveyFilters } from '../types';

const Reports = () => {
  const [filters, setFilters] = useState<SurveyFilters>({});
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string>('daily');
  
  const { data: surveys, isLoading } = useQuery({
    queryKey: ['surveys', filters],
    queryFn: () => getSurveys(filters),
  });
  
  const generateReport = () => {
    if (!surveys) return [];
    
    const reportData = surveys.map(survey => ({
      id: survey.id,
      pesquisador: `Pesquisador ${survey.pesquisador_id}`,
      data: format(new Date(survey.data_hora), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
      localizacao: `${survey.latitude.toFixed(4)}, ${survey.longitude.toFixed(4)}`,
      perfil: `${survey.idade} anos, ${survey.sexo}`,
      satisfacao: survey.satisfacao_servicos,
      interesse: `${survey.interesse}/10`,
    }));
    
    return reportData;
  };
  
  const reportTypes = [
    { id: 'daily', name: 'Relatório Diário', icon: Calendar },
    { id: 'researchers', name: 'Por Pesquisador', icon: Users },
    { id: 'regions', name: 'Por Região', icon: MapPin },
  ];
  
  const reportData = generateReport();
  
  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
        
        <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            className="btn btn-outline flex items-center"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <Filter size={16} className="mr-1" />
            Filtros
            <ChevronDown size={16} className="ml-1" />
          </button>
          
          <button className="btn btn-primary flex items-center">
            <Download size={16} className="mr-1" />
            Exportar CSV
          </button>
        </div>
      </div>
      
      {/* Filters panel */}
      {filtersOpen && (
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Data Inicial</label>
              <input
                type="date"
                className="input w-full"
                value={filters.startDate || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="label">Data Final</label>
              <input
                type="date"
                className="input w-full"
                value={filters.endDate || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="label">Tipo de Relatório</label>
              <select
                className="input w-full"
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
              >
                {reportTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end space-x-2">
            <button
              className="btn btn-outline"
              onClick={() => {
                setFilters({});
                setSelectedReport('daily');
              }}
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
      
      {/* Report type cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reportTypes.map(type => (
          <Card
            key={type.id}
            className={`cursor-pointer transition-all ${
              selectedReport === type.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedReport(type.id)}
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <type.icon size={20} className="text-blue-900" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{type.name}</p>
                <p className="text-xs text-gray-500">
                  {reportData.length} registros disponíveis
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Report table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <FileText size={20} className="text-blue-900" />
            <h2 className="text-lg font-medium text-gray-900">
              Dados do Relatório
            </h2>
          </div>
          <p className="text-sm text-gray-500">
            {reportData.length} registros encontrados
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pesquisador
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data/Hora
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localização
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Perfil
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Satisfação
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interesse
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{item.id}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {item.pesquisador}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {item.data}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {item.localizacao}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {item.perfil}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {item.satisfacao}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {item.interesse}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Página 1 de {Math.ceil(reportData.length / 10)}
          </p>
          <div className="flex space-x-2">
            <button className="btn btn-outline" disabled>
              Anterior
            </button>
            <button className="btn btn-outline">
              Próxima
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Reports;