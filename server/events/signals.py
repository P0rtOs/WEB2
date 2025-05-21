from django.db.models.signals import pre_save
from django.dispatch import receiver

from .models import Event
from notifications.models import Notification
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

@receiver(pre_save, sender=Event)
def notify_event_changed(sender, instance, **kwargs):
    if not instance.pk:
        return 
    old = sender.objects.get(pk=instance.pk)
    if old.title != instance.title or old.start_date != instance.start_date:
        regs = instance.registrations.filter(paid=True).select_related('participant')
        channel_layer = get_channel_layer()
        for reg in regs:
            notif = Notification.objects.create(
                user=reg.participant,
                event=instance,
                message=f"Подію «{instance.title}» було оновлено."
            )
            async_to_sync(channel_layer.group_send)(
                f"user_{reg.participant.id}",
                {
                    "type": "send_notification",
                    "message": notif.message,
                    "event_id": instance.id,
                    "created_at": notif.created_at.isoformat(),
                }
            )
