import React from 'react';
import { AuthContext } from '../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { vi } from 'vitest';

type Options = {
  route?: string;
};

export function renderWithProviders(ui: React.ReactElement, options: Options = {}) {
  const { route = '/' } = options;
  const mockAuth = {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    isAuthModalOpen: false,
    authModalView: 'login',
    openAuthModal: vi.fn(),
    closeAuthModal: vi.fn(),
    setAuthModalView: vi.fn(),
  } as any;

  window.history.pushState({}, '', route);
  return render(
    <AuthContext.Provider value={mockAuth}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </AuthContext.Provider>
  );
}
