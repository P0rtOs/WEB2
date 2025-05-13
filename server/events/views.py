from rest_framework import generics, permissions, views, status, serializers
from django.db.models import Sum, Count, F, DecimalField
from django.db.models.functions import TruncDay, TruncHour
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Event, TicketTier, Registration
from .serializers import EventSerializer, RegistrationSerializer
from users.permissions import IsOrganizer, IsEventOwnerOrStaff, IsAdminUser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from users.models import CustomUser
from .models import Event, Speaker, Sponsor, ProgramItem, TicketTier
from django.utils import timezone
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from io import BytesIO
from django.core.files.base import ContentFile
from django.http import FileResponse, Http404
from .utils import generate_ticket_pdf

import os
import stripe
import qrcode

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

class TicketDownloadView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        # fetch only your own registrations
        try:
            reg = Registration.objects.get(pk=pk, participant=request.user)
        except Registration.DoesNotExist:
            raise Http404

        # if there's no PDF yet, generate & save it
        if not reg.ticket_pdf:
            pdf_file = generate_ticket_pdf(reg)
            reg.ticket_pdf.save(f"ticket_{reg.pk}.pdf", pdf_file, save=True)

        # now we know ticket_pdf exists
        return FileResponse(
            reg.ticket_pdf.open("rb"),
            as_attachment=True,
            filename=f"ticket_{reg.pk}.pdf"
        )


class TicketMarkUsedView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            reg = Registration.objects.get(pk=pk, participant=request.user)
        except Registration.DoesNotExist:
            raise Http404
        reg.used = True
        reg.save(update_fields=["used"])
        return Response({"status": "marked_used"}, status=200)

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
    """Генерирует тестовые данные: организаторов, клиентов, события и регистрации (покупки билетов)."""
    permission_classes = [IsAdminUser]

    def post(self, request, *args, **kwargs):
        fake = Faker()
        password = 'TestPass123'
        accounts = []  # список учетных данных для вывода

        # 1) Создаем организаторов
        organizers = []
        for _ in range(10):
            email = fake.unique.email()
            user = CustomUser.objects.create_user(
                email=email,
                password=password,
                user_type='organizer'
            )
            organizers.append(user)
            accounts.append({'email': email, 'password': password})

        # 2) Создаем клиентов
        clients = []
        for _ in range(50):
            email = fake.unique.email()
            user = CustomUser.objects.create_user(
                email=email,
                password=password,
                user_type='client'
            )
            clients.append(user)
            accounts.append({'email': email, 'password': password})

        event_types = [choice[0] for choice in Event.EVENT_TYPES]

        # 3) Для каждого организатора создаем события и покупки билетов
        for org in organizers:
            for _ in range(5):
                # Создаем событие
                start_date = fake.date_time_between(start_date='-30d', end_date='now', tzinfo=datetime.timezone.utc)
                end_date = start_date + datetime.timedelta(hours=random.randint(1, 8))
                event = Event.objects.create(
                    title=fake.sentence(nb_words=6),
                    description="\n\n".join(fake.paragraphs(nb=3)),
                    location=fake.city(),
                    start_date=start_date,
                    end_date=end_date,
                    organizer=org,
                    event_type=random.choice(event_types)
                )

                # Спикеры, спонсоры, программа
                for __ in range(random.randint(1, 3)):
                    sp, _ = Speaker.objects.get_or_create(
                        name=fake.name(), bio=fake.text(max_nb_chars=200)
                    )
                    event.speakers.add(sp)
                for __ in range(random.randint(1, 2)):
                    sp, _ = Sponsor.objects.get_or_create(
                        name=fake.company(), website=fake.url()
                    )
                    event.sponsors.add(sp)
                for __ in range(random.randint(1, 4)):
                    pi, _ = ProgramItem.objects.get_or_create(
                        title=fake.sentence(nb_words=4), description=fake.text(max_nb_chars=100)
                    )
                    event.program_items.add(pi)

                # Тарифы
                for tier_name in ['Standard', 'VIP']:
                    price = random.uniform(10, 200)
                    tier = TicketTier.objects.create(
                        event=event,
                        title=tier_name,
                        description=fake.text(max_nb_chars=100),
                        price=price,
                        ticket_type='paid'
                    )

                    # Генерируем покупки для этого тарифа
                    # Выбираем случайных клиентов для покупки
                    buyers = random.sample(clients, k=random.randint(0, len(clients)))
                    for buyer in buyers[:random.randint(0, 20)]:
                        # Выбираем случайную дату покупки между созданием события и сейчас
                        purchase_date = fake.date_time_between(
                            start_date=event.start_date - datetime.timedelta(days=30),
                            end_date=min(event.end_date, datetime.datetime.now(datetime.timezone.utc)),
                            tzinfo=datetime.timezone.utc
                        )
                        # Флаг использования билета: только если событие уже прошло
                        used_flag = purchase_date < datetime.datetime.now(datetime.timezone.utc) and bool(random.getrandbits(1))

                        # Создаем регистрацию
                        reg = Registration(
                            event=event,
                            participant=buyer,
                            ticket_tier=tier,
                            paid=True
                        )
                        # Устанавливаем дату регистрации и статус использования
                        reg.registered_at = purchase_date
                        reg.used = used_flag
                        reg.save()

        return Response({'status': 'Test data generated', 'accounts': accounts}, status=201)


