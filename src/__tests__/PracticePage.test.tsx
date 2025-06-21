import { screen } from '@testing-library/react';
import PracticePage from '../pages/PracticePage';
import { renderWithProviders, mockApi } from './test-utils';

const API_URL = 'http://localhost:3000/api/';

describe('PracticePage', () => {
  it('shows error message when API fails', async () => {
    const restore = mockApi();
    // override start quiz endpoint with failure
    (global.fetch as any).mockImplementationOnce(async (url: string) => {
      if (url.startsWith(`${API_URL}quizzes/start/`)) {
        return Promise.resolve(new Response(null, { status: 500 }));
      }
      return Promise.reject(new Error('Unhandled request'));
    });

    renderWithProviders(<PracticePage />);
    expect(await screen.findByText('Unable to Load Quiz')).toBeInTheDocument();
    restore();
  });
});
