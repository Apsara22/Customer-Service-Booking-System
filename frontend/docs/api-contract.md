# API Contract

## Customer Service Booking System

**API Version:** `v1`
**Base URL:** `/api/v1`

This document defines the API contract used by the Customer Service Booking System.

The frontend is designed against this contract so that the current mock API can later be replaced with a real backend without requiring major changes to the UI.

---

# 1. API Design Principles

The API follows these principles:

* REST-style resource endpoints
* Versioned API routes
* JSON request and response bodies
* Consistent response structure
* Structured error codes
* Resource IDs in URL parameters
* Date-specific service availability
* Server-side booking validation
* Clear separation between API and UI logic

---

# 2. Common Response Structure

## Successful Response

Successful API requests return:

```json
{
  "success": true,
  "data": {}
}
```

The `data` property contains the requested resource or result.

---

## Error Response

Failed requests return:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message."
  }
}
```

The `code` field is intended for frontend logic, while `message` is intended for displaying useful information to the customer.

---

# 3. Services

## 3.1 Get Services

### Endpoint

```http
GET /api/v1/services
```

### Description

Returns a list of available services.

### Query Parameters

| Parameter  | Type   | Required | Description                           |
| ---------- | ------ | -------: | ------------------------------------- |
| `search`   | string |       No | Searches service name and description |
| `category` | string |       No | Filters services by category ID       |

### Example Request

```http
GET /api/v1/services
```

### Filtered Request

```http
GET /api/v1/services?category=cleaning
```

### Search Request

```http
GET /api/v1/services?search=home
```

### Example Response

```json
{
  "success": true,
  "data": [
    {
      "id": "service-001",
      "categoryId": "cleaning",
      "name": "Home Cleaning",
      "description": "Professional home cleaning service.",
      "price": 1500,
      "duration": 120,
      "isAvailable": true
    }
  ]
}
```

---

# 4. Get Service Details

## Endpoint

```http
GET /api/v1/services/:service_id
```

### Description

Returns detailed information about a specific service.

### Path Parameter

| Parameter    | Type   | Required | Description               |
| ------------ | ------ | -------: | ------------------------- |
| `service_id` | string |      Yes | Unique service identifier |

### Example

```http
GET /api/v1/services/service-001
```

### Example Response

```json
{
  "success": true,
  "data": {
    "id": "service-001",
    "categoryId": "cleaning",
    "name": "Home Cleaning",
    "description": "Professional home cleaning service.",
    "price": 1500,
    "duration": 120,
    "isAvailable": true
  }
}
```

---

# 5. Get Service Availability

## Endpoint

```http
GET /api/v1/services/:service_id/availability
```

### Description

Returns available time slots for a service on a selected date.

### Query Parameters

| Parameter | Type   | Required | Description                          |
| --------- | ------ | -------: | ------------------------------------ |
| `date`    | string |      Yes | Selected date in `YYYY-MM-DD` format |

### Example Request

```http
GET /api/v1/services/service-001/availability?date=2026-09-10
```

### Example Response

```json
{
  "success": true,
  "data": {
    "service_id": "service-001",
    "date": "2026-09-10",
    "slots": [
      {
        "id": "service-001-2026-09-10-09",
        "start_time": "09:00",
        "end_time": "11:00",
        "available": true
      },
      {
        "id": "service-001-2026-09-10-11",
        "start_time": "11:00",
        "end_time": "13:00",
        "available": true
      },
      {
        "id": "service-001-2026-09-10-14",
        "start_time": "14:00",
        "end_time": "16:00",
        "available": false
      }
    ]
  }
}
```

---

# 6. Create Booking

## Endpoint

```http
POST /api/v1/bookings
```

### Description

Creates a new service booking.

The API validates the service, date, customer, address, and selected time slot before creating the booking.

---

## Request Body

```json
{
  "service_id": "service-001",
  "slot_id": "service-001-2026-09-10-09",
  "date": "2026-09-10",
  "customer": {
    "id": "customer-001",
    "name": "John Doe",
    "phone": "9800000000"
  },
  "address": {
    "id": "address-001",
    "label": "Home",
    "address_line": "Kathmandu, Nepal"
  }
}
```

---

## Required Fields

| Field                  | Type   | Required |
| ---------------------- | ------ | -------: |
| `service_id`           | string |      Yes |
| `slot_id`              | string |      Yes |
| `date`                 | string |      Yes |
| `customer.id`          | string |      Yes |
| `customer.name`        | string |      Yes |
| `customer.phone`       | string |      Yes |
| `address.id`           | string |      Yes |
| `address.label`        | string |      Yes |
| `address.address_line` | string |      Yes |

---

## Successful Response

```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "booking-001",
      "booking_number": "BK-123456",
      "service": {
        "id": "service-001",
        "name": "Home Cleaning",
        "category": "cleaning"
      },
      "provider": {
        "id": "provider-001",
        "name": "Service Professional",
        "phone": "9800000000"
      },
      "scheduled_date": "2026-09-10",
      "start_time": "09:00",
      "end_time": "11:00",
      "slot_id": "service-001-2026-09-10-09",
      "status": "CONFIRMED",
      "price": 1500,
      "currency": "NPR",
      "duration": 120,
      "customer": {
        "id": "customer-001",
        "name": "John Doe",
        "phone": "9800000000"
      },
      "address": {
        "id": "address-001",
        "label": "Home",
        "address_line": "Kathmandu, Nepal"
      },
      "created_at": "2026-09-02T10:00:00.000Z"
    }
  }
}
```

---

# 7. Booking Validation

The API validates the booking request before creating a booking.

## Required Service

If `service_id` is missing:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_SERVICE",
    "message": "Service is required."
  }
}
```

