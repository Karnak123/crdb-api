# crdb-api

## Endpoints
1. [GET /events] - List all events
2. [GET /events/creator] - Get event by creator (send email in req body)
3. [GET /events/tag] - Get event by tag (send tag in req body)
4. [GET /events/type] - Get event by type (send type in req body)
5. [GET /events/location] - Get event by location (send location in req body)
6. [POST /add] - Add event (send creator, name, description, start_time, end_time, location, url, and tags(array) in req body)
7. [POST /update] - Update event (send id, name, description, start_time, end_time, location, url, and tags(array) in req body)
8. [GET /delete] - Delete event (send id in req body)
