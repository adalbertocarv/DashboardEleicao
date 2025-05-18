import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart2,
  PieChart,
  TrendingUp,
  Filter,
  ChevronDown,
} from "lucide-react";
import Card from "../components/ui/Card";
import ChartContainer from "../components/ui/ChartContainer";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { getSurveys } from "../api";
import { ChartData, SurveyFilters } from "../types";

const Analytics = () => {
  const [filters, setFilters] = useState<SurveyFilters>({});
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data: surveys, isLoading } = useQuery({
    queryKey: ["surveys", filters],
    queryFn: () => getSurveys(filters),
  });

  // Calculate statistics from survey data
  const calculateStats = () => {
    if (!surveys) return null;

    const totalSurveys = surveys.length;
    const avgAge = surveys.reduce((sum, s) => sum + s.idade, 0) / totalSurveys;
    const avgConfidence =
      surveys.reduce((sum, s) => sum + s.confianca, 0) / totalSurveys;
    const avgInterest =
      surveys.reduce((sum, s) => sum + s.interesse, 0) / totalSurveys;

    return {
      totalSurveys,
      avgAge: avgAge.toFixed(1),
      avgConfidence: avgConfidence.toFixed(1),
      avgInterest: avgInterest.toFixed(1),
    };
  };

  // Prepare chart data
  const prepareChartData = () => {
    if (!surveys) return null;

    // Age distribution
    const ageGroups = {
      "18-24": 0,
      "25-34": 0,
      "35-44": 0,
      "45-54": 0,
      "55-64": 0,
      "65+": 0,
    };

    surveys.forEach((s) => {
      if (s.idade < 25) ageGroups["18-24"]++;
      else if (s.idade < 35) ageGroups["25-34"]++;
      else if (s.idade < 45) ageGroups["35-44"]++;
      else if (s.idade < 55) ageGroups["45-54"]++;
      else if (s.idade < 65) ageGroups["55-64"]++;
      else ageGroups["65+"]++;
    });

    const ageDistribution: ChartData = {
      labels: Object.keys(ageGroups),
      datasets: [
        {
          label: "Distribuição por Idade",
          data: Object.values(ageGroups),
          backgroundColor: [
            "#1E40AF",
            "#2563EB",
            "#3B82F6",
            "#60A5FA",
            "#93C5FD",
            "#BFDBFE",
          ],
        },
      ],
    };

    // Satisfaction distribution
    const satisfactionLevels = {
      "Muito insatisfeito": 0,
      Insatisfeito: 0,
      Neutro: 0,
      Satisfeito: 0,
      "Muito satisfeito": 0,
    };

    surveys.forEach((s) => {
      satisfactionLevels[s.satisfacao_servicos]++;
    });

    const satisfactionDistribution: ChartData = {
      labels: Object.keys(satisfactionLevels),
      datasets: [
        {
          label: "Nível de Satisfação",
          data: Object.values(satisfactionLevels),
          backgroundColor: "#0F766E",
        },
      ],
    };

    // Voting intention
    const votingIntention = {
      Sim: surveys.filter((s) => s.vai_votar === true).length,
      Não: surveys.filter((s) => s.vai_votar === false).length,
    };

    const votingIntentionData: ChartData = {
      labels: Object.keys(votingIntention),
      datasets: [
        {
          label: "Intenção de Voto",
          data: Object.values(votingIntention),
          backgroundColor: ["#15803D", "#DC2626"],
        },
      ],
    };

    return {
      ageDistribution,
      satisfactionDistribution,
      votingIntentionData,
    };
  };

  const stats = calculateStats();
  const chartData = prepareChartData();

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Análise de Dados</h1>

        <button
          className="mt-3 sm:mt-0 btn btn-outline flex items-center"
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          <Filter size={16} className="mr-1" />
          Filtros
          <ChevronDown size={16} className="ml-1" />
        </button>
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
                value={filters.startDate || ""}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, startDate: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="label">Data Final</label>
              <input
                type="date"
                className="input w-full"
                value={filters.endDate || ""}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, endDate: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="label">Faixa Etária</label>
              <select
                className="input w-full"
                value={
                  filters.ageRange
                    ? `${filters.ageRange[0]}-${filters.ageRange[1]}`
                    : ""
                }
                onChange={(e) => {
                  const [min, max] = e.target.value.split("-").map(Number);
                  setFilters((prev) => ({ ...prev, ageRange: [min, max] }));
                }}
              >
                <option value="">Todas as idades</option>
                <option value="18-24">18-24 anos</option>
                <option value="25-34">25-34 anos</option>
                <option value="35-44">35-44 anos</option>
                <option value="45-54">45-54 anos</option>
                <option value="55-100">55+ anos</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            <button className="btn btn-outline" onClick={() => setFilters({})}>
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

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full mr-4">
              <BarChart2 size={20} className="text-blue-900" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total de Pesquisas</p>
              <p className="text-xl font-semibold">
                {stats?.totalSurveys || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-teal-100 rounded-full mr-4">
              <PieChart size={20} className="text-teal-700" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Idade Média</p>
              <p className="text-xl font-semibold">{stats?.avgAge || 0} anos</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-amber-100 rounded-full mr-4">
              <TrendingUp size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Confiança Média</p>
              <p className="text-xl font-semibold">
                {stats?.avgConfidence || 0}/10
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-indigo-100 rounded-full mr-4">
              <BarChart2 size={20} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Interesse Médio</p>
              <p className="text-xl font-semibold">
                {stats?.avgInterest || 0}/10
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title="Distribuição por Idade"
          type="pie"
          data={chartData?.ageDistribution || { labels: [], datasets: [] }}
        />

        <ChartContainer
          title="Nível de Satisfação"
          type="bar"
          data={
            chartData?.satisfactionDistribution || { labels: [], datasets: [] }
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ChartContainer
          title="Intenção de Voto"
          type="doughnut"
          data={chartData?.votingIntentionData || { labels: [], datasets: [] }}
        />
      </div>
    </div>
  );
};

export default Analytics;
