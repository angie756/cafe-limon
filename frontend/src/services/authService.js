/**
 * Servicio de autenticación
 * @module services/authService
 *
 * Maneja login, logout y gestión de tokens JWT.
 * Utiliza localStorage para persistir la sesión.
 */

import { post, get } from './api';
import { saveToken, saveUser, removeToken, removeUser, getToken, getUser } from '../utils/localStorage';

/**
 * Inicia sesión de usuario
 * @param {Object} credentials - Credenciales de login
 * @param {string} credentials.username - Nombre de usuario
 * @param {string} credentials.password - Contraseña
 * @returns {Promise<Object>} { token: string, user: Object }
 */
export const login = async (credentials) => {
  // post() ya extrae .data del ApiResponse automáticamente
  const loginData = await post('/auth/login', credentials);

  // Guardar token en localStorage
  if (loginData.token) {
    saveToken(loginData.token);
  }

  // Guardar usuario en localStorage (los datos del usuario están en loginData)
  const user = {
    id: loginData.id,
    username: loginData.username,
    email: loginData.email,
    role: loginData.role,
  };

  saveUser(user);

  // Retornar en el formato esperado por el contexto
  return {
    token: loginData.token,
    user: user,
  };
};

/**
 * Cierra sesión del usuario actual
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    // Intentar notificar al servidor (opcional)
    await post('/auth/logout');
  } catch (error) {
    // Continuar con logout local incluso si falla el servidor
    console.error('Error al hacer logout en servidor:', error);
  } finally {
    // Siempre limpiar datos locales
    removeToken();
    removeUser();
  }
};

/**
 * Verifica si hay una sesión activa
 * @returns {boolean} true si hay token guardado
 */
export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

/**
 * Obtiene el usuario actual de localStorage
 * @returns {Object|null} Usuario o null
 */
export const getCurrentUser = () => {
  return getUser();
};

/**
 * Verifica si el usuario tiene un rol específico
 * @param {string} role - Rol a verificar (ADMIN, KITCHEN)
 * @returns {boolean} true si el usuario tiene el rol
 */
export const hasRole = (role) => {
  const user = getCurrentUser();
  return user && user.role === role;
};

/**
 * Verifica si el usuario es administrador
 * @returns {boolean} true si es admin
 */
export const isAdmin = () => {
  return hasRole('ADMIN');
};

/**
 * Verifica si el usuario es personal de cocina
 * @returns {boolean} true si es cocina
 */
export const isKitchen = () => {
  return hasRole('KITCHEN');
};

/**
 * Obtiene el perfil del usuario actual del servidor
 * @returns {Promise<Object>} Usuario actualizado
 */
export const getProfile = async () => {
  // get() ya extrae .data del ApiResponse automáticamente
  const user = await get('/auth/profile');

  // Actualizar usuario en localStorage
  saveUser(user);

  return user;
};

/**
 * Actualiza el perfil del usuario
 * @param {Object} profileData - Datos a actualizar
 * @returns {Promise<Object>} Usuario actualizado
 */
export const updateProfile = async (profileData) => {
  // post() ya extrae .data del ApiResponse automáticamente
  const user = await post('/auth/profile', profileData);

  // Actualizar usuario en localStorage
  saveUser(user);

  return user;
};

/**
 * Cambia la contraseña del usuario
 * @param {Object} passwordData - Datos de contraseña
 * @param {string} passwordData.currentPassword - Contraseña actual
 * @param {string} passwordData.newPassword - Nueva contraseña
 * @returns {Promise<void>}
 */
export const changePassword = async (passwordData) => {
  return post('/auth/change-password', passwordData);
};

/**
 * Refresca el token JWT
 * @returns {Promise<Object>} { token: string }
 */
export const refreshToken = async () => {
  // post() ya extrae .data del ApiResponse automáticamente
  const tokenData = await post('/auth/refresh');

  if (tokenData.token) {
    saveToken(tokenData.token);
  }

  return tokenData;
};

/**
 * Verifica si el token es válido
 * @returns {Promise<boolean>} true si es válido
 */
export const verifyToken = async () => {
  try {
    await get('/auth/verify');
    return true;
  } catch (error) {
    // Token inválido o expirado
    removeToken();
    removeUser();
    return false;
  }
};

export default {
  login,
  logout,
  isAuthenticated,
  getCurrentUser,
  hasRole,
  isAdmin,
  isKitchen,
  getProfile,
  updateProfile,
  changePassword,
  refreshToken,
  verifyToken,
};
