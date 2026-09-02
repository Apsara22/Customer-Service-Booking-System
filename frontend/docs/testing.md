# Testing Strategy

## Customer Service Booking System

This document describes the testing strategy for the Customer Service Booking System.

The goal is to verify that the application's core business flows work correctly and that important loading, validation, error, and conflict scenarios are handled safely.

---

# 1. Testing Goals

The testing strategy focuses on:

* Service listing
* Service search
* Category filtering
* Service details
* Service availability
* Booking validation
* Successful booking
* Booking conflicts
* My Bookings
* Booking Details
* Loading states
* Empty states
* Error states
* Authentication redirects

The tests should focus primarily on **user-visible behavior and business logic** rather than implementation details.

---

# 2. Testing Approach

The application can be tested at several levels:

```text
Unit Tests
    ↓
API / Business Logic Tests
    ↓
Component Tests
    ↓
Integration Tests
    ↓
End-to-End User Flow
```

Each level provides different confidence.

---

# 3. Unit Testing

Unit tests verify small pieces of functionality independently.

Potential unit-test targets include:

* API service functions
* Validation logic
* Utility functions
* Data transformations
* Error handling

Examples:

```text
getServiceById()
getBookings()
getBookingById()
createBooking()
```

---

# 4. API Service Testing

The API service layer should be tested independently from the UI.

For example:

```text
bookingApi.ts
```

should verify that:

* Successful responses return typed data.
* Failed responses throw `ApiError`.
* Missing IDs are rejected.
* API error codes are preserved.
* API error messages are preserved.

---

# 5. Service List Test Cases

## Test 1: Load Services Successfully

### Given

The mock API contains available services.

### When

The customer opens the Services page.

### Then

The application should:

* Show a loading state initially.
* Request services through the API service.
* Display the returned services.
* Stop displaying the loading state.

### Expected Result

Service cards are visible to the customer.

---

## Test 2: Search Services

### Given

Multiple services exist.

### When

The customer enters a search term.

### Then

The application should display services matching the search term.

### Expected Result

Only matching services are displayed.

---

## Test 3: Filter by Category

### Given

Services belong to different categories.

### When

The customer selects a category.

### Then

Only services belonging to that category should be displayed.

### Expected Result

The service list is filtered correctly.

---

## Test 4: Empty Service Results

### Given

The API returns an empty array.

```json
{
  "success": true,
  "data": []
}
```

### When

The customer searches for a service that does not exist.

### Then

The application should display an empty state.

### Expected Result

The customer sees a meaningful message instead of a blank page.

---

## Test 5: Service API Error

### Given

The API request fails.

### When

The Services page requests service data.

### Then

The application should display an error state.

### Expected Result

The customer receives a clear error message and, where appropriate, a retry action.

---

# 6. Service Details Test Cases

## Test 6: Load Service Details

### Given

A valid service ID exists.

### When

The customer opens:

```text
/services/:categoryId/:serviceId
```

### Then

The application should load the service using its ID.

### Expected Result

The service details page displays:

* Service name
* Description
* Category
* Price
* Duration
* Availability

---

## Test 7: Service Not Found

### Given

The service ID does not exist.

### When

The customer opens the service details page.

### Then

The API should return:

```text
SERVICE_NOT_FOUND
```

### Expected Result

The application displays an appropriate not-found message.

---

# 7. Availability Test Cases

## Test 8: Load Available Slots

### Given

A valid service and date are selected.

### When

The customer selects a date.

### Then

The application requests availability.

### Expected Result

Available time slots are displayed.

---

## Test 9: Display Unavailable Slot

### Given

A slot has already been booked.

### When

The customer loads availability for that date.

### Then

The slot should be returned as unavailable.

### Expected Result

The customer cannot select the unavailable slot.

---

## Test 10: Invalid Availability Request

### Given

A date is missing.

### When

The availability API is called.

### Then

The API should return:

```text
INVALID_DATE
```

### Expected Result

The frontend handles the error appropriately.

---

# 8. Booking Validation Tests

Booking validation is an important part of the application's business logic.

---

## Test 11: Missing Service

### Given

A booking request does not contain `service_id`.

### When

The customer confirms the booking.

### Then

The API should reject the request.

### Expected Error

```text
INVALID_SERVICE
```

---

## Test 12: Missing Time Slot

### Given

A booking request does not contain `slot_id`.

### When

The customer confirms the booking.

### Then

The API should reject the request.

### Expected Error

```text
INVALID_SLOT
```

---

## Test 13: Missing Date

### Given

The booking date is missing.

### When

The booking request is submitted.

### Then

The API should reject the request.

### Expected Error

```text
INVALID_DATE
```

---

## Test 14: Missing Customer

### Given

Customer information is missing.

### When

The booking request is submitted.

### Then

The API should reject the request.

### Expected Error

```text
INVALID_CUSTOMER
```

---

## Test 15: Incomplete Customer Information

### Given

