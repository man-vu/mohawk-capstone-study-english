import { screen } from '@testing-library/react';
import SpeakingPracticePage from '../pages/SpeakingPracticePage';
import { renderWithProviders } from './test-utils';

describe('SpeakingPracticePage', () => {
  it('renders speaking practice heading', () => {
    renderWithProviders(<SpeakingPracticePage />);
    expect(screen.getByText('IELTS Speaking Practice')).toBeInTheDocument();
  });
});
