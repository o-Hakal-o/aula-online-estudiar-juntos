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
            
            
            
cclass SuperuserInitView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # 1. Definimos la clave esperada (Hardcoded para eliminar dudas)
        expected_key = "INIT_KEY_43987349872340987324"
        
        # 2. Obtenemos lo que enviaste
        received_key = request.data.get('init_key')
        
        # === DIAGNÓSTICO: DEVOLVER LO QUE VEMOS ===
        # Si la clave no coincide, devolvemos un mensaje con lo que recibió el servidor
        if received_key != expected_key:
            return Response({
                "error": "Clave inválida",
                "debug_info": {
                    "lo_que_esperaba_el_servidor": expected_key,
                    "lo_que_recibio_del_request": received_key,
                    "datos_completos_recibidos": request.data
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        # ============================================

        # ... (Aquí sigue el resto de tu lógica de creación de usuario si todo está bien)
        CustomUser = ProfessorFile.uploaded_by.field.related_model 
        
        if CustomUser.objects.filter(is_superuser=True).exists():
             return Response({"message": "Ya existe un superusuario."}, status=status.HTTP_200_OK)

        try:
            user = CustomUser.objects.create_superuser(
                username=request.data.get('username'),
                email=request.data.get('email'),
                password=request.data.get('password'),
                role='PROFESSOR'
            )
            return Response({"message": "Superusuario creado!"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)