Customer information is incomplete.

For example:

```json
{
  "id": "",
  "name": "",
  "phone": ""
}
```

### When

The booking is submitted.

### Then

The API should reject the request.

### Expected Error

```text
INVALID_CUSTOMER
```

---

## Test 16: Missing Address

### Given

The address is missing.

### When

The booking is submitted.

### Then

The API should reject the request.

### Expected Error

```text
INVALID_ADDRESS
```

---

## Test 17: Incomplete Address

### Given

The address is incomplete.

### When

The booking is submitted.

### Then

The API should reject the request.

### Expected Error

```text
INVALID_ADDRESS
```

---

# 9. Successful Booking Test

## Test 18: Create Booking Successfully

### Given

The request contains:

* Valid service
* Valid date
* Valid slot
* Valid customer
* Valid address
* Available time slot

### When

The customer confirms the booking.

### Then

The API should:

1. Validate the request.
2. Verify the service.
3. Verify the slot.
4. Check for conflicts.
5. Create the booking.
6. Add it to the mock database.
7. Return the created booking.

### Expected Result

The customer sees a booking confirmation.

---

# 10. Booking Persistence Test

## Test 19: Created Booking Appears in My Bookings

### Given

A booking has been successfully created.

### When

The customer opens My Bookings.

### Then

The newly created booking should be included in the response.

### Expected Result

The booking appears in the booking list.

---

# 11. Booking Details Test

## Test 20: Load Booking Details

### Given

A valid booking ID exists.

### When

The customer opens:

```text
/bookings/:bookingId
```

### Then

The application should request the booking using its ID.

### Expected Result

The booking details page displays:

* Booking number
* Service
* Provider
* Date
* Time
* Status
* Price
* Customer
* Address

---

# 12. Booking Not Found Test

## Test 21: Invalid Booking ID

### Given

The requested booking does not exist.

### When

The customer opens the booking details route.

### Then

The API should return:

```text
BOOKING_NOT_FOUND
```

### Expected Result

The application displays a booking-not-found state.

The page should not crash.

---

# 13. Booking Conflict Test

## Test 22: Prevent Double Booking

### Given

A time slot has already been booked.

### When

Another customer attempts to book the same:

```text
Service
+
Date
+
Slot
```

### Then

The API should reject the request.

### Expected Error

```text
BOOKING_CONFLICT
```

### Expected Result

The customer is informed that the slot is no longer available and can select another slot.

---

# 14. Cancelled Booking Conflict Rule

## Test 23: Cancelled Booking Does Not Block Slot

### Given

An existing booking has:

```text
status = CANCELLED
```

### When

Another customer attempts to book the same slot.

### Then

The cancelled booking should not be considered an active conflict.

### Expected Result

The slot can be booked again.

---

# 15. Empty My Bookings Test

## Test 24: Customer Has No Bookings

### Given

The bookings API returns:

```json
{
  "success": true,
  "data": []
}
```

### When

The customer opens My Bookings.

### Then

The application should display an empty state.

### Expected Result

Example:

```text
No bookings yet.

Browse Services
```

The empty response should not be treated as an error.

---

# 16. Loading State Tests

## Test 25: Services Loading State

### Given

The API request is still pending.

### When

The Services page is loading.

### Expected Result

A loading indicator or skeleton UI is displayed.

---

## Test 26: Booking Details Loading State

### Given

The booking details API request is pending.

### When

The Booking Details page loads.

### Expected Result

A loading skeleton or loading indicator is displayed.

---

# 17. Error State Tests

## Test 27: Temporary API Error

### Given

The API returns an unexpected server error.

### When

The page requests data.

### Expected Result

The application displays a user-friendly error state.

Where appropriate, the customer can retry the request.

---

# 18. Authentication Tests

## Test 28: Unauthenticated Customer

### Given

No `customer` session exists in local storage.

### When

The customer opens a protected route.

Example:

```text
/bookings
```

### Expected Result

The customer is redirected to:

```text
/login
```

---

## Test 29: Authenticated Customer Opens Login

### Given

A customer session exists.

### When

The customer navigates to:

```text
/login
```

### Expected Result

The customer is redirected to:

```text
/services
```

---

## Test 30: Logout

### Given

The customer is authenticated.

### When

The customer selects Logout.

### Then

The application should:

1. Remove the customer session.
2. Close the profile menu.
3. Redirect to `/login`.

### Expected Result

Protected pages are no longer accessible without logging in again.

---

# 19. Navigation Tests

The application should verify the main customer navigation flow.

```text
Login
  ↓
Services
  ↓
Service Details
  ↓
Booking
  ↓
Confirmation
  ↓
My Bookings
  ↓
Booking Details
```

### Expected Result

Each navigation step leads to the correct route and page.

---

# 20. Test Case Summary

