from django.db import models
from django.conf import settings
from events.models import Event

class Notification(models.Model):
    user      = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    event     = models.ForeignKey(Event, on_delete=models.CASCADE, null=True, blank=True)
    message   = models.TextField()
    created_at= models.DateTimeField(auto_now_add=True)
    read      = models.BooleanField(default=False)

    def __str__(self):
        return f"Notif to {self.user.email}: {self.message[:20]}"
