from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Reservation
from .permissions import IsOwner
from .serializers import ReservationSerializer
from rest_framework import serializers
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS, BasePermission


class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Reservation.objects.all()
        return Reservation.objects.filter(user=user)

    def perform_create(self, serializer):
        event = serializer.validated_data['event']
        tickets = serializer.validated_data['tickets']

        if event.available_tickets < tickets:
            raise serializers.ValidationError("Not enough tickets available")

        event.available_tickets -= tickets
        event.save()

        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def pay(self, request, pk=None):
        reservation = self.get_object()

        if reservation.paid:
            return Response({'detail': 'Reservation already paid'}, status=status.HTTP_400_BAD_REQUEST)

        reservation.paid = True
        reservation.save()

        return Response({'detail': 'Payment successful'}, status=status.HTTP_200_OK)
