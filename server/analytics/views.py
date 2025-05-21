from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from users.permissions import IsAdminUser, IsOrganizer
from rest_framework.permissions import IsAuthenticated
from events.models import Event, Registration
from .serializers import EventReportSerializer, GenerateReportSerializer
from io import StringIO
from rest_framework import status
import csv

class OrganizerAnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        data = {
            "total_events": 5,
            "total_tickets_sold": 120,
            "revenue": 2500.00,
        }
        return Response(data, status=200)

class AdminAnalyticsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request, *args, **kwargs):
        data = {
            "total_events": 20,
            "total_users": 150,
            "total_revenue": 10000.00,
        }
        return Response(data, status=200)

from django.utils import timezone
from django.core.files.base import ContentFile



from events.models import Event, Registration
from .models import EventReport
from .serializers import EventReportSerializer, GenerateReportSerializer

class GenerateEventReportView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser|IsOrganizer]

    def post(self, request, event_id):
        try:
            event = Event.objects.get(pk=event_id)
        except Event.DoesNotExist:
            return Response({"detail": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        if not (user.is_staff or event.organizer == user):
            return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)

        params_ser = GenerateReportSerializer(data=request.query_params)
        params_ser.is_valid(raise_exception=True)
        date_from = params_ser.validated_data.get("date_from")
        date_to   = params_ser.validated_data.get("date_to")

        regs = Registration.objects.filter(event=event, paid=True)
        if date_from:
            regs = regs.filter(registered_at__date__gte=date_from)
        if date_to:
            regs = regs.filter(registered_at__date__lte=date_to)

        total_tickets = regs.count()
        total_revenue = sum(r.ticket_tier.price for r in regs)
        used_tickets  = regs.filter(used=True).count()

        buffer = StringIO()
        buffer.write('\ufeff')
        writer.writerow(["Tier", "Кол‑во билетов", "Выручка"])
        for tier_id, group in regs.values_list('ticket_tier__title', 'ticket_tier__price').distinct():
            count = regs.filter(ticket_tier__title=tier_id).count()
            rev   = count * dict(regs.values_list('ticket_tier__title','ticket_tier__price'))[tier_id]
            writer.writerow([tier_id, count, f"{rev:.2f}"])
        writer.writerow([])
        writer.writerow(["Итого", total_tickets, f"{total_revenue:.2f}"])

        csv_content = buffer.getvalue().encode('utf-8-sig')
        filename = f"report_event_{event_id}_{timezone.now().date()}.csv"

        report = EventReport.objects.create(
            event=event,
            total_tickets=total_tickets,
            total_revenue=total_revenue,
            used_tickets=used_tickets,
        )
        report.file.save(filename, ContentFile(csv_content))
        report.save()

        return Response({
            "id": report.id,
            "created_at": report.created_at,
            "file": request.build_absolute_uri(report.file.url),
        }, status=status.HTTP_201_CREATED)


from .models import EventReport
from .serializers import EventReportSerializer

class OrganizerReportListView(APIView):
    permission_classes = [ IsAuthenticated, (IsAdminUser|IsOrganizer) ]

    def get(self, request, event_id):
        try:
            event = Event.objects.get(pk=event_id)
        except Event.DoesNotExist:
            return Response({"detail":"Event not found"}, status=404)
        user = request.user
        if event.organizer != request.user and not user.is_staff :
            return Response({"detail":"Forbidden"}, status=403)

        qs = EventReport.objects.filter(event=event).order_by('-created_at')
        serializer = EventReportSerializer(qs, many=True, context={'request':request})
        return Response(serializer.data)

class AdminReportListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        qs = EventReport.objects.all().order_by('-created_at')
        serializer = EventReportSerializer(qs, many=True, context={'request':request})
        return Response(serializer.data)
