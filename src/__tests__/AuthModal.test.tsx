import { screen, fireEvent } from '@testing-library/react';
import AuthModal from '../components/auth/AuthModal';
import { renderWithProviders } from './test-utils';
import { vi } from 'vitest';

describe('AuthModal', () => {
  it('renders login view when open', () => {
    renderWithProviders(<AuthModal />, {
      auth: { isAuthModalOpen: true, authModalView: 'login' }
    });
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
  });

  it('closes when clicking overlay', () => {
    const close = vi.fn();
    renderWithProviders(<AuthModal />, {
      auth: { isAuthModalOpen: true, authModalView: 'login', closeAuthModal: close }
    });
    const overlay = document.querySelector('div.fixed');
    if (!overlay) throw new Error('overlay not found');
    fireEvent.click(overlay);
    expect(close).toHaveBeenCalled();
  });
});
