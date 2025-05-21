from django.urls import path
from .views import (
    GenerateEventReportView,
    OrganizerReportListView,
    AdminReportListView,
)

urlpatterns = [
    # … ваши старые пути …
    path('events/<int:event_id>/generate-report/', GenerateEventReportView.as_view(), name='generate-event-report'),
    path('events/<int:event_id>/reports/',        OrganizerReportListView.as_view(), name='organizer-reports'),
    path('admin/reports/',                        AdminReportListView.as_view(),     name='admin-reports'),
]
