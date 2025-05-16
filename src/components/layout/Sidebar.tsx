import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Map, 
  Users, 
  BarChart2, 
  FileText, 
  Settings, 
  LogOut,
  X
} from 'lucide-react';

interface SidebarProps {
  expanded: boolean;
  onClose: () => void;
}

const Sidebar = ({ expanded, onClose }: SidebarProps) => {
  const location = useLocation();
  
  const navItems = [
    { to: '/', icon: <Home size={20} />, label: 'Dashboard' },
    { to: '/map', icon: <Map size={20} />, label: 'Mapa' },
    { to: '/researchers', icon: <Users size={20} />, label: 'Pesquisadores' },
    { to: '/analytics', icon: <BarChart2 size={20} />, label: 'Análises' },
    { to: '/reports', icon: <FileText size={20} />, label: 'Relatórios' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Configurações' },
  ];

  return (
    <div className="flex flex-col h-full border-r border-gray-200">
      {/* Sidebar header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-blue-900 text-white p-2 rounded">
            <BarChart2 size={20} />
          </div>
          {expanded && <span className="text-xl font-bold">OpinionPoll</span>}
        </Link>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 lg:hidden"
        >
          <X size={18} />
        </button>
      </div>
      
      {/* Navigation links */}
      <div className="flex-1 py-6 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-blue-50 text-blue-900'
                    : 'text-gray-700 hover:bg-gray-50'
                } transition-colors duration-200`}
              >
                <div className={`${isActive ? 'text-blue-900' : 'text-gray-500'}`}>
                  {item.icon}
                </div>
                {expanded && <span className="ml-3">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* User section */}
      <div className="p-4 border-t border-gray-200">
        <button 
          className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50"
          onClick={() => {
            // Handle logout
            console.log('Logout clicked');
          }}
        >
          <LogOut size={20} className="text-gray-500" />
          {expanded && <span className="ml-3">Sair</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;