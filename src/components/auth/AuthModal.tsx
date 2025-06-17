import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Login from './Login';
import Register from './Register';

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, authModalView, setAuthModalView } = useAuth();

  // Close modal on escape key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        closeAuthModal();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    
    // Lock body scroll when modal is open
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'auto';
    };
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeAuthModal();
    }
  };
  
  const switchToLogin = () => setAuthModalView('login');
  const switchToRegister = () => setAuthModalView('register');

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-60 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-auto p-8 transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
      >
        <div className="flex justify-end">
          <button
            onClick={closeAuthModal}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mt-2">
          {authModalView === 'login' ? (
            <Login switchToRegister={switchToRegister} />
          ) : (
            <Register switchToLogin={switchToLogin} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
