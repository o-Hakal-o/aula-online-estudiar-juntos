/**
 * Tipos para las respuestas de la API
 * Mantiene compatibilidad con el backend Django actual
 */

// Tipos de usuario
export type UserRole = "STUDENT" | "PROFESSOR";

export interface User {
  id?: number;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: UserRole;
  username?: string;
  is_superuser?: boolean;
  is_staff?: boolean;
}

// Respuesta de login (compatible con JWT de Django)
export interface LoginResponse {
  access: string;
  refresh: string;
  user?: User;
  // Compatibilidad con otros formatos
  token?: string;
}

// Request de login
export interface LoginRequest {
  email: string;
  password: string;
}

// Respuesta de refresh token
export interface RefreshTokenResponse {
  access: string;
}

// Respuesta de error de la API
export interface ApiError {
  detail?: string;
  message?: string;
  error?: string;
  [key: string]: unknown;
}

// Tipos para archivos (compatible con FileManagementView)
export interface ProfessorFile {
  id: number;
  file: string;
  title: string;
  uploaded_at: string;
  uploaded_by: number;
}

export interface FileListResponse {
  message: string;
  data: ProfessorFile[];
}

// Tipos genéricos para respuestas de API
export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: string;
}

