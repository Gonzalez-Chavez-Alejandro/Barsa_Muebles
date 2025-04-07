# Generated by Django 5.1.7 on 2025-04-07 18:43

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Comentarios',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('contentComment', models.CharField(max_length=200)),
                ('dateComment', models.DateField(auto_now=True)),
                ('userID', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='comentarios', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
