# C:/Users/Fr0ndeur/Desktop/3_year_2_semestr/WEB2/backend/controller/events/views.py
from rest_framework import generics
from model.events.models import Event
from model.events.serializers import EventSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from controller.permissions import IsOrganizer  # если используется для ограничения доступа

class EventListView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.request.method == "POST":
            # Допустим, только организаторы могут создавать события
            return [IsAuthenticated(), IsOrganizer()]
        return [AllowAny()]

class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            return [IsAuthenticated(), IsOrganizer()]
        return [AllowAny()]
