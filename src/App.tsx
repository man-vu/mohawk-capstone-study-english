import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import AuthModal from './components/auth/AuthModal';
import { useTheme } from './hooks/useTheme';
import HomePage from './pages/HomePage';
import TemplatesPage from './pages/TemplatesPage';
import PracticePage from './pages/PracticePage';
import VocabularyBuilderPage from './pages/VocabularyBuilderPage';
import FlashcardsPage from './pages/FlashcardsPage';
import PageTransition from './components/PageTransition';

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const Layout: React.FC = () => {
    const location = useLocation();
    const hideFooter = location.pathname.startsWith('/practice/');
    return (
      <div className={theme === 'dark' ? 'dark' : ''}>
        <div className="min-h-screen bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text))] transition-colors duration-300">
          <Navbar theme={theme} toggleTheme={toggleTheme} />
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition keyProp="home"><HomePage /></PageTransition>} />
              <Route path="/templates" element={<PageTransition keyProp="templates"><TemplatesPage /></PageTransition>} />
              <Route path="/practice/:id" element={<PageTransition keyProp="practice"><PracticePage /></PageTransition>} />
              <Route path="/vocabulary" element={<PageTransition keyProp="vocabulary"><VocabularyBuilderPage /></PageTransition>} />
              <Route path="/flashcards" element={<PageTransition keyProp="flashcards"><FlashcardsPage /></PageTransition>} />
            </Routes>
          </AnimatePresence>
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
