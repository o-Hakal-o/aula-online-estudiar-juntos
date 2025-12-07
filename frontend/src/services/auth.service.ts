/**
 * Servicio de autenticación
 * Maneja login, logout y operaciones relacionadas con autenticación
 * Mantiene compatibilidad con el backend Django actual
 */

import { apiClient } from "./api";
import { storage } from "@/utils/storage";
import type { LoginRequest, LoginResponse, User } from "@/types/api.types";

class AuthService {
  /**
   * Inicia sesión con email y contraseña
   * Compatible con el endpoint /tasks/auth/login/ del backend
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      "/tasks/auth/login/",
      credentials,
      { skipAuth: true } // Login es público
    );

    // Guardar tokens (compatible con ambos formatos: JWT y token simple)
    if (response.access) {
      storage.setTokens(response.access, response.refresh);
    } else if (response.token) {
      // Compatibilidad con formato antiguo
      storage.setAccessToken(response.token);
    }

    // Guardar usuario si viene en la respuesta
    if (response.user) {
      storage.setUser<User>(response.user);
    }

    return response;
  }

  /**
   * Cierra sesión (limpia tokens y usuario)
   */
  logout(): void {
    storage.clearSession();
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!storage.getAccessToken();
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser(): User | null {
    return storage.getUser<User>();
  }

  /**
   * Obtiene el token de acceso actual
   */
  getAccessToken(): string | null {
    return storage.getAccessToken();
  }
}

export const authService = new AuthService();
export default authService;
