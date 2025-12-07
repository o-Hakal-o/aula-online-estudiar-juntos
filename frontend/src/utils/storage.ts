/**
 * Utilidades para manejo de localStorage tipado y seguro
 */

const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  TOKEN: "token", // Compatibilidad con formato antiguo
  USER: "user",
} as const;

class StorageService {
  /**
   * Guarda un valor en localStorage
   */
  setItem<T>(key: string, value: T): void {
    try {
      const serialized =
        typeof value === "string" ? value : JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Error guardando en localStorage (${key}):`, error);
    }
  }

  /**
   * Obtiene un valor de localStorage
   */
  getItem<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;

      try {
        return JSON.parse(item) as T;
      } catch {
        // Si no es JSON, devolver como string
        return item as T;
      }
    } catch (error) {
      console.error(`Error leyendo de localStorage (${key}):`, error);
      return defaultValue;
    }
  }

  /**
   * Elimina un valor de localStorage
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error eliminando de localStorage (${key}):`, error);
    }
  }

  /**
   * Limpia todo el localStorage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error limpiando localStorage:", error);
    }
  }

  // Métodos específicos para tokens
  getAccessToken(): string | null {
    return (
      this.getItem<string>(STORAGE_KEYS.ACCESS_TOKEN) ||
      this.getItem<string>(STORAGE_KEYS.TOKEN)
    );
  }

  setAccessToken(token: string): void {
    this.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  getRefreshToken(): string | null {
    return this.getItem<string>(STORAGE_KEYS.REFRESH_TOKEN);
  }

  setRefreshToken(token: string): void {
    this.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  setTokens(access: string, refresh?: string): void {
    this.setAccessToken(access);
    if (refresh) {
      this.setRefreshToken(refresh);
    }
  }

  clearTokens(): void {
    this.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    this.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    this.removeItem(STORAGE_KEYS.TOKEN);
  }

  // Métodos para usuario
  getUser<T = unknown>(): T | null {
    return this.getItem<T>(STORAGE_KEYS.USER);
  }

  setUser<T>(user: T): void {
    this.setItem(STORAGE_KEYS.USER, user);
  }

  clearUser(): void {
    this.removeItem(STORAGE_KEYS.USER);
  }

  // Limpia toda la sesión
  clearSession(): void {
    this.clearTokens();
    this.clearUser();
  }
}

export const storage = new StorageService();
export { STORAGE_KEYS };
