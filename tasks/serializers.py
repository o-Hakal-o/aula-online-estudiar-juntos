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

class ProfessorFileSerializer(serializers.ModelSerializer):
    uploaded_by_email = serializers.ReadOnlyField(source='uploaded_by.email')
    download_url = serializers.SerializerMethodField()

    class Meta:
        model = ProfessorFile
        fields = [
            'id',
            'title',
            'uploaded_at',
            'uploaded_by',
            'uploaded_by_email',
            'download_url',
        ]
        read_only_fields = ['uploaded_by', 'uploaded_at']

    def get_download_url(self, obj):
        if not obj.file:
            return None
        
        # Obtenemos la URL original
        url = obj.file.url
        
        # 1. Forzar HTTPS (Evita bloqueos en Render/Navegadores)
        if url.startswith("http://"):
            url = url.replace("http://", "https://", 1)

        # 2. Ajuste para archivos No-Imagen (PDF, RAR, DOCX)
        if ".cloudinary.com" in url:
            # Cloudinary a veces pone /image/upload/ por defecto, 
            # pero los archivos raw requieren /raw/upload/
            if "/image/upload/" in url:
                url = url.replace("/image/upload/", "/raw/upload/")
            
            # 3. Forzar Descarga (Flag fl_attachment)
            # Solo lo añadimos si no está ya presente para no romper la URL
            if "/upload/" in url and "fl_attachment" not in url:
                url = url.replace("/upload/", "/upload/fl_attachment/", 1)
        
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