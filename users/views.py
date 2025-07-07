# users/views.py
from rest_framework import viewsets, status
from rest_framework.response import Response

from .models import CustomUser
from .permissions import IsSelfOrAdmin
from .serializers import CustomUserSerializer


class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsSelfOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return CustomUser.objects.all()
        return CustomUser.objects.filter(id=user.id)

    def destroy(self, request, *args, **kwargs):
        try:
            user = self.get_object()
            user.delete()

            return Response(
                {"detail": "User deleted successfully."},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"detail": "Error during delete: " + str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )