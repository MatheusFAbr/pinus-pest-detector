import React, {
  createContext,
  useState,
  useContext,
  useEffect
} from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const [isLoadingPublicSettings] = useState(false);

  const [authError] = useState(null);

  const [authChecked, setAuthChecked] = useState(false);

  const [appPublicSettings] = useState(null);

  useEffect(() => {
    checkUserAuth();
  }, []);

  const checkUserAuth = async () => {

    try {

      const storedUser = localStorage.getItem('user');

      if (storedUser) {

        const parsedUser = JSON.parse(storedUser);

        setUser(parsedUser);

        setIsAuthenticated(true);

      } else {

        setIsAuthenticated(false);
      }

    } catch (error) {

      console.error(error);

      setIsAuthenticated(false);

    } finally {

      setIsLoadingAuth(false);

      setAuthChecked(true);
    }
  };

  const logout = () => {

    localStorage.removeItem('user');

    localStorage.removeItem('token');

    setUser(null);

    setIsAuthenticated(false);

    window.location.href = '/';
  };

  const navigateToLogin = () => {

    window.location.href = '/login';
  };

  const checkAppState = async () => {
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        appPublicSettings,
        authChecked,
        logout,
        navigateToLogin,
        checkUserAuth,
        checkAppState
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};