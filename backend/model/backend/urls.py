from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from controller.views_social import GoogleLogin  # import your custom view

def index(request):
    return HttpResponse("It works")

urlpatterns = [
    path('admin/', admin.site.urls),  # Панель адміністратора
    path('api/', include('controller.urls')),  # Всі API-запити йдуть у контролер

    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
    # The following URL is used for social login via Google.
    # dj-rest-auth expects a POST with the Google token.
       # Custom social login endpoint for Google.
    # Now POST requests to /dj-rest-auth/google/ will be handled by your GoogleLogin view.
    path('dj-rest-auth/google/', GoogleLogin.as_view(), name='google_login'),
]
