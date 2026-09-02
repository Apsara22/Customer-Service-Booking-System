# Technical Decisions

This document records the main technical and architectural decisions made while developing the Customer Service Booking System.

The purpose is to explain **what was chosen, why it was chosen, and how the decision supports maintainability, scalability, and the requirements of the assignment.**

---

## 1. React + TypeScript + Vite

### Decision

The application is built using **React, TypeScript, and Vite**.

### Reason

React provides a component-based architecture that is suitable for building a multi-step customer booking workflow.

TypeScript provides:

* Static type checking
* Better developer experience
* Safer API data handling
* Better IDE support
* Reduced runtime errors
* Easier maintenance of shared data models

Vite provides:

* Fast development server
* Fast hot module replacement
* Modern production builds
* Simple React and TypeScript configuration

### Result

The project has a modern frontend foundation that can easily be extended as the application grows.

---

# 2. Feature-Oriented Application Structure

### Decision

Application code is separated according to responsibilities and business features rather than placing all code into large component files.

The project separates:

* API logic
* Components
* Pages/features
* Hooks
* Types
* Mock data
* Layout components

### Reason

The booking system contains several independent areas:

* Services
* Service details
* Booking
* My bookings
* Booking details
* Authentication
* Navigation

Separating responsibilities makes the code easier to locate, understand, test, and modify.

### Result

A change to booking functionality should not require modifying unrelated service-list or navigation logic.

---

# 3. API-First Development

### Decision

The frontend is designed around an API contract instead of directly depending on mock data.

The main API operations are:

```text
GET    /api/v1/services
GET    /api/v1/services/:service_id
GET    /api/v1/services/:service_id/availability

POST   /api/v1/bookings
GET    /api/v1/bookings
GET    /api/v1/bookings/:booking_id
```

### Reason

The assignment specifically requires API-first development.

The UI should not know whether the data comes from:

* A mock API
* A local backend
* A production REST API

For example:

```text
Component
    ↓
API Service
    ↓
Mock API
```

A real backend can later replace the mock implementation.

### Result

The frontend is less tightly coupled to the current mock data implementation.

---

# 4. Promise-Based Mock API

### Decision

A Promise-based mock API is used during development.

### Reason

The assignment requires a mock API while maintaining an API-first architecture.

The mock API simulates network behavior using an artificial delay.

Example:

```text
UI Request
    ↓
API Service
    ↓
Mock API
    ↓
Simulated Network Delay
    ↓
Response
```

The mock API supports:

* Successful requests
* Loading delays
* Empty responses
* Validation errors
* Not-found errors
* Service unavailable errors
* Booking conflicts

### Result

The application behaves more like a real frontend application instead of directly reading static data.

---

# 5. Centralized API Error Handling

### Decision

A custom `ApiError` class is used for structured API errors.

### Reason

A normal JavaScript `Error` mainly provides an error message.

The booking system also needs an error code so the UI can determine the appropriate response.

Examples include:

```text
SERVICE_NOT_FOUND
SERVICE_UNAVAILABLE
BOOKING_NOT_FOUND
BOOKING_CONFLICT
INVALID_SLOT
INVALID_DATE
INVALID_CUSTOMER
INVALID_ADDRESS
```

The API layer converts mock API errors into `ApiError` instances.

### Result

Components can distinguish between different types of failures.

For example:

```text
BOOKING_NOT_FOUND
        ↓
Show "Booking not found"

BOOKING_CONFLICT
        ↓
Ask customer to select another slot
```

This produces more meaningful error handling.

---

# 6. Shared TypeScript Data Models

### Decision

Shared TypeScript interfaces and types are stored in the `types` directory.

Examples include:

```text
types/
├── booking.ts
├── customer.ts
└── service.ts
```

### Reason

The same data structures are used by:

* API services
* Mock API
* Components
* Booking pages
* Booking details
* Service pages

Duplicating interfaces in multiple files can lead to inconsistent data structures.

### Result

Centralized types improve:

* Type safety
* Consistency
* Maintainability
* API integration
* Refactoring safety

