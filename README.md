# Simple Reservation System

This project is a simple reservation system designed to facilitate the booking of a single table for two people in a restaurant.

## Project Goal

The goal of this reservation system is to provide a mechanism for reserving the only available table in the restaurant. Here are the key features:

- **Single Table Booking:**
  - Users can reserve the only available table in the restaurant for a specific date and time.
  
- **Time Slots:**
  - The calendar operates in one-hour time slots, resulting in 24 slots per day.
  
- **Booking Duration:**
  - The duration of a table reservation is set to 3 hours.
  
- **Two-Person Requirement:**
  - To confirm a table reservation, two users are required to book it together.

## Reservation Workflow

1. **User 1 Reservation:**
   - The first user creates a reservation event for a specific date and time.

2. **User 2 Confirmation:**
   - A second user can see partially occupied time slots and confirms the reservation, making the table booked.

3. **Additional Reservation by User 1:**
   - The first user can open another time slot, but the first available time will be three hours later, considering the 3-hour booking duration.

## Example:

- User 1 reserves a table for tomorrow at 12:00 PM.
- User 2 sees a partially filled slot for tomorrow at 12:00 PM and confirms the reservation.
- The table is considered booked for that time.

## Notes:

- User registration is not mandatory; users can be hardcoded for simplicity.
- Time zone considerations are essential, as users may be in different time zones.

Enjoy using the Simple Reservation System!

# How to run

### Setup a mongo db
```
docker compose up --build -d
```

### Build and Run server
```
npm install
``` 

```
npm run build
``` 

```
npm run start

``` 

# How to test

By default the app will run on 3000 port and will have `reserve` endpoint

you can use the following curl to test

```
curl --location 'localhost:3000/reserve' \
--header 'Content-Type: application/json' \
--data '{
    "tableNumber":1,
    "userId": 1,
    "dateTime": "Tue Dec 05 2023 23:00:08 GMT+0300"
}'
```