import { GraduationCap, LogOut } from 'lucide-react';
import type { MenuItem } from '../types';

interface LeftSidebarProps {
  menuItems: MenuItem[];
  activeTab: string;
  onPageChange: (label: string) => void;
  user: { username?: string; role?: string } | null;
  onLogout: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ menuItems, activeTab, onPageChange, user, onLogout }) => {
  return (
    <div className="glass-sidebar flex h-full w-full flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="glass-logo">
            <GraduationCap className="h-5 w-5 text-cyan-300" strokeWidth={1.75} />
          </div>
          <div>
            <span className="glass-heading block text-base">{user?.role === 'TEACHER' ? 'Mentor Hub' : 'Mentee Hub'}</span>
            <span className="glass-muted text-xs">{user?.role === 'TEACHER' ? 'Management Console' : 'Mentorship Portal'}</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4 custom-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onPageChange(item.label)}
            className={`glass-nav-item flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm ${
              activeTab === item.label ? 'glass-nav-item-active' : ''
            }`}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span>{item.label}</span>
            {item.badge && (
              <span className="glass-badge ml-auto bg-cyan-500/20 text-cyan-300">{item.badge}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-4 flex items-center gap-3">
          <div className="glass-avatar" />
          <div className="min-w-0 flex-1">
            <p className="glass-heading truncate text-sm">{user?.username ?? 'Student'}</p>
            <p className="glass-muted text-xs capitalize">{user?.role?.toLowerCase() ?? 'student'}</p>
          </div>
        </div>
        <button type="button" onClick={onLogout} className="glass-btn-danger">
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default LeftSidebar;
