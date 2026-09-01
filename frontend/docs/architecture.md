# API Contract

## 1. Overview

The Customer Service Booking System uses a REST-style API contract between the frontend application and the backend/mock API.

The frontend communicates with the API through an API service layer. The React components do not directly access the mock API or HTTP implementation.

### API Base URL

```text
/api/v1
```

### Response Format

Successful responses use:

```json
{
  "success": true,
  "data": {}
}
```

Error responses use:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

---

# 2. API Endpoints

| Method | Endpoint                                     | Purpose                                 |
| ------ | -------------------------------------------- | --------------------------------------- |
| GET    | `/api/v1/services`                           | Retrieve available services             |
| GET    | `/api/v1/services/{service_id}`              | Retrieve service details                |
| GET    | `/api/v1/services/{service_id}/availability` | Retrieve available dates and time slots |
| POST   | `/api/v1/bookings`                           | Create a new booking                    |
| GET    | `/api/v1/bookings`                           | Retrieve customer's bookings            |
| GET    | `/api/v1/bookings/{booking_id}`              | Retrieve booking details                |

---

# 3. GET /api/v1/services

Retrieves the list of services available for booking.

## Request

### Method

```http
GET
```

### Endpoint

```text
/api/v1/services
```

### Query Parameters

| Parameter  | Type   | Required | Description                            |
| ---------- | ------ | -------- | -------------------------------------- |
| `search`   | string | No       | Search services by name or description |
| `category` | string | No       | Filter services by category            |

### Example

```http
GET /api/v1/services?search=cleaning&category=Home
```

## Successful Response

### Status

```text
200 OK
```

### Response Body

```json
{
  "success": true,
  "data": {
    "services": [
      {
        "id": "service_001",
        "name": "Home Cleaning",
        "description": "Professional home cleaning service.",
        "category": "Home",
        "provider": {
          "id": "provider_001",
          "name": "CleanPro Services"
        },
        "price": 1500,
        "currency": "NPR",
        "duration": 120,
        "rating": 4.8
      }
    ],
    "total": 1
  }
}
```

## Empty Response

If no services match the search/filter:

### Status

```text
200 OK
```

### Response

```json
{
  "success": true,
  "data": {
    "services": [],
    "total": 0
  }
}
```

The frontend should display an appropriate empty state instead of treating this as an API error.

## Error Response

### Status

```text
500 Internal Server Error
```

```json
{
  "success": false,
  "error": {
    "code": "SERVER_ERROR",
    "message": "Unable to retrieve services."
  }
}
```

---

# 4. GET /api/v1/services/{service_id}

Retrieves detailed information about a specific service.

## Request

### Method

```http
GET
```

### Endpoint

```text
/api/v1/services/{service_id}
```

### Path Parameter

| Parameter    | Type   | Required | Description               |
| ------------ | ------ | -------- | ------------------------- |
| `service_id` | string | Yes      | Unique service identifier |

### Example

```http
GET /api/v1/services/service_001
```

## Successful Response

### Status

```text
200 OK
```

### Response Body

```json
{
  "success": true,
  "data": {
    "id": "service_001",
    "name": "Home Cleaning",
    "description": "Professional home cleaning service for houses and apartments.",
    "category": "Home",
    "provider": {
      "id": "provider_001",
      "name": "CleanPro Services"
    },
    "price": 1500,
    "currency": "NPR",
    "duration": 120,
    "rating": 4.8,
    "availability": {
      "available": true
    }
  }
}
```

## Service Not Found

### Status

```text
404 Not Found
```

```json
{
  "success": false,
  "error": {
    "code": "SERVICE_NOT_FOUND",
    "message": "The requested service was not found."
  }
}
```

---

# 5. GET /api/v1/services/{service_id}/availability

Retrieves available dates and time slots for a service.

## Request

### Method

```http
GET
```

### Endpoint

```text
/api/v1/services/{service_id}/availability
```

### Path Parameter

| Parameter    | Type   | Required | Description               |
| ------------ | ------ | -------- | ------------------------- |
| `service_id` | string | Yes      | Unique service identifier |

### Query Parameters

| Parameter | Type   | Required | Description                           |
| --------- | ------ | -------- | ------------------------------------- |
| `date`    | string | Yes      | Requested date in `YYYY-MM-DD` format |

### Example

```http
GET /api/v1/services/service_001/availability?date=2026-09-10
```

## Successful Response

### Status

```text
200 OK
```

### Response

```json
{
  "success": true,
  "data": {
    "service_id": "service_001",
    "date": "2026-09-10",
    "slots": [
      {
        "id": "slot_001",
        "start_time": "09:00",
        "end_time": "11:00",
        "available": true
      },
      {
        "id": "slot_002",
        "start_time": "11:30",
        "end_time": "13:30",
        "available": true
      },
      {
        "id": "slot_003",
        "start_time": "14:00",
        "end_time": "16:00",
        "available": false
      }
    ]
  }
}
```

## Empty Availability

If there are no available slots:

### Status

```text
200 OK
```

