from django.shortcuts import render, HttpResponse, redirect
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import BasePermission
from rest_framework_simplejwt.views import TokenObtainPairView

# Importaciones de tu app
from .models import CustomUser, ProfessorFile 
from .serializers import CustomTokenObtainPairSerializer, ProfessorFileSerializer, PasswordResetRequestSerializer, PasswordResetConfirmSerializer
from .permissions import IsStudentOrProfessor, IsStudent

# Para el reset de password
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.core.mail import send_mail, EmailMultiAlternatives # Añade send_mail

# ==========================================
# 1. AUTH VIEWS
# ==========================================

class LoginView(TokenObtainPairView):
    """
    Endpoint de Login. Devuelve Access Token, Refresh Token y Datos del Usuario.
    """
    serializer_class = CustomTokenObtainPairSerializer

def index(request):
    return HttpResponse("Backend Ittac Running")

# ==========================================
# 2. CUSTOM PERMISSIONS
# ==========================================

class IsProfessorOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        return request.user.role == 'PROFESSOR'

# ==========================================
# 3. FILE MANAGEMENT VIEW
# ==========================================

class FileManagementView(APIView):
    permission_classes = [IsProfessorOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        # Traemos todos los archivos ordenados por fecha
        files = ProfessorFile.objects.all().order_by('-uploaded_at') 
        
        # El serializer hará todo el trabajo sucio con el download_url
        serializer = ProfessorFileSerializer(files, many=True)
        
        return Response({
            "message": "Lista de archivos cargada correctamente",
            "count": files.count(),
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def post(self, request):
        # Se mantiene igual: Solo profesores pueden subir
        serializer = ProfessorFileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(uploaded_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        # Se mantiene igual: Solo el dueño puede borrar su archivo
        file_id = request.query_params.get('id') 
        if not file_id:
            return Response({"error": "Falta el ID (?id=1)"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Aquí mantenemos el filtro 'uploaded_by=request.user' por seguridad:
            # Aunque todos vean todo, no queremos que un Profe borre archivos de otro.
            file_obj = ProfessorFile.objects.get(id=file_id, uploaded_by=request.user)
            file_obj.delete()
            return Response({"message": "Archivo eliminado correctamente."}, status=status.HTTP_204_NO_CONTENT)
            
        except ProfessorFile.DoesNotExist:
            return Response(
                {"error": "Archivo no encontrado o no tienes permiso para borrarlo."}, 
                status=status.HTTP_404_NOT_FOUND
            )

# class FileDownloadView(APIView):
#     # Al usar tu permiso personalizado que revisa is_authenticated,
#     # el token es obligatorio aquí.
#     permission_classes = [IsStudentOrProfessor]
    
#     def get(self, request, file_id, format=None):
#         try:
#             file_instance = ProfessorFile.objects.get(pk=file_id)
            
#             # Verificamos si existe el archivo físico/link
#             if file_instance.file:
#                 download_url = file_instance.file.url
                
#                 # Transformación de Cloudinary para forzar descarga
#                 if ".cloudinary.com" in download_url:
#                     download_url = download_url.replace("/upload/", "/upload/fl_attachment/")

#                 return Response({
#                     "download_url": download_url,
#                     "title": file_instance.title
#                 }, status=status.HTTP_200_OK)
#             else:
#                 return Response({"error": "No hay archivo adjunto"}, status=status.HTTP_404_NOT_FOUND)
                
#         except ProfessorFile.DoesNotExist:
#             return Response({"detail": "El archivo no existe."}, status=status.HTTP_404_NOT_FOUND)
        
        
        
        
        
        
        

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
                
                # Asegúrate que esta URL coincida con tu frontend o endpoint
                reset_url = f"https://ittac.onrender.com/tasks/auth/password-reset-confirm/{uid}/{token}/"

                subject = "Recuperación de Contraseña - Ittac"
                message = f"Hola {user.username}, usa este enlace para restablecer tu contraseña: {reset_url}"
                from_email = settings.EMAIL_HOST_USER
                
                send_mail(subject, message, from_email, [email], fail_silently=False)

                return Response({"message": "Correo enviado."}, status=status.HTTP_200_OK)
            except CustomUser.DoesNotExist:
                return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
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
                id_usuario = force_str(urlsafe_base64_decode(uid))
                user = CustomUser.objects.get(pk=id_usuario)
            except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
                user = None

            if user is not None and default_token_generator.check_token(user, token):
                user.set_password(new_password)
                user.save()
                return Response({"message": "Contraseña restablecida."}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Token inválido."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    



from django.http import HttpResponse
from django.contrib.auth import get_user_model

# def create_admin_temporal(request):
#     User = get_user_model()
#     email = "itacknowledge@gmail.com"
#     password = "TuPasswordSegura123" # <--- Cámbiala aquí
    
#     if not User.objects.filter(email=email).exists():
#         User.objects.create_superuser(
#             email=email, 
#             password=password,
#             username="admin" # Si tu modelo usa username, si no, bórralo
#         )
#         return HttpResponse(f"¡Éxito! Superusuario {email} creado correctamente.")
#     else:
#         return HttpResponse("El usuario ya existe en la base de datos.")