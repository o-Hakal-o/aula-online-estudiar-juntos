from rest_framework import serializers, generics, permissions, status
from rest_framework.response import Response
from .models import CustomUser
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializer import EmailTokenObtainPairSerializer # Asegúrate de que este serializer exista
from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
from rest_framework.views import APIView
import os # Necesario para manejar rutas de archivos

# Nota: Las vistas de registro están comentadas, las mantendré así.

class LoginView(TokenObtainPairView):
    """
    Endpoint de Login que acepta 'email' y 'password' y devuelve tokens JWT.
    """
    serializer_class = EmailTokenObtainPairSerializer

def index(request):
    return HttpResponse("hi")

class uploadFile(APIView):
    """
    Vista para manejar la carga de archivos.
    """
    def get(self, request):
        return Response(
            {"message": "Por favor, utiliza una solicitud POST para subir un archivo."}, 
            status=status.HTTP_200_OK
        )
        
    def post(self, request):
        # 1. Recuperación Segura del Archivo (Mejora Crítica)
        # Usamos .get() para evitar MultiValueDictKeyError si el campo 'file' falta.
        uploaded_file = request.FILES.get('file')
        
        if not uploaded_file:
            # Responde con un error 400 claro si no se encuentra el archivo
            return Response(
                {'error': 'No se encontró el archivo. Asegúrate de que estás subiendo un archivo usando el campo "file" con Content-Type: multipart/form-data.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        file_name = uploaded_file.name
        
        # 2. Definición del Destino
        # Asegúrate de que la carpeta 'media/' exista en tu proyecto.
        destination = 'media/'
        
        # Opcional: Recomendado usar un nombre de archivo único por seguridad
        # Por ahora, usaremos el nombre original
        output_path = os.path.join(destination, file_name)
        
        print(f"Intentando guardar: {output_path}")

        try:
            # 3. Guardado del Archivo (Corrección de Tipeo)
            with open(output_path, 'wb+') as fn:
                # CORRECCIÓN: Usar 'chunk' como variable de iteración y de escritura
                for chunk in uploaded_file.chunks():
                    fn.write(chunk)
                fn.close()
            
            # 4. Respuesta Exitosa (Uso Convencional de DRF)
            return Response(
                {'message': f'Archivo "{file_name}" subido exitosamente a {output_path}.'}, 
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            # 5. Manejo de Errores de Escritura (Recomendado)
            print(f"Error al intentar guardar el archivo: {e}")
            return Response(
                {'error': f'Ocurrió un error al guardar el archivo en el servidor: {e}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )