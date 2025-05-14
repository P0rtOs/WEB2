from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from users.permissions import IsAdminUser, IsOrganizer
from rest_framework.permissions import IsAuthenticated

class OrganizerAnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Демонстрационные данные для организатора
        data = {
            "total_events": 5,
            "total_tickets_sold": 120,
            "revenue": 2500.00,
        }
        return Response(data, status=200)

class AdminAnalyticsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request, *args, **kwargs):
        # Демонстрационные данные для администратора
        data = {
            "total_events": 20,
            "total_users": 150,
            "total_revenue": 10000.00,
        }
        return Response(data, status=200)

class GenerateEventReportView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser|IsOrganizer]

    def post(self, request, event_id):
        # 1) Проверяем, что это организатор этого события или админ
        try:
            event = Event.objects.get(pk=event_id)
        except Event.DoesNotExist:
            return Response({"detail":"Event not found"}, status=404)
        user = request.user
        if not (user.is_staff or event.organizer == user):
            return Response({"detail":"Forbidden"}, status=403)

        # 2) Собираем данные по продажам
        regs = Registration.objects.filter(event=event, paid=True)
        total_tickets = regs.count()
        total_revenue = sum(r.ticket_tier.price for r in regs)
        used_tickets  = regs.filter(used=True).count()

        # 3) Формируем CSV
        sio = StringIO()
        writer = csv.writer(sio)
        writer.writerow(['Metric','Value'])
        writer.writerow(['Total tickets sold', total_tickets])
        writer.writerow(['Total revenue', f"{total_revenue:.2f}"])
        writer.writerow(['Tickets used', used_tickets])
        csv_content = sio.getvalue().encode('utf-8')

        # 4) Сохраняем Report
        now = timezone.now()
        report = EventReport(event=event, format='csv')
        filename = f"event_{event.id}_report_{now:%Y%m%d_%H%M}.csv"
        report.file.save(filename, ContentFile(csv_content), save=True)

        # 5) Отдаём обратно ссылку на файл
        serializer = EventReportSerializer(report, context={'request': request})
        return Response(serializer.data, status=201)