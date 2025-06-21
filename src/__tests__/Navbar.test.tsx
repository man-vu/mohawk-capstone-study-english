import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from '../components/layout/Navbar';
import { renderWithProviders } from './test-utils';
import { vi } from 'vitest';

describe('Navbar', () => {
  it('shows login options when logged out', () => {
    const toggle = vi.fn();
    renderWithProviders(<Navbar theme="light" toggleTheme={toggle} />);
    expect(screen.getByText('Log In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('shows user greeting when logged in', () => {
    const toggle = vi.fn();
    renderWithProviders(<Navbar theme="light" toggleTheme={toggle} />, {
      auth: { user: { firstName: 'John' }, isAuthenticated: true }
    });
    expect(screen.getByText('Hello, John')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('calls toggleTheme when clicking button', async () => {
    const user = userEvent.setup();
    const toggle = vi.fn();
    renderWithProviders(<Navbar theme="dark" toggleTheme={toggle} />);
    await user.click(screen.getByLabelText('Switch to light mode'));
    expect(toggle).toHaveBeenCalled();
  });
});