---

# 7. React Router for Navigation

### Decision

React Router is used for application navigation.

### Reason

The application contains multiple pages and dynamic resources.

Examples:

```text
/services
/services/:categoryId
/services/:categoryId/:serviceId
/services/:categoryId/:serviceId/booking

/bookings
/bookings/:bookingId
```

Dynamic route parameters allow pages to load the correct service or booking based on its ID.

### Result

The application has meaningful URLs and browser navigation works naturally.

---

# 8. Protected Routes

### Decision

Customer-specific pages are protected using a reusable `ProtectedLayout`.

### Reason

Pages such as:

* Services
* Service details
* Booking
* My bookings
* Booking details

should only be accessible to authenticated customers.

The application checks whether a customer session exists.

If no customer session exists:

```text
Protected Page
      ↓
No Customer Session
      ↓
/login
```

After successful login:

```text
Login
   ↓
Store Customer Session
   ↓
/services
```

### Result

Authentication checks are centralized instead of being repeated inside every page.

---

# 9. Public Route Protection

### Decision

Login and registration pages use a public-route guard.

### Reason

An already authenticated customer should not normally be sent back to the login or registration page.

The application checks the customer session before rendering these pages.

Example:

```text
Customer already logged in
          ↓
Open /login
          ↓
Redirect to /services
```

### Result

The authentication flow is more consistent and prevents unnecessary access to authentication pages.

---

# 10. Mock Database as a Shared In-Memory Store

### Decision

Bookings are stored in a shared `mockBookings` array.

### Reason

Creating a booking must affect later API requests.

For example:

```text
Create Booking
      ↓
mockBookings.push(booking)
      ↓
GET /bookings
      ↓
New booking appears
```

The same booking data is also used when checking availability.

### Result

The mock application behaves more realistically during the current browser session.

A newly created booking can:

* Appear in My Bookings
* Be opened in Booking Details
* Make the selected time slot unavailable

---

# 11. Booking Conflict Validation

### Decision

The booking API performs a second availability check when creating a booking.

### Reason

Availability may change between selecting a slot and confirming a booking.

For example:

```text
Customer selects 14:00
        ↓
Customer reviews booking
        ↓
Another booking takes 14:00
        ↓
Customer confirms
        ↓
API checks availability
        ↓
BOOKING_CONFLICT
```

Therefore, availability cannot rely only on the initial slot selection.

### Result

The application demonstrates realistic booking conflict handling.

---

# 12. Validation at the API Boundary

### Decision

Important booking fields are validated by the mock API before creating a booking.

Required information includes:

* Service ID
* Slot ID
* Date
* Customer
* Customer name
* Customer phone
* Customer ID
* Address
* Address ID
* Address label
* Address line

### Reason

Frontend validation improves user experience, but the API should also validate incoming data.

This follows the principle:

> Never trust the client.

### Result

Invalid booking requests are rejected consistently.

---

# 13. Separate UI and API Responsibilities

### Decision

UI components are responsible for presentation and UI state, while API service modules handle data access.

Example:

```text
BookingDetails.tsx
        ↓
bookingApi.ts
        ↓
mockApi.ts
        ↓
mockDatabase.ts
```

### Reason

The component should not directly access mock database arrays.

Instead, it should request data through the API service.

### Result

This separation makes the application:

* Easier to test
* Easier to maintain
* Easier to refactor
* Easier to connect to a real backend

---

# 14. API Service Layer

### Decision

API operations are exposed through dedicated service modules such as `bookingApi.ts`.

### Reason

Components should not contain low-level API implementation details.

For example, instead of:

```text
Component
   ↓
mockApi.createBooking()
```

the application uses:

```text
Component
   ↓
bookingApi.createBooking()
   ↓
mockApi.createBooking()
```

### Result

The UI depends on an application-level API service rather than a specific mock implementation.

This makes replacing the mock API with a real HTTP client easier.

---

# 15. Loading, Error, Empty, and Success States

### Decision

Data-driven pages explicitly handle different request states.

The main states are:

