import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getProfile } from '../services/auth';

/**
 * @description OAuth callback page that handles the redirect from OAuth providers (Google, Apple).
 *              The JWT token is now automatically set as an httpOnly cookie by the backend,
 *              so we just need to fetch the user profile and update the auth context.
 */
const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const error = searchParams.get('error');

    if (error) {
      navigate('/login?error=oauth_failed');
      return;
    }

    // The backend has already set the JWT token as an httpOnly cookie
    // Now we need to fetch the user profile to verify authentication and get user data
    const completeOAuthFlow = async () => {
      try {
        // Fetch user profile - this will use the httpOnly cookie automatically
        const userData = await getProfile();

        // Update auth context with user data
        login(userData);

        // Redirect to dashboard
        navigate('/dashboard');
      } catch (error) {
        // If profile fetch fails, the cookie might not have been set or is invalid
        navigate('/login?error=oauth_failed');
      }
    };

    completeOAuthFlow();
  }, [searchParams, navigate, login]);

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