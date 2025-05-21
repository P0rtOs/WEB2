# server/events/apps.py

from django.apps import AppConfig

class EventsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'events'

    def ready(self):
        # при старте Django импортируем сигналы
        import events.signals  # noqa