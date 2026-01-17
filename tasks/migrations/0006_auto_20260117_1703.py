from django.db import migrations
from django.contrib.auth import get_user_model

def create_superuser(apps, schema_editor):
    User = get_user_model()
    # Verifica que no exista ya para no duplicar
    if not User.objects.filter(email='tu_email@gmail.com').exists():
        User.objects.create_superuser(
            email='tu_email@gmail.com',
            password='PasswordSegura123',
            username='admin' # Opcional si tu CustomUser lo requiere
        )

class Migration(migrations.Migration):
    dependencies = [
        ('tasks', '0001_initial'), # Asegúrate de que este nombre sea el de tu migración anterior
    ]
    operations = [
        migrations.RunPython(create_superuser),
    ]
