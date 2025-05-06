from django.urls import path
from .views import EventListCreateView, EventDetailView, TicketPurchaseView,AdminAnalyticsView, OrganizerAnalyticsView, MyRegistrationsView,MyEventsView, TestDataGenerateView, CreateCheckoutSessionView,stripe_webhook, GenerateQRView, TicketDownloadView, TicketMarkUsedView, TicketViewAPIView



urlpatterns = [
    path('',                            EventListCreateView.as_view(),          name='event-list'),
    path('<int:pk>/',                   EventDetailView.as_view(),              name='event-detail'),
    path('purchase/',                   TicketPurchaseView.as_view(),           name='ticket-purchase'),
    path('my-registrations/',           MyRegistrationsView.as_view(),          name='my-registrations'),
    path('my-registrations/<int:pk>/generate-qr/', GenerateQRView.as_view(),    name='generate-qr'),
    path('my-registrations/<int:pk>/ticket/',    TicketDownloadView.as_view(),  name='ticket-download'),
    path('my-registrations/<int:pk>/mark-used/', TicketMarkUsedView.as_view(), name='ticket-mark-used'),
    path('my-events/',                  MyEventsView.as_view(),                 name='my-events'),
    path('analytics/organizer/',        OrganizerAnalyticsView.as_view(),       name='organizer-analytics'),
    path('analytics/admin/',            AdminAnalyticsView.as_view(),           name='admin-analytics'),
    path('generate-test-data/',         TestDataGenerateView.as_view(),         name='generate-test-data'),
    path('create-checkout-session/',    CreateCheckoutSessionView.as_view(),    name='create-checkout-session'),
    path('webhook/',                    stripe_webhook,                         name='stripe-webhook'),
    path('tickets/<int:pk>/view/',      TicketViewAPIView.as_view(),            name='ticket-view'),

]
