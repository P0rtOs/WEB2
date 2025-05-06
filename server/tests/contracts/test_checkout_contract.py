import pytest
from pact import Consumer, Provider
import requests

@pytest.fixture
def pact():
    pact = Consumer('Client').has_pact_with(Provider('Service'), port=1234)
    pact.start_service()
    yield pact
    pact.stop_service()


def test_create_checkout_contract(pact):
    expected = {'sessionId':'sess_abc'}
    pact.given('valid tier')\
        .upon_receiving('a create checkout')\
        .with_request('POST','/api/events/create-checkout-session/')\
        .will_respond_with(201, body=expected)
    with pact:
        resp = requests.post('http://localhost:1234/api/events/create-checkout-session/', json={'tier_id':1})
        assert resp.json()==expected