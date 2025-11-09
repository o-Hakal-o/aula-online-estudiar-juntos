

# Create your models here.

from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    #FIX: Explicitly define the email field as unique
    email = models.EmailField(unique=True, blank=False)
    # Define choices for the user's role
    ROLE_CHOICES = (
        ('PROFESSOR', 'Professor'),
        ('STUDENT', 'Student'),
    )
    
    # Add a field to distinguish between user types
    role = models.CharField(
        max_length=10, 
        choices=ROLE_CHOICES, 
        default='STUDENT'
    )
    # CRITICAL: Set email as the main field for authentication (login)
    USERNAME_FIELD = 'email'
    
    #Define required fields (excluding email/password) for createsuperuser
    REQUIRED_FIELDS = ['role', 'username']
    
    # You  generally don't need to redefine name/email/password fields, 
    # as AbstractUser already provides first_name, last_name, email, and password.
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

# In settings.py:
# AUTH_USER_MODEL = 'yourappname.CustomUser'



    
    
