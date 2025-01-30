from django.urls import path, include

urlpatterns = [
    path('users/', include('djoser.urls')),

    path('token/', include('djoser.urls.jwt')),
]
