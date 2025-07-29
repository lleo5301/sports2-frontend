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
  User
} from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const { theme, changeTheme } = useTheme();
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/players', label: 'Players', icon: Users },
    { path: '/teams', label: 'Teams', icon: Building2 },
    { path: '/scouting', label: 'Scouting', icon: Target },
    { path: '/depth-chart', label: 'Depth Chart', icon: BarChart3 },
    { path: '/team-schedule', label: 'Team Schedule', icon: Calendar },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/settings', label: 'Settings', icon: Settings },
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
        {/* Fixed Top navbar */}
        <div className="w-full navbar bg-base-100 shadow-lg fixed top-0 z-50">
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
              <Menu className="w-6 h-6" />
            </label>
          </div>
          <div className="flex-1 px-2 mx-2">
            {/* Removed the heading since it's in the drawer */}
          </div>
          <div className="flex-none">
            <button 
              className="btn btn-ghost btn-circle mr-2"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-10">
                      <User className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/settings">Settings</Link></li>
                <li><a>Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Page content with top padding to account for fixed navbar */}
        <div className="flex-1 p-4 mt-16">
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
          <ul className="menu p-4 min-h-full bg-base-200 text-base-content">
            {navItems.map((item) => {
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
        </aside>
      </div>
    </div>
  );
};

export default Layout; 