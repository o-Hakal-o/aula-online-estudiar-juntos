from django.db import migrations
from django.contrib.auth import get_user_model
import os

def create_superuser(apps, schema_editor):
    User = get_user_model()
    # Usamos variables o valores fijos para asegurar la creación
    email = "itacknowledge@gmail.com" # El que vi en tus capturas
    if not User.objects.filter(email=email).exists():
        User.objects.create_superuser(
            email=email,
            password='UnaPasswordMuySegura123', # Cambia esto luego en el admin
            username='admin' 
        )

class Migration(migrations.Migration):
    dependencies = [
        ('tasks', '0006_auto_20260117_1703'), # <--- IMPORTANTE: Pon aquí el nombre de la última migración que falló
    ]

    operations = [
        migrations.RunPython(create_superuser),
    ]