from django.db import models
from events.models import Event

class EventReport(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='reports')
    created_at   = models.DateTimeField(auto_now_add=True)
    file         = models.FileField(upload_to='reports/')
    total_tickets = models.PositiveIntegerField()
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2)
    used_tickets  = models.PositiveIntegerField()

    def __str__(self):
        return f"Report #{self.id} for {self.event.title}"