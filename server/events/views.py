from rest_framework import generics, permissions, views, status
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Event, TicketTier, Registration
from .serializers import EventSerializer, RegistrationSerializer
from users.permissions import IsOrganizer, IsEventOwnerOrStaff, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from users.models import CustomUser
from .models import Event, Speaker, Sponsor, ProgramItem, TicketTier
from django.utils import timezone
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

import os
import stripe

import random
import datetime
from faker import Faker


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


class TestDataGenerateView(views.APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, *args, **kwargs):
        fake = Faker()
        password = 'TestPass123'
        # Создаем 10 организаторов
        organizers = []
        accounts = []  # список учётных данных
        for _ in range(10):
            email = fake.unique.email()
            user = CustomUser.objects.create_user(
                email=email,
                password=password,
                user_type='organizer'
            )
            organizers.append(user)
            accounts.append({'email': email, 'password': password})

        event_types = [choice[0] for choice in Event.EVENT_TYPES]
        # Для каждого организатора создаем 5 событий
        for org in organizers:
            for _ in range(5):
                title       = fake.sentence(nb_words=6)
                location    = fake.city()
                description = "\n\n".join(fake.paragraphs(nb=3))
                start_date = fake.date_time_between(start_date='-30d', end_date='now', tzinfo=datetime.timezone.utc)
                end_date   = start_date + datetime.timedelta(hours=random.randint(1,8))
                event_type  = random.choice(event_types)
                # Создаем событие
                event = Event.objects.create(
                    title=title,
                    description=description,
                    location=location,
                    start_date=start_date,
                    end_date=end_date,
                    organizer=org,
                    event_type=event_type
                )
                # Спикеры
                for __ in range(random.randint(1,3)):
                    sp, _ = Speaker.objects.get_or_create(
                        name=fake.name(),
                        bio=fake.text(max_nb_chars=200)
                    )
                    event.speakers.add(sp)
                # Спонсоры
                for __ in range(random.randint(1,2)):
                    sp, _ = Sponsor.objects.get_or_create(
                        name=fake.company(),
                        website=fake.url()
                    )
                    event.sponsors.add(sp)
                # Программа
                for __ in range(random.randint(1,4)):
                    pi, _ = ProgramItem.objects.get_or_create(
                        title=fake.sentence(nb_words=4),
                        description=fake.text(max_nb_chars=100)
                    )
                    event.program_items.add(pi)
                # Тарифы (пример)
                TicketTier.objects.create(event=event, title='Standard', description=fake.text(max_nb_chars=100), price=random.uniform(10,100), ticket_type='paid')
                TicketTier.objects.create(event=event, title='VIP',      description=fake.text(max_nb_chars=100), price=random.uniform(50,200), ticket_type='paid')

        return Response({'status': 'Test data generated', 'accounts': accounts}, status=201)




stripe.api_key = settings.STRIPE_SECRET_KEY
ENDPOINT_SECRET = settings.STRIPE_WEBHOOK_SECRET

class CreateCheckoutSessionView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        tier_id = request.data.get('tier_id')
        try:
            tier = TicketTier.objects.get(pk=tier_id)
        except TicketTier.DoesNotExist:
            return Response({'error': 'Tier not found'}, status=404)

        YOUR_DOMAIN = 'http://localhost:3000'
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',           # или 'uah'
                    'product_data': {'name': f"{tier.event.title} — {tier.title}"},
                    'unit_amount': int(tier.price * 100),
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=YOUR_DOMAIN + '/payments/success/?session_id={CHECKOUT_SESSION_ID}',
            cancel_url=YOUR_DOMAIN + '/payments/cancel/',
            metadata={
                'user_id': request.user.id,
                'event_id': tier.event.id,
                'tier_id': tier.id,
            }
        )
        return Response({'sessionId': session.id})

@csrf_exempt
@api_view(['POST'])
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    try:
        event = stripe.Webhook.construct_event(payload, sig_header, ENDPOINT_SECRET)
    except (ValueError, stripe.error.SignatureVerificationError):
        return Response(status=400)

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        meta = session['metadata']
        user = CustomUser.objects.get(pk=meta['user_id'])
        tier = TicketTier.objects.get(pk=meta['tier_id'])
        Registration.objects.create(
            event=tier.event,
            participant=user,
            ticket_tier=tier,
            paid=True
        )
    return Response(status=200)