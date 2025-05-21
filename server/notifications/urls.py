from django.urls import path
from .views import NotificationListView, mark_read

urlpatterns = [
    path('', NotificationListView.as_view(), name='notifications-list'),
    path('<int:pk>/mark-read/', mark_read, name='notification-mark-read'),
]
