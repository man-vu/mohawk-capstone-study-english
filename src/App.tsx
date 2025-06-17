import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import AuthModal from './components/auth/AuthModal';
import { useTheme } from './hooks/useTheme';
import HomePage from './pages/HomePage';
import TemplatesPage from './pages/TemplatesPage';

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <AuthProvider>
      <div className={theme === 'dark' ? 'dark' : ''}>
        <div className="min-h-screen bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text))] transition-colors duration-300">
          <Router>
            <Navbar theme={theme} toggleTheme={toggleTheme} />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/templates" element={<TemplatesPage />} />
            </Routes>
            <Footer />
            <AuthModal />
          </Router>
        </div>
      </div>
    </AuthProvider>
  );
};

export default App;
