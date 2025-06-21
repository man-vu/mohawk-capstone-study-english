import { screen } from '@testing-library/react';
import VocabularyBuilderPage from '../pages/VocabularyBuilderPage';
import { renderWithProviders } from './test-utils';

describe('VocabularyBuilderPage', () => {
  it('renders vocabulary builder heading', () => {
    renderWithProviders(<VocabularyBuilderPage />);
    expect(screen.getByText('Vocabulary Builder')).toBeInTheDocument();
  });
});
