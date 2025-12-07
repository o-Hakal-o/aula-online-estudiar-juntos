

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
   
   
