import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Register from '../components/auth/Register';
import { renderWithProviders } from './test-utils';
import { vi } from 'vitest';

describe('Register component', () => {
  it('shows validation error for password mismatch', async () => {
    const user = userEvent.setup();
    const registerFn = vi.fn();
    renderWithProviders(<Register switchToLogin={() => {}} />, { auth: { register: registerFn } });
    await user.type(screen.getByLabelText('First Name'), 'John');
    await user.type(screen.getByLabelText('Last Name'), 'Doe');
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.type(screen.getByLabelText('Password'), 'pass12345');
    await user.type(screen.getByLabelText('Confirm Password'), 'wrong');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: /sign up/i }));
    expect(registerFn).not.toHaveBeenCalled();
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });

  it('calls register with form data', async () => {
    const user = userEvent.setup();
    const registerFn = vi.fn().mockResolvedValue({ success: true });
    renderWithProviders(<Register switchToLogin={() => {}} />, { auth: { register: registerFn } });
    await user.type(screen.getByLabelText('First Name'), 'Jane');
    await user.type(screen.getByLabelText('Last Name'), 'Smith');
    await user.type(screen.getByLabelText('Email'), 'jane@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm Password'), 'password123');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: /sign up/i }));
    expect(registerFn).toHaveBeenCalledWith({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      password: 'password123'
    });
  });
});
