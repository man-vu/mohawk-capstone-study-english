import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuizList from '../components/home/QuizList';
import { renderWithProviders, mockApi } from './test-utils';
import { vi } from 'vitest';

describe('QuizList', () => {
  it('fetches and displays quizzes', async () => {
    const restore = mockApi();
    renderWithProviders(<QuizList />);
    expect(await screen.findByText('Sample Quiz')).toBeInTheDocument();
    restore();
  });

  it('opens auth modal when not logged in', async () => {
    const user = userEvent.setup();
    const restore = mockApi();
    const open = vi.fn();
    renderWithProviders(<QuizList />, { auth: { openAuthModal: open } });
    await screen.findByText('Sample Quiz');
    await user.click(screen.getByRole('button', { name: /start quiz/i }));
    expect(open).toHaveBeenCalledWith('login');
    restore();
  });
});
