import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../components/auth/Login';
import { renderWithProviders } from './test-utils';
import { vi } from 'vitest';

describe('Login component', () => {
  it('shows error if fields empty', async () => {
    const user = userEvent.setup();
    const loginFn = vi.fn();
    renderWithProviders(<Login switchToRegister={() => {}} />, { auth: { login: loginFn } });
    fireEvent.submit(document.querySelector('form')!);
    expect(loginFn).not.toHaveBeenCalled();
    expect(await screen.findByText('Please fill in all fields')).toBeInTheDocument();
  });

  it('calls login with entered credentials', async () => {
    const user = userEvent.setup();
    const loginFn = vi.fn().mockResolvedValue({ success: true });
    renderWithProviders(<Login switchToRegister={() => {}} />, { auth: { login: loginFn } });
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.type(screen.getByLabelText('Password'), 'pass12345');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    expect(loginFn).toHaveBeenCalledWith('john@example.com', 'pass12345');
  });
});
