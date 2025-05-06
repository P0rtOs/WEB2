import pytest
from events.serializers import EventSerializer, RegistrationSerializer
from events.models import Event, TicketTier, Registration
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
def test_event_serializer_create_and_partial_update():
    user = User.objects.create_user(email='u@e', password='p')
    data = {
        'title': 'Name',
        'description': 'Desc',
        'location': 'Loc',
        'start_date': '2025-07-01T09:00:00Z',
        'ticket_tiers': [{'title':'Gold','price':100,'ticket_type':'paid','tickets_remaining':10}]
    }
    ser = EventSerializer(data=data)
    ser.is_valid(raise_exception=True)
    ev = ser.save(organizer=user)
    assert ev.ticket_tiers.count() == 1
    ser2 = EventSerializer(ev, data={'title':'New'}, partial=True)
    ser2.is_valid(raise_exception=True)
    ev2 = ser2.save()
    assert ev2.title == 'New'

@pytest.mark.django_db
def test_registration_serializer_fields():
    event = Event.objects.create(title='E', description='D', start_date='2025-06-01T09:00:00Z')
    tier = TicketTier.objects.create(event=event, title='Std', price=30)
    user = User.objects.create_user(email='x@y', password='p')
    reg = Registration.objects.create(event=event, participant=user, ticket_tier=tier, paid=True)
    ser = RegistrationSerializer(reg)
    data = ser.data
    assert 'event' in data and 'ticket_tier' in data
    assert data['participant_name'] == user.email