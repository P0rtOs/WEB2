import json
from rest_framework import serializers
from .models import Event, TicketTier, Speaker, Sponsor, ProgramItem

class TicketTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketTier
        fields = ('id', 'title', 'description', 'price', 'ticket_type', 'tickets_remaining')

# Кастомое поле для обработки вложенного JSON из FormData
class TicketTierJSONField(serializers.Field):
    def to_internal_value(self, data):
        if isinstance(data, str):
            try:
                return json.loads(data)
            except Exception:
                raise serializers.ValidationError("Invalid JSON format for ticket_tiers.")
        return data

    def to_representation(self, value):
        return TicketTierSerializer(value, many=True).data


class SpeakerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Speaker
        fields = ('id', 'name', 'bio', 'photo')

class SponsorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sponsor
        fields = ('id', 'name', 'logo', 'website')

class ProgramItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramItem
        fields = ('id', 'title', 'description', 'start_time', 'end_time')

class EventSerializer(serializers.ModelSerializer):
    ticket_tiers = TicketTierJSONField(required=False)
    speakers = SpeakerSerializer(many=True, required=False)
    sponsors = SponsorSerializer(many=True, required=False)
    program_items = ProgramItemSerializer(many=True, required=False)
    organizer = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Event
        fields = ('id', 'title', 'description', 'location', 'start_date', 'end_date', 'image',
                  'ticket_tiers', 'speakers', 'sponsors', 'program_items', 'organizer')

    def create(self, validated_data):
        tiers_data = validated_data.pop('ticket_tiers', [])
        speakers_data = validated_data.pop('speakers', [])
        sponsors_data = validated_data.pop('sponsors', [])
        program_data = validated_data.pop('program_items', [])
        event = Event.objects.create(**validated_data)
        for tier in tiers_data:
            TicketTier.objects.create(event=event, **tier)
        for speaker in speakers_data:
            sp, _ = Speaker.objects.get_or_create(**speaker)
            event.speakers.add(sp)
        for sponsor in sponsors_data:
            sp, _ = Sponsor.objects.get_or_create(**sponsor)
            event.sponsors.add(sp)
        for item in program_data:
            pi, _ = ProgramItem.objects.get_or_create(**item)
            event.program_items.add(pi)
        return event

    def update(self, instance, validated_data):
        tiers_data = validated_data.pop('ticket_tiers', None)
        speakers_data = validated_data.pop('speakers', None)
        sponsors_data = validated_data.pop('sponsors', None)
        program_data = validated_data.pop('program_items', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if tiers_data is not None:
            instance.ticket_tiers.all().delete()
            for tier in tiers_data:
                TicketTier.objects.create(event=instance, **tier)
        # При необходимости обновите связи для speakers, sponsors, program_items
        return instance

# class RegistrationSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Registration
#         fields = ('id', 'event', 'participant', 'ticket_tier', 'registered_at')
#         read_only_fields = ('id', 'participant', 'registered_at')