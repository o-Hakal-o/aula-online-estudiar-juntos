from django.contrib import admin

# Register your models here.
# tasks/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin # <--- CORRECT LOCATION
from .models import CustomUser

# Define the custom admin class
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role',)}),
    )
    # Si tienes otros campos como name o LastNames en CustomUser, añádelos aquí.

# 2. Registra el modelo de usuario personalizado
# Usa la clase de administración personalizada si la definiste
admin.site.register(CustomUser, CustomUserAdmin)

