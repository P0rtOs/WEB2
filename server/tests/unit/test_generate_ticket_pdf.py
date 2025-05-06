import pytest
from django.contrib.auth import get_user_model
from events.utils import generate_ticket_pdf
from events.models import Event, TicketTier, Registration
from django.core.files.base import ContentFile

User = get_user_model()

@pytest.mark.django_db
@pytest.mark.parametrize('paid', [True, False])
def test_generate_ticket_pdf_returns_pdf(paid):
    # Створення тестового користувача для participant
    user = User.objects.create_user(email='test@example.com', password='pass')
    event = Event.objects.create(
        title='E', description='D', start_date='2025-06-01T10:00:00Z'
    )
    tier = TicketTier.objects.create(event=event, title='T1', price=50)
    reg = Registration.objects.create(
        event=event,
        participant=user,
        ticket_tier=tier,
        paid=paid
    )
    pdf_file = generate_ticket_pdf(reg)
    assert isinstance(pdf_file, ContentFile)
    data = pdf_file.read()
    assert data.startswith(b'%PDF')