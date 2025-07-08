#!/bin/sh

python manage.py makemigrations
python manage.py migrate
exec gunicorn ticketing_system.wsgi --bind 0.0.0.0:$PORT
