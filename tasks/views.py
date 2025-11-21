import os
from django.shortcuts import render, HttpResponse
from django.http import JsonResponse

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