---

## Required Slot

If `slot_id` is missing:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_SLOT",
    "message": "Time slot is required."
  }
}
```

---

## Required Date

If `date` is missing:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_DATE",
    "message": "Booking date is required."
  }
}
```

---

# 8. Service Not Found

If the requested service does not exist:

```json
{
  "success": false,
  "error": {
    "code": "SERVICE_NOT_FOUND",
    "message": "Service not found."
  }
}
```

---

# 9. Service Unavailable

If the service exists but is currently unavailable:

```json
{
  "success": false,
  "error": {
    "code": "SERVICE_UNAVAILABLE",
    "message": "This service is currently unavailable."
  }
}
```

---

# 10. Booking Conflict

If another booking already occupies the selected slot:

```json
{
  "success": false,
  "error": {
    "code": "BOOKING_CONFLICT",
    "message": "This time slot has already been booked. Please select another slot."
  }
}
```

### Conflict Rule

A booking conflicts when:

```text
Same Service
+
Same Date
+
Same Time Slot
+
Existing Booking is not CANCELLED
```

This validation is performed during booking creation.

---

# 11. Get Bookings

## Endpoint

```http
GET /api/v1/bookings
```

### Description

Returns bookings associated with the current customer.

### Example Response

```json
{
  "success": true,
  "data": [
    {
      "id": "booking-001",
      "booking_number": "BK-123456",
      "service": {
        "id": "service-001",
        "name": "Home Cleaning",
        "category": "cleaning"
      },
      "provider": {
        "id": "provider-001",
        "name": "Service Professional",
        "phone": "9800000000"
      },
      "scheduled_date": "2026-09-10",
      "start_time": "09:00",
      "end_time": "11:00",
      "slot_id": "service-001-2026-09-10-09",
      "status": "CONFIRMED",
      "price": 1500,
      "currency": "NPR",
      "duration": 120,
      "customer": {
        "id": "customer-001",
        "name": "John Doe",
        "phone": "9800000000"
      },
      "address": {
        "id": "address-001",
        "label": "Home",
        "address_line": "Kathmandu, Nepal"
      },
      "created_at": "2026-09-02T10:00:00.000Z"
    }
  ]
}
```

---

# 12. Empty Bookings Response

If the customer has no bookings:

```json
{
  "success": true,
  "data": []
}
```

The frontend should display an appropriate empty state rather than treating this as an API error.

Example UI behavior:

```text
No bookings yet.

Browse Services
```

---

# 13. Get Booking Details

## Endpoint

```http
GET /api/v1/bookings/:booking_id
```

### Description

Returns detailed information about a specific booking.

### Path Parameter

| Parameter    | Type   | Required |
| ------------ | ------ | -------: |
| `booking_id` | string |      Yes |

### Example

```http
GET /api/v1/bookings/booking-001
```

### Successful Response

```json
{
  "success": true,
  "data": {
    "id": "booking-001",
    "booking_number": "BK-123456",
    "service": {
      "id": "service-001",
      "name": "Home Cleaning",
      "category": "cleaning"
    },
    "provider": {
      "id": "provider-001",
      "name": "Service Professional",
      "phone": "9800000000"
    },
    "scheduled_date": "2026-09-10",
    "start_time": "09:00",
    "end_time": "11:00",
    "slot_id": "service-001-2026-09-10-09",
    "status": "CONFIRMED",
    "price": 1500,
    "currency": "NPR",
    "duration": 120
  }
}
```

---

# 14. Booking Not Found

If the booking does not exist:

```json
{
  "success": false,
  "error": {
    "code": "BOOKING_NOT_FOUND",
    "message": "Booking not found."
  }
}
```

The frontend should display a dedicated not-found state.

---

# 15. Invalid Booking ID

