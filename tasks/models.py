from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from cloudinary.models import CloudinaryField


class CustomUser(AbstractUser):
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

    # ✅ CAMBIO CLAVE
    file = CloudinaryField(
        resource_type="auto",
        folder="professor_uploads"
    )

    title = models.CharField(max_length=255, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.uploaded_by.email}"
