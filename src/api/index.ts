import {
  Survey,
  Researcher,
  User,
  DashboardSummary,
  SurveyFilters,
  MapPoint,
  HeatmapData,
} from "../types";

const API_URL =
  import.meta.env.VITE_API_URL || "https://servidor.shark-newton.ts.net";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// const authHeader = () => ({
//   Authorization: `Bearer ${TOKEN_DEBUG}`, // <-- token fixo
// });

// 🔐 Login
export const login = async (
  email: string,
  password: string
): Promise<{ token: string; user: { nome: string } }> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha: password }),
  });

  if (!response.ok) throw new Error("Falha no login");

  const data = await response.json();

  // Ajusta a estrutura esperada pelo frontend
  return {
    token: data.token,
    user: {
      nome: data.nome,
    },
  };
};

// 📋 Get pesquisas com filtros
export const getSurveys = async (
  filters?: SurveyFilters
): Promise<Survey[]> => {
  const params = new URLSearchParams();

  if (filters?.startDate) params.append("startDate", filters.startDate);
  if (filters?.endDate) params.append("endDate", filters.endDate);
  if (filters?.researcherId)
    params.append("researcherId", filters.researcherId.toString());
  if (filters?.gender) params.append("gender", filters.gender);
  if (filters?.ageRange) {
    params.append("ageMin", filters.ageRange[0].toString());
    params.append("ageMax", filters.ageRange[1].toString());
  }
  if (filters?.region) {
    params.append("lat", filters.region.lat.toString());
    params.append("lng", filters.region.lng.toString());
    params.append("radius", filters.region.radius.toString());
  }

  const response = await fetch(`${API_URL}/pesquisas?${params.toString()}`, {
    headers: authHeader(),
  });

  if (!response.ok) throw new Error("Erro ao buscar pesquisas");
  return response.json();
};

// 🧠 Dashboard summary
export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await fetch(`${API_URL}/dashboard/resumo`, {
    headers: authHeader(),
  });
  if (!response.ok) throw new Error("Erro ao buscar resumo");
  return response.json();
};

// 👤 Pesquisadores
export const getResearchers = async (): Promise<Researcher[]> => {
  const response = await fetch(`${API_URL}/pesquisadores`, {
    headers: authHeader(),
  });
  if (!response.ok) throw new Error("Erro ao buscar pesquisadores");
  return response.json();
};

// 🧑 Usuários
export const getUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_URL}/usuarios`, {
    headers: authHeader(),
  });
  if (!response.ok) throw new Error("Erro ao buscar usuários");
  return response.json();
};

// 🗺️ Pontos do mapa
export const getMapPoints = async (
  filters?: SurveyFilters
): Promise<MapPoint[]> => {
  const surveys = await getSurveys(filters);

  return surveys.map((survey) => ({
    id: survey.id,
    lat: survey.latitude,
    lng: survey.longitude,
    info: {
      pesquisador: survey.pesquisador?.usuario?.nome || "Desconhecido",
      dataHora: survey.data_hora,
      idade: survey.idade,
      sexo: survey.sexo,
    },
  }));
};

// 🔥 Heatmap
export const getHeatmapData = async (
  filters?: SurveyFilters
): Promise<HeatmapData> => {
  const surveys = await getSurveys(filters);
  return {
    points: surveys.map((s) => [s.latitude, s.longitude, 1]),
    radius: 25,
  };
};
