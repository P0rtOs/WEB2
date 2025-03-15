from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Event
from .serializers import EventSerializer
from users.permissions import IsOrganizer

class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated(), IsOrganizer()]
        return [permissions.AllowAny()]

class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            return [permissions.IsAuthenticated(), IsOrganizer()]
        return [permissions.AllowAny()]
