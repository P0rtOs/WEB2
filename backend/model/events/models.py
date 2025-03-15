# C:/Users/Fr0ndeur/Desktop/3_year_2_semestr/WEB2/backend/model/events/models.py
from django.db import models

class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    # Вместо одного поля date добавляем диапазон дат:
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True, blank=True)
    # Поле для картинки события (необязательное)
    image = models.ImageField(upload_to='event_images/', null=True, blank=True)

    def __str__(self):
        return self.title

class TicketTier(models.Model):
    event = models.ForeignKey(Event, related_name="ticket_tiers", on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.title} ({self.price})"

    
@classmethod
def get_all_events(cls):
        """
        Повертає список усіх подій.
        """
        return list(cls.objects.all())
