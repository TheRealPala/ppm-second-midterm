from rest_framework import permissions


class IsSelfOrAdmin(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff or request.user.is_superuser:
            return True
        return obj == request.user

    def has_permission(self, request, view):
        if request.method in ['POST']:
            return request.user.is_staff or request.user.is_superuser
        return True
