from django.conf import settings
from django.db import models

class Speaker(models.Model):
    name = models.CharField(max_length=100)
    bio = models.TextField(blank=True)
    photo = models.ImageField(upload_to='speakers/', null=True, blank=True)
    def __str__(self):
        return self.name

class Sponsor(models.Model):
    name = models.CharField(max_length=100)
    logo = models.ImageField(upload_to='sponsors/', null=True, blank=True)
    website = models.URLField(blank=True)
    def __str__(self):
        return self.name


class ProgramItem(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    def __str__(self):
        return self.title

class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(
        max_length=255,     
        null=True,          # разрешаем null временно
        blank=True          # разрешаем пустое значение в формах
    )  # Новое поле для места проведения
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True, blank=True)
    image = models.ImageField(upload_to='event_images/', null=True, blank=True)
    organizer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='organized_events',
        null=True,          # разрешаем null временно
        blank=True          # разрешаем пустое значение в формах
    )
    speakers = models.ManyToManyField(Speaker, blank=True)
    sponsors = models.ManyToManyField(Sponsor, blank=True)
    program_items = models.ManyToManyField(ProgramItem, blank=True)

    def __str__(self):
        return self.title

    @classmethod
    def get_all_events(cls):
        return list(cls.objects.all())


class TicketTier(models.Model):
    TICKET_TYPES = (
        ('free', 'Free'),
        ('paid', 'Paid'),
        ('early_access', 'Early Access'),
    )
    event = models.ForeignKey(Event, related_name="ticket_tiers", on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    ticket_type = models.CharField(max_length=20, choices=TICKET_TYPES, default='paid')
    tickets_remaining = models.PositiveIntegerField(default=100)  # Новое поле для отслеживания оставшихся билетов

    def __str__(self):
        return f"{self.title} ({self.ticket_type})"

class Registration(models.Model):
    event = models.ForeignKey(Event, related_name="registrations", on_delete=models.CASCADE)
    participant = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="registrations", on_delete=models.CASCADE)
    ticket_tier = models.ForeignKey(TicketTier, null=True, blank=True, on_delete=models.SET_NULL)
    registered_at = models.DateTimeField(auto_now_add=True)
    paid = models.BooleanField(default=False)
    def __str__(self):
        return f"{self.participant.email} -> {self.event.title}"
