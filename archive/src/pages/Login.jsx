import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { login } from '../services/auth';
import toast from 'react-hot-toast';
import OAuthButtons from '../components/OAuthButtons';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // login() returns user data directly (with token included)
      const userData = await login(formData);

      // Store token and user data
      authLogin(userData, userData.token);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        'Login failed. Please check your credentials.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements - subtle industrial feel */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-md w-full space-y-12 relative z-10">
        <div className="text-center space-y-6">
          {/* Brand Logo with precision styling */}
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand to-brand-light rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative">
                {import.meta.env.VITE_LOGIN_LOGO_URL ? (
                  <img
                    src={import.meta.env.VITE_LOGIN_LOGO_URL}
                    alt={import.meta.env.VITE_APP_NAME || 'Team Logo'}
                    className="w-24 h-24 object-contain filter drop-shadow-2xl"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className="w-20 h-20 rounded-2xl bg-[#16161a] border border-white/5 flex items-center justify-center shadow-2xl"
                  style={{
                    display: import.meta.env.VITE_LOGIN_LOGO_URL
                      ? 'none'
                      : 'flex'
                  }}
                >
                  <span className="text-3xl font-bold text-white tracking-tighter">
                    CB
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-white tracking-tight sm:text-5xl">
              Sign in
            </h2>
            <p className="text-sm text-zinc-500 font-medium uppercase tracking-widest">
              {import.meta.env.VITE_APP_NAME || 'The Program'} Management
            </p>
          </div>
        </div>

        <div className="bg-[#121216] border border-white/[0.03] rounded-3xl p-8 sm:p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]">
          <form className="space-y-8" onSubmit={onSubmit}>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full bg-[#1a1a20] border border-white/[0.05] text-white rounded-xl px-4 py-4 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all duration-300 placeholder:text-zinc-600 ${errors.email ? 'border-red-500/50' : ''}`}
                  placeholder="name@university.edu"
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-xs text-red-400 mt-1 ml-1 font-medium">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full bg-[#1a1a20] border border-white/[0.05] text-white rounded-xl px-4 py-4 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all duration-300 placeholder:text-zinc-600 ${errors.password ? 'border-red-500/50' : ''}`}
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400 mt-1 ml-1 font-medium">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className={`w-full bg-brand hover:bg-brand-hover text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-brand/20 active:scale-[0.98] flex items-center justify-center space-x-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              <span>
                {isLoading ? 'Processing...' : 'Sign in to dashboard'}
              </span>
            </button>

            <OAuthButtons onError={(message) => toast.error(message)} />
          </form>
        </div>
      </div>
    </div>
  );
}
