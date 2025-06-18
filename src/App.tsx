import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import AuthModal from './components/auth/AuthModal';
import { useTheme } from './hooks/useTheme';
import HomePage from './pages/HomePage';
import TemplatesPage from './pages/TemplatesPage';
import PracticePage from './pages/PracticePage';

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const Layout: React.FC = () => {
    const location = useLocation();
    const hideFooter = location.pathname.startsWith('/practice/');
    return (
      <div className={theme === 'dark' ? 'dark' : ''}>
        <div className="min-h-screen bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text))] transition-colors duration-300">
          <Navbar theme={theme} toggleTheme={toggleTheme} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/practice/:id" element={<PracticePage />} />
          </Routes>
          {!hideFooter && <Footer />}
          <AuthModal />
        </div>
      </div>
    );
  };

  return (
    <AuthProvider>
      <Router>
        <Layout />
      </Router>
    </AuthProvider>
  );
};

export default App;
