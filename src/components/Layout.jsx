import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Home, 
  Users, 
  Building2, 
  Target, 
  BarChart3, 
  Calendar, 
  FileText, 
  Settings,
  Menu,
  ChevronRight,
  ChevronLeft,
  Moon,
  Sun,
  User,
  Trophy,
  Star,
  UserPlus,
  List,
  GraduationCap,
  ArrowRightLeft,
  UserCheck
} from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const { theme, changeTheme } = useTheme();
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);

  const navSections = [
    {
      title: 'Overview',
      items: [
        { path: '/', label: 'Dashboard', icon: Home },
      ]
    },
    {
      title: 'Player Management',
      items: [
        { path: '/players', label: 'Players', icon: Users },
        { path: '/performance', label: 'Performance Rankings', icon: Trophy },
        { path: '/recruiting', label: 'Recruiting Board', icon: UserCheck },
        { path: '/scouting', label: 'Scouting', icon: Target },
        { path: '/depth-chart', label: 'Depth Chart', icon: BarChart3 },
      ]
    },
    {
      title: 'Pref List',
      items: [
        { path: '/pref-list/new-players', label: 'New Players', icon: UserPlus },
        { path: '/pref-list/overall', label: 'Overall Pref List', icon: Star },
        { path: '/pref-list/high-school', label: 'HS Pref List', icon: GraduationCap },
        { path: '/pref-list/college-portal', label: 'College Portal/transfers', icon: ArrowRightLeft },
      ]
    },
    {
      title: 'Team Management',
      items: [
        { path: '/teams', label: 'Teams', icon: Building2 },
        { path: '/team-schedule', label: 'Team Schedule', icon: Calendar },
      ]
    },
    {
      title: 'Reports & Settings',
      items: [
        { path: '/reports', label: 'Reports', icon: FileText },
        { path: '/settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    changeTheme(newTheme);
  };

  const toggleDrawer = () => {
    setIsDrawerCollapsed(!isDrawerCollapsed);
  };

  return (
    <div className={`drawer lg:drawer-open ${isDrawerCollapsed ? 'lg:drawer-collapsed' : ''}`}>
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      
      {/* Page content */}
      <div className="drawer-content flex flex-col">
        {/* Mobile menu toggle - only visible on mobile */}
        <div className="lg:hidden p-4 border-b border-base-300">
          <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
            <Menu className="w-6 h-6" />
          </label>
        </div>
        
        {/* Page content */}
        <div className="flex-1 p-4">
          {children}
        </div>
      </div>
      
      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <aside className={`min-h-full bg-base-200 text-base-content transition-all duration-300 ${isDrawerCollapsed ? 'w-16' : 'w-80'}`}>
          {/* Sidebar header */}
          <div className="bg-base-100 p-4 border-b border-base-300 flex items-center justify-between">
            {!isDrawerCollapsed && (
              <Link to="/" className="text-2xl font-bold">
                The Program
              </Link>
            )}
            <button
              onClick={toggleDrawer}
              className="btn btn-ghost btn-sm btn-circle"
              title={isDrawerCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isDrawerCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>
          
          {/* Navigation menu */}
          <div className="p-4 min-h-full bg-base-200 text-base-content">
            {navSections.map((section, sectionIndex) => (
              <div key={section.title} className={sectionIndex > 0 ? 'mt-6' : ''}>
                {/* Section header */}
                {!isDrawerCollapsed && (
                  <div className="px-3 py-2">
                    <h3 className="text-xs font-semibold text-base-content/70 uppercase tracking-wider">
                      {section.title}
                    </h3>
                  </div>
                )}
                
                {/* Section items */}
                <ul className="menu">
                  {section.items.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <li key={item.path}>
                        <Link 
                          to={item.path}
                          className={`${location.pathname === item.path ? 'active' : ''} ${isDrawerCollapsed ? 'justify-center' : ''}`}
                          title={isDrawerCollapsed ? item.label : ''}
                        >
                          <IconComponent className="w-5 h-5" />
                          {!isDrawerCollapsed && item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Layout; 