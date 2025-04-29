from rest_framework import generics, permissions, views
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Event, TicketTier, Registration
from .serializers import EventSerializer, RegistrationSerializer
from users.permissions import IsOrganizer, IsEventOwnerOrStaff
from rest_framework.response import Response
from rest_framework import status


class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.request.method == "POST":
            # Допустим, только организаторы могут создавать события
            return [permissions.IsAuthenticated(), IsOrganizer()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            return [permissions.IsAuthenticated(), IsEventOwnerOrStaff()]
        return [permissions.AllowAny()]

# Новый эндпоинт для покупки билета (заглушка)
class TicketPurchaseView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        event_id = request.data.get('event_id')
        tier_id  = request.data.get('tier_id')
        try:
            tier = TicketTier.objects.get(pk=tier_id, event_id=event_id)
        except TicketTier.DoesNotExist:
            return Response({"error":"Tier not found"}, status=404)

        if tier.tickets_remaining < 1:
            return Response({"error":"Sold out"}, status=400)

        reg = Registration.objects.create(
            event = tier.event,
            participant = request.user,
            ticket_tier = tier,
            paid = True
        )
        return Response(RegistrationSerializer(reg).data, status=201)

# class RegistrationCreateView(generics.CreateAPIView):
#     queryset = Registration.objects.all()
#     serializer_class = RegistrationSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def perform_create(self, serializer):
#         serializer.save(participant=self.request.user)

# Аналитика для организаторов: список их событий с числом регистраций
class OrganizerAnalyticsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        user = request.user
        events = Event.objects.filter(organizer=user)
        data = []
        for event in events:
            data.append({
                'event_id': event.id,
                'event_title': event.title,
                'registrations_count': event.registrations.count()
            })
        return Response(data, status=status.HTTP_200_OK)

# Аналитика для администраторов: общая статистика по платформе
class AdminAnalyticsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response({"error": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
        total_events = Event.objects.count()
        total_registrations = Registration.objects.count()
        return Response({
            'total_events': total_events,
            'total_registrations': total_registrations,
        }, status=status.HTTP_200_OK)


# 2) Список своих регистраций (для клиента):
class MyRegistrationsView(generics.ListAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Registration.objects.filter(participant=self.request.user)

# 3) Список своих ивентов (для организатора):
class MyEventsView(generics.ListAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Event.objects.filter(organizer=self.request.user)