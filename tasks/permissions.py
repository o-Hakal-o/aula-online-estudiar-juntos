from rest_framework import permissions
class IsStudent(permissions.BasePermission):
    """
    Permite el acceso solo si el usuario autenticado tiene el rol 'STUDENT'.
    """
    def has_permission(self, request, view):
        # Verifica si el usuario está autenticado y tiene el rol 'STUDENT'
        return request.user and request.user.is_authenticated and request.user.role == 'STUDENT'
class IsStudentOrProfessor(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        
        # 1. Verifica autenticación
        if not user or not user.is_authenticated:
            return False
        
        # 2. Revisa los roles permitidos
        allowed_roles = ['STUDENT', 'PROFESSOR']
        
        # Verifica la coincidencia del rol
        if user.role in allowed_roles:
             return True
        else:
             # Opcional: Si quieres ver qué rol está fallando, puedes imprimirlo
             # print(f"Acceso denegado. Rol del usuario: {user.role}")
             return False



class IsProfessorOrReadOnly(permissions.BasePermission):
    """
    - Cualquier usuario autenticado (Estudiante o Profesor) puede ver (GET).
    - Solo los PROFESSORES pueden crear (POST) o eliminar (DELETE).
    """
    def has_permission(self, request, view):
        # 1. CANDADO MAESTRO: ¿Tiene Token válido?
        if not request.user or not request.user.is_authenticated:
            return False

        # 2. Si el método es de lectura (GET, HEAD, OPTIONS), dejamos pasar a cualquiera autenticado
        if request.method in permissions.SAFE_METHODS:
            return True

        # 3. Si quiere escribir (POST, DELETE), DEBE ser PROFESSOR
        return request.user.role == 'PROFESSOR'