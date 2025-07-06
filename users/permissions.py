from rest_framework import permissions

# Anonimi non possono fare nulla,
# Autenticati possono gestire solamente il loro utente [NON POSSONO ESEGUIRE POST]
# Superuser e staff possono fare tutto

class IsSelfOrAdmin(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff or request.user.is_superuser:
            return True
        return obj == request.user

    def has_permission(self, request, view):
        if request.method in ['POST']:
            return request.user.is_staff or request.user.is_superuser
        return request.user and request.user.is_authenticated
