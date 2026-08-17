import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

import { User } from '../types/auth';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;

  login: (credentials: {
    email: string;
    password: string;
  }) => Promise<User>;

  register: (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: string;
  }) => Promise<void>;

  logout: () => void;

  refreshUser: () => Promise<void>;

  updateProfile: (data: {
    name?: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('hpb_token');
  });

  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  /* =========================================================
     REFRESH CURRENT USER
  ========================================================= */

  const refreshUser = async (): Promise<void> => {
    const savedToken = localStorage.getItem('hpb_token');

    if (!savedToken) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      if (token !== savedToken) {
        setToken(savedToken);
      }

      const data = await authService.getMe();

      if (!data?.user) {
        throw new Error(
          'User information was not returned by the server.'
        );
      }

      /*
       * Always replace the old user with the latest
       * database user.
       *
       * This is important for:
       *
       * customer
       *    ↓
       * wholesale
       *
       * after admin approval.
       */
      setUser(data.user);
    } catch (error) {
      console.error(
        'Failed to refresh authenticated user:',
        error
      );

      localStorage.removeItem('hpb_token');

      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     INITIAL AUTH CHECK
  ========================================================= */

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('hpb_token');

      if (!savedToken) {
        setUser(null);
        setToken(null);
        setLoading(false);
        return;
      }

      setToken(savedToken);

      try {
        setLoading(true);

        const data = await authService.getMe();

        if (!data?.user) {
          throw new Error(
            'User information was not returned by the server.'
          );
        }

        setUser(data.user);
      } catch (error) {
        console.error(
          'Authentication initialization failed:',
          error
        );

        localStorage.removeItem('hpb_token');

        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /* =========================================================
     REFRESH USER WHEN TAB / WINDOW GETS FOCUS
     
     This fixes the situation where:
     
     Customer applies for wholesale
              ↓
     Admin approves
              ↓
     Customer is still logged in
              ↓
     Frontend should see wholesale immediately
  ========================================================= */

  useEffect(() => {
    const handleFocus = () => {
      const savedToken = localStorage.getItem('hpb_token');

      if (savedToken) {
        refreshUser();
      }
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  /* =========================================================
     ALSO REFRESH WHEN TAB BECOMES VISIBLE
     
     Browser may not always trigger focus exactly when
     switching tabs, so visibilitychange gives us another
     reliable refresh.
  ========================================================= */

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const savedToken = localStorage.getItem('hpb_token');

        if (savedToken) {
          refreshUser();
        }
      }
    };

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      );
    };
  }, []);

  /* =========================================================
     LOGIN
  ========================================================= */

  const login = async (credentials: {
    email: string;
    password: string;
  }): Promise<User> => {
    const data = await authService.login(credentials);

    if (!data?.token) {
      throw new Error(
        'Login succeeded but no access token was returned.'
      );
    }

    localStorage.setItem('hpb_token', data.token);

    setToken(data.token);

    if (data.user) {
      setUser(data.user);
    }

    /*
     * Fetch latest user from database.
     */
    try {
      const latestUser = await authService.getMe();

      if (latestUser?.user) {
        setUser(latestUser.user);

        return latestUser.user;
      }
    } catch (error) {
      console.error(
        'Could not refresh user after login:',
        error
      );
    }

    return data.user;
  };

  /* =========================================================
     REGISTER
  ========================================================= */

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: string;
  }): Promise<void> => {
    const data = await authService.register(userData);

    if (!data?.token) {
      throw new Error(
        'Registration succeeded but no access token was returned.'
      );
    }

    localStorage.setItem('hpb_token', data.token);

    setToken(data.token);

    if (data.user) {
      setUser(data.user);
    }

    /*
     * Fetch latest user after registration.
     */
    try {
      const latestUser = await authService.getMe();

      if (latestUser?.user) {
        setUser(latestUser.user);
      }
    } catch (error) {
      console.error(
        'Could not refresh user after registration:',
        error
      );
    }
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const logout = (): void => {
    localStorage.removeItem('hpb_token');

    setToken(null);
    setUser(null);
  };

  /* =========================================================
     UPDATE PROFILE
  ========================================================= */

  const updateProfile = async (data: {
    name?: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
  }): Promise<void> => {
    const response = await authService.updateProfile(data);

    if (response?.user) {
      setUser(response.user);
    } else {
      await refreshUser();
    }
  };

  /* =========================================================
     CONTEXT VALUE
  ========================================================= */

  const contextValue: AuthContextType = {
    user,
    token,
    loading,
    isAuthenticated: !!user,

    login,
    register,
    logout,

    refreshUser,

    updateProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/* =========================================================
   USE AUTH HOOK
========================================================= */

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
};