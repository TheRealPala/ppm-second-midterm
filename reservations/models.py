from django.core.validators import MinValueValidator
from django.db import models
from django.conf import settings
from events.models import Event


class Reservation(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='reservations')
    reserved_at = models.DateTimeField(auto_now_add=True)
    paid = models.BooleanField(default=False)
    tickets = models.PositiveIntegerField(
        validators=[MinValueValidator(1, message="Number of tickets must be greater than zero")]
    )

    def __str__(self):
        return f"{self.user} - {self.event}-num of tickets: {self.tickets}"
