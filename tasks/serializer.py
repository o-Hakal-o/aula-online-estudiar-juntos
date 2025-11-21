

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

class RegisterSerializer(serializers.ModelSerializer):
   
   class Meta:
      
      model = CustomUser
      fields = ('email', 'password', 'role', 'username') # Added 'username' which AbstractUser requires
      extra_kwargs = {
         'password': {'write_only': True},  # Crucial: Password is only for writing, never read
         'email': {'required': True},       # Ensure email is required
      }

  # CORRECTED CODE
def create(self, validated_data):
    # Use the CustomUser manager's create_user method to handle password hashing
    validated_data['username'] = validated_data.get('username') or validated_data['email']
    user = CustomUser.objects.create_user(
        username=validated_data['username'],  # Correctly indented arguments
        email=validated_data['email'],
        password=validated_data['password'],
        role=validated_data.get('role', 'STUDENT')
    )
    return user
 
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
   
   
