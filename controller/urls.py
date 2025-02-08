from django.urls import path, include

urlpatterns = [
    path('', include('controller.users.urls')),
    path('events/', include('controller.events.urls')),
]
