

# class UserSerializer(serializers.ModelSerializer):
#    class Meta:
#       model = CustomUser
#       fields = ('email','password','role')
#       #fields = '__all__'
   
#    def create(self, validated_data):
#       # CORRECTION: Use the Model class (User) to call create_user()
#       CustomUser = CustomUser.objects.create_user(**validated_data) 
#       return CustomUser# yourappname/serializer.py (Adjusted)

from rest_framework import serializers
from .models import CustomUser,ProfessorFile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


 
class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    # This field maps the incoming 'email' to the user model's 'username' field
    # which is used by AbstractBaseUser for authentication.
    # We override this to tell the base class to use 'email' instead.
   username_field = 'email'
   
class ProfessorFileSerializer(serializers.ModelSerializer):
     class Meta:
         model = ProfessorFile
         fields = ['id', 'file', 'title', 'uploaded_at', 'uploaded_by']
         read_only_fields = ['uploaded_by', 'uploaded_at']
   
   


from django.contrib.auth.forms import PasswordResetForm
from rest_framework import serializers

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    class Meta:
        fields = ['email']

    def validate_email(self, value):
        # Opcional: Validar si el usuario existe antes de intentar enviar
        if not CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("No existe un usuario con este correo electrónico.")
        return value

class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(min_length=8, write_only=True)

    def validate(self, data):
        # Aquí podrías agregar una validación para confirmar que las dos 
        # contraseñas coincidan si decides pedir "repetir contraseña"
        return data