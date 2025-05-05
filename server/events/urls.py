from django.urls import path
from .views import EventListCreateView, EventDetailView, TicketPurchaseView, AdminAnalyticsView, OrganizerAnalyticsView, MyRegistrationsView, MyEventsView, TestDataGenerateView



urlpatterns = [
    path('',                        EventListCreateView.as_view(),      name='event-list'),
    path('<int:pk>/',               EventDetailView.as_view(),          name='event-detail'),
    path('purchase/',               TicketPurchaseView.as_view(),       name='ticket-purchase'),
    path('my-registrations/',       MyRegistrationsView.as_view(),      name='my-registrations'),
    path('my-events/',              MyEventsView.as_view(),             name='my-events'),
    path('analytics/organizer/',    OrganizerAnalyticsView.as_view(),   name='organizer-analytics'),
    path('analytics/admin/',        AdminAnalyticsView.as_view(),       name='admin-analytics'),
    path('generate-test-data/',     TestDataGenerateView.as_view(),     name='generate-test-data'),
]
