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