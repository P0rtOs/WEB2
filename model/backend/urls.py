from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def index(request):
    return HttpResponse("It works")

urlpatterns = [
    path('admin/', admin.site.urls),  # Панель адміністратора
    path('api/', include('controller.urls')),  # Всі API-запити йдуть у контролер
]
