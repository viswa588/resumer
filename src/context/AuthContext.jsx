import { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, logoutUser } from '../services/authService';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  // Logout function
  const logout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  // Update user data
  const updateUserData = (userData) => {
    setCurrentUser(userData);
  };

  // Context value
  const value = {
    currentUser,
    loading,
    logout,
    updateUserData,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;