import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a context for authentication
export const AuthContext = createContext();

// Authentication provider component that will wrap the app
export const AuthProvider = ({ children }) => {
  // State for user information
  const [user, setUser] = useState(null);
  // State for loading status
  const [isLoading, setIsLoading] = useState(true);
  // State for auth modal visibility
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  // State to determine which form to show (login or register)
  const [authModalView, setAuthModalView] = useState('login'); // 'login' or 'register'
  
  // Effect to check if user is already logged in (from localStorage)
  useEffect(() => {
    const checkLoggedInUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Failed to parse user data:", error);
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };
    
    checkLoggedInUser();
  }, []);

  // Function to open auth modal with specific view
  const openAuthModal = (view = 'login') => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  // Function to close auth modal
  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Function to handle user login
  const login = (userData) => {
    // In a real app, you would send a request to your backend
    // For now, we'll just simulate a successful login
    
    // Save user data
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Close modal after successful login
    closeAuthModal();
  };

  // Function to handle user registration
  const register = (userData) => {
    // In a real app, you would send a request to your backend
    // For now, we'll just simulate a successful registration followed by login
    
    // Add additional user data
    const newUser = {
      ...userData,
      id: Date.now().toString(), // Generate a dummy ID
      createdAt: new Date().toISOString()
    };
    
    // Save user data (effectively logging them in after registration)
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    // Close modal after successful registration
    closeAuthModal();
  };

  // Function to handle user logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Provide all auth-related functions and state through context
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        isAuthModalOpen,
        authModalView,
        openAuthModal,
        closeAuthModal,
        setAuthModalView
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
