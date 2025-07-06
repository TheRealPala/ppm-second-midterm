from rest_framework.permissions import BasePermission


# Anonimi non possono fare nulla
# Autenticati possono gestire solamente le loro prenotazioni
# Super user e staff possono fare tutto

class IsOwner(BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.user and (request.user.is_staff or request.user.is_superuser):
            return True
        return obj.user == request.user
