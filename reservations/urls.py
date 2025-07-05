from rest_framework import routers
from django.urls import path, include
from .views import ReservationViewSet

router = routers.DefaultRouter()
router.register(r'', ReservationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]