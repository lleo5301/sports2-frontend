import { useState } from 'react';
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
  Trophy,
  Star,
  UserPlus,
  GraduationCap,
  ArrowRightLeft,
  UserCheck,
  School,
  Eye,
  LogOut
} from 'lucide-react';

import ThemeToggle from './ui/ThemeToggle';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { logoUrl, name, programName, primaryColor } = useBranding();
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

  const headerTextColor = isLightColor(primaryColor)
    ? 'text-gray-900'
    : 'text-white';

  const navSections = [
    {
      title: 'Overview',
      items: [{ path: '/', label: 'Dashboard', icon: Home }]
    },
    {
      title: 'Player Management',
      items: [
        { path: '/players', label: 'Roster Players', icon: Users },
        { path: '/performance', label: 'Performance Rankings', icon: Trophy },
        { path: '/scouting', label: 'Scouting Reports', icon: Target },
        { path: '/depth-chart', label: 'Depth Chart', icon: BarChart3 }
      ]
    },
    {
      title: 'Contacts & Networks',
      items: [
        { path: '/coaches', label: 'Coaches', icon: School },
        { path: '/scouts', label: 'Scouts', icon: Eye },
        { path: '/vendors', label: 'Vendors', icon: Building2 },
        {
          path: '/high-school-coaches',
          label: 'High School Coaches',
          icon: GraduationCap
        }
      ]
    },
    {
      title: 'Prospect Pipelines',
      items: [
        { path: '/recruiting', label: 'Recruiting Board', icon: UserCheck },
        {
          path: '/pref-list/new-players',
          label: 'New Players',
          icon: UserPlus
        },
        { path: '/pref-list/overall', label: 'Overall Pref List', icon: Star },
        {
          path: '/pref-list/high-school',
          label: 'HS Pref List',
          icon: GraduationCap
        },
        {
          path: '/pref-list/college-portal',
          label: 'College Portal/transfers',
          icon: ArrowRightLeft
        }
      ]
    },
    {
      title: 'Team Management',
      items: [
        { path: '/teams', label: 'Teams', icon: Building2 },
        { path: '/team-settings', label: 'Team Settings', icon: Settings },
        { path: '/games', label: 'Games', icon: Trophy },
        { path: '/team-schedule', label: 'Team Schedule', icon: Calendar },
        {
          path: '/schedule-templates',
          label: 'Schedule Templates',
          icon: FileText
        }
      ]
    },
    {
      title: 'Reports & Settings',
      items: [
        { path: '/reports', label: 'Reports', icon: FileText },
        { path: '/settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  const toggleDrawer = () => {
    setIsDrawerCollapsed(!isDrawerCollapsed);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div
      className={`drawer lg:drawer-open ${isDrawerCollapsed ? 'lg:drawer-collapsed' : ''}`}
    >
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
        <div className="flex-1 p-4">{children}</div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-50">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <aside
          className={`min-h-full flex flex-col bg-base-200 border-r border-base-300 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isDrawerCollapsed ? 'w-[72px]' : 'w-72'}`}
        >
          {/* Sidebar Header - Monolithic precision */}
          <div className="h-20 flex items-center px-6 relative overflow-hidden group">
            {/* Subtle atmospheric glow behind logo */}
            <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            <Link to="/" className="flex items-center gap-3 min-w-0 z-10">
              <div className="relative flex-shrink-0">
                <div className="absolute -inset-1 bg-brand opacity-20 blur-sm rounded-lg" />
                {fullLogoUrl ? (
                  <img
                    src={fullLogoUrl}
                    alt={programName || name || 'Logo'}
                    className="w-9 h-9 object-contain rounded-lg relative bg-base-300 p-1 border border-base-content/10"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center relative">
                    <span className="text-primary-content text-xs font-black tracking-tighter">
                      CB
                    </span>
                  </div>
                )}
              </div>
              {!isDrawerCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-base-content font-bold leading-tight truncate tracking-tight">
                    {programName || name || 'The Program'}
                  </span>
                  <span className="text-[10px] text-base-content/40 uppercase font-black tracking-[0.2em] leading-none">
                    Management
                  </span>
                </div>
              )}
            </Link>

            {!isDrawerCollapsed && (
              <button
                onClick={toggleDrawer}
                className="ml-auto p-1.5 rounded-lg text-base-content/40 hover:text-base-content hover:bg-base-300/50 transition-all z-10"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {isDrawerCollapsed && (
              <button
                onClick={toggleDrawer}
                className="absolute inset-0 w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 bg-brand/10 transition-opacity duration-300 z-20"
              >
                <ChevronRight className="w-5 h-5 text-brand" />
              </button>
            )}
          </div>

          {/* Navigation Area */}
          <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide space-y-8">
            {navSections.map((section) => (
              <div key={section.title} className="space-y-4">
                {/* Section header - High precision tracking */}
                {!isDrawerCollapsed && (
                  <h3 className="px-4 text-[11px] font-bold text-base-content/40 uppercase tracking-[0.25em]">
                    {section.title}
                  </h3>
                )}

                {/* Section items */}
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          className={`
                            relative flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all duration-300 group
                            ${
                              isActive
                                ? 'bg-brand/10 text-brand font-semibold'
                                : 'text-base-content/60 hover:text-base-content hover:bg-base-300/50'
                            }
                            ${isDrawerCollapsed ? 'justify-center' : ''}
                          `}
                        >
                          {/* Active Indicator Bar */}
                          {isActive && !isDrawerCollapsed && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-brand rounded-r-full animate-fade-in" />
                          )}

                          <IconComponent
                            className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                          />

                          {!isDrawerCollapsed && (
                            <span className="text-[14px] tracking-tight">
                              {item.label}
                            </span>
                          )}

                          {/* Tooltip for collapsed state */}
                          {isDrawerCollapsed && (
                            <div className="absolute left-full ml-4 px-3 py-1.5 bg-base-300 text-base-content text-xs font-bold rounded-lg border border-base-content/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 -translate-x-2 group-hover:translate-x-0 whitespace-nowrap z-50">
                              {item.label}
                            </div>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Theme Toggle - Simple mode control */}
          <ThemeToggle isCollapsed={isDrawerCollapsed} />

          {/* User & Footer Area */}
          <div className="p-4 bg-base-300/20 border-t border-base-300">
            {user && !isDrawerCollapsed && (
              <div className="flex items-center gap-3 px-4 py-4 mb-2 bg-base-300/30 rounded-2xl border border-base-content/5">
                <div className="w-10 h-10 rounded-xl bg-brand/20 flex items-center justify-center border border-brand/20">
                  <UserCheck className="w-5 h-5 text-brand" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-base-content truncate leading-none mb-1">
                    {user.first_name || 'Admin'}
                  </p>
                  <p className="text-[11px] text-base-content/40 truncate uppercase tracking-tighter">
                    {user.role || 'Staff Member'}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center gap-4 px-4 py-3 rounded-xl text-base-content/40 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300 group
                ${isDrawerCollapsed ? 'justify-center' : ''}
              `}
              title={isDrawerCollapsed ? 'Logout' : ''}
            >
              <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
              {!isDrawerCollapsed && (
                <span className="text-sm font-bold">Logout session</span>
              )}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Layout;
