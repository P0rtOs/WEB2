import json
from rest_framework import serializers
from .models import Event, TicketTier

import json
from rest_framework import serializers
from .models import Event, TicketTier

class TicketTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketTier
        fields = ('id', 'title', 'description', 'price')

class TicketTierJSONField(serializers.Field):
    def to_internal_value(self, data):
        # Если получаем строку, пытаемся распарсить JSON
        if isinstance(data, str):
            try:
                return json.loads(data)
            except Exception:
                raise serializers.ValidationError("Invalid JSON format for ticket_tiers.")
        return data

    def to_representation(self, value):
        # value — это связанный менеджер (queryset), сериализуем его стандартным способом
        return TicketTierSerializer(value, many=True).data

class EventSerializer(serializers.ModelSerializer):
    # Используем наше кастомное поле вместо TicketTierSerializer напрямую
    ticket_tiers = TicketTierJSONField(required=False)

    class Meta:
        model = Event
        fields = ('id', 'title', 'description', 'start_date', 'end_date', 'image', 'ticket_tiers')

    def create(self, validated_data):
        tiers_data = validated_data.pop('ticket_tiers', [])
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
