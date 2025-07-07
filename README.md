# Second Midterm PPM Project
Student: Alessandro Palano (Mat. 7111482)  
Project choosen: Ticket reservation system REST API  

## Introduction
This project includes a full Django backend which expose REST endpoints thanks to the Django Rest Framework.
It includes also a minimal client written in plain html, js, and css. There is also a link to a Postman Collection i published 
on a third-level domain of my own domain.
As DBMS, i choose to use PostgresSql, and, in order to follow the good practices, the project can be fully configured with env variables. 

## Entities
The project has three different apps, which are individually traduced in entities into the database:

- Users
- Events
- Reservations

### User
Has all the properties of the Django AbstractUser and the birth_date [dateTime].

### Event
Has the following properties: 
- title [string]
- description [text]
- location [string]
- date [dateTime]
- available_tickets [integer > 0]

### Reservation
Has the following properties:
- user [User]
- event [Event]
- reserved_at [DateTime] (the system fill this filed automatically)
- paid [boolean] (default = False)
- tickets [integer > 0]

## Generics Constraints And Behaviours
1) Two events with the same date and location
2) Once the Reservation is paid, is not possible neither to modify nor delete it.
3) If you delete a reservation or modify its tickets, the available_tickets of the event will be updated.

## Users
There are three type of users:
- Anonymous
- Base Users
- Staff Users

Anonymous users can:
- list and retrieve events.    

Base users can:
- list and retrieve events,
- add a new reservation
- list, retrieve, modify and delete only THEIR reservations  

Staff Users can:
- list, retrieve, add, modify and delete events,
- list, retrieve, add, modify and delete ALL the reservations,
- list, retrieve, add, modify and delete users

## Rest Endpoints

### Authorization

