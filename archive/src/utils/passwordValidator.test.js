import { describe, it, expect } from 'vitest';
import {
  PASSWORD_MIN_LENGTH,
  hasMinLength,
  hasUppercase,
  hasLowercase,
  hasDigit,
  hasSpecialChar,
  validatePassword,
  isPasswordValid,
  getPasswordStrength,
  getPasswordRequirements,
  passwordSchema,
  passwordSchemaWithAllErrors,
  createPasswordConfirmSchema,
  PASSWORD_REQUIREMENTS_LIST
} from './passwordValidator.js';

describe('Password Validator', () => {
  describe('Constants', () => {
    it('should have correct minimum length', () => {
      expect(PASSWORD_MIN_LENGTH).toBe(8);
    });

    it('should export requirements list', () => {
      expect(PASSWORD_REQUIREMENTS_LIST).toHaveLength(5);
    });
  });

  describe('Individual Check Functions', () => {
    it('hasMinLength should return false for short passwords', () => {
      expect(hasMinLength('short')).toBe(false);
      expect(hasMinLength('1234567')).toBe(false);
    });

    it('hasMinLength should return true for passwords >= 8 chars', () => {
      expect(hasMinLength('12345678')).toBe(true);
      expect(hasMinLength('longenough')).toBe(true);
    });

    it('hasUppercase should detect uppercase letters', () => {
      expect(hasUppercase('abc')).toBe(false);
      expect(hasUppercase('Abc')).toBe(true);
    });

    it('hasLowercase should detect lowercase letters', () => {
      expect(hasLowercase('ABC')).toBe(false);
      expect(hasLowercase('ABc')).toBe(true);
    });

    it('hasDigit should detect digits', () => {
      expect(hasDigit('abc')).toBe(false);
      expect(hasDigit('abc1')).toBe(true);
    });

    it('hasSpecialChar should detect special characters', () => {
      expect(hasSpecialChar('abc123')).toBe(false);
      expect(hasSpecialChar('abc!')).toBe(true);
      expect(hasSpecialChar('abc@#$')).toBe(true);
    });

    it('should handle null/undefined/empty as falsy', () => {
      expect(hasMinLength(null)).toBeFalsy();
      expect(hasMinLength(undefined)).toBeFalsy();
      expect(hasMinLength('')).toBeFalsy();
      expect(hasUppercase(null)).toBeFalsy();
      expect(hasLowercase(undefined)).toBeFalsy();
      expect(hasDigit('')).toBeFalsy();
      expect(hasSpecialChar(null)).toBeFalsy();
    });
  });

  describe('getPasswordRequirements', () => {
    it('should return all requirements with met status', () => {
      const reqs = getPasswordRequirements('MyP@ssw0rd!');
      expect(reqs.minLength.met).toBe(true);
      expect(reqs.uppercase.met).toBe(true);
      expect(reqs.lowercase.met).toBe(true);
      expect(reqs.digit.met).toBe(true);
      expect(reqs.specialChar.met).toBe(true);
    });

    it('should show unmet requirements for weak passwords', () => {
      const reqs = getPasswordRequirements('abc');
      expect(reqs.minLength.met).toBe(false);
      expect(reqs.uppercase.met).toBe(false);
      expect(reqs.lowercase.met).toBe(true);
      expect(reqs.digit.met).toBe(false);
      expect(reqs.specialChar.met).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should return isValid=true for strong passwords', () => {
      const result = validatePassword('MyP@ssw0rd!');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return isValid=false for weak passwords', () => {
      const result = validatePassword('123456');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject commonly weak passwords', () => {
      expect(validatePassword('password').isValid).toBe(false);
      expect(validatePassword('123456').isValid).toBe(false);
      expect(validatePassword('qwerty').isValid).toBe(false);
    });
  });

  describe('isPasswordValid', () => {
    it('should return boolean for password validity', () => {
      expect(isPasswordValid('MyP@ssw0rd!')).toBe(true);
      expect(isPasswordValid('weak')).toBe(false);
    });
  });

  describe('getPasswordStrength', () => {
    it('should return correct strength for empty password', () => {
      const strength = getPasswordStrength('');
      expect(strength.level).toBe(0);
      expect(strength.label).toBe('No password');
    });

    it('should return weak for password meeting 1 requirement', () => {
      const strength = getPasswordStrength('abc');
      expect(strength.level).toBe(1);
      expect(strength.label).toBe('Weak');
    });

    it('should return very strong for password meeting all requirements', () => {
      const strength = getPasswordStrength('MyP@ssw0rd!');
      expect(strength.level).toBe(5);
      expect(strength.label).toBe('Very strong');
    });
  });

  describe('Zod Schemas', () => {
    it('passwordSchema should validate strong passwords', () => {
      expect(() => passwordSchema.parse('MyP@ssw0rd!')).not.toThrow();
    });

    it('passwordSchema should reject weak passwords', () => {
      expect(() => passwordSchema.parse('weak')).toThrow();
    });

    it('passwordSchemaWithAllErrors should work', () => {
      const result = passwordSchemaWithAllErrors.safeParse('MyP@ssw0rd!');
      expect(result.success).toBe(true);

      const weakResult = passwordSchemaWithAllErrors.safeParse('weak');
      expect(weakResult.success).toBe(false);
    });

    it('createPasswordConfirmSchema should validate matching passwords', () => {
      const schema = createPasswordConfirmSchema();
      const result = schema.safeParse({
        password: 'MyP@ssw0rd!',
        confirmPassword: 'MyP@ssw0rd!'
      });
      expect(result.success).toBe(true);
    });

    it('createPasswordConfirmSchema should reject non-matching passwords', () => {
      const schema = createPasswordConfirmSchema();
      const result = schema.safeParse({
        password: 'MyP@ssw0rd!',
        confirmPassword: 'DifferentP@ss1'
      });
      expect(result.success).toBe(false);
    });
  });
});
