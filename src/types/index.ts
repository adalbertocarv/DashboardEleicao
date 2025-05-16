export interface User {
  id: number;
  nome: string;
  email: string;
  tipo: string;
  ativo: boolean;
  criado_em: string;
}

export interface Researcher {
  id: number;
  usuario_id: number;
  usuario?: User;
  dispositivo_id: string;
  ultimo_acesso: string;
  totalSurveys?: number;
}

export interface Survey {
  id: number;
  pesquisador_id: number;
  data_hora: string;
  latitude: number;
  longitude: number;
  sexo: string;
  idade: number;
  renda: string;
  escolaridade: string;
  religiao: string;
  satisfacao_servicos: string;
  problemas: string;
  conhece_politicos: string;
  confianca: number;
  politicos_conhecidos: string;
  vai_votar: string;
  influencia_voto: string;
  interesse: number;
  opiniao: string;
}

export interface DashboardSummary {
  totalSurveys: number;
  totalResearchers: number;
  activeResearchers: number;
  surveysToday: number;
  recentSurveys: Survey[];
}

export interface SurveyFilters {
  startDate?: string;
  endDate?: string;
  researcherId?: number;
  ageRange?: [number, number];
  gender?: string;
  region?: {
    lat: number;
    lng: number;
    radius: number;
  };
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

export interface MapPoint {
  id: number;
  lat: number;
  lng: number;
  info: {
    pesquisador: string;
    dataHora: string;
    idade?: number;
    sexo?: string;
  };
}

export interface HeatmapData {
  points: [number, number, number][]; // [lat, lng, intensity]
  radius?: number;
}