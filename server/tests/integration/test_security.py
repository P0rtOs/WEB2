import pytest
from django.urls import reverse
from rest_framework.test import APIClient

@pytest.fixture
def client():
    return APIClient()

@pytest.mark.django_db
class TestEventPermissions:
    def test_list_anonymous(self, client):
        resp = client.get(reverse('event-list'))
        assert resp.status_code == 200

    def test_create_forbidden(self, client):
        resp = client.post(reverse('event-list'), {})
        assert resp.status_code in (401, 403)