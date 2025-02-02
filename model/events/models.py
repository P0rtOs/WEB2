from django.db import models

class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    date = models.DateTimeField()

    def __str__(self):
        return self.title
    
@classmethod
def get_all_events(cls):
        """
        Повертає список усіх подій.
        """
        return list(cls.objects.all())
