from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import CustomUser, ProfessorFile
from django.contrib.auth.forms import PasswordResetForm
from cloudinary.utils import cloudinary_url
# --- LOGIN SERIALIZER PERSONALIZADO ---
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        # 1. Genera los tokens (access y refresh) usando la lógica original
        data = super().validate(attrs)

        # 2. Agregamos los datos del usuario a la respuesta
        # self.user es el usuario autenticado que encontró el serializador
        data.update({
            'user_id': self.user.id,
            'email': self.user.email,
            'username': self.user.username,
            'role': self.user.role,
            # Puedes agregar 'first_name', 'last_name' si los usas
        })

        return data

# --- OTROS SERIALIZADORES ---

import re # Usaremos expresiones regulares para ser precisos

import os

def get_download_url(self, obj):
        if not obj.file:
            return None
        
        url = obj.file.url
        
        # 1. Forzar HTTPS
        if url.startswith("http://"):
            url = url.replace("http://", "https://", 1)

        # 2. Detectar extensión
        ext = os.path.splitext(url)[1].lower()
        image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        
        if ".cloudinary.com" in url:
            # LIMPIEZA CRÍTICA: Eliminar prefijos de media que rompen el acceso público
            # Esto quita cualquier "/media/" o carpetas extra que Django inserte antes de "upload"
            if "/upload/" in url:
                parts = url.split("/upload/")
                # Reconstruimos la URL asegurando que empiece directamente en la base de Cloudinary
                base_url = parts[0].split(".com/")[0] + ".com/"
                path_after_upload = parts[1]
                
                # Identificar el tipo de recurso correcto
                resource_type = "image" if ext in image_extensions else "raw"
                
                # Reconstruir la URL limpia con el flag de descarga
                url = f"{base_url}{resource_type}/upload/fl_attachment/{path_after_upload}"

        return url



class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    class Meta:
        fields = ['email']

    def validate_email(self, value):
        if not CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("No existe un usuario con este correo electrónico.")
        return value

class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(min_length=8, write_only=True)