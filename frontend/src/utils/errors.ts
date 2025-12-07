/**
 * Utilidades para manejo de errores de la API
 */

import type { ApiError } from "@/types/api.types";

/**
 * Extrae el mensaje de error de una respuesta de la API
 */
export function getErrorMessage(
  error: unknown,
  defaultMessage = "Ha ocurrido un error"
): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const apiError = error as ApiError;
    if (apiError.detail) return apiError.detail;
    if (apiError.message) return apiError.message;
    if (apiError.error) return apiError.error;
  }

  if (typeof error === "string") {
    return error;
  }

  return defaultMessage;
}

/**
 * Verifica si un error es de red
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError) {
    return error.message.includes("fetch") || error.message.includes("network");
  }
  return false;
}

/**
 * Verifica si un error es de autenticación (401)
 */
export function isAuthError(status: number): boolean {
  return status === 401 || status === 403;
}
