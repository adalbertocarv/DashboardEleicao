import { useQuery } from "@tanstack/react-query";
import { getResearchers } from "../api";
import { Users } from "lucide-react";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const Researchers = () => {
  const {
    data: researchers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["researchers"],
    queryFn: getResearchers,
  });

  if (isLoading) return <LoadingSpinner size="lg" />;

  if (error)
    return (
      <div className="p-6 text-red-600 font-medium">
        Erro ao carregar pesquisadores. Verifique sua conexão com o servidor.
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pesquisadores</h1>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {researchers?.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-lg shadow p-6 flex flex-col gap-2"
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 text-blue-700 rounded-full p-2">
                <Users size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {r.usuario?.nome || `Pesquisador #${r.id}`}
                </h2>
                <p className="text-sm text-gray-500">{r.usuario?.email}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Último acesso:{" "}
              {new Date(r.ultimo_acesso).toLocaleString("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </p>
            <p className="text-sm text-gray-500">
              ID do dispositivo:{" "}
              <code className="text-xs">{r.dispositivo_id}</code>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Researchers;
