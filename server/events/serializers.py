import json
from rest_framework import serializers
from .models import Event, Registration, TicketTier, Speaker, Sponsor, ProgramItem

class NestedListField(serializers.Field):
    def __init__(self, child_serializer, **kwargs):
        super().__init__(**kwargs)
        self.child_serializer = child_serializer

    def to_internal_value(self, data):
        # JSON coming as string from FormData
        if isinstance(data, str):
            try:
                return json.loads(data)
            except json.JSONDecodeError:
                raise serializers.ValidationError("Invalid JSON.")
        if isinstance(data, list):
            return data
        raise serializers.ValidationError("Expected a list of items.")

    def to_representation(self, value):
        # value is a queryset or list of model-instances
        return self.child_serializer(value, many=True).data

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
    ticket_tiers   = NestedListField(child_serializer=TicketTierSerializer, required=False)
    speakers       = NestedListField(child_serializer=SpeakerSerializer,  required=False)
    sponsors       = NestedListField(child_serializer=SponsorSerializer,  required=False)
    program_items  = NestedListField(child_serializer=ProgramItemSerializer, required=False)
    organizer      = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Event
        fields = (
            'id','title','description','location','start_date','end_date','image',
            'ticket_tiers','speakers','sponsors','program_items','organizer'
        )

    def create(self, validated_data):
        tiers_data      = validated_data.pop('ticket_tiers',    [])
        speakers_data   = validated_data.pop('speakers',        [])
        sponsors_data   = validated_data.pop('sponsors',        [])
        program_data    = validated_data.pop('program_items',   [])

        event           = Event.objects.create(**validated_data)
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
        tiers     = validated_data.pop('ticket_tiers', None)
        spk_data  = validated_data.pop('speakers',     None)
        spon_data = validated_data.pop('sponsors',     None)
        prog_data = validated_data.pop('program_items',None)

        # базовое обновление полей Event
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        instance.save()

        if tiers is not None:
            instance.ticket_tiers.all().delete()
            for t in tiers:
                TicketTier.objects.create(event=instance, **t)

        if spk_data is not None:
            instance.speakers.clear()
            for sp in spk_data:
                obj, _ = Speaker.objects.get_or_create(**sp)
                instance.speakers.add(obj)

        if spon_data is not None:
            instance.sponsors.clear()
            for s in spon_data:
                obj, _ = Sponsor.objects.get_or_create(**s)
                instance.sponsors.add(obj)

        if prog_data is not None:
            instance.program_items.clear()
            for p in prog_data:
                obj, _ = ProgramItem.objects.get_or_create(**p)
                instance.program_items.add(obj)

        return instance

class RegistrationSerializer(serializers.ModelSerializer):
    event       = EventSerializer(read_only=True)
    ticket_tier = TicketTierSerializer(read_only=True)
    class Meta:
        model = Registration
        fields = ('id','event','ticket_tier','registered_at','paid')
        read_only_fields = ('registered_at','paid')