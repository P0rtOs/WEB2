from django.urls import path, include

urlpatterns = [
    path('', include('controller.users.urls')),  # Всі юрли, що стосуються користувачів
    path('events/', include('controller.events.urls')),  # Всі юрли, що стосуються подій
]
