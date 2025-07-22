import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const { theme, changeTheme } = useTheme();
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/players', label: 'Players', icon: '👥' },
    { path: '/teams', label: 'Teams', icon: '🏟️' },
    { path: '/scouting', label: 'Scouting', icon: '📊' },
    { path: '/depth-chart', label: 'Depth Chart', icon: '📈' },
    { path: '/team-schedule', label: 'Team Schedule', icon: '📅' },
    { path: '/reports', label: 'Reports', icon: '📋' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
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
        {/* Top navbar */}
        <div className="w-full navbar bg-base-100 shadow-lg">
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </label>
          </div>
          <div className="flex-1 px-2 mx-2">
            <Link to="/" className="btn btn-ghost text-xl">⚾ Baseball Scout</Link>
          </div>
          <div className="flex-none">
            <button 
              className="btn btn-ghost btn-circle mr-2"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img alt="User" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
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
                ⚾ Baseball Scout
              </Link>
            )}
            <button
              onClick={toggleDrawer}
              className="btn btn-ghost btn-sm btn-circle"
              title={isDrawerCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isDrawerCollapsed ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Navigation menu */}
          <ul className="menu p-4 min-h-full bg-base-200 text-base-content">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path}
                  className={`${location.pathname === item.path ? 'active' : ''} ${isDrawerCollapsed ? 'justify-center' : ''}`}
                  title={isDrawerCollapsed ? item.label : ''}
                >
                  <span className="text-lg">{item.icon}</span>
                  {!isDrawerCollapsed && item.label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default Layout; 