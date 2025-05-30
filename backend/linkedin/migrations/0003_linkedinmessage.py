# Generated by Django 5.2 on 2025-04-27 10:41

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('linkedin', '0002_linkedinaccount_delete_linkedinsession'),
    ]

    operations = [
        migrations.CreateModel(
            name='LinkedInMessage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sender', models.CharField(max_length=100)),
                ('recipient', models.CharField(max_length=100)),
                ('body', models.TextField()),
                ('sent_at', models.DateTimeField()),
                ('linkedin_message_id', models.CharField(max_length=128, unique=True)),
                ('account', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages', to='linkedin.linkedinaccount')),
            ],
        ),
    ]
