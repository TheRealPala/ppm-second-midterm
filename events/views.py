from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status
from django.utils.timezone import now
from .models import Event
from .permissions import IsAdmin
from .serializers import EventSerializer


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAdmin]

    @action(detail=False, methods=['get'], url_path='availables')
    def get_available_events(self, request):
        available_events = Event.objects.filter(date__gt=now(), available_tickets__gt=0)
        serializer = self.get_serializer(available_events, many=True)
        return Response(serializer.data)


    def destroy(self, request, *args, **kwargs):
        try:
            event = self.get_object()
            event.delete()

            return Response(
                {"detail": "Event deleted successfully."},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"detail": "Error during delete: " + str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )