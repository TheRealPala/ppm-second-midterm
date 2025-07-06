from rest_framework import permissions


class IsAdmin(permissions.BasePermission):

    # Anonimi possono eseguire GET
    # Utenti normali possono eseguire GET
    # Superuser e staff possono eseguire tutto
    def has_permission(self, request, view):
        if request.method not in permissions.SAFE_METHODS:
            return request.user.is_staff or request.user.is_superuser
        return True
