from django.urls import path, include
from controller.users.views import CustomUserViewSet

urlpatterns = [
    path('', include('djoser.urls')),  # Авторизація через Djoser
    path('token/', include('djoser.urls.jwt')),  # JWT токени
    path('profile/', CustomUserViewSet.as_view({'get': 'retrieve'}), name='user-profile'),
]
