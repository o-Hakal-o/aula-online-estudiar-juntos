/**
 * Servicio para manejo de archivos
 * Compatible con el endpoint /api/files/ del backend
 */

import { apiClient } from "./api";
import type { FileListResponse, ProfessorFile } from "@/types/api.types";

class FilesService {
  /**
   * Obtiene la lista de archivos
   * Profesores ven sus propios archivos, estudiantes ven todos
   */
  async getFiles(): Promise<FileListResponse> {
    return apiClient.get<FileListResponse>("/api/files/");
  }

  /**
   * Sube un archivo (solo para profesores)
   */
  async uploadFile(file: File, title?: string): Promise<ProfessorFile> {
    const formData = new FormData();
    formData.append("file", file);
    if (title) {
      formData.append("title", title);
    }

    // Para FormData, necesitamos hacer la petición directamente
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    const baseURL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
    
    const response = await fetch(`${baseURL}/api/files/`, {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        // No establecer Content-Type, el navegador lo hará automáticamente para FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Error al subir el archivo" }));
      throw new Error(error.error || error.detail || "Error al subir el archivo");
    }

    return response.json();
  }

  /**
   * Elimina un archivo (solo para profesores)
   */
  async deleteFile(fileId: number): Promise<void> {
    await apiClient.delete(`/api/files/?id=${fileId}`);
  }

  /**
   * Obtiene la URL completa de un archivo
   */
  getFileUrl(filePath: string): string {
    const baseURL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
    // El backend devuelve la ruta relativa, necesitamos construir la URL completa
    if (filePath.startsWith("http")) {
      return filePath;
    }
    return `${baseURL}${filePath.startsWith("/") ? filePath : `/${filePath}`}`;
  }
}

export const filesService = new FilesService();
export default filesService;

