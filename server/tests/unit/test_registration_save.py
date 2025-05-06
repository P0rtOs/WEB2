import pytest
from django.contrib.auth import get_user_model
from events.models import Event, TicketTier, Registration

User = get_user_model()

@pytest.mark.django_db
def test_registration_decrements_tickets_remaining():
    # Створення тестового користувача
    user = User.objects.create_user(email='user2@example.com', password='pass')
    event = Event.objects.create(
        title='X', description='Y', start_date='2025-06-02T12:00:00Z'
    )
    tier = TicketTier.objects.create(event=event, title='T2', price=20)
    orig = tier.tickets_remaining
    Registration.objects.create(
        event=event,
        participant=user,
        ticket_tier=tier,
        paid=False
    )
    tier.refresh_from_db()
    assert tier.tickets_remaining == orig - 1