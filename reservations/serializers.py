# reservations/serializers.py
from rest_framework import serializers
from .models import Reservation


class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = '__all__'

    def validate(self, data):
        event = data.get('event')
        tickets = data.get('tickets')
        if event.available_tickets < tickets:
            raise serializers.ValidationError("Not enough tickets available")
        return data
