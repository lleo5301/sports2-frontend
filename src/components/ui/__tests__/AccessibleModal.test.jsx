import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccessibleModal from '../AccessibleModal';

describe('AccessibleModal', () => {
  let onClose;
  let originalOverflow;
  let originalPaddingRight;

  beforeEach(() => {
    onClose = vi.fn();
    // Store original body styles
    originalOverflow = document.body.style.overflow;
    originalPaddingRight = document.body.style.paddingRight;
    // Clear any previous focus
    document.body.focus();
  });

  afterEach(() => {
    // Restore original body styles
    document.body.style.overflow = originalOverflow;
    document.body.style.paddingRight = originalPaddingRight;
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders nothing when isOpen is false', () => {
      const { container } = render(
        <AccessibleModal isOpen={false} onClose={onClose} title="Test Modal">
          <div>Content</div>
        </AccessibleModal>
      );
      expect(container.firstChild).toBeNull();
    });

    it('renders modal when isOpen is true', () => {
      render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal">
          <div>Modal Content</div>
        </AccessibleModal>
      );
      expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('renders backdrop element', () => {
      const { container } = render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal">
          <div>Content</div>
        </AccessibleModal>
      );
      const backdrop = container.querySelector('.modal-backdrop');
      expect(backdrop).toBeInTheDocument();
    });

    it('renders modal box element', () => {
      const { container } = render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal">
          <div>Content</div>
        </AccessibleModal>
      );
      const modalBox = container.querySelector('.modal-box');
      expect(modalBox).toBeInTheDocument();
    });

    it('renders children correctly', () => {
      render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal">
          <div data-testid="child-element">Test Child</div>
        </AccessibleModal>
      );
      expect(screen.getByTestId('child-element')).toBeInTheDocument();
    });
  });

  describe('ARIA attributes', () => {
    it('has role="dialog" on modal box', () => {
      const { container } = render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal">
          <div>Content</div>
        </AccessibleModal>
      );
      const modalBox = container.querySelector('.modal-box');
      expect(modalBox).toHaveAttribute('role', 'dialog');
    });

    it('has aria-modal="true" on modal box', () => {
      const { container } = render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal">
          <div>Content</div>
        </AccessibleModal>
      );
      const modalBox = container.querySelector('.modal-box');
      expect(modalBox).toHaveAttribute('aria-modal', 'true');
    });

    it('has aria-labelledby attribute when title is provided', () => {
      const { container } = render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal">
          <div>Content</div>
        </AccessibleModal>
      );
      const modalBox = container.querySelector('.modal-box');
      expect(modalBox).toHaveAttribute('aria-labelledby');
      expect(modalBox.getAttribute('aria-labelledby')).toBe('modal-title-test-modal');
    });

    it('has tabIndex="-1" on modal box', () => {
      const { container } = render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal">
          <div>Content</div>
        </AccessibleModal>
      );
      const modalBox = container.querySelector('.modal-box');
      expect(modalBox).toHaveAttribute('tabIndex', '-1');
    });

    it('has aria-hidden="true" on backdrop', () => {
      const { container } = render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal">
          <div>Content</div>
        </AccessibleModal>
      );
      const backdrop = container.querySelector('.modal-backdrop');
      expect(backdrop).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('backdrop click behavior', () => {
    it('calls onClose when backdrop is clicked', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal">
          <div>Content</div>
        </AccessibleModal>
      );
      const backdrop = container.querySelector('.modal-backdrop');
      await user.click(backdrop);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when modal box is clicked', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal">
          <div>Content</div>
        </AccessibleModal>
      );
      const modalBox = container.querySelector('.modal-box');
      await user.click(modalBox);
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('keyboard navigation', () => {
    it('calls onClose when Escape key is pressed', async () => {
      const user = userEvent.setup();
      render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal">
          <button>Button 1</button>
        </AccessibleModal>
      );
      await user.keyboard('{Escape}');
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    // Note: Testing Tab key focus trapping behavior is challenging in JSDOM
    // because it doesn't fully simulate browser-native tab navigation.
    // The focus trapping logic is implemented in useModalAccessibility hook
    // and should be tested in E2E tests with a real browser.

    it('has multiple focusable elements for focus trapping', async () => {
      const { container } = render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal">
          <button data-testid="button1">Button 1</button>
          <button data-testid="button2">Button 2</button>
          <button data-testid="button3">Button 3</button>
        </AccessibleModal>
      );

      await waitFor(() => {
        const button1 = screen.getByTestId('button1');
        const activeElement = document.activeElement;
        // Either button1 or the modal container should have focus initially
        expect(activeElement === button1 || activeElement.getAttribute('role') === 'dialog').toBe(true);
      }, { timeout: 100 });

      // Verify all buttons are in the document and focusable
      const button1 = screen.getByTestId('button1');
      const button2 = screen.getByTestId('button2');
      const button3 = screen.getByTestId('button3');

      expect(button1).toBeInTheDocument();
      expect(button2).toBeInTheDocument();
      expect(button3).toBeInTheDocument();

      // Verify buttons don't have disabled attribute (are focusable)
      expect(button1).not.toBeDisabled();
      expect(button2).not.toBeDisabled();
      expect(button3).not.toBeDisabled();
    });

    it('focuses first focusable element when modal opens', async () => {
      const { rerender } = render(
        <AccessibleModal isOpen={false} onClose={onClose} title="Test Modal">
          <button data-testid="button1">Button 1</button>
        </AccessibleModal>
      );

      rerender(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal">
          <button data-testid="button1">Button 1</button>
        </AccessibleModal>
      );

      await waitFor(() => {
        const button1 = screen.getByTestId('button1');
        const activeElement = document.activeElement;
        // Either button1 or the modal container should have focus
        expect(activeElement === button1 || activeElement.getAttribute('role') === 'dialog').toBe(true);
      }, { timeout: 100 });
    });
  });

  describe('focus management', () => {
    it('returns focus to trigger element when modal closes', async () => {
      const triggerButton = document.createElement('button');
      triggerButton.textContent = 'Open Modal';
      document.body.appendChild(triggerButton);
      triggerButton.focus();

      expect(document.activeElement).toBe(triggerButton);

      const { rerender } = render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal">
          <button data-testid="modal-button">Modal Button</button>
        </AccessibleModal>
      );

      // Wait for focus to move into modal (either to button or dialog)
      await waitFor(() => {
        const activeElement = document.activeElement;
        expect(activeElement !== triggerButton).toBe(true);
      }, { timeout: 100 });

      // Close modal
      rerender(
        <AccessibleModal isOpen={false} onClose={onClose} title="Test Modal">
          <button data-testid="modal-button">Modal Button</button>
        </AccessibleModal>
      );

      // Focus should return to trigger
      await waitFor(() => {
        expect(document.activeElement).toBe(triggerButton);
      }, { timeout: 100 });

      document.body.removeChild(triggerButton);
    });
  });

  describe('scroll lock', () => {
    it('locks body scroll when modal opens', () => {
      render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal">
          <div>Content</div>
        </AccessibleModal>
      );
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('restores body scroll when modal closes', () => {
      const { rerender } = render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal">
          <div>Content</div>
        </AccessibleModal>
      );

      expect(document.body.style.overflow).toBe('hidden');

      rerender(
        <AccessibleModal isOpen={false} onClose={onClose} title="Test Modal">
          <div>Content</div>
        </AccessibleModal>
      );

      expect(document.body.style.overflow).toBe(originalOverflow);
    });
  });

  describe('modal sizes', () => {
    it('applies default size (md) when no size is specified', () => {
      const { container } = render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal">
          <div>Content</div>
        </AccessibleModal>
      );
      const modalBox = container.querySelector('.modal-box');
      expect(modalBox).toHaveClass('max-w-2xl');
    });

    it('applies small (sm) size class', () => {
      const { container } = render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal" size="sm">
          <div>Content</div>
        </AccessibleModal>
      );
      const modalBox = container.querySelector('.modal-box');
      expect(modalBox).toHaveClass('max-w-sm');
    });

    it('applies medium (md) size class', () => {
      const { container } = render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal" size="md">
          <div>Content</div>
        </AccessibleModal>
      );
      const modalBox = container.querySelector('.modal-box');
      expect(modalBox).toHaveClass('max-w-2xl');
    });

    it('applies large (lg) size class', () => {
      const { container } = render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal" size="lg">
          <div>Content</div>
        </AccessibleModal>
      );
      const modalBox = container.querySelector('.modal-box');
      expect(modalBox).toHaveClass('max-w-4xl');
    });

    it('applies extra large (xl) size class', () => {
      const { container } = render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal" size="xl">
          <div>Content</div>
        </AccessibleModal>
      );
      const modalBox = container.querySelector('.modal-box');
      expect(modalBox).toHaveClass('max-w-6xl');
    });

    it('falls back to medium size for invalid size value', () => {
      const { container } = render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal" size="invalid">
          <div>Content</div>
        </AccessibleModal>
      );
      const modalBox = container.querySelector('.modal-box');
      expect(modalBox).toHaveClass('max-w-2xl');
    });
  });

  describe('custom styling', () => {
    it('applies custom className to modal box', () => {
      const { container } = render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal" className="custom-class">
          <div>Content</div>
        </AccessibleModal>
      );
      const modalBox = container.querySelector('.modal-box');
      expect(modalBox).toHaveClass('custom-class');
    });

    it('preserves default classes when applying custom className', () => {
      const { container } = render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal" className="custom-class">
          <div>Content</div>
        </AccessibleModal>
      );
      const modalBox = container.querySelector('.modal-box');
      expect(modalBox).toHaveClass('modal-box');
      expect(modalBox).toHaveClass('custom-class');
    });
  });

  describe('ModalHeader subcomponent', () => {
    it('renders title in header', () => {
      render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal">
          <AccessibleModal.Header title="Header Title" />
        </AccessibleModal>
      );
      expect(screen.getByText('Header Title')).toBeInTheDocument();
    });

    it('renders close button when onClose is provided', () => {
      render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal">
          <AccessibleModal.Header title="Header Title" onClose={onClose} />
        </AccessibleModal>
      );
      const closeButton = screen.getByLabelText('Close modal');
      expect(closeButton).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal">
          <AccessibleModal.Header title="Header Title" onClose={onClose} />
        </AccessibleModal>
      );
      const closeButton = screen.getByLabelText('Close modal');
      await user.click(closeButton);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not render close button when onClose is not provided', () => {
      render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal">
          <AccessibleModal.Header title="Header Title" />
        </AccessibleModal>
      );
      const closeButton = screen.queryByLabelText('Close modal');
      expect(closeButton).not.toBeInTheDocument();
    });

    it('applies custom className to header', () => {
      const { container } = render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal">
          <AccessibleModal.Header title="Header Title" className="custom-header" />
        </AccessibleModal>
      );
      const header = container.querySelector('.custom-header');
      expect(header).toBeInTheDocument();
    });

    it('generates correct ID for title', () => {
      render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal">
          <AccessibleModal.Header title="My Test Title" />
        </AccessibleModal>
      );
      const title = screen.getByText('My Test Title');
      expect(title).toHaveAttribute('id', 'modal-title-my-test-title');
    });

    it('renders children in header', () => {
      render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal">
          <AccessibleModal.Header title="Header Title">
            <span>Extra Content</span>
          </AccessibleModal.Header>
        </AccessibleModal>
      );
      expect(screen.getByText('Extra Content')).toBeInTheDocument();
    });
  });

  describe('ModalContent subcomponent', () => {
    it('renders content children', () => {
      render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal">
          <AccessibleModal.Content>
            <p>Modal body content</p>
          </AccessibleModal.Content>
        </AccessibleModal>
      );
      expect(screen.getByText('Modal body content')).toBeInTheDocument();
    });

    it('applies custom className to content', () => {
      const { container } = render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal">
          <AccessibleModal.Content className="custom-content">
            <p>Content</p>
          </AccessibleModal.Content>
        </AccessibleModal>
      );
      const content = container.querySelector('.custom-content');
      expect(content).toBeInTheDocument();
    });

    it('applies default py-4 class to content', () => {
      const { container } = render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal">
          <AccessibleModal.Content>
            <p>Content</p>
          </AccessibleModal.Content>
        </AccessibleModal>
      );
      const content = screen.getByText('Content').parentElement;
      expect(content).toHaveClass('py-4');
    });
  });

  describe('ModalFooter subcomponent', () => {
    it('renders footer children', () => {
      render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal">
          <AccessibleModal.Footer>
            <button>Cancel</button>
            <button>Confirm</button>
          </AccessibleModal.Footer>
        </AccessibleModal>
      );
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Confirm')).toBeInTheDocument();
    });

    it('applies modal-action class to footer', () => {
      const { container } = render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal">
          <AccessibleModal.Footer>
            <button>Action</button>
          </AccessibleModal.Footer>
        </AccessibleModal>
      );
      const footer = screen.getByText('Action').parentElement;
      expect(footer).toHaveClass('modal-action');
    });

    it('applies custom className to footer', () => {
      const { container } = render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal">
          <AccessibleModal.Footer className="custom-footer">
            <button>Action</button>
          </AccessibleModal.Footer>
        </AccessibleModal>
      );
      const footer = container.querySelector('.custom-footer');
      expect(footer).toBeInTheDocument();
    });
  });

  describe('composed modal structure', () => {
    it('renders complete modal with header, content, and footer', () => {
      render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Complete Modal">
          <AccessibleModal.Header title="Complete Modal" onClose={onClose} />
          <AccessibleModal.Content>
            <p>This is the modal content</p>
          </AccessibleModal.Content>
          <AccessibleModal.Footer>
            <button>Cancel</button>
            <button>Confirm</button>
          </AccessibleModal.Footer>
        </AccessibleModal>
      );

      expect(screen.getByText('Complete Modal')).toBeInTheDocument();
      expect(screen.getByText('This is the modal content')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Confirm')).toBeInTheDocument();
      expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles modal with no focusable elements', () => {
      const { container } = render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal">
          <p>Just text, no interactive elements</p>
        </AccessibleModal>
      );
      const modalBox = container.querySelector('.modal-box');

      // Modal container itself should be focusable as fallback
      expect(modalBox).toHaveAttribute('tabIndex', '-1');
    });

    it('handles rapid open/close cycles', async () => {
      const { rerender } = render(
        <AccessibleModal isOpen={false} onClose={onClose} title="Test Modal">
          <button>Button</button>
        </AccessibleModal>
      );

      // Open
      rerender(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal">
          <button>Button</button>
        </AccessibleModal>
      );

      // Close immediately
      rerender(
        <AccessibleModal isOpen={false} onClose={onClose} title="Test Modal">
          <button>Button</button>
        </AccessibleModal>
      );

      // Should not throw errors
      expect(onClose).not.toHaveBeenCalled();
    });

    it('handles undefined title gracefully', () => {
      const { container } = render(
        <AccessibleModal isOpen={true} onClose={onClose}>
          <div>Content</div>
        </AccessibleModal>
      );
      const modalBox = container.querySelector('.modal-box');
      // Should not have aria-labelledby when title is undefined
      expect(modalBox.hasAttribute('aria-labelledby')).toBe(false);
    });
  });
});
