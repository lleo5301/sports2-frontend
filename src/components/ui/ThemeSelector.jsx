import { useTheme } from '../../contexts/ThemeContext';
import { Palette, Check, Sparkles, ShieldCheck, Zap } from 'lucide-react';

const ThemeSelector = ({ isCollapsed, variant = 'sidebar' }) => {
  const { theme: currentTheme, changeTheme, availableThemes } = useTheme();
  const setTheme = (id) => changeTheme(id);

  const getThemeIcon = (id) => {
    switch (id) {
      case 'executive-oxford':
        return <ShieldCheck className="w-4 h-4" />;
      case 'modern-neon':
        return <Zap className="w-4 h-4" />;
      case 'clean-slate':
        return <Palette className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  if (variant === 'settings') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {availableThemes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setTheme(theme.id)}
            className={`
              relative flex flex-col gap-3 p-5 rounded-3xl border transition-all duration-300 group
              ${
                currentTheme === theme.id
                  ? 'bg-brand/5 border-brand/20 ring-1 ring-brand/10'
                  : 'bg-background border-divider hover:border-brand/40 hover:bg-brand/5'
              }
            `}
          >
            <div className="flex items-center justify-between w-full">
              <div
                className={`
                  w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500
                  ${currentTheme === theme.id ? 'bg-brand text-primary-content shadow-lg shadow-brand/20 rotate-6' : 'bg-content1 text-foreground/40 group-hover:bg-brand/10 group-hover:text-brand'}
                `}
              >
                {getThemeIcon(theme.id)}
              </div>
              {currentTheme === theme.id && (
                <div className="w-6 h-6 rounded-full bg-brand flex items-center justify-center animate-scale-in">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>
            <div className="text-left">
              <p
                className={`text-base font-bold tracking-tight ${currentTheme === theme.id ? 'text-brand' : 'text-foreground'}`}
              >
                {theme.name}
              </p>
              <p className="text-xs text-foreground/60 mt-1 font-medium leading-relaxed">
                {theme.description}
              </p>
            </div>

            {/* Theme color indicators */}
            <div className="flex gap-1.5 mt-2">
              <div
                className={`w-3 h-3 rounded-full ${theme.id === 'executive-oxford' ? 'bg-[#3b82f6]' : theme.id === 'modern-neon' ? 'bg-[#8251ee]' : 'bg-[#6366f1]'}`}
              ></div>
              <div
                className={`w-3 h-3 rounded-full ${theme.id === 'executive-oxford' ? 'bg-[#0f172a]' : 'bg-[#1a1a20]'}`}
              ></div>
              <div className="w-3 h-3 rounded-full bg-content2"></div>
            </div>
          </button>
        ))}
      </div>
    );
  }

  if (isCollapsed) {
    return (
      <div className="relative group/theme flex justify-center py-2">
        <div className="w-10 h-10 rounded-xl bg-content2/50 flex items-center justify-center text-foreground/60 group-hover/theme:text-foreground group-hover/theme:bg-content2 transition-all cursor-pointer">
          <Palette className="w-5 h-5" />
        </div>

        {/* Tooltip with theme options */}
        <div className="absolute left-full ml-4 p-2 bg-content2 rounded-2xl border border-base-content/10 opacity-0 group-hover/theme:opacity-100 pointer-events-none group-hover/theme:pointer-events-auto transition-all duration-300 z-[100] min-w-[200px]">
          <p className="px-3 py-2 text-[10px] uppercase font-black tracking-[0.2em] text-foreground/40 border-b border-ui-border mb-2">
            Select Theme
          </p>
          <div className="space-y-1">
            {availableThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                  currentTheme === theme.id
                    ? 'bg-brand/10 text-brand'
                    : 'text-foreground/60 hover:text-foreground hover:bg-content2/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {getThemeIcon(theme.id)}
                  <span className="text-xs font-bold">{theme.name}</span>
                </div>
                {currentTheme === theme.id && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-[11px] font-bold text-foreground/40 uppercase tracking-[0.25em]">
          Visual System
        </h3>
        <Sparkles className="w-3.5 h-3.5 text-foreground/40" />
      </div>

      <div className="grid grid-cols-1 gap-2">
        {availableThemes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setTheme(theme.id)}
            className={`
              relative flex flex-col gap-1 p-3 rounded-2xl border transition-all duration-300 group
              ${
                currentTheme === theme.id
                  ? 'bg-brand/5 border-brand/20 ring-1 ring-brand/10'
                  : 'bg-content2/30 border-ui-border hover:border-ui-border-strong hover:bg-content2/50'
              }
            `}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2.5">
                <div
                  className={`
                  w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                  ${currentTheme === theme.id ? 'bg-brand text-primary-content' : 'bg-content2/50 text-foreground/60 group-hover:text-foreground'}
                `}
                >
                  {getThemeIcon(theme.id)}
                </div>
                <div className="text-left">
                  <p
                    className={`text-sm font-bold leading-none ${currentTheme === theme.id ? 'text-foreground' : 'text-foreground/80'}`}
                  >
                    {theme.name}
                  </p>
                  <p className="text-[10px] text-foreground/40 mt-1 leading-none font-medium">
                    {theme.description}
                  </p>
                </div>
              </div>
              {currentTheme === theme.id && (
                <div className="w-5 h-5 rounded-full bg-brand/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-brand" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
