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
from rest_framework.parsers import JSONParser
# --- YOUR APP IMPORTS ---
# Make sure these match your actual file names (e.g. 'models.py', 'serializer.py')
from .models import CustomUser, ProfessorFile 
from .serializer import EmailTokenObtainPairSerializer, ProfessorFileSerializer
from django.http import FileResponse, Http404
from .permissions import IsStudent
import json

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
            
            
            




from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.template.loader import render_to_string
from .serializer import PasswordResetRequestSerializer

from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                user = CustomUser.objects.get(email=email)
                token = default_token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                
                # IMPORTANTE: Cambia localhost:3000 por tu URL de Render si ya estás en producción
                reset_url = f"https://ittac.onrender.com/tasks/auth/password-reset-confirm/{uid}/{token}/"

                context = {
                    'user': user,
                    'reset_url': reset_url,
                }

                html_content = render_to_string('emails/password_reset_email.html', context)
                text_content = strip_tags(html_content)

                subject = "Recuperación de Contraseña - Ittac"
                # CAMBIO CRÍTICO: Debe ser tu correo de Gmail configurado en las variables
                from_email = settings.EMAIL_HOST_USER
                
                msg = EmailMultiAlternatives(subject, text_content, from_email, [email])
                msg.attach_alternative(html_content, "text/html")
                
                # fail_silently=False nos ayudará a ver el error real en los logs
                msg.send(fail_silently=False)

                return Response(
                    {"message": "Correo enviado con éxito."},
                    status=status.HTTP_200_OK
                )
            except CustomUser.DoesNotExist:
                return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                # Esto evita que el servidor se "congele" y te escupe el error en el JSON
                return Response(
                    {"error": "Fallo al enviar correo", "details": str(e)}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            uid = serializer.validated_data['uid']
            token = serializer.validated_data['token']
            new_password = serializer.validated_data['new_password']

            try:
                # 1. Decodificar el UID para obtener el ID real del usuario
                id_usuario = force_str(urlsafe_base64_decode(uid))
                user = CustomUser.objects.get(pk=id_usuario)
            except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
                user = None

            # 2. Verificar si el token es válido para ese usuario
            if user is not None and default_token_generator.check_token(user, token):
                # 3. Cambiar la contraseña de forma segura
                user.set_password(new_password)
                user.save()
                return Response(
                    {"message": "Tu contraseña ha sido restablecida con éxito."},
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"error": "El enlace es inválido o ha expirado."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)