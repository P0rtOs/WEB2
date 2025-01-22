from django.contrib import admin
from .models import Event  # Імпортуємо модель

admin.site.register(Event)  # Регіструємо модель в адмінці
