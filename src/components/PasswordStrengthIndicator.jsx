import { useMemo } from 'react';
import { Check, X } from 'lucide-react';
import { getPasswordRequirements, getPasswordStrength, PASSWORD_REQUIREMENTS_LIST } from '../utils/passwordValidator';

/**
 * PasswordStrengthIndicator Component
 *
 * Shows real-time password strength feedback with:
 * - A visual strength progress bar
 * - Checkmarks/X marks for each password requirement
 *
 * @param {Object} props
 * @param {string} props.password - The password to evaluate
 * @param {boolean} props.showRequirements - Whether to show the requirements list (default: true)
 * @param {string} props.className - Additional CSS classes
 */
const PasswordStrengthIndicator = ({ password = '', showRequirements = true, className = '' }) => {
  // Calculate password strength and requirements status
  const { strength, requirements } = useMemo(() => {
    return {
      strength: getPasswordStrength(password),
      requirements: getPasswordRequirements(password)
    };
  }, [password]);

  // Don't render anything if no password
  if (!password) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Strength Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-sm">
          <span className="text-foreground/70">Password strength</span>
          <span className={`font-medium ${getStrengthTextColor(strength.level)}`}>
            {strength.label}
          </span>
        </div>
        <div className="w-full bg-content2 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ease-out ${strength.colorClass}`}
            style={{ width: `${(strength.level / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      {showRequirements && (
        <div className="space-y-1.5">
          <span className="text-sm text-foreground/70">Requirements:</span>
          <ul className="space-y-1">
            {PASSWORD_REQUIREMENTS_LIST.map((req) => {
              const isMet = requirements[req.key]?.met;
              return (
                <li
                  key={req.key}
                  className={`flex items-center gap-2 text-sm transition-colors duration-200 ${
                    isMet ? 'text-success' : 'text-foreground/60'
                  }`}
                >
                  {isMet ? (
                    <Check className="h-4 w-4 flex-shrink-0" />
                  ) : (
                    <X className="h-4 w-4 flex-shrink-0" />
                  )}
                  <span>{req.message}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

/**
 * Get the text color class based on strength level
 * @param {number} level - Strength level (0-5)
 * @returns {string} - Tailwind text color class
 */
const getStrengthTextColor = (level) => {
  if (level <= 1) return 'text-error';
  if (level <= 3) return 'text-warning';
  return 'text-success';
};

export default PasswordStrengthIndicator;
