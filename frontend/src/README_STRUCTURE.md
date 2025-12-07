# Estructura del Proyecto Frontend

Esta documentación describe la estructura moderna del proyecto React, siguiendo las mejores prácticas de 2025.

## 📁 Estructura de Carpetas

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes de UI (shadcn/ui)
│   └── ...             # Componentes de la aplicación
├── pages/              # Páginas/Views de la aplicación
├── contexts/           # Contextos de React (Auth, Theme, etc.)
├── services/           # Servicios de API y lógica de negocio
├── hooks/              # Custom hooks
├── types/              # Definiciones de tipos TypeScript
├── utils/              # Utilidades y helpers
├── config/             # Configuración (env, constants)
└── lib/                # Librerías y utilidades de terceros
```

## 🔧 Servicios y API

### `services/api.ts`

Cliente HTTP centralizado que:

- Maneja autenticación automática (Bearer tokens)
- Refresh token automático
- Manejo centralizado de errores
- Compatible con el backend Django actual

**Uso:**

```typescript
import { apiClient } from "@/services/api";

// GET request
const data = await apiClient.get("/tasks/api/endpoint/");

// POST request
const result = await apiClient.post("/tasks/api/endpoint/", { data });
```

### `services/auth.service.ts`

Servicio de autenticación que maneja:

- Login
- Logout
- Verificación de autenticación
- Gestión de tokens

## 🔐 Autenticación

### `contexts/AuthContext.tsx`

Contexto global de autenticación que proporciona:

- Estado del usuario actual
- Funciones `login()` y `logout()`
- Estado de carga
- Verificación automática al cargar la app

**Uso:**

```typescript
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  // ...
}
```

### `components/ProtectedRoute.tsx`

Componente para proteger rutas que requieren autenticación.

**Uso:**

```typescript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

## 📝 Tipos TypeScript

### `types/api.types.ts`

Tipos para las respuestas de la API, manteniendo compatibilidad con el backend Django.

### `types/carousel.types.ts`

Tipos para Embla Carousel API (elimina el uso de `any`).

## 🛠️ Utilidades

### `utils/storage.ts`

Servicio tipado para manejo de localStorage:

- `storage.setItem()`, `storage.getItem()`
- `storage.setTokens()`, `storage.getAccessToken()`
- `storage.clearSession()`

### `utils/errors.ts`

Utilidades para manejo de errores:

- `getErrorMessage()` - Extrae mensajes de error
- `isNetworkError()` - Detecta errores de red
- `isAuthError()` - Detecta errores de autenticación

## ⚙️ Configuración

### `config/env.ts`

Lee variables de entorno de forma tipada y segura.

**Variables disponibles:**

- `VITE_API_BASE_URL` - URL base del backend (default: http://127.0.0.1:8000)

## 🎯 Mejoras Implementadas

### ✅ Buenas Prácticas Aplicadas

1. **Servicio de API centralizado** - Todas las llamadas HTTP pasan por un cliente único
2. **Autenticación con refresh token automático** - Los tokens se renuevan automáticamente
3. **Tipos TypeScript completos** - Eliminado el uso de `any`
4. **Validación de formularios** - React Hook Form + Zod
5. **Contexto de autenticación global** - Estado compartido en toda la app
6. **Rutas protegidas** - Componente para proteger rutas privadas
7. **Manejo de errores centralizado** - Utilidades para manejar errores de forma consistente
8. **React Query configurado** - Cache, retry y stale time optimizados
9. **Storage tipado y seguro** - Manejo de localStorage con tipos

### 🔄 Compatibilidad con Backend

El código mantiene **100% de compatibilidad** con el backend Django actual:

- Endpoints: `/tasks/auth/login/`, `/tasks/auth/refresh/`
- Formato de datos: `{ email, password }` para login
- Respuestas: `{ access, refresh, user? }`
- Headers: `Authorization: Bearer <token>`

## 📚 Próximos Pasos

Cuando el backend tenga endpoints para cursos:

1. Crear `services/courses.service.ts`
2. Usar React Query para fetch de cursos
3. Reemplazar datos mock en `pages/Index.tsx`

## 🚀 Ejemplo de Uso Completo

```typescript
// En un componente
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

function MyComponent() {
  const { user, isAuthenticated } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["myData"],
    queryFn: () => apiClient.get("/tasks/api/endpoint/"),
    enabled: isAuthenticated, // Solo fetch si está autenticado
  });

  // ...
}
```
