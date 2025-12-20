

# Create your models here.
from django.db import models
from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractUser
import os
from django.dispatch import receiver
from django.db.models.signals import post_delete

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
    REQUIRED_FIELDS = ['role', 'username',]
    
    # You  generally don't need to redefine name/email/password fields, 
    # as AbstractUser already provides first_name, last_name, email, and password.
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

# In settings.py:
# AUTH_USER_MODEL = 'yourappname.CustomUser'


# --- NEW MODEL FOR FILES ---
class ProfessorFile(models.Model):
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='files'
    )
    file = models.FileField(upload_to='professor_uploads/')
    title = models.CharField(max_length=255, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.uploaded_by.email}"

@receiver(post_delete, sender=ProfessorFile)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    """
    Deletes file from filesystem when corresponding `ProfessorFile` object is deleted.
    """
    if instance.file:
        if os.path.isfile(instance.file.path):
            os.remove(instance.file.path)
    
