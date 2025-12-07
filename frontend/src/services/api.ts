/**
 * Cliente de API centralizado
 * Maneja autenticación, interceptores y refresh token automático
 * Mantiene compatibilidad total con el backend Django actual
 */

import { env } from "@/config/env";
import { storage } from "@/utils/storage";
import { getErrorMessage } from "@/utils/errors";
import type { ApiError, LoginRequest, LoginResponse, RefreshTokenResponse } from "@/types/api.types";

// Tipos para las opciones de fetch
interface FetchOptions extends RequestInit {
  skipAuth?: boolean; // Para endpoints públicos
}

class ApiClient {
  private baseURL: string;
  private isRefreshing = false;
  private refreshPromise: Promise<string> | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL.replace(/\/$/, ""); // Elimina trailing slash
  }

  /**
   * Obtiene el token de acceso actual
   */
  private getAccessToken(): string | null {
    return storage.getAccessToken();
  }

  /**
   * Refresca el token de acceso usando el refresh token
   */
  private async refreshAccessToken(): Promise<string> {
    // Si ya hay un refresh en proceso, esperar a ese
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performRefresh();

    try {
      const newAccessToken = await this.refreshPromise;
      return newAccessToken;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  /**
   * Realiza el refresh del token
   */
  private async performRefresh(): Promise<string> {
    const refreshToken = storage.getRefreshToken();

    if (!refreshToken) {
      throw new Error("No hay refresh token disponible");
    }

    try {
      const response = await fetch(`${this.baseURL}/tasks/auth/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        // Si el refresh falla, limpiar sesión
        storage.clearSession();
        throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
      }

      const data = (await response.json()) as RefreshTokenResponse;
      storage.setAccessToken(data.access);
      return data.access;
    } catch (error) {
      storage.clearSession();
      throw error;
    }
  }

  /**
   * Realiza una petición HTTP con manejo automático de autenticación
   */
  async request<T = unknown>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { skipAuth = false, headers = {}, ...fetchOptions } = options;

    // Construir URL
    const url = endpoint.startsWith("http") 
      ? endpoint 
      : `${this.baseURL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

    // Headers por defecto
    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
      ...headers,
    };

    // Agregar token si no se omite la autenticación
    if (!skipAuth) {
      const token = this.getAccessToken();
      if (token) {
        defaultHeaders.Authorization = `Bearer ${token}`;
      }
    }

    try {
      let response = await fetch(url, {
        ...fetchOptions,
        headers: defaultHeaders,
      });

      // Si recibimos 401 y tenemos refresh token, intentar refrescar
      if (response.status === 401 && !skipAuth && storage.getRefreshToken()) {
        try {
          const newToken = await this.refreshAccessToken();
          // Reintentar la petición con el nuevo token
          defaultHeaders.Authorization = `Bearer ${newToken}`;
          response = await fetch(url, {
            ...fetchOptions,
            headers: defaultHeaders,
          });
        } catch (refreshError) {
          // Si el refresh falla, lanzar error
          throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
        }
      }

      // Manejar errores HTTP
      if (!response.ok) {
        let errorMessage = "Error en la solicitud";
        try {
          const errorData = (await response.json()) as ApiError;
          errorMessage = getErrorMessage(errorData);
        } catch {
          // Si no se puede parsear el error, usar el mensaje por defecto
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Parsear respuesta
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        return (await response.json()) as T;
      }

      return (await response.text()) as T;
    } catch (error) {
      // Manejar errores de red
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Error de conexión. Verifica tu conexión a internet.");
      }
      throw error;
    }
  }

  /**
   * Métodos de conveniencia para diferentes verbos HTTP
   */
  async get<T = unknown>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T = unknown>(endpoint: string, data?: unknown, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = unknown>(endpoint: string, data?: unknown, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T = unknown>(endpoint: string, data?: unknown, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = unknown>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "DELETE",
    });
  }
}

// Instancia singleton del cliente API
export const apiClient = new ApiClient(env.API_BASE_URL);

// Exportar también como default para facilitar imports
export default apiClient;

