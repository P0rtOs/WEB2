from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import UserRegistrationView, UserLoginView, GoogleLoginView, ToggleAdminView
from rest_framework.permissions import AllowAny
urlpatterns = [
    path('register/', UserRegistrationView.as_view(permission_classes=[AllowAny]), name='register'),
    path('login/', UserLoginView.as_view(permission_classes=[AllowAny]), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(permission_classes=[AllowAny]), name='token_refresh'),
    path('google/', GoogleLoginView.as_view(permission_classes=[AllowAny]), name='google_auth'),
    path('toggle-admin/', ToggleAdminView.as_view(permission_classes=[AllowAny]), name='toggle_admin'),
]