class GenerateQRView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        """
        Генерировать QR-билет для регистрации pk.
        В теле запроса: {"qr_holder_name": "Полное Имя"}
        """
        try:
            reg = Registration.objects.get(pk=pk, participant=request.user)
        except Registration.DoesNotExist:
            return Response({"error":"Registration not found"}, status=404)

        if reg.qr_code:
            # Уже есть — не генерируем повторно
            serializer = RegistrationSerializer(reg, context={'request': request})
            return Response(serializer.data)

        name = request.data.get('qr_holder_name')
        if not name:
            return Response({"error":"qr_holder_name is required"}, status=400)

        # Собираем payload для QR
        payload = {
            "receipt_id": reg.id,
            "event_id": reg.event.id,
            "user_name": name,
        }
        qr = qrcode.QRCode(box_size=10, border=4)
        qr.add_data(payload)
        qr.make(fit=True)
        img = qr.make_image(fill="black", back_color="white")

        # Сохраняем картинку в поле qr_code
        buf = BytesIO()
        img.save(buf, format='PNG')
        file_name = f"reg_{reg.id}_qr.png"
        reg.qr_code.save(file_name, ContentFile(buf.getvalue()), save=False)

        # Сохраняем имя и время генерации
        reg.qr_holder_name = name
        reg.qr_generated_at = timezone.now()
        reg.save()

        serializer = RegistrationSerializer(reg, context={'request': request})
        return Response(serializer.data, status=201)

class TicketViewAPIView(generics.RetrieveAPIView):
    """
    Публичный просмотр билета по ссылке из QR.
    Доступен без авторизации.
    """
    queryset = Registration.objects.select_related('event','ticket_tier','participant')
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.AllowAny]

class SalesPointSerializer(serializers.Serializer):
    period    = serializers.CharField()   # например "2025-05-01" или "2025-05-01T14"
    tickets   = serializers.IntegerField()
    revenue   = serializers.DecimalField(max_digits=12, decimal_places=2)

class EventSalesAnalyticsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, event_id):
        # проверяем, что пользователь — организатор или админ
        try:
            event = Event.objects.get(pk=event_id)
        except Event.DoesNotExist:
            return Response({"detail":"Event not found"}, status=404)

        user = request.user
        if not (user.is_staff or event.organizer == user):
            return Response({"detail":"Forbidden"}, status=403)

        # параметры
        period    = request.query_params.get("period","day")
        df        = request.query_params.get("date_from")
        dt        = request.query_params.get("date_to")

        qs = Registration.objects.filter(
            event=event, paid=True
        )
        if df:
            qs = qs.filter(registered_at__date__gte=df)
        if dt:
            qs = qs.filter(registered_at__date__lte=dt)

        if period=="hour":
            trunc = TruncHour("registered_at")
        else:
            trunc = TruncDay("registered_at")

        agg = (qs
            .annotate(period=trunc)
            .values("period")
            .annotate(
                tickets = Count("id"),
                revenue = Sum(F("ticket_tier__price"), output_field=DecimalField())
            )
            .order_by("period")
        )
        data = [{
            "period": x["period"].isoformat(),
            "tickets": x["tickets"],
            "revenue": float(x["revenue"] or 0)
        } for x in agg]

        # отправляем вместе с общим итогом
        used_count = qs.filter(used=True).count()
        summary = {
            "total_tickets": sum(d["tickets"] for d in data),
            "total_revenue": sum(d["revenue"] for d in data),
            "used_tickets": used_count,
        }
        return Response({"summary": summary, "series": data}, status=200)


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

        YOUR_DOMAIN = 'http://localhost:1234'
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'uah',           # или 'uah'
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