import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginModal from '../components/auth/LoginModal';
import { renderWithProviders } from './test-utils';
import { vi } from 'vitest';

describe('LoginModal', () => {
  it('renders when open and closes on button click', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(
      <LoginModal isOpen onClose={onClose} onSwitchToRegister={() => {}} />
    );
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    await user.click(screen.getByText('×'));
    expect(onClose).toHaveBeenCalled();
  });
});
