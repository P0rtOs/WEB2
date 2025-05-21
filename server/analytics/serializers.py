from rest_framework import serializers
from .models import EventReport



class EventReportSerializer(serializers.ModelSerializer):
    file = serializers.FileField(read_only=True)

    class Meta:
        model = EventReport
        fields = (
            'id',
            'event',
            'created_at',
            'total_tickets',
            'total_revenue',
            'used_tickets',
            'file',
        )
        read_only_fields = (
            'id',
            'event',
            'created_at',
            'total_tickets',
            'total_revenue',
            'used_tickets',
            'file',
        )


class GenerateReportSerializer(serializers.Serializer):
    date_from = serializers.DateField(required=False)
    date_to   = serializers.DateField(required=False)