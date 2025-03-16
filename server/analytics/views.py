from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions

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
