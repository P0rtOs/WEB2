from rest_framework import serializers
from .models import EventReport

class EventReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventReport
        fields = ('id', 'event', 'created_at', 'format', 'file')
        read_only_fields = ('id','created_at')
