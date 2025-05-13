from django.urls import path
from .views import GenerateEventReportView

urlpatterns = [
    # … ваши старые пути …
    path('events/<int:event_id>/generate-report/', GenerateEventReportView.as_view(), name='generate-event-report'),
]
