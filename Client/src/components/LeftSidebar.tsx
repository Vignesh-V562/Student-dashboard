import { LogOut } from 'lucide-react';

import type { MenuItem } from '../types';

interface LeftSidebarProps {
  darkMode: boolean;
  menuItems: MenuItem[];
  activeTab: string;
  onPageChange: (label: string) => void;
  user: { username?: string; role?: string } | null;
  onLogout: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ darkMode, menuItems, activeTab, onPageChange, user, onLogout }) => {
  return (
    <div className={`h-full w-full flex-shrink-0 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'} border-r flex flex-col`}>
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg"></div>
          <span className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Exams</span>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item, idx) => (
          <div
            key={idx}
            onClick={() => onPageChange(item.label)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${activeTab === item.label
              ? darkMode
                ? 'bg-gray-800 text-gray-100 font-medium shadow-sm'
                : 'bg-white text-gray-900 font-medium shadow-sm'
              : darkMode
                ? 'text-gray-400 hover:bg-gray-800'
                : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm">{item.label}</span>
            {item.badge && (
              <span className={`ml-auto ${darkMode ? 'bg-gray-100 text-gray-900' : 'bg-black text-white'} text-xs px-2 py-0.5 rounded-full`}>
                {item.badge}
              </span>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className={`p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
        <p className={`text-xs font-medium ${darkMode ? 'text-gray-500' : 'text-gray-600'} mb-3`}>Settings and news</p>
        <div className="space-y-2">
          {["What's New", 'Settings'].map((item, idx) => (
            <div key={idx} className={`text-sm ${darkMode ? 'text-gray-400 hover:text-gray-100' : 'text-gray-700 hover:text-gray-900'} cursor-pointer flex items-center gap-2`}>
              <div className={`w-1 h-1 ${darkMode ? 'bg-gray-600' : 'bg-gray-400'} rounded-full`}></div>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* User Profile */}
      <div className={`p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"></div>
          <div className="flex-1">
            <p className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{user?.username || 'John Doe'}</p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{user?.role ?? 'Student'}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all font-medium ${darkMode
            ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
            : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 shadow-sm'
            } active:scale-95`}>
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default LeftSidebar;