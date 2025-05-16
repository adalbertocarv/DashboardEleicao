import { useState } from 'react';
import { Save, Bell, Lock, User, Globe, Database, Trash2 } from 'lucide-react';
import Card from '../components/ui/Card';

const Settings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    updates: false,
  });
  
  const [appearance, setAppearance] = useState({
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
  });
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
      
      {/* Profile Settings */}
      <Card>
        <div className="flex items-center space-x-3 mb-4">
          <User size={20} className="text-blue-900" />
          <h2 className="text-lg font-medium">Perfil</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Nome</label>
            <input
              type="text"
              className="input w-full"
              placeholder="Seu nome"
              defaultValue="Administrador"
            />
          </div>
          
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input w-full"
              placeholder="seu@email.com"
              defaultValue="admin@example.com"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <button className="btn btn-primary">
            <Save size={16} className="mr-1" />
            Salvar Alterações
          </button>
        </div>
      </Card>
      
      {/* Security Settings */}
      <Card>
        <div className="flex items-center space-x-3 mb-4">
          <Lock size={20} className="text-blue-900" />
          <h2 className="text-lg font-medium">Segurança</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="label">Senha Atual</label>
            <input
              type="password"
              className="input w-full"
              placeholder="••••••••"
            />
          </div>
          
          <div>
            <label className="label">Nova Senha</label>
            <input
              type="password"
              className="input w-full"
              placeholder="••••••••"
            />
          </div>
          
          <div>
            <label className="label">Confirmar Nova Senha</label>
            <input
              type="password"
              className="input w-full"
              placeholder="••••••••"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <button className="btn btn-primary">
            <Save size={16} className="mr-1" />
            Atualizar Senha
          </button>
        </div>
      </Card>
      
      {/* Notification Settings */}
      <Card>
        <div className="flex items-center space-x-3 mb-4">
          <Bell size={20} className="text-blue-900" />
          <h2 className="text-lg font-medium">Notificações</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Notificações por Email</p>
              <p className="text-sm text-gray-500">Receber atualizações por email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notifications.email}
                onChange={(e) => setNotifications(prev => ({ ...prev, email: e.target.checked }))}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-900"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Notificações Push</p>
              <p className="text-sm text-gray-500">Receber notificações no navegador</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notifications.push}
                onChange={(e) => setNotifications(prev => ({ ...prev, push: e.target.checked }))}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-900"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Atualizações do Sistema</p>
              <p className="text-sm text-gray-500">Receber notificações sobre atualizações</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notifications.updates}
                onChange={(e) => setNotifications(prev => ({ ...prev, updates: e.target.checked }))}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-900"></div>
            </label>
          </div>
        </div>
      </Card>
      
      {/* Regional Settings */}
      <Card>
        <div className="flex items-center space-x-3 mb-4">
          <Globe size={20} className="text-blue-900" />
          <h2 className="text-lg font-medium">Regional</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Idioma</label>
            <select
              className="input w-full"
              value={appearance.language}
              onChange={(e) => setAppearance(prev => ({ ...prev, language: e.target.value }))}
            >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>
          
          <div>
            <label className="label">Fuso Horário</label>
            <select
              className="input w-full"
              value={appearance.timezone}
              onChange={(e) => setAppearance(prev => ({ ...prev, timezone: e.target.value }))}
            >
              <option value="America/Sao_Paulo">América/São Paulo (GMT-3)</option>
              <option value="America/Manaus">América/Manaus (GMT-4)</option>
              <option value="America/Belem">América/Belém (GMT-3)</option>
            </select>
          </div>
        </div>
      </Card>
      
      {/* Database Settings */}
      <Card>
        <div className="flex items-center space-x-3 mb-4">
          <Database size={20} className="text-blue-900" />
          <h2 className="text-lg font-medium">Banco de Dados</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-2">Backup Automático</p>
            <select className="input w-full">
              <option value="daily">Diário</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensal</option>
            </select>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-2">Retenção de Dados</p>
            <select className="input w-full">
              <option value="30">30 dias</option>
              <option value="60">60 dias</option>
              <option value="90">90 dias</option>
              <option value="365">1 ano</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button className="btn bg-red-600 text-white hover:bg-red-700 focus:ring-red-500">
            <Trash2 size={16} className="mr-1" />
            Limpar Todos os Dados
          </button>
          <p className="mt-2 text-xs text-gray-500">
            Atenção: Esta ação não pode ser desfeita.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Settings;