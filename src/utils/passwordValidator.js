/**
 * Password Validator Utility
 *
 * Provides strong password validation functions based on NIST SP 800-63B recommendations.
 * Requirements:
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 digit
 * - At least 1 special character
 */

import { z } from 'zod';

// Password requirement constants
export const PASSWORD_MIN_LENGTH = 8;
export const UPPERCASE_REGEX = /[A-Z]/;
export const LOWERCASE_REGEX = /[a-z]/;
export const DIGIT_REGEX = /[0-9]/;
export const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/;

/**
 * Check if password meets minimum length requirement
 * @param {string} password - The password to validate
 * @returns {boolean}
 */
export const hasMinLength = (password) => {
  return password && password.length >= PASSWORD_MIN_LENGTH;
};

/**
 * Check if password contains at least one uppercase letter
 * @param {string} password - The password to validate
 * @returns {boolean}
 */
export const hasUppercase = (password) => {
  return password && UPPERCASE_REGEX.test(password);
};

/**
 * Check if password contains at least one lowercase letter
 * @param {string} password - The password to validate
 * @returns {boolean}
 */
export const hasLowercase = (password) => {
  return password && LOWERCASE_REGEX.test(password);
};

/**
 * Check if password contains at least one digit
 * @param {string} password - The password to validate
 * @returns {boolean}
 */
export const hasDigit = (password) => {
  return password && DIGIT_REGEX.test(password);
};

/**
 * Check if password contains at least one special character
 * @param {string} password - The password to validate
 * @returns {boolean}
 */
export const hasSpecialChar = (password) => {
  return password && SPECIAL_CHAR_REGEX.test(password);
};

/**
 * Get detailed validation results for each password requirement
 * @param {string} password - The password to validate
 * @returns {Object} Object containing validation result for each requirement
 */
export const getPasswordRequirements = (password) => {
  return {
    minLength: {
      met: hasMinLength(password),
      message: `At least ${PASSWORD_MIN_LENGTH} characters`,
      label: 'Minimum length'
    },
    uppercase: {
      met: hasUppercase(password),
      message: 'At least one uppercase letter (A-Z)',
      label: 'Uppercase letter'
    },
    lowercase: {
      met: hasLowercase(password),
      message: 'At least one lowercase letter (a-z)',
      label: 'Lowercase letter'
    },
    digit: {
      met: hasDigit(password),
      message: 'At least one digit (0-9)',
      label: 'Number'
    },
    specialChar: {
      met: hasSpecialChar(password),
      message: 'At least one special character (!@#$%^&*...)',
      label: 'Special character'
    }
  };
};

/**
 * Validate password and return detailed error messages for failed requirements
 * @param {string} password - The password to validate
 * @returns {Object} Object with isValid boolean and array of error messages
 */
export const validatePassword = (password) => {
  const requirements = getPasswordRequirements(password);
  const errors = [];

  for (const [, requirement] of Object.entries(requirements)) {
    if (!requirement.met) {
      errors.push(requirement.message);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Check if password is valid (returns boolean only)
 * @param {string} password - The password to validate
 * @returns {boolean}
 */
export const isPasswordValid = (password) => {
  return validatePassword(password).isValid;
};

/**
 * Calculate password strength level
 * @param {string} password - The password to check
 * @returns {Object} Object with strength level (0-5), label, and color class
 */
export const getPasswordStrength = (password) => {
  if (!password) {
    return { level: 0, label: 'No password', colorClass: 'bg-base-300' };
  }

  const requirements = getPasswordRequirements(password);
  const metCount = Object.values(requirements).filter((req) => req.met).length;

  // Strength levels based on requirements met
  const strengthLevels = [
    { level: 0, label: 'Very weak', colorClass: 'bg-error' },
    { level: 1, label: 'Weak', colorClass: 'bg-error' },
    { level: 2, label: 'Fair', colorClass: 'bg-warning' },
    { level: 3, label: 'Good', colorClass: 'bg-warning' },
    { level: 4, label: 'Strong', colorClass: 'bg-success' },
    { level: 5, label: 'Very strong', colorClass: 'bg-success' }
  ];

  return strengthLevels[metCount];
};

/**
 * Zod schema for password validation
 * Use this in react-hook-form with zodResolver
 */
export const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
  .regex(UPPERCASE_REGEX, 'Password must contain at least one uppercase letter')
  .regex(LOWERCASE_REGEX, 'Password must contain at least one lowercase letter')
  .regex(DIGIT_REGEX, 'Password must contain at least one digit')
  .regex(SPECIAL_CHAR_REGEX, 'Password must contain at least one special character (!@#$%^&*()_+-=[]{};\':"|,.<>/?`~)');

/**
 * Zod schema for password with custom refinement that shows all failed requirements
 * This provides a better UX by showing all missing requirements at once
 */
export const passwordSchemaWithAllErrors = z
  .string()
  .min(1, 'Password is required')
  .superRefine((password, ctx) => {
    const { isValid, errors } = validatePassword(password);
    if (!isValid) {
      errors.forEach((error) => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: error
        });
      });
    }
  });

/**
 * Create a Zod object schema for forms with password and confirmPassword fields
 * @param {string} passwordField - Name of the password field (default: 'password')
 * @param {string} confirmField - Name of the confirm password field (default: 'confirmPassword')
 * @returns {z.ZodObject} Zod schema with password validation and matching check
 */
export const createPasswordConfirmSchema = (passwordField = 'password', confirmField = 'confirmPassword') => {
  return z.object({
    [passwordField]: passwordSchema,
    [confirmField]: z.string().min(1, 'Please confirm your password')
  }).refine((data) => data[passwordField] === data[confirmField], {
    message: "Passwords don't match",
    path: [confirmField]
  });
};

/**
 * Password requirements list for UI display
 */
export const PASSWORD_REQUIREMENTS_LIST = [
  { key: 'minLength', message: `At least ${PASSWORD_MIN_LENGTH} characters` },
  { key: 'uppercase', message: 'At least one uppercase letter (A-Z)' },
  { key: 'lowercase', message: 'At least one lowercase letter (a-z)' },
  { key: 'digit', message: 'At least one digit (0-9)' },
  { key: 'specialChar', message: 'At least one special character (!@#$%^&*...)' }
];

// Default export for convenience
export default {
  PASSWORD_MIN_LENGTH,
  UPPERCASE_REGEX,
  LOWERCASE_REGEX,
  DIGIT_REGEX,
  SPECIAL_CHAR_REGEX,
  hasMinLength,
  hasUppercase,
  hasLowercase,
  hasDigit,
  hasSpecialChar,
  getPasswordRequirements,
  validatePassword,
  isPasswordValid,
  getPasswordStrength,
  passwordSchema,
  passwordSchemaWithAllErrors,
  createPasswordConfirmSchema,
  PASSWORD_REQUIREMENTS_LIST
};
