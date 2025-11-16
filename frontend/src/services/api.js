/**
 * Configuración y cliente HTTP con Axios
 * @module services/api
 */

import axios from 'axios';
import { API_URL, ERROR_MESSAGES } from '../constants';
import { getToken, removeToken, removeUser } from '../utils/localStorage';

/**
 * Instancia configurada de Axios
 */
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de requests para agregar el token de autenticación
 */
api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log en desarrollo
    if (import.meta.env.DEV) {
      console.log('📤 API Request:', {
        method: config.method.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Interceptor de responses para manejo global de errores
 */
api.interceptors.response.use(
  (response) => {
    // Log en desarrollo
    if (import.meta.env.DEV) {
      console.log('📥 API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  (error) => {
    // Log del error
    console.error('❌ API Error:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
      data: error.response?.data,
    });

    // Manejo específico por código de error
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Token inválido o expirado - logout automático
          console.warn('🔒 Unauthorized - Limpiando sesión');
          removeToken();
          removeUser();

          // Redirigir al login (solo si no estamos ya en login)
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }

          return Promise.reject({
            message: ERROR_MESSAGES.UNAUTHORIZED,
            status,
            data,
          });

        case 403:
          return Promise.reject({
            message: 'No tienes permisos para realizar esta acción',
            status,
            data,
          });

        case 404:
          return Promise.reject({
            message: ERROR_MESSAGES.NOT_FOUND,
            status,
            data,
          });

        case 422:
          return Promise.reject({
            message: data.message || ERROR_MESSAGES.VALIDATION_ERROR,
            status,
            data,
            errors: data.errors || [],
          });

        case 500:
        case 502:
        case 503:
          return Promise.reject({
            message: ERROR_MESSAGES.SERVER_ERROR,
            status,
            data,
          });

        default:
          return Promise.reject({
            message: data.message || 'Error en la solicitud',
            status,
            data,
          });
      }
    } else if (error.request) {
      // Request hecho pero sin respuesta (problema de red)
      return Promise.reject({
        message: ERROR_MESSAGES.NETWORK_ERROR,
        status: 0,
        data: null,
      });
    } else {
      // Error al configurar el request
      return Promise.reject({
        message: error.message || 'Error desconocido',
        status: 0,
        data: null,
      });
    }
  }
);

/**
 * Funciones helper para requests comunes
 */

/**
 * GET request
 * @param {string} url - Endpoint
 * @param {Object} config - Configuración adicional de Axios
 * @returns {Promise} Respuesta de la API (data extraído del ApiResponse)
 */
export const get = (url, config = {}) => {
  return api.get(url, config).then(res => {
    // Extraer 'data' del ApiResponse del backend {success, data, timestamp}
    return res.data?.data || res.data;
  });
};

/**
 * POST request
 * @param {string} url - Endpoint
 * @param {Object} data - Datos a enviar
 * @param {Object} config - Configuración adicional de Axios
 * @returns {Promise} Respuesta de la API (data extraído del ApiResponse)
 */
export const post = (url, data = {}, config = {}) => {
  return api.post(url, data, config).then(res => {
    // Extraer 'data' del ApiResponse del backend {success, data, timestamp}
    return res.data?.data || res.data;
  });
};

/**
 * PUT request
 * @param {string} url - Endpoint
 * @param {Object} data - Datos a enviar
 * @param {Object} config - Configuración adicional de Axios
 * @returns {Promise} Respuesta de la API (data extraído del ApiResponse)
 */
export const put = (url, data = {}, config = {}) => {
  return api.put(url, data, config).then(res => {
    // Extraer 'data' del ApiResponse del backend {success, data, timestamp}
    return res.data?.data || res.data;
  });
};

/**
 * PATCH request
 * @param {string} url - Endpoint
 * @param {Object} data - Datos a enviar
 * @param {Object} config - Configuración adicional de Axios
 * @returns {Promise} Respuesta de la API (data extraído del ApiResponse)
 */
export const patch = (url, data = {}, config = {}) => {
  return api.patch(url, data, config).then(res => {
    // Extraer 'data' del ApiResponse del backend {success, data, timestamp}
    return res.data?.data || res.data;
  });
};

/**
 * DELETE request
 * @param {string} url - Endpoint
 * @param {Object} config - Configuración adicional de Axios
 * @returns {Promise} Respuesta de la API (data extraído del ApiResponse)
 */
export const del = (url, config = {}) => {
  return api.delete(url, config).then(res => {
    // Extraer 'data' del ApiResponse del backend {success, data, timestamp}
    return res.data?.data || res.data;
  });
};

/**
 * Upload de archivo
 * @param {string} url - Endpoint
 * @param {FormData} formData - Datos del formulario con archivo
 * @param {Function} onProgress - Callback de progreso (opcional)
 * @returns {Promise} Respuesta de la API
 */
export const upload = (url, formData, onProgress = null) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  if (onProgress) {
    config.onUploadProgress = (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgress(percentCompleted);
    };
  }

  return api.post(url, formData, config).then(res => res.data);
};

export default api;
