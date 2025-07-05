# reservations/serializers.py
from rest_framework import serializers
from .models import Reservation


class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = '__all__'

    def create(self, validated_data):
        event = validated_data['event']

        tickets = validated_data['tickets']

        if event.available_tickets < tickets:
            raise serializers.ValidationError("Not enough tickets available")

        event.available_tickets -= tickets
        event.save()

        return super().create(validated_data)

    def update(self, instance, validated_data):
        event = instance.event
        old_tickets = instance.tickets
        new_tickets = validated_data.get('tickets', old_tickets)

        if instance.paid:
            raise serializers.ValidationError("Cannot modify a paid reservation")

        delta = new_tickets - old_tickets

        if delta > 0 and event.available_tickets < delta:
            raise serializers.ValidationError("Not enough tickets available for this update")

        event.available_tickets -= delta
        event.save()

        return super().update(instance, validated_data)
