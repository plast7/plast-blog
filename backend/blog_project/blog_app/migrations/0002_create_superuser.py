from django.db import migrations
import os
from django.contrib.auth import get_user_model

def create_superuser(apps, schema_editor):
    User = get_user_model()
    username = os.environ.get('SUPERUSER_USERNAME')
    email = os.environ.get('SUPERUSER_EMAIL')
    password = os.environ.get('SUPERUSER_PASSWORD')

    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(username=username, email=email, password=password)
        print(f"Superuser '{username}' created successfully.")
    else:
        print(f"Superuser '{username}' already exists.")

class Migration(migrations.Migration):

    dependencies = [
        ('blog_app', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_superuser),
    ]