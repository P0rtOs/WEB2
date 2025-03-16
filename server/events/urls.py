from django.urls import path
from .views import EventListCreateView, EventDetailView, TicketPurchaseView, AdminAnalyticsView, OrganizerAnalyticsView

urlpatterns = [
    path('', EventListCreateView.as_view(), name='event-list'),
    path('<int:pk>/', EventDetailView.as_view(), name='event-detail'),
    path('purchase-ticket/', TicketPurchaseView.as_view(), name='ticket-purchase'),
    path('analytics/organizer/', OrganizerAnalyticsView.as_view(), name='organizer-analytics'),
    path('analytics/admin/', AdminAnalyticsView.as_view(), name='admin-analytics'),
]
