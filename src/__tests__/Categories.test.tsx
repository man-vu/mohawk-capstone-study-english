import { screen } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import Categories from '../components/home/Categories';
import { renderWithProviders } from './test-utils';

describe('Categories', () => {
  it('renders category links', () => {
    renderWithProviders(
      <Routes>
        <Route path="/" element={<Categories />} />
      </Routes>
    );
    expect(screen.getByText('Listening Tests')).toBeInTheDocument();
    expect(screen.getByText('Vocabulary Games')).toBeInTheDocument();
  });
});
