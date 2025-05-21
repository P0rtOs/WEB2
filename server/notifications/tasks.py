from celery import shared_task
from django.utils import timezone
from .models import Notification
from events.models import Registration
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

@shared_task
def schedule_reminder(registration_id):
    from events.models import Registration
    reg = Registration.objects.select_related('participant','event').get(pk=registration_id)
    event = reg.event
    user  = reg.participant

    Notification.objects.create(
        user=user,
        event=event,
        message=f"До початку події «{event.title}» залишився 1 год."
    )
    async_to_sync(get_channel_layer().group_send)(
        f"user_{user.id}",
        {
        "type": "send_notification",
        "message": notif.message,
        "event_id": notif.event_id,
        "created_at": notif.created_at.isoformat(),
        }
    )
