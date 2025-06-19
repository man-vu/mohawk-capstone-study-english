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
  
  // Effect to check if user is already logged in and verify token
  useEffect(() => {
    const getCookie = (name: string) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? match[2] : null;
    };

    const verifySession = async () => {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setIsLoading(false);
        return;
      }

      try {
        const parsed = JSON.parse(storedUser);
        const token = parsed.token || getCookie('token');
        if (!token) {
          localStorage.removeItem('user');
          setUser(null);
          setIsLoading(false);
          return;
        }

        const res = await fetch(`${API_URL}auth`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          setUser(parsed);
        } else {
          localStorage.removeItem('user');
          setUser(null);
        }
      } catch (err) {
        console.error('verify session failed', err);
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
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

  const API_URL = import.meta.env.VITE_SERVER_ENDPOINT;

  // Function to handle user login
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.statusCode === 200) {
        setUser(data.response);
        localStorage.setItem('user', JSON.stringify(data.response));
        closeAuthModal();
        return { success: true };
      }

      return { success: false, message: data.error || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error' };
    }
  };

  // Function to handle user registration
  const register = async ({ firstName, lastName, email, password }) => {
    try {
      const response = await fetch(`${API_URL}auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password
        })
      });

      const data = await response.json();

      if (data.statusCode === 201) {
        setUser(data.response);
        localStorage.setItem('user', JSON.stringify(data.response));
        closeAuthModal();
        return { success: true };
      }

      return { success: false, message: data.error || 'Registration failed' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Network error' };
    }
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
