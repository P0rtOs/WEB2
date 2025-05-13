from django.db import models
from events.models import Event

class EventReport(models.Model):
    FORMAT_CHOICES = (
        ('csv', 'CSV'),
        ('pdf', 'PDF'),
    )
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='reports')
    created_at = models.DateTimeField(auto_now_add=True)
    format = models.CharField(max_length=10, choices=FORMAT_CHOICES, default='csv')
    file = models.FileField(upload_to='event_reports/')

    def __str__(self):
        return f"Report for «{self.event.title}» at {self.created_at:%Y-%m-%d %H:%M}"
