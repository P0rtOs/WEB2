# C:/Users/Fr0ndeur/Desktop/3_year_2_semestr/WEB2/backend/model/events/serializers.py
from rest_framework import serializers
from .models import Event, TicketTier
import json

class TicketTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketTier
        fields = ('id', 'title', 'description', 'price')

class EventSerializer(serializers.ModelSerializer):
    # Делаем вложенный сериализатор для ticket_tiers (необязательный)
    ticket_tiers = TicketTierSerializer(many=True, required=False)

    class Meta:
        model = Event
        fields = '__all__'

    def create(self, validated_data):
        ticket_data = validated_data.pop('ticket_tiers', [])
        # Если ticket_data — строка, пытаемся распарсить JSON
        if isinstance(ticket_data, str):
            try:
                ticket_data = json.loads(ticket_data)
            except Exception:
                ticket_data = []
        event = Event.objects.create(**validated_data)
        for ticket in ticket_data:
            TicketTier.objects.create(event=event, **ticket)
        return event