If the booking ID is missing or invalid:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_BOOKING_ID",
    "message": "Booking ID is required."
  }
}
```

---

# 16. Customer Model

The booking API uses the following customer structure:

```json
{
  "id": "customer-001",
  "name": "John Doe",
  "phone": "9800000000"
}
```

### Fields

| Field   | Type   | Description             |
| ------- | ------ | ----------------------- |
| `id`    | string | Customer identifier     |
| `name`  | string | Customer name           |
| `phone` | string | Customer contact number |

---

# 17. Address Model

The booking API uses:

```json
{
  "id": "address-001",
  "label": "Home",
  "address_line": "Kathmandu, Nepal"
}
```

### Fields

| Field          | Type   | Description        |
| -------------- | ------ | ------------------ |
| `id`           | string | Address identifier |
| `label`        | string | Address label      |
| `address_line` | string | Full address       |

---

# 18. Service Model

A service contains:

```json
{
  "id": "service-001",
  "categoryId": "cleaning",
  "name": "Home Cleaning",
  "description": "Professional home cleaning service.",
  "price": 1500,
  "duration": 120,
  "isAvailable": true
}
```

### Fields

| Field         | Type    | Description                  |
| ------------- | ------- | ---------------------------- |
| `id`          | string  | Service identifier           |
| `categoryId`  | string  | Category identifier          |
| `name`        | string  | Service name                 |
| `description` | string  | Service description          |
| `price`       | number  | Service price                |
| `duration`    | number  | Duration in minutes          |
| `isAvailable` | boolean | Current service availability |

---

# 19. Availability Slot Model

Each available time slot contains:

```json
{
  "id": "service-001-2026-09-10-09",
  "start_time": "09:00",
  "end_time": "11:00",
  "available": true
}
```

### Fields

| Field        | Type    | Description                    |
| ------------ | ------- | ------------------------------ |
| `id`         | string  | Unique slot identifier         |
| `start_time` | string  | Slot start time                |
| `end_time`   | string  | Slot end time                  |
| `available`  | boolean | Whether the slot can be booked |

---

# 20. Booking Status

The booking status can be one of:

```text
CONFIRMED
PENDING
COMPLETED
CANCELLED
```

### Status Meaning

| Status      | Meaning                                 |
| ----------- | --------------------------------------- |
| `CONFIRMED` | Booking has been successfully confirmed |
| `PENDING`   | Booking is waiting for confirmation     |
| `COMPLETED` | Service has been completed              |
| `CANCELLED` | Booking has been cancelled              |

---

# 21. HTTP Method Summary

| Method | Endpoint                                    | Purpose               |
| ------ | ------------------------------------------- | --------------------- |
| GET    | `/api/v1/services`                          | Get services          |
| GET    | `/api/v1/services/:service_id`              | Get service details   |
| GET    | `/api/v1/services/:service_id/availability` | Get available slots   |
| POST   | `/api/v1/bookings`                          | Create booking        |
| GET    | `/api/v1/bookings`                          | Get customer bookings |
| GET    | `/api/v1/bookings/:booking_id`              | Get booking details   |

---

# 22. Error Code Summary

| Error Code            | Meaning                                       |
| --------------------- | --------------------------------------------- |
| `SERVICE_NOT_FOUND`   | Requested service does not exist              |
| `SERVICE_UNAVAILABLE` | Service cannot currently be booked            |
| `BOOKING_NOT_FOUND`   | Requested booking does not exist              |
| `BOOKING_CONFLICT`    | Selected slot has already been booked         |
| `INVALID_SERVICE`     | Service information is missing or invalid     |
| `INVALID_SLOT`        | Selected slot is missing or invalid           |
| `INVALID_DATE`        | Booking date is missing or invalid            |
| `INVALID_CUSTOMER`    | Customer information is missing or incomplete |
| `INVALID_ADDRESS`     | Address information is missing or incomplete  |

---

# 23. Frontend API Layer

The React components do not directly communicate with the mock database.

The expected flow is:

```text
React Component
      ↓
API Service
      ↓
Mock API
      ↓
Mock Data / Mock Database
```

For example:

```text
BookingDetails.tsx
      ↓
getBookingById()
      ↓
bookingApi.ts
      ↓
mockApi.getBookingById()
      ↓
mockBookings
```

This keeps the UI independent from the data source.

---

# 24. Future Production Implementation

The current implementation uses a mock API, but the API contract is designed so that the mock layer can later be replaced by a real backend.

Current:

```text
React
  ↓
bookingApi.ts
  ↓
mockApi.ts
```

Future:

```text
React
  ↓
bookingApi.ts
  ↓
HTTP Client
  ↓
Backend REST API
  ↓
Database
```

The React components should not need to know whether the backend is mocked or real.

---

# 25. Contract Goals

This API contract is designed to provide:

* Clear resource boundaries
* Predictable request and response structures
* Consistent error handling
* Type-safe frontend integration
* Realistic booking behavior
* Easy mock-to-production migration
* Separation between UI and backend implementation

The API contract serves as the foundation for the frontend architecture and ensures that the Customer Service Booking System can evolve from a mock implementation into a production backend integration.
