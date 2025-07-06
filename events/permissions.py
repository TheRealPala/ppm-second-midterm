from rest_framework import permissions


class IsAdmin(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method not in ['GET']:
            return request.user.is_staff or request.user.is_superuser
        return True
