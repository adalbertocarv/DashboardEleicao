import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  BarChart2, 
  Users, 
  Calendar, 
  MapPin, 
  Activity, 
  ChevronRight, 
  Info
} from 'lucide-react';
import Card from '../components/ui/Card';
import ChartContainer from '../components/ui/ChartContainer';
import StatusBadge from '../components/ui/StatusBadge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { getDashboardSummary, getResearchers, getSurveys } from '../api';
import { ChartData } from '../types';

const Dashboard = () => {
  const [timeFilter, setTimeFilter] = useState('today');
  
  // Fetch dashboard summary data
  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: getDashboardSummary,
  });
  
  // Fetch researchers data for the activity display
  const { data: researchers, isLoading: isLoadingResearchers } = useQuery({
    queryKey: ['researchers'],
    queryFn: getResearchers,
  });

  // Fetch surveys for charts
  const { data: surveys, isLoading: isLoadingSurveys } = useQuery({
    queryKey: ['surveys'],
    queryFn: () => getSurveys(),
  });
  
  // Calculate chart data from real surveys
  const calculateChartData = () => {
    if (!surveys) return null;

    // Surveys by date
    const last7Days = new Array(7).fill(0).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return format(date, 'dd/MM', { locale: ptBR });
    }).reverse();

    const surveysByDate = last7Days.map(date => {
      return surveys.filter(s => 
        format(new Date(s.data_hora), 'dd/MM', { locale: ptBR }) === date
      ).length;
    });

    // Demographics data
    const ageGroups = {
      '18-24': 0, '25-34': 0, '35-44': 0, '45-54': 0, '55+': 0
    };

    surveys.forEach(s => {
      if (s.idade < 25) ageGroups['18-24']++;
      else if (s.idade < 35) ageGroups['25-34']++;
      else if (s.idade < 45) ageGroups['35-44']++;
      else if (s.idade < 55) ageGroups['45-54']++;
      else ageGroups['55+']++;
    });

    // Satisfaction data
    const satisfactionLevels = {
      'Muito Insatisfeito': 0,
      'Insatisfeito': 0,
      'Neutro': 0,
      'Satisfeito': 0,
      'Muito Satisfeito': 0
    };

