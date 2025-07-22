import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { authLogin } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const provider = searchParams.get('provider');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      navigate('/login?error=oauth_failed');
      return;
    }

    if (token) {
      // Store the token and redirect to dashboard
      authLogin({ token }, token);
      navigate('/dashboard');
    } else {
      // No token received, redirect to login
      navigate('/login?error=no_token');
    }
  }, [searchParams, navigate, authLogin]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="text-center">
        <div className="loading loading-spinner loading-lg mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Completing Sign In</h2>
        <p className="text-base-content/70">Please wait while we complete your authentication...</p>
      </div>
    </div>
  );
};

export default OAuthCallback; 