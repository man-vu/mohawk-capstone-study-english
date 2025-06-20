import { screen } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Hero from '../components/home/Hero';
import { renderWithProviders } from './test-utils';

function setup() {
  return renderWithProviders(
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/templates" element={<div>Templates Page</div>} />
      <Route path="/study-plans" element={<div>Study Plans Page</div>} />
    </Routes>
  );
}

describe('Hero', () => {
  it('renders call to action buttons', () => {
    setup();
    expect(screen.getByText('Start Free Practice Test')).toBeInTheDocument();
    expect(screen.getByText('View Study Plans')).toBeInTheDocument();
  });

  it('navigates to templates on click', async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByText('Start Free Practice Test'));
    expect(screen.getByText('Templates Page')).toBeInTheDocument();
  });
});
