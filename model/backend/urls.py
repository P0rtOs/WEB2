from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def index(request):
    return HttpResponse("It works")

urlpatterns = [
    path('', index),
    path('admin/', admin.site.urls),
    path('api/', include('model.events.urls')),
    path('auth/', include('model.users.urls')),
]
