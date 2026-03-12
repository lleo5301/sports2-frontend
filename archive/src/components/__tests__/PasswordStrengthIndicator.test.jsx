import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PasswordStrengthIndicator from '../PasswordStrengthIndicator';

describe('PasswordStrengthIndicator', () => {
  describe('rendering', () => {
    it('renders nothing when password is empty', () => {
      const { container } = render(<PasswordStrengthIndicator password="" />);
      expect(container.firstChild).toBeNull();
    });

    it('renders nothing when password is undefined', () => {
      const { container } = render(<PasswordStrengthIndicator />);
      expect(container.firstChild).toBeNull();
    });

    it('renders the strength indicator when password is provided', () => {
      render(<PasswordStrengthIndicator password="abc" />);
      expect(screen.getByText('Password strength')).toBeInTheDocument();
    });

    it('renders all requirement items by default', () => {
      render(<PasswordStrengthIndicator password="abc" />);
      expect(screen.getByText('Requirements:')).toBeInTheDocument();
      expect(screen.getByText('At least 8 characters')).toBeInTheDocument();
      expect(screen.getByText('At least one uppercase letter (A-Z)')).toBeInTheDocument();
      expect(screen.getByText('At least one lowercase letter (a-z)')).toBeInTheDocument();
      expect(screen.getByText('At least one digit (0-9)')).toBeInTheDocument();
      expect(screen.getByText(/At least one special character/)).toBeInTheDocument();
    });

    it('hides requirements when showRequirements is false', () => {
      render(<PasswordStrengthIndicator password="abc" showRequirements={false} />);
      expect(screen.queryByText('Requirements:')).not.toBeInTheDocument();
    });
  });

  describe('strength levels', () => {
    it('shows "Weak" for password with only one requirement met (lowercase only)', () => {
      // "abc" has only lowercase -> 1 requirement met -> level 1 = Weak
      render(<PasswordStrengthIndicator password="abc" />);
      expect(screen.getByText('Weak')).toBeInTheDocument();
    });

    it('shows "Fair" for password with two requirements met', () => {
      // "abcdefgh" has lowercase + minLength -> 2 requirements met -> level 2 = Fair
      render(<PasswordStrengthIndicator password="abcdefgh" />);
      expect(screen.getByText('Fair')).toBeInTheDocument();
    });

    it('shows "Good" for password with three requirements met', () => {
      // "Abcdefgh" has lowercase + uppercase + minLength -> 3 requirements met -> level 3 = Good
      render(<PasswordStrengthIndicator password="Abcdefgh" />);
      expect(screen.getByText('Good')).toBeInTheDocument();
    });

    it('shows "Strong" for password with four requirements met', () => {
      // "Abcdefg1" has lowercase + uppercase + digit + minLength -> 4 requirements met -> level 4 = Strong
      render(<PasswordStrengthIndicator password="Abcdefg1" />);
      expect(screen.getByText('Strong')).toBeInTheDocument();
    });

    it('shows "Very strong" for password meeting all requirements', () => {
      // "Abcdefg1!" has all 5 requirements met -> level 5 = Very strong
      render(<PasswordStrengthIndicator password="Abcdefg1!" />);
      expect(screen.getByText('Very strong')).toBeInTheDocument();
    });
  });

  describe('requirement status', () => {
    it('shows met requirements with success styling', () => {
      const { container } = render(<PasswordStrengthIndicator password="abcdefgh" />);
      // lowercase and minLength should be met
      const listItems = container.querySelectorAll('li');
      const lowercaseItem = Array.from(listItems).find((li) =>
        li.textContent.includes('lowercase')
      );
      expect(lowercaseItem).toHaveClass('text-success');
    });

    it('shows unmet requirements without success styling', () => {
      const { container } = render(<PasswordStrengthIndicator password="abc" />);
      // minLength should not be met
      const listItems = container.querySelectorAll('li');
      const minLengthItem = Array.from(listItems).find((li) =>
        li.textContent.includes('8 characters')
      );
      expect(minLengthItem).not.toHaveClass('text-success');
      expect(minLengthItem).toHaveClass('text-foreground/60');
    });
  });

  describe('custom className', () => {
    it('applies custom className to container', () => {
      const { container } = render(
        <PasswordStrengthIndicator password="abc" className="my-custom-class" />
      );
      expect(container.firstChild).toHaveClass('my-custom-class');
    });
  });
});
