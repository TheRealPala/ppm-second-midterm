from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Reservation, Event
from .serializers import ReservationSerializer
from rest_framework import serializers


class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

    def perform_create(self, serializer):
        event = serializer.validated_data['event']
        tickets = serializer.validated_data['tickets']

        if event.available_tickets < tickets:
            raise serializers.ValidationError("Not enough tickets available")

        event.available_tickets -= tickets
        event.save()

        serializer.save()

    @action(detail=True, methods=['post'])
    def pay(self, request, pk=None):
        reservation = self.get_object()

        if reservation.paid:
            return Response({'detail': 'Reservation already paid'}, status=status.HTTP_400_BAD_REQUEST)

        reservation.paid = True
        reservation.save()

        return Response({'detail': 'Payment successful'}, status=status.HTTP_200_OK)
