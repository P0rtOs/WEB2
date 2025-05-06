import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
class TestEventCRUD:
    @pytest.fixture(autouse=True)
    def auth(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email='o@e', password='p', user_type='organizer')
        self.client.force_authenticate(self.user)

    def test_create_and_get(self):
        data = {'title':'A','description':'B','start_date':'2025-06-10T10:00:00Z'}
        r1 = self.client.post(reverse('event-list'), data)
        assert r1.status_code == 201
        eid = r1.data['id']
        r2 = self.client.get(reverse('event-detail', kwargs={'pk':eid}))
        assert r2.status_code == 200 and r2.data['title']=='A'

    def test_update_and_delete(self):
        r1 = self.client.post(reverse('event-list'), {'title':'X','description':'D','start_date':'2025-06-11T11:00:00Z'})
        eid = r1.data['id']
        r2 = self.client.patch(reverse('event-detail', kwargs={'pk':eid}), {'title':'Y'})
        assert r2.data['title']=='Y'
        r3 = self.client.delete(reverse('event-detail', kwargs={'pk':eid}))
        assert r3.status_code == 204