```json
{
  "success": true,
  "data": {
    "service_id": "service_001",
    "date": "2026-09-10",
    "slots": []
  }
}
```

The frontend should display:

```text
No available time slots for this date.
```

## Service Not Found

### Status

```text
404 Not Found
```

```json
{
  "success": false,
  "error": {
    "code": "SERVICE_NOT_FOUND",
    "message": "The requested service was not found."
  }
}
```

## Invalid Date

### Status

```text
400 Bad Request
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The requested date is invalid.",
    "details": {
      "date": "Date must use YYYY-MM-DD format."
    }
  }
}
```

---

# 6. POST /api/v1/bookings

Creates a new service booking.

## Request

### Method

```http
POST
```

### Endpoint

```text
/api/v1/bookings
```

### Request Body

```json
{
  "service_id": "service_001",
  "slot_id": "slot_001",
  "date": "2026-09-10",
  "customer": {
    "id": "customer_001",
    "name": "John Doe",
    "phone": "9800000000"
  },
  "address": {
    "id": "address_001",
    "label": "Home",
    "address_line": "Kathmandu, Nepal"
  }
}
```

## Request Fields

| Field                  | Type   | Required | Description                |
| ---------------------- | ------ | -------- | -------------------------- |
| `service_id`           | string | Yes      | Service being booked       |
| `slot_id`              | string | Yes      | Selected availability slot |
| `date`                 | string | Yes      | Booking date               |
| `customer.id`          | string | Yes      | Customer identifier        |
| `customer.name`        | string | Yes      | Customer name              |
| `customer.phone`       | string | Yes      | Customer phone number      |
| `address.id`           | string | Yes      | Address identifier         |
| `address.label`        | string | Yes      | Address label              |
| `address.address_line` | string | Yes      | Service address            |

## Successful Response

### Status

```text
201 Created
```

### Response

```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "booking_001",
      "booking_number": "BK-20260910-001",
      "service": {
        "id": "service_001",
        "name": "Home Cleaning"
      },
      "provider": {
        "id": "provider_001",
        "name": "CleanPro Services"
      },
      "scheduled_at": "2026-09-10T09:00:00",
      "status": "CONFIRMED",
      "price": 1500,
      "currency": "NPR",
      "duration": 120,
      "customer": {
        "id": "customer_001",
        "name": "John Doe"
      },
      "address": {
        "id": "address_001",
        "label": "Home",
        "address_line": "Kathmandu, Nepal"
      }
    }
  }
}
```

---

# 7. Booking Validation Errors

If required booking information is missing or invalid:

### Status

```text
400 Bad Request
```

### Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please correct the booking information.",
    "details": {
      "service_id": "Service is required.",
      "date": "Date is required.",
      "slot_id": "Time slot is required.",
      "address_id": "Address is required."
    }
  }
}
```

The frontend should display field-level validation messages where appropriate.

---

# 8. Booking Conflict

A selected slot may become unavailable between availability checking and booking confirmation.

This must be treated as a business conflict rather than a validation error.

### Status

```text
409 Conflict
```

### Response

```json
{
  "success": false,
  "error": {
    "code": "SLOT_UNAVAILABLE",
    "message": "The selected time slot is no longer available."
  }
}
```

The frontend should:

1. Display the conflict message.
2. Keep the user's booking information where possible.
3. Refresh availability.
4. Allow the customer to select another slot.

---

# 9. Service Unavailable

If a service is no longer available for booking:

### Status

```text
409 Conflict
```

```json
{
  "success": false,
  "error": {
    "code": "SERVICE_UNAVAILABLE",
    "message": "This service is currently unavailable for booking."
  }
}
```

---

# 10. Server Error During Booking

### Status

```text
500 Internal Server Error
```

```json
{
  "success": false,
  "error": {
    "code": "SERVER_ERROR",
    "message": "Unable to create the booking. Please try again."
  }
}
```

The frontend should provide a retry action.

---

# 11. GET /api/v1/bookings

Retrieves bookings belonging to the current customer.

## Request

### Method

```http
GET
```

### Endpoint

```text
/api/v1/bookings
```

No request body is required.

## Successful Response

### Status

```text
200 OK
```

### Response

```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "booking_001",
        "booking_number": "BK-20260910-001",
        "service": {
          "id": "service_001",
          "name": "Home Cleaning"
        },
        "provider": {
          "id": "provider_001",
          "name": "CleanPro Services"
        },
        "scheduled_at": "2026-09-10T09:00:00",
        "status": "CONFIRMED",
        "price": 1500,
        "currency": "NPR"
      }
    ],
    "total": 1
  }
}
```

## Empty Response

### Status

```text
200 OK
```

```json
{
  "success": true,
  "data": {
    "bookings": [],
    "total": 0
  }
}
```

The frontend should display an appropriate empty state such as:

```text
You don't have any bookings yet.
```

---

# 12. GET /api/v1/bookings/{booking_id}

Retrieves details for a specific booking.

## Request

### Method

```http
GET
```

### Endpoint

```text
/api/v1/bookings/{booking_id}
```

### Path Parameter

| Parameter    | Type   | Required | Description               |
| ------------ | ------ | -------- | ------------------------- |
| `booking_id` | string | Yes      | Unique booking identifier |

### Example

```http
GET /api/v1/bookings/booking_001
```

## Successful Response

### Status

```text
200 OK
```

### Response

```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "booking_001",
      "booking_number": "BK-20260910-001",
      "service": {
        "id": "service_001",
        "name": "Home Cleaning",
        "category": "Home"
      },
      "provider": {
        "id": "provider_001",
        "name": "CleanPro Services"
      },
      "scheduled_at": "2026-09-10T09:00:00",
      "status": "CONFIRMED",
      "price": 1500,
      "currency": "NPR",
      "duration": 120,
      "customer": {
        "id": "customer_001",
        "name": "John Doe",
        "phone": "9800000000"
      },
      "address": {
        "id": "address_001",
        "label": "Home",
        "address_line": "Kathmandu, Nepal"
      }
    }
  }
}
```

## Booking Not Found

### Status

```text
404 Not Found
```

```json
{
  "success": false,
  "error": {
    "code": "BOOKING_NOT_FOUND",
    "message": "The requested booking was not found."
  }
}
```

---

# 13. HTTP Status Code Summary

| Status | Meaning      | Usage                         |
| ------ | ------------ | ----------------------------- |
| `200`  | OK           | Successful GET requests       |
| `201`  | Created      | Successful booking creation   |
| `400`  | Bad Request  | Validation errors             |
| `404`  | Not Found    | Service/booking doesn't exist |
| `409`  | Conflict     | Slot/service unavailable      |
| `500`  | Server Error | Unexpected API failure        |

---

# 14. Common Error Codes

| Error Code            | HTTP Status | Description                              |
| --------------------- | ----------: | ---------------------------------------- |
| `VALIDATION_ERROR`    |         400 | Request contains invalid or missing data |
| `SERVICE_NOT_FOUND`   |         404 | Requested service doesn't exist          |
| `BOOKING_NOT_FOUND`   |         404 | Requested booking doesn't exist          |
| `SLOT_UNAVAILABLE`    |         409 | Selected slot is no longer available     |
| `SERVICE_UNAVAILABLE` |         409 | Service cannot currently be booked       |
| `SERVER_ERROR`        |         500 | Unexpected server-side failure           |

---

# 15. Loading Behaviour

Loading is a frontend state and is not represented by a special API response.

When an API request is in progress, the frontend should:

* Display an appropriate loading indicator.
* Prevent duplicate booking submissions.
* Disable the confirm button while a booking request is being submitted.
* Preserve already loaded information when possible.

Example:

```text
Loading services...
Loading availability...
Creating booking...
```

---

# 16. Empty Behaviour

An empty result is not considered an API failure.

Examples:

### Services

```json
{
  "success": true,
  "data": {
    "services": [],
    "total": 0
  }
}
```

Frontend:

```text
No services found.
```

### Availability

```json
{
  "success": true,
  "data": {
    "slots": []
  }
}
```

Frontend:

```text
No available time slots for this date.
```

### Bookings

```json
{
  "success": true,
  "data": {
    "bookings": [],
    "total": 0
  }
}
```

Frontend:

```text
You don't have any bookings yet.
```

---

# 17. Error Behaviour

The frontend should distinguish between different types of errors.

### Validation Error

Display the relevant validation message and allow the customer to correct the input.

### Not Found

Display a resource-not-found state and provide navigation back to the relevant list.

### Conflict

For a booking conflict:

```text
The selected time slot is no longer available.
Please select another time.
```

Availability should then be refreshed.

### Server Error

Display a user-friendly message and provide a retry option.

### Network/Technical Error

The API client should normalize technical failures into an application-level error format so that React components don't need to understand low-level HTTP errors.

---

# 18. API Layer Responsibility

React components must not directly implement API requests.

The intended flow is:

```text
React Component
       ↓
Feature Hook
       ↓
API Service
       ↓
API Client
       ↓
Mock API / Real Backend
```

For example:

```text
ServiceList
    ↓
useServices()
    ↓
serviceApi.getServices()
    ↓
apiClient.get()
    ↓
mockApi.getServices()
```

The Mock API can later be replaced by a real backend without requiring changes to the service-list components.

---

# 19. Mock API Requirements

The Mock API must reproduce the contract defined in this document.

It must:

* Return Promise-based responses.
* Simulate network latency.
* Return structured success responses.
* Return structured error responses.
* Validate requests.
* Simulate empty responses.
* Simulate server errors.
* Simulate booking conflicts.
* Maintain booking state.
* Keep mock data outside React components.

The Mock API is intended to behave like a backend, not simply return static arrays.

---

# 20. Contract Ownership

The API contract is the shared agreement between the frontend and backend.

The frontend will build against this contract even though the assignment uses a Mock API.

When a real backend is introduced, the API service layer should continue exposing the same application-facing functions:

```ts
getServices()
getServiceById(serviceId)
getAvailability(serviceId, date)
createBooking(bookingData)
getBookings()
getBookingById(bookingId)
```

This keeps the UI independent from the underlying API implementation.
