import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useBranding } from '../contexts/BrandingContext';
import { useAuth } from '../contexts/AuthContext';
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
  UserCheck,
  School,
  Eye,
  LogOut
} from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, changeTheme } = useTheme();
  const { logoUrl, name, programName, primaryColor, secondaryColor } = useBranding();
  const { logout, user } = useAuth();
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);

  // Logo URL is served via nginx proxy at /uploads/
  // No need to prepend API URL since nginx proxies /uploads/ to backend
  const fullLogoUrl = logoUrl || null;

  // Calculate if primary color is light or dark for text contrast
  const isLightColor = (hex) => {
    if (!hex) return false;
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  };

  const headerTextColor = isLightColor(primaryColor) ? 'text-gray-900' : 'text-white';

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
      title: 'Contacts & Networks',
      items: [
        { path: '/coaches', label: 'Coaches', icon: School },
        { path: '/scouts', label: 'Scouts', icon: Eye },
        { path: '/vendors', label: 'Vendors', icon: Building2 },
        { path: '/high-school-coaches', label: 'High School Coaches', icon: GraduationCap },
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
        { path: '/team-settings', label: 'Team Settings', icon: Settings },
        { path: '/games', label: 'Games', icon: Trophy },
        { path: '/team-schedule', label: 'Team Schedule', icon: Calendar },
        { path: '/schedule-templates', label: 'Schedule Templates', icon: FileText },
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

  const handleLogout = async () => {
    await logout();
    navigate('/login');
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
          {/* Sidebar header with team branding colors */}
          <div
            className={`p-4 border-b border-base-300 flex items-center justify-between ${headerTextColor}`}
            style={{ backgroundColor: primaryColor || undefined }}
          >
            {!isDrawerCollapsed && (
              <Link to="/" className="flex items-center gap-3 min-w-0">
                {fullLogoUrl ? (
                  <img
                    src={fullLogoUrl}
                    alt={programName || name || 'Team Logo'}
                    className="w-10 h-10 object-contain rounded"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : null}
                <span className="text-xl font-bold truncate" style={{ color: 'inherit' }}>
                  {programName || name || 'The Program'}
                </span>
              </Link>
            )}
            {isDrawerCollapsed && fullLogoUrl && (
              <Link to="/" className="flex justify-center w-full">
                <img
                  src={fullLogoUrl}
                  alt={programName || name || 'Team Logo'}
                  className="w-8 h-8 object-contain rounded"
                />
              </Link>
            )}
            <button
              onClick={toggleDrawer}
              className="btn btn-ghost btn-sm btn-circle flex-shrink-0"
              style={{ color: 'inherit' }}
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

            {/* User section with logout */}
            <div className="mt-6 pt-6 border-t border-base-300">
              {!isDrawerCollapsed && user && (
                <div className="px-3 py-2 mb-2">
                  <p className="text-sm font-medium truncate">{user.first_name} {user.last_name}</p>
                  <p className="text-xs text-base-content/60 truncate">{user.email}</p>
                </div>
              )}
              <ul className="menu">
                <li>
                  <button
                    onClick={handleLogout}
                    className={`text-error hover:bg-error/10 ${isDrawerCollapsed ? 'justify-center' : ''}`}
                    title={isDrawerCollapsed ? 'Logout' : ''}
                  >
                    <LogOut className="w-5 h-5" />
                    {!isDrawerCollapsed && 'Logout'}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Layout; 