surveys.forEach(s => {
  if (
    s.satisfacao_servicos &&
    satisfactionLevels[s.satisfacao_servicos] !== undefined
  ) {
    satisfactionLevels[s.satisfacao_servicos]++;
  }
});

    return {
      surveysByDate: {
        labels: last7Days,
        datasets: [{
          label: 'Pesquisas Realizadas',
          data: surveysByDate,
          backgroundColor: '#1E40AF',
        }]
      },
      demographics: {
        labels: Object.keys(ageGroups),
        datasets: [{
          label: 'Distribuição por Idade',
          data: Object.values(ageGroups),
          backgroundColor: [
            '#1E40AF', '#2563EB', '#3B82F6', '#60A5FA', '#93C5FD'
          ],
        }]
      },
      satisfaction: {
        labels: Object.keys(satisfactionLevels),
        datasets: [{
          label: 'Nível de Satisfação',
          data: Object.values(satisfactionLevels),
          backgroundColor: '#0F766E',
        }]
      }
    };
  };

  const chartData = calculateChartData();
  
  // Active researchers - sorted by last access
  const activeResearchers = researchers
    ?.filter(r => new Date(r.ultimo_acesso) > new Date(Date.now() - 24 * 60 * 60 * 1000))
    .sort((a, b) => new Date(b.ultimo_acesso).getTime() - new Date(a.ultimo_acesso).getTime())
    .slice(0, 5);
  
  if (isLoadingSummary || isLoadingResearchers || isLoadingSurveys) {
    return <LoadingSpinner size="lg" />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="mt-2 md:mt-0 flex items-center">
          <span className="text-sm text-gray-500 mr-2">Filtrar por:</span>
          <select 
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="today">Hoje</option>
            <option value="yesterday">Ontem</option>
            <option value="week">Esta Semana</option>
            <option value="month">Este Mês</option>
          </select>
        </div>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Total de Pesquisas</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{summary?.totalSurveys || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <BarChart2 size={24} className="text-blue-900" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
              +{summary?.surveysToday || 0} hoje
            </span>
          </div>
        </Card>
        
        <Card className="hover:border-teal-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Pesquisadores Ativos</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{summary?.activeResearchers || 0}</p>
            </div>
            <div className="p-3 bg-teal-100 rounded-full">
              <Users size={24} className="text-teal-700" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-xs font-medium text-gray-600">
              {summary?.totalResearchers || 0} pesquisadores no total
            </span>
          </div>
        </Card>
        
        <Card className="hover:border-amber-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Pesquisas Hoje</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{summary?.surveysToday || 0}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-full">
              <Calendar size={24} className="text-amber-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
              Última há {summary?.recentSurveys?.[0] ? 
                format(new Date(summary.recentSurveys[0].data_hora), 'mm', { locale: ptBR }) : '0'} minutos
            </span>
          </div>
        </Card>
        
        <Card className="hover:border-indigo-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Regiões Mapeadas</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {surveys ? new Set(surveys.map(s => `${s.latitude.toFixed(1)},${s.longitude.toFixed(1)}`)).size : 0}
              </p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <MapPin size={24} className="text-indigo-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
              Cobertura ativa
            </span>
          </div>
        </Card>
      </div>
      
      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {chartData && (
          <>
            <ChartContainer
              title="Pesquisas por Data"
              subtitle="Últimos 7 dias"
              type="bar"
              data={chartData.surveysByDate}
              action={
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  Ver Detalhes
                </button>
              }
            />
            
            <ChartContainer
              title="Distribuição Demográfica"
              subtitle="Por Idade"
              type="doughnut"
              data={chartData.demographics}
              action={
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  Ver Mais
                </button>
              }
            />
          </>
        )}
      </div>
      
      {/* Additional content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Satisfaction chart */}
        <div className="lg:col-span-2">
          {chartData && (
            <ChartContainer
              title="Nível de Satisfação com Serviços Públicos"
              type="line"
              data={chartData.satisfaction}
            />
          )}
        </div>
        
        {/* Recent activity */}
        <Card title="Atividade dos Pesquisadores" className="lg:col-span-1">
          <div className="space-y-4">
            {activeResearchers?.map((researcher) => (
              <div key={researcher.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users size={16} className="text-blue-900" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {researcher.usuario?.nome || `Pesquisador ${researcher.id}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(researcher.ultimo_acesso).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <StatusBadge 
                  status={
                    new Date(researcher.ultimo_acesso) > new Date(Date.now() - 30 * 60 * 1000)
                      ? 'online'
                      : 'offline'
                  } 
                  pulsing={new Date(researcher.ultimo_acesso) > new Date(Date.now() - 15 * 60 * 1000)}
                />
              </div>
            ))}
            
            {(!activeResearchers || activeResearchers.length === 0) && (
              <div className="flex flex-col items-center justify-center text-center py-4">
                <Info size={24} className="text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  Nenhum pesquisador ativo nas últimas 24 horas.
                </p>
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <a 
              href="/researchers" 
              className="flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              <span>Ver todos os pesquisadores</span>
              <ChevronRight size={16} className="ml-1" />
            </a>
          </div>
        </Card>
      </div>
      
      {/* Recent surveys */}
      <Card title="Pesquisas Recentes">
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
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {summary?.recentSurveys?.map((survey) => (
                <tr key={survey.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{survey.id}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {survey.pesquisador?.usuario?.nome || `Pesquisador ${survey.pesquisador_id}`}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(survey.data_hora), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin size={14} className="text-gray-400 mr-1" />
                      <span>{survey.latitude.toFixed(4)}, {survey.longitude.toFixed(4)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {survey.sexo}, {survey.idade} anos
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Mostrando {summary?.recentSurveys?.length || 0} de {summary?.totalSurveys || 0} pesquisas
          </p>
          <button className="text-sm flex items-center text-blue-600 hover:text-blue-800">
            <span>Ver todas as pesquisas</span>
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;