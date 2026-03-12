import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ isCollapsed }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  if (isCollapsed) {
    return (
      <div className="flex justify-center py-2">
        <button
          onClick={toggleDarkMode}
          className="w-10 h-10 rounded-xl bg-content2/50 flex items-center justify-center text-foreground/60 hover:text-foreground hover:bg-content2 transition-all cursor-pointer"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-2">
      <button
        onClick={toggleDarkMode}
        className="w-full h-11 flex items-center gap-4 px-4 rounded-xl text-foreground/60 hover:text-foreground hover:bg-content2/50 transition-all group"
      >
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-500/10 text-indigo-500'}`}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </div>
        <span className="text-sm font-bold">
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </span>
      </button>
    </div>
  );
};

export default ThemeToggle;
