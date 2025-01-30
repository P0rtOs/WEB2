import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'model.settings')

from model.events.models import Event

def get_all_events():
    """
    Повертає список усіх подій.
    """
    return list(Event.objects.all())
