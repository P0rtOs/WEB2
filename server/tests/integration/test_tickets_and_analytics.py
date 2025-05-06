import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from events.models import Event, TicketTier, Registration
from django.utils import timezone

User = get_user_model()

@pytest.mark.django_db
class TestTicketEndpoints:
    @pytest.fixture(autouse=True)
    def setup(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email='c@e', password='p')
        self.client.force_authenticate(self.user)
        self.event = Event.objects.create(title='E', description='', start_date=timezone.now())
        self.tier = TicketTier.objects.create(event=self.event, title='Std', price=10)

    def test_purchase_and_download(self):
        r1 = self.client.post(reverse('ticket-purchase'), {'event_id':self.event.id,'tier_id':self.tier.id})
        assert r1.status_code==201
        reg_id = r1.data['id']
        r2 = self.client.get(reverse('ticket-download', kwargs={'pk':reg_id}))
        assert r2.status_code==200 and r2['Content-Type']=='application/pdf'

@pytest.mark.django_db
class TestAnalyticsEndpoints:
    @pytest.fixture(autouse=True)
    def setup(self):
        self.client = APIClient()
        self.org = User.objects.create_user(email='org@e', password='p', user_type='organizer')
        self.admin = User.objects.create_user(email='a@e', password='p', is_staff=True)
        self.event = Event.objects.create(title='A', description='', start_date=timezone.now(), organizer=self.org)
        tier = TicketTier.objects.create(event=self.event, title='T', price=5)
        Registration.objects.create(event=self.event, participant=self.org, ticket_tier=tier, paid=True)

    def test_organizer_analytics(self):
        self.client.force_authenticate(self.org)
        r = self.client.get(reverse('organizer-analytics'))
        assert r.status_code==200 and isinstance(r.data, list)

    def test_admin_analytics(self):
        self.client.force_authenticate(self.admin)
        r = self.client.get(reverse('admin-analytics'))
        assert r.status_code==200 and 'total_events' in r.data