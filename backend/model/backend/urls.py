from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from view.GoogleView import GoogleLoginView

def index(request):
    return HttpResponse("It works")

urlpatterns = [
    path('admin/', admin.site.urls),  # Панель адміністратора
    path('api/', include('controller.urls')),  # Всі API-запити йдуть у контролер
    
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),

    path('auth/', include('social_django.urls', namespace='social')),

    path('auth/google/', GoogleLoginView.as_view(), name='google-login'),

    # path('dj-rest-auth/', include('dj_rest_auth.urls')),
    # path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
    # path('dj-rest-auth/social/',include('djoser.social.urls')),
]
