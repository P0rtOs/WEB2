import pytest
from pact import Consumer, Provider
import requests

@pytest.fixture
def pact_analytics():
    pact = Consumer('AnalyticsClient').has_pact_with(Provider('Service'), port=1235)
    pact.start_service()
    yield pact
    pact.stop_service()

def test_analytics_contract(pact_analytics):
    expected = [{'event_id':1,'event_title':'X','registrations_count':3}]
    pact_analytics.given('analytics available')\
        .upon_receiving('get organizer analytics')\
        .with_request('GET','/api/events/analytics/organizer/')\
        .will_respond_with(200, body=expected)
    with pact_analytics:
        resp = requests.get('http://localhost:1235/api/events/analytics/organizer/')
        assert resp.json()==expected