```text
Loading
Success
Empty
Error
```

### Reason

Production applications cannot assume that every API request succeeds or returns data.

For example, the Service List can have:

```text
Loading
    ↓
Services Found
```

or:

```text
Loading
    ↓
No Services
    ↓
Empty State
```

or:

```text
Loading
    ↓
API Failure
    ↓
Error State
```

### Result

Users receive clear feedback instead of seeing blank screens.

---

# 16. Booking Details Error Handling

### Decision

Booking Details distinguishes between different error types.

Examples include:

```text
BOOKING_NOT_FOUND
INVALID_BOOKING_ID
```

### Reason

Not every error should display the same message or action.

For example:

```text
Booking Not Found
        ↓
Explain that the booking does not exist
```

A temporary server error may instead provide:

```text
Something went wrong
        ↓
Try Again
```

### Result

Error messages become more useful and context-aware.

---

# 17. Reusable Layout Components

### Decision

Common application layout elements are implemented as reusable components.

Examples include:

* Navbar
* Sidebar
* MainLayout
* Page background
* Navigation elements

### Reason

These components are shared by multiple pages.

Duplicating navigation and layout code would make maintenance harder.

### Result

Protected pages maintain a consistent application structure.

---

# 18. Responsive Design

### Decision

Responsive CSS and Tailwind utility classes are used to support different screen sizes.

The interface is designed for:

* Desktop
* Tablet
* Mobile

Responsive behavior is applied to:

* Navbar
* Sidebar
* Service cards
* Booking forms
* Booking summary
* Booking details
* Buttons
* Navigation

### Reason

Customers may access the service booking system from different devices.

### Result

The application remains usable across common screen sizes.

---

# 19. Local Storage for Mock Authentication

### Decision

`localStorage` is used to store the mock customer session.

The session is stored under:

```text
customer
```

### Reason

The assignment focuses on frontend architecture and booking functionality rather than implementing a complete authentication backend.

Using local storage provides enough behavior to demonstrate:

* Login
* Logout
* Protected routes
* Customer information
* Redirects

### Result

Authentication behavior can be demonstrated without a backend authentication service.

### Production Consideration

For a real production application, authentication should use a secure backend-based authentication strategy.

Sensitive authentication data should not be stored in plain local storage.

---

# 20. Centralized Customer Session Handling

### Decision

The authenticated customer is read from the shared local storage session.

### Reason

The Navbar, protected routes, and authentication pages all need to know whether a customer is logged in.

The session flow is:

```text
Login
  ↓
Save customer
  ↓
Protected pages available
  ↓
Navbar displays customer
  ↓
Logout
  ↓
Remove customer
  ↓
Redirect to /login
```

### Result

The customer authentication flow remains consistent across the application.

---

# 21. Dynamic Service and Booking Routes

### Decision

Service and booking IDs are represented through route parameters.

Examples:

```text
/services/:categoryId/:serviceId
/services/:categoryId/:serviceId/booking
/bookings/:bookingId
```

### Reason

A separate hard-coded route is not required for every service or booking.

The same component can display different resources based on the ID.

### Result

The application is scalable and supports additional services and bookings without creating new routes.

---

# 22. Availability Is Date-Specific

### Decision

Service availability is requested using both the service ID and selected date.

Example:

```text
GET /api/v1/services/:service_id/availability?date=YYYY-MM-DD
```

### Reason

Available time slots depend on the selected date.

A service may be available on one date but have different booked slots on another date.

### Result

The booking flow can dynamically load available slots after the customer selects a date.

---

# 23. Booking Data Uses Snapshot Information

### Decision

A booking stores relevant service and provider information at booking time.

For example:

```text
Booking
├── service
│   ├── id
│   ├── name
│   └── category
├── provider
│   ├── id
│   ├── name
│   └── phone
├── price
├── currency
└── duration
```

### Reason

A booking represents a historical transaction.

If service information changes later, the booking should still contain enough information to display what was booked.

### Result

Booking details are more self-contained and suitable for future backend implementation.

---

# 24. Currency Is Included in Booking Data

