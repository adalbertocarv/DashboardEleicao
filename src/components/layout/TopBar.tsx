import { useState } from 'react';
import { Bell, Search, User } from 'lucide-react';

interface TopBarProps {
  children?: React.ReactNode;
}

const TopBar = ({ children }: TopBarProps) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };
  
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };
  
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm z-10">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          {children}
          <div className="ml-4">
            <h1 className="text-xl font-semibold text-gray-900 hidden md:block">
              Dashboard de Pesquisa de Opinião
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:block">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Buscar..."
              />
            </div>
          </div>
          
          {/* Notifications */}
          <div className="relative">
            <button
              className="relative p-2 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none"
              onClick={toggleNotifications}
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
                <div className="p-3 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900">Notificações</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="p-3 border-b border-gray-100 hover:bg-gray-50">
                    <p className="text-sm font-medium text-gray-900">Novas pesquisas adicionadas</p>
                    <p className="text-xs text-gray-500 mt-1">20 novas pesquisas foram adicionadas hoje</p>
                    <p className="text-xs text-gray-400 mt-1">Há 10 minutos</p>
                  </div>
                  <div className="p-3 border-b border-gray-100 hover:bg-gray-50">
                    <p className="text-sm font-medium text-gray-900">Alerta de inatividade</p>
                    <p className="text-xs text-gray-500 mt-1">3 pesquisadores estão inativos há mais de 2 horas</p>
                    <p className="text-xs text-gray-400 mt-1">Há 1 hora</p>
                  </div>
                </div>
                <div className="p-2 border-t border-gray-200">
                  <button className="w-full text-center text-xs font-medium text-blue-600 hover:text-blue-500">
                    Ver todas as notificações
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Profile */}
          <div className="relative">
            <button
              className="flex items-center text-sm rounded-full focus:outline-none"
              onClick={toggleProfile}
            >
              <div className="h-8 w-8 rounded-full bg-blue-900 flex items-center justify-center text-white">
                <User size={16} />
              </div>
            </button>
            
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">Administrador</p>
                  <p className="text-xs text-gray-500 truncate">admin@example.com</p>
                </div>
                <a href="#profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Seu Perfil
                </a>
                <a href="#settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Configurações
                </a>
                <a href="#logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Sair
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;