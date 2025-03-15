import json
from rest_framework import serializers
from .models import Event, TicketTier

class TicketTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketTier
        fields = ('id', 'title', 'description', 'price')

class EventSerializer(serializers.ModelSerializer):
    ticket_tiers = TicketTierSerializer(many=True, required=False)

    class Meta:
        model = Event
        fields = ('id', 'title', 'description', 'start_date', 'end_date', 'image', 'ticket_tiers')

    def create(self, validated_data):
        tiers_data = validated_data.pop('ticket_tiers', [])
        # Если tiers_data передается как строка (JSON), попробуем распарсить
        if isinstance(tiers_data, str):
            try:
                tiers_data = json.loads(tiers_data)
            except Exception:
                tiers_data = []
        event = Event.objects.create(**validated_data)
        for tier in tiers_data:
            TicketTier.objects.create(event=event, **tier)
        return event

    def update(self, instance, validated_data):
        tiers_data = validated_data.pop('ticket_tiers', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if tiers_data is not None:
            instance.ticket_tiers.all().delete()
            for tier in tiers_data:
                TicketTier.objects.create(event=instance, **tier)
        return instance
