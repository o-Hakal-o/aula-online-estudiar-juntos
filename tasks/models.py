from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    # Email único y obligatorio
    email = models.EmailField(unique=True, blank=False)
    
    ROLE_CHOICES = (
        ('PROFESSOR', 'Professor'),
        ('STUDENT', 'Student'),
    )
    
    role = models.CharField(
        max_length=10, 
        choices=ROLE_CHOICES, 
        default='STUDENT'
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['role', 'username'] 
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'


class ProfessorFile(models.Model):
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='files'
    )
    # upload_to indica la carpeta dentro de Cloudinary
    file = models.FileField(upload_to='professor_uploads/')
    title = models.CharField(max_length=255, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    file = CloudinaryField('resource_type'='raw', folder='professor_uploads/')
    def __str__(self):
        return f"{self.title} - {self.uploaded_by.email}"