### Decision

The booking model stores both:

```text
price
currency
```

Example:

```text
price: 1500
currency: "NPR"
```

### Reason

A numeric price alone does not indicate which currency is being used.

Including currency makes the API model more internationally adaptable.

### Result

The frontend can display prices correctly and the API can support multiple currencies in the future.

---

# 25. Status Is Represented as a Type

### Decision

Booking status is represented using a TypeScript union type.

```text
CONFIRMED
PENDING
COMPLETED
CANCELLED
```

### Reason

Restricting status values prevents invalid values from being used throughout the application.

### Result

TypeScript can detect invalid booking statuses during development.

---

# 26. Meaningful API Error Codes

### Decision

The mock API returns structured error codes instead of relying only on text messages.

Examples:

```text
SERVICE_NOT_FOUND
SERVICE_UNAVAILABLE
BOOKING_NOT_FOUND
BOOKING_CONFLICT
INVALID_DATE
INVALID_SLOT
INVALID_CUSTOMER
INVALID_ADDRESS
```

### Reason

Error messages can change for UX or localization reasons, while error codes provide stable identifiers for frontend logic.

### Result

The frontend can make decisions based on stable error codes.

---

# 27. Minimal Dependency Strategy

### Decision

Only libraries that provide clear value to the assignment are used.

Examples include:

* React
* React Router
* TypeScript
* Vite
* Tailwind CSS
* React Icons
* Axios where required by the API implementation

### Reason

Adding unnecessary dependencies increases:

* Bundle size
* Maintenance cost
* Complexity
* Potential security risks

### Result

The application remains relatively lightweight and easier to maintain.

---

# 28. Reusable API Response Structure

### Decision

The mock API uses a consistent response structure.

Successful response:

```text
{
  success: true,
  data: ...
}
```

Error response:

```text
{
  success: false,
  error: {
    code: "...",
    message: "..."
  }
}
```

### Reason

A predictable API response structure simplifies API service handling.

### Result

API service functions can consistently:

1. Check `success`
2. Read `data`
3. Convert errors into `ApiError`

---

# 29. Mock Data Is Kept Separate From UI Components

### Decision

Mock services and database data are stored separately from React components.

Examples:

```text
src/api/mock/mockApi.ts
src/api/mock/mockData.ts
src/api/mock/mockDatabase.ts
```

### Reason

Components should not contain large static datasets.

Keeping mock data separate makes it easier to:

* Modify test data
* Add new services
* Simulate different scenarios
* Replace mock data later

### Result

UI components remain focused on rendering and interaction.

---

# 30. Maintainability as the Primary Architectural Goal

### Decision

The overall architecture prioritizes maintainability and clear separation of concerns.

The main flow is:

```text
React UI
   ↓
Feature/Page Logic
   ↓
API Service
   ↓
Mock API
   ↓
Mock Data / Mock Database
```

### Reason

The application is a technical assignment, but it should still demonstrate production-style frontend engineering practices.

The goal is not only to make the application work, but also to make the code understandable and replaceable.

### Result

The architecture can be extended later with:

* Real REST APIs
* Real authentication
* Database persistence
* More service categories
* More booking states
* Payment integration
* Notifications
* Customer profiles

---

# Summary

The main architectural principles used in this project are:

* **React + TypeScript** for a maintainable frontend
* **Vite** for fast development and builds
* **API-first development** for backend independence
* **Promise-based mock API** for realistic asynchronous behavior
* **Centralized API services** for separation of concerns
* **Custom `ApiError`** for structured error handling
* **Shared TypeScript types** for consistent data models
* **React Router** for scalable navigation
* **Protected routes** for customer-only pages
* **Shared mock database** for persistent behavior during the session
* **Booking conflict validation** for realistic booking behavior
* **Loading, error, empty, and success states** for better UX
* **Reusable layout components** for consistency
* **Responsive design** for multiple screen sizes
* **Minimal dependencies** to reduce unnecessary complexity

The architecture is designed so that the current mock API can later be replaced by a real backend with minimal changes to the UI layer