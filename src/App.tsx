import React from 'react';
import MatchingCardsGame from './components/MatchingCardsGame';
import { useTheme } from './hooks/useTheme';

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text))] transition-colors duration-300 p-4">
        <div className="flex justify-end mb-4">
          <button onClick={toggleTheme} className="btn-primary rounded px-3 py-1 text-sm">
            Toggle Theme
          </button>
        </div>
        <MatchingCardsGame onBack={() => {}} />
      </div>
    </div>
  );
};

export default App;
