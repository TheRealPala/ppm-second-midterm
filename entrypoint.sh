#!/bin/sh

python manage.py makemigrations
python manage.py migrate --noinput
python manage.py collectstatic --noinput
python seed_data.py
exec gunicorn ticketing_system.wsgi --bind 0.0.0.0:$PORT