| ID  | Area            | Scenario            | Expected Result             |
| --- | --------------- | ------------------- | --------------------------- |
| T01 | Services        | Load services       | Services displayed          |
| T02 | Services        | Search              | Matching services displayed |
| T03 | Services        | Category filter     | Filtered services displayed |
| T04 | Services        | Empty results       | Empty state displayed       |
| T05 | Services        | API error           | Error state displayed       |
| T06 | Service Details | Valid service       | Details displayed           |
| T07 | Service Details | Invalid service     | Not-found state             |
| T08 | Availability    | Valid date          | Slots displayed             |
| T09 | Availability    | Booked slot         | Slot unavailable            |
| T10 | Availability    | Missing date        | Validation error            |
| T11 | Booking         | Missing service     | Validation error            |
| T12 | Booking         | Missing slot        | Validation error            |
| T13 | Booking         | Missing date        | Validation error            |
| T14 | Booking         | Missing customer    | Validation error            |
| T15 | Booking         | Invalid customer    | Validation error            |
| T16 | Booking         | Missing address     | Validation error            |
| T17 | Booking         | Invalid address     | Validation error            |
| T18 | Booking         | Valid booking       | Booking created             |
| T19 | Bookings        | Created booking     | Appears in list             |
| T20 | Booking Details | Valid ID            | Details displayed           |
| T21 | Booking Details | Invalid ID          | Not-found state             |
| T22 | Booking         | Double booking      | Conflict error              |
| T23 | Booking         | Cancelled booking   | Slot can be reused          |
| T24 | Bookings        | No bookings         | Empty state                 |
| T25 | UI              | Loading services    | Loading state               |
| T26 | UI              | Loading booking     | Loading state               |
| T27 | UI              | API failure         | Error state                 |
| T28 | Auth            | Unauthenticated     | Redirect to login           |
| T29 | Auth            | Authenticated login | Redirect to services        |
| T30 | Auth            | Logout              | Session removed             |

---

# 21. Manual Testing Checklist

Before submitting the assignment, manually verify the following.

## Authentication

```text
[ ] Register a customer
[ ] Login successfully
[ ] Customer name appears in Navbar
[ ] Customer email appears in profile menu
[ ] Logout works
[ ] Protected route redirects unauthenticated users
[ ] Login redirects authenticated users
```

## Services

```text
[ ] Categories display correctly
[ ] Service list loads
[ ] Search works
[ ] Category filter works
[ ] Service details open correctly
[ ] Unavailable service is handled
[ ] Empty state displays correctly
[ ] Error state displays correctly
```

## Booking

```text
[ ] Select a service
[ ] Select a date
[ ] Availability loads
[ ] Available slots can be selected
[ ] Booked slots are disabled
[ ] Customer information is valid
[ ] Address information is valid
[ ] Booking summary is correct
[ ] Booking can be confirmed
[ ] Confirmation displays correctly
```

## Booking Conflicts

```text
[ ] Book a slot
[ ] Return to availability
[ ] Previously booked slot is unavailable
[ ] Attempt duplicate booking
[ ] BOOKING_CONFLICT is handled
```

## My Bookings

```text
[ ] Created booking appears
[ ] Booking number is displayed
[ ] Service is displayed
[ ] Provider is displayed
[ ] Date is displayed
[ ] Time is displayed
[ ] Status is displayed
[ ] Price is displayed
[ ] Booking details open correctly
```

---

# 22. Testing Tools

The exact testing tools depend on the packages configured in `package.json`.

A React project may use tools such as:

```text
Vitest
React Testing Library
@testing-library/jest-dom
```

The selected testing tools should remain focused on testing application behavior rather than introducing unnecessary complexity.

---

# 23. Testing Principles

The testing strategy follows these principles:

### Test User Behavior

Tests should verify what the customer can see and do.

### Test Business Rules

Important booking rules should be tested independently.

### Test Failure Scenarios

The application should be tested not only for successful requests but also for:

* Validation errors
* Not-found resources
* Empty responses
* API failures
* Booking conflicts

### Keep Tests Isolated

Tests should not depend on the execution order of other tests.

### Avoid Testing Implementation Details

Tests should focus on behavior rather than internal React implementation.

---

# 24. Definition of Done

A feature is considered complete when:

```text
[ ] Main success scenario works
[ ] Loading state is handled
[ ] Empty state is handled where applicable
[ ] Error state is handled
[ ] Validation is implemented
[ ] Important business rules are tested
[ ] TypeScript build succeeds
[ ] Linting succeeds
[ ] Tests pass
[ ] Responsive behavior is verified
[ ] Documentation is updated
```

---

# 25. Final Testing Goal

The purpose of testing this application is not only to verify that the happy path works.

The testing strategy ensures that the application behaves predictably when:

```text
Data exists
Data is empty
Request is loading
Request fails
Resource does not exist
Input is invalid
Slot becomes unavailable
Booking conflicts occur
Customer is unauthenticated
```

This provides confidence that the Customer Service Booking System is reliable, maintainable, and ready to evolve beyond the mock API implementation.
