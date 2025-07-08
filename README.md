# Second Midterm PPM Project
Student: Alessandro Palano (Mat. 7111482)  
Project choosen: Ticket reservation system REST API  

## Introduction
This project includes a full Django backend which expose REST endpoints thanks to the Django Rest Framework.
It includes also a minimal client written in plain html, js, and css. There is also a link to a Postman Collection i published 
on a third-level domain of my own domain.
As DBMS, i choose to use PostgresSql, and, in order to follow the good practices, the project can be fully configured with env variables.  

<a href="https://ticket-api.palano.it" target="_blank">
<img src="https://run.pstmn.io/button.svg" alt="Run In Postman"
style="width: 128px; height: 32px;">
</a>  

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
- modify or delete it's user

Staff Users can:
- list, retrieve, add, modify and delete events,
- list, retrieve, add, modify and delete ALL the reservations,
- list, retrieve, add, modify and delete users

## Usage
The application expose the REST CLIENT in the root of the web server.  
The API Endpoints are available at `/api/`, the documentation is available [here](#Rest-Endpoints) or on [Postman](https://ticket-api.palano.it).  
The app has been deployed at this url: [https://ppm-second-midterm-production.up.railway.app/](https://ppm-second-midterm-production.up.railway.app/).  

As said before, for a basic usage, the client available [here](https://ppm-second-midterm-production.up.railway.app/) is more than enough.  
If you want to test each endpoint in a more detailed way, you can use the Postman collection available [here](https://ticket-api.palano.it).  
If you want to go with the Postman collection, the docs will teach you how to use it, but, as a summary, you have to add in the environment variables the username and the password of the user you want to impersonate, and then you can use the "login_check" endpoint to get the access token and the refresh token.
The Available Users are:

- Anonymous User: no username and password   
(the token is not required, so you have neither to fill the environment nor perform the login_check request)
- Base User 1 -> username: `user1`, password: `user1`,
- Base User 2 -> username: `user2`, password: `user2`,
- Staff User -> username: `staff`, password: `staff`.
## Rest Endpoints

### Authorization
In order to identify each user, the app use JWT tokens.
If you have a token, you have to send it in each http request (except for the login endpoint) by putting it in the HTTP header as Bearer Token.
If you want to impersonate Anonymous user, you have to not specify any token in the HTTP header.  
Endpoints:   
Login: if success get access token and refresh token

    Method: POST
    uri: /api/token  
    Content-type: multipart/form-data  
    payload: {
        "username": "username"
        "password": "password"
    }
    response: {
        "refresh": "refresh-token",
        "access": "access-token"
    }
Refresh access token:

    Method: POST
    uri: /api/token/refresh
    Content-type: multipart/form-data  
    payload: {
       "refresh": "refresh-token",
    }
    response: {
       "refresh": "refresh-token",
       "access": "access-token"
    }
### Events

List events

    Method: GET
    uri: /api/events/
    response: Array of Events

Retrieve an event

    Method: GET
    uri: /api/events/{id}/
    response: Event

List available events (the one with tickets left and not already happened)

    Method: GET
    uri: /api/events/availables/
    response: Array of Events

Insert a new Event

    Method: POST
    uri: /api/events/
    Content-type: application/json  
    payload: Event to add
    response: Event added

Delete an event

    Method: DELETE
    uri: /api/events/{id}/

Patch an event

    Method: PATCH
    uri: /api/events/{id}/
    Content-type: application/json  
    payload: Event to patch
    response: Event patched


### Reservations

List reservations

    Method: GET
    uri: /api/reservations/
    response: Array of Reservations

Retrieve a reservation

    Method: GET
    uri: /api/reservations/{id}/
    response: Reservation

Insert a new reservation

    Method: POST
    uri: /api/reservations/
    Content-type: application/json  
    payload: Reservation to add
    response: Reservation added

Pay a reservation

    Method: POST
    uri: /api/reservations/{id}/pay/

Delete a reservation

    Method: DELETE
    uri: /api/reservations/{id}/

Patch a reservation

    Method: PATCH
    uri: /api/reservations/{id}/
    Content-type: application/json  
    payload: Reservation to patch
    response: Reservation patched

### Users

List Users

    Method: GET
    uri: /api/users/
    response: Array of Users

Retrieve an user

    Method: GET
    uri: /api/users/{id}/
    response: User

Insert a new user

    Method: POST
    uri: /api/users/
    Content-type: application/json  
    payload: User to add
    response: User added


Delete an user

    Method: DELETE
    uri: /api/users/{id}/

Patch an user

    Method: PATCH
    uri: /api/users/{id}/
    Content-type: application/json  
    payload: User to patch
    response: User patched


