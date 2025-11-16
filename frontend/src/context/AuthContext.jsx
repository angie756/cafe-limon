/**
 * Context para gestión de autenticación
 * @module context/AuthContext
 *
 * Proporciona estado global y funciones para manejar la autenticación.
 * Utiliza authService y localStorage.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/authService';
import { USER_ROLES } from '../constants';

const AuthContext = createContext(null);

/**
 * Provider del contexto de autenticación
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar autenticación al montar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          setUser(currentUser);
          setIsAuthenticated(true);

          // Verificar token en el servidor
          const isValid = await authService.verifyToken();

          if (!isValid) {
            // Token inválido, hacer logout
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Inicia sesión
   */
  const login = useCallback(async (credentials) => {
    setLoading(true);

    try {
      const response = await authService.login(credentials);

      setUser(response.user);
      setIsAuthenticated(true);

      return response;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cierra sesión
   */
  const logout = useCallback(async () => {
    setLoading(true);

    try {
      await authService.logout();
    } catch (error) {
      console.error('Error al hacer logout:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);

  /**
   * Actualiza el perfil del usuario
   */
  const updateProfile = useCallback(async (profileData) => {
    try {
      const updatedUser = await authService.updateProfile(profileData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      throw error;
    }
  }, []);

  /**
   * Cambia la contraseña
   */
  const changePassword = useCallback(async (passwordData) => {
    try {
      await authService.changePassword(passwordData);
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      throw error;
    }
  }, []);

  /**
   * Verifica si el usuario tiene un rol específico
   */
  const hasRole = useCallback((role) => {
    return user && user.role === role;
  }, [user]);

  /**
   * Verifica si el usuario es administrador
   */
  const isAdmin = useCallback(() => {
    return hasRole(USER_ROLES.ADMIN);
  }, [hasRole]);

  /**
   * Verifica si el usuario es personal de cocina
   */
  const isKitchen = useCallback(() => {
    return hasRole(USER_ROLES.KITCHEN);
  }, [hasRole]);

  const value = {
    // Estado
    user,
    loading,
    isAuthenticated,

    // Acciones
    login,
    logout,
    updateProfile,
    changePassword,

    // Helpers
    hasRole,
    isAdmin,
    isKitchen,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook para usar el contexto de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }

  return context;
};

export default AuthContext;
