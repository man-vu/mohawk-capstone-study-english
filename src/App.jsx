import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Categories from './components/Categories';
import Statistics from './components/Statistics';
import Testimonials from './components/Testimonials';
import QuestionTemplates from './components/QuestionTemplates';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import AuthModal from './components/auth/AuthModal';
import { useTheme } from './hooks/useTheme';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [showQuestionTemplates, setShowQuestionTemplates] = useState(false);

  return (
    <AuthProvider>
      <div className={`${theme === 'dark' ? 'dark' : ''}`}>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
          <Navbar theme={theme} toggleTheme={toggleTheme} />
          
          {!showQuestionTemplates ? (
            <>
              <Hero onExploreTests={() => setShowQuestionTemplates(true)} />
              <Features />
              <Categories />
              <Statistics />
              <Testimonials />
            </>
          ) : (
            <QuestionTemplates onBackToHome={() => setShowQuestionTemplates(false)} />
          )}
          
          <Footer />

          {/* Auth Modal */}
          <AuthModal />
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;