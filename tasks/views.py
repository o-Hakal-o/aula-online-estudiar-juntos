
# yourappname/views.py

from rest_framework import serializers, generics, permissions
from rest_framework.response import Response
#from .serializer import RegisterSerializer
from .models import CustomUser
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializer import EmailTokenObtainPairSerializer

# class RegisterView(generics.CreateAPIView):
#     """
#     Handles new user registration (Sign Up).
#     """
#     queryset = CustomUser.objects.all()
#     permission_classes = [permissions.AllowAny] # Allow anyone to register
#     serializer_class = RegisterSerializer

#     def post(self, request, *args, **kwargs):
#         # Optional: You can customize the response after successful creation
#         return super().post(request, *args, **kwargs)
    

class LoginView(TokenObtainPairView):
    """
    Login endpoint that accepts 'email' and 'password' and returns JWT tokens.
    """
    serializer_class = EmailTokenObtainPairSerializer