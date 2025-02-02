from django.urls import path
from controller.events.views import EventListView, EventDetailView

urlpatterns = [
    path('', EventListView.as_view(), name='event-list'),  # Отримати список подій
    path('<int:pk>/', EventDetailView.as_view(), name='event-detail'),  # Отримати конкретну подію
]
