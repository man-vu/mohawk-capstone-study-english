import React from 'react';
import { AuthContext } from '../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { vi } from 'vitest';

export function mockApi() {
  const original = global.fetch;
  global.fetch = vi.fn(async (input: RequestInfo) => {
    const url = typeof input === 'string' ? input : input.toString();
    if (url.endsWith('/courses')) {
      return Promise.resolve(new Response(JSON.stringify({
        response: [{ CourseId: 1, Title: 'Sample Course' }]
      }), { status: 200 }));
    }
    if (url.endsWith('/quizzes')) {
      return Promise.resolve(new Response(JSON.stringify({
        response: [{ quiz_id: '1', title: 'Mock Quiz', skill_id: 1, skill_description: 'Listening', time_allowed: 60, attempts: 0, number_of_questions: 5, average_rating: 4, rating_count: 1, favorite: false }]
      }), { status: 200 }));
    }
    if (url.endsWith('/mock-tests')) {
      return Promise.resolve(new Response(JSON.stringify({
        response: [{ MockTestId: 1, Title: 'Mock Test', Description: 'desc', TotalDuration: 120, MockTestSection: [] }]
      }), { status: 200 }));
    }
    if (url.includes('/quizzes/start/')) {
      return Promise.resolve(new Response(JSON.stringify({ statusCode: 200, response: { questions: [], parts: [], attempt_id: 1, expired_time: '2030-01-01' } }), { status: 200 }));
    }
    return Promise.reject(new Error('Unhandled request: ' + url));
  });
  return () => { global.fetch = original; };
}

type Options = { route?: string; auth?: Partial<any> };

export function renderWithProviders(
  ui: React.ReactElement,
  options: Options = {}
) {
  const { route = '/', auth = {} } = options;
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
    ...auth,
  } as any;

  window.history.pushState({}, '', route);
  return render(
    <AuthContext.Provider value={mockAuth}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </AuthContext.Provider>
  );
}
