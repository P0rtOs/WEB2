from django.db import models

class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True, blank=True)
    image = models.ImageField(upload_to='event_images/', null=True, blank=True)

    def __str__(self):
        return self.title

    @classmethod
    def get_all_events(cls):
        return list(cls.objects.all())

class TicketTier(models.Model):
    event = models.ForeignKey(Event, related_name="ticket_tiers", on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.title} ({self.price})"
