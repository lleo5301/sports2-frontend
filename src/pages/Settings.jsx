import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Settings = () => {
  const { theme, changeTheme } = useTheme();

  const handleThemeChange = (e) => {
    changeTheme(e.target.value);
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-base-content mb-2">
            Settings
          </h1>
          <p className="text-base-content/70">
            Manage your account and application preferences
          </p>
        </div>

        {/* Settings Tabs */}
        <div className="tabs tabs-boxed mb-6">
          <a className="tab tab-active">General</a>
          <a className="tab">Account</a>
          <a className="tab">Notifications</a>
          <a className="tab">Security</a>
        </div>

        {/* General Settings */}
        <div className="space-y-6">
          {/* Theme Settings */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Theme</h2>
              <p className="card-description">Choose your preferred theme</p>
            </div>
            <div className="card-content">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Theme</span>
                </label>
                
                {/* Theme Preview */}
                <div className="mb-4 p-4 rounded-lg border bg-base-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Current Theme Preview</span>
                    <span className="text-xs opacity-70">{theme}</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded bg-primary"></div>
                    <div className="w-8 h-8 rounded bg-secondary"></div>
                    <div className="w-8 h-8 rounded bg-accent"></div>
                    <div className="w-8 h-8 rounded bg-neutral"></div>
                    <div className="w-8 h-8 rounded bg-success"></div>
                    <div className="w-8 h-8 rounded bg-warning"></div>
                    <div className="w-8 h-8 rounded bg-error"></div>
                  </div>
                </div>
                
                <select 
                  className="select select-bordered"
                  value={theme}
                  onChange={handleThemeChange}
                >
                  {/* Custom User-Friendly Themes */}
                  <optgroup label="🎨 Custom Themes">
                    <option value="ocean-breeze">🌊 Ocean Breeze</option>
                    <option value="sunset-glow">🌅 Sunset Glow</option>
                    <option value="forest-mist">🌲 Forest Mist</option>
                    <option value="lavender-dreams">💜 Lavender Dreams</option>
                    <option value="tropical">🌴 Tropical</option>
                  </optgroup>
                  
                  {/* Built-in Themes */}
                  <optgroup label="📦 Built-in Themes">
                    <option value="light">☀️ Light</option>
                    <option value="dark">🌙 Dark</option>
                    <option value="cupcake">🧁 Cupcake</option>
                    <option value="bumblebee">🐝 Bumblebee</option>
                    <option value="emerald">💎 Emerald</option>
                    <option value="corporate">🏢 Corporate</option>
                    <option value="synthwave">🎸 Synthwave</option>
                    <option value="retro">📺 Retro</option>
                    <option value="cyberpunk">🤖 Cyberpunk</option>
                    <option value="valentine">💕 Valentine</option>
                    <option value="halloween">🎃 Halloween</option>
                    <option value="garden">🌱 Garden</option>
                    <option value="forest">🌳 Forest</option>
                    <option value="aqua">💧 Aqua</option>
                    <option value="lofi">🎧 Lo-Fi</option>
                    <option value="pastel">🎨 Pastel</option>
                    <option value="fantasy">🧚 Fantasy</option>
                    <option value="wireframe">📐 Wireframe</option>
                    <option value="black">⚫ Black</option>
                    <option value="luxury">💎 Luxury</option>
                    <option value="dracula">🧛 Dracula</option>
                    <option value="cmyk">🖨️ CMYK</option>
                    <option value="autumn">🍂 Autumn</option>
                    <option value="business">💼 Business</option>
                    <option value="acid">⚗️ Acid</option>
                    <option value="lemonade">🍋 Lemonade</option>
                    <option value="night">🌃 Night</option>
                    <option value="coffee">☕ Coffee</option>
                    <option value="winter">❄️ Winter</option>
                  </optgroup>
                </select>
              </div>
            </div>
          </div>

          {/* Display Settings */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Display</h2>
              <p className="card-description">Customize your display preferences</p>
            </div>
            <div className="card-content space-y-4">
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Show notifications</span>
                  <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Auto-refresh data</span>
                  <input type="checkbox" className="toggle toggle-primary" />
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Compact view</span>
                  <input type="checkbox" className="toggle toggle-primary" />
                </label>
              </div>
            </div>
          </div>

          {/* Data Settings */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Data Management</h2>
              <p className="card-description">Manage your data and exports</p>
            </div>
            <div className="card-content space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Export Data</h3>
                  <p className="text-sm text-base-content/70">Download your data as CSV or JSON</p>
                </div>
                <button className="btn btn-outline">Export</button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Clear Cache</h3>
                  <p className="text-sm text-base-content/70">Clear cached data to free up space</p>
                </div>
                <button className="btn btn-outline">Clear</button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 