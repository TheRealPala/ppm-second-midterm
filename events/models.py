from django.db import models


class Event(models.Model):
    title = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    date = models.DateTimeField()
    available_tickets = models.PositiveIntegerField()


    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['date', 'location'], name='unique_event_date_location')
        ]

    def __str__(self):
        return self.title
