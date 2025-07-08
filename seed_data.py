import os
from datetime import timedelta

import django
from django.contrib.auth import get_user_model
from django.utils.timezone import now

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ticketing_system.settings")
django.setup()

from events.models import Event
from reservations.models import Reservation

User = get_user_model()

def run():
    try:
        if User.objects.exists():
            User.objects.all().delete()

        if Event.objects.exists() or Reservation.objects.exists():
            Event.objects.all().delete()
            Reservation.objects.all().delete()

        User.objects.create_superuser(username="staff", password="staff", email="staff@ticketinSystem.com",
                                      is_staff=True, is_superuser=True, first_name="Staff", last_name="User",
                                      birth_date="1990-01-01")

        user1 = User.objects.create_user(username="user1", password="user1", email="user1@ticketinSystem.com",
                                         is_staff=False, is_superuser=False, first_name="User1", last_name="Base User",
                                         birth_date="1991-02-02")

        user2 = User.objects.create_user(username="user2", password="user2", email="user2@ticketinSystem.com",
                                         is_staff=False, is_superuser=False, first_name="User2", last_name="Base User",
                                         birth_date="1992-03-03")

        event1 = Event.objects.create(title="Rock in Roma", location="Stadio Olimpico, Roma",
                                      date=now() + timedelta(days=7),
                                      available_tickets=300)

        event2 = Event.objects.create(title="Opera", location="Teatro La Scala, Milano ",
                                      date=now() + timedelta(days=14),
                                      available_tickets=250)

        event3 = Event.objects.create(title="Decibel Festival", location="Kozel Carroponte, Milano ",
                                      date=now() + timedelta(days=21),
                                      available_tickets=500)

        Reservation.objects.create(user=user1, event=event1, tickets=2, paid=True)
        Reservation.objects.create(user=user2, event=event1, tickets=3, paid=False)
        Reservation.objects.create(user=user2, event=event2, tickets=4, paid=True)
        Reservation.objects.create(user=user1, event=event3, tickets=10, paid=False)

    except Exception as e:
        print(f"An error occurred while seeding data: {e}")


if __name__ == '__main__':
    run()
