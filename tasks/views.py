import os
from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
from .permissions import IsStudentOrProfessor
# --- REST FRAMEWORK IMPORTS ---
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView

# --- YOUR APP IMPORTS ---
# Make sure these match your actual file names (e.g. 'models.py', 'serializer.py')
from .models import CustomUser, ProfessorFile 
from .serializer import EmailTokenObtainPairSerializer, ProfessorFileSerializer
from django.http import FileResponse, Http404
from .permissions import IsStudent

# ==========================================
# 1. AUTH VIEWS
# ==========================================

class LoginView(TokenObtainPairView):
    """
    Endpoint de Login que acepta 'email' y 'password' y devuelve tokens JWT.
    """
    serializer_class = EmailTokenObtainPairSerializer
    
def index(request):
    return HttpResponse("hi")

# ==========================================
# 2. CUSTOM PERMISSIONS
# ==========================================

class IsProfessorOrReadOnly(BasePermission):
    """
    Custom Permission:
    - Students: Can only Read (GET).
    - Professors: Can Read, Write, and Delete.
    """
    def has_permission(self, request, view):
        # 1. User must be logged in
        if not request.user or not request.user.is_authenticated:
            return False
            
        # 2. Safe methods (GET, HEAD, OPTIONS) are allowed for everyone (Students & Profs)
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
            
        # 3. Unsafe methods (POST, DELETE) are ONLY for Professors
        return request.user.role == 'PROFESSOR'

# ==========================================
# 3. FILE MANAGEMENT VIEW
# ==========================================

class FileManagementView(APIView):
    permission_classes = [IsProfessorOrReadOnly]
    parser_classes = [MultiPartParser, FormParser] # Helps handle file uploads

    # 1. GET: List files
    def get(self, request):
        # Logic: Professors see their own files. Students see ALL files.
        if request.user.role == 'PROFESSOR':
            files = ProfessorFile.objects.filter(uploaded_by=request.user)
            message = "Estos son tus archivos subidos."
        else:
            # Students see everything
            files = ProfessorFile.objects.all()
            message = "Estos son los archivos disponibles para estudiar."

        serializer = ProfessorFileSerializer(files, many=True)
        return Response({"message": message, "data": serializer.data}, status=status.HTTP_200_OK)

    # 2. POST: Upload file (Protected by Permission Class)
    def post(self, request):
        serializer = ProfessorFileSerializer(data=request.data)
        if serializer.is_valid():
            # Link the file to the logged-in professor
            # This line automatically handles opening, writing, and saving the file to disk
            serializer.save(uploaded_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 3. DELETE: Remove a file
    def delete(self, request):
        file_id = request.query_params.get('id')
        
        if not file_id:
            return Response({"error": "Debes proporcionar un ID (ej: ?id=1)"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # 1. Get the object
            file_obj = ProfessorFile.objects.get(id=file_id, uploaded_by=request.user)
            
            # --- THE FIX: Delete physical file first ---
            # save=False means: "Delete the file from disk, but don't try to save the model 
            # right now (because we are about to delete the model anyway)."
            file_obj.file.delete(save=False) 
            
            # 2. Now delete the database record
            file_obj.delete()
            
            return Response({"message": "Archivo eliminado física y lógicamente."}, status=status.HTTP_204_NO_CONTENT)
            
        except ProfessorFile.DoesNotExist:
            return Response(
                {"error": "El archivo no existe o no tienes permiso."}, 
                status=status.HTTP_404_NOT_FOUND
            )
            
            
class FileDownloadView(APIView):
    # Permite solo a usuarios autenticados que sean estudiantes
    permission_classes = [IsStudentOrProfessor]
    

    def get(self, request, file_id, format=None):
        try:
            # 1. Obtener el objeto del archivo
            file_instance = ProfessorFile.objects.get(pk=file_id)
            
            # 2. Verificar que el archivo exista en el sistema de archivos
            file_path = file_instance.file.path
            
            # 3. Usar FileResponse para servir el archivo
            response = FileResponse(open(file_path, 'rb'))
            
            # 4. Establecer el encabezado Content-Disposition para forzar la descarga
            # Esto usa el nombre original del archivo (o el título si lo prefieres)
            response['Content-Disposition'] = f'attachment; filename="{file_instance.file.name.split("/")[-1]}"'
            
            # 5. Establecer el tipo de contenido
            # (Django a menudo lo infiere, pero es buena práctica)
            response['Content-Type'] = 'application/octet-stream' 
            
            return response
        
        except ProfessorFile.DoesNotExist:
            return Response(
                {"detail": "El archivo solicitado no existe."}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except FileNotFoundError:
             # Ocurrirá si la entrada existe en la BD pero el archivo físico fue borrado
            return Response(
                {"detail": "El archivo físico no se encuentra en el servidor."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            # Manejar otros errores
            return Response(
                {"detail": f"Error al procesar la descarga: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
            
            
class SuperuserInitView(APIView):
    # No necesita permisos si se verifica la clave secreta
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # 1. Seguridad CRÍTICA: Verificar la clave de inicialización
        init_key = os.environ.get('SUPERUSER_INIT_KEY')
        if not init_key or request.data.get('init_key') != init_key:
            return Response(
                {"error": "Clave de inicialización inválida o faltante."},
                status=status.HTTP_403_FORBIDDEN
            )

        # 2. Verificar si ya existe un superusuario
        CustomUser = ProfessorFile.uploaded_by.field.related_model # Acceder al modelo CustomUser
        
        # OTRA FORMA (Si CustomUser está importado):
        # from .models import CustomUser 
        # if CustomUser.objects.filter(is_superuser=True).exists():
        #    return Response({"message": "Ya existe un superusuario. Inicialización cancelada."}, status=status.HTTP_200_OK)

        # Si ya existe un superusuario, este método te protegerá de errores de unicidad
        if CustomUser.objects.filter(is_superuser=True).exists():
             return Response({"message": "Ya existe un superusuario. Inicialización cancelada."}, status=status.HTTP_200_OK)

        # 3. Extraer y validar los datos
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not all([username, email, password]):
            return Response(
                {"error": "Faltan datos (username, email, password)."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 4. Crear el superusuario
        try:
            user = CustomUser.objects.create_superuser(
                username=username,
                email=email,
                password=password,
                role='PROFESSOR' # O el rol que desees para el administrador
            )
            return Response(
                {"message": f"Superusuario '{user.email}' creado exitosamente."},
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {"error": f"Error al crear el usuario: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )