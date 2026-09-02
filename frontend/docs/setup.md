# Setup and Development Guide

## Customer Service Booking System

This document explains how to install, configure, run, test, and build the Customer Service Booking System locally.

---

# 1. Prerequisites

Before running the project, make sure the following are installed:

* Node.js
* npm
* Git

Recommended versions:

```text
Node.js 20+
npm 10+
```

You can verify the installed versions with:

```bash
node --version
npm --version
```

---

# 2. Clone the Repository

Clone the project repository:

```bash
git clone <repository-url>
```

Navigate into the project directory:

```bash
cd <project-directory>
```

Replace `<repository-url>` and `<project-directory>` with the actual repository URL and folder name.

---

# 3. Install Dependencies

Install all project dependencies:

```bash
npm install
```

This installs the packages defined in `package.json`.

---

# 4. Environment Variables

The current assignment uses a mock API and does not require a production backend environment variable.

If environment variables are introduced later, create:

```text
.env
```

For Vite applications, frontend environment variables should use the `VITE_` prefix.

Example:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Do not commit sensitive credentials or API keys to Git.

---

# 5. Start the Development Server

Run:

```bash
npm run dev
```

Vite will start the development server.

The terminal will display the local development URL.

Open the displayed URL in a browser.

---

# 6. Application Flow

After starting the application, the main customer flow is:

```text
Login / Register
      ↓
Service Categories
      ↓
Service List
      ↓
Service Details
      ↓
Select Date
      ↓
Select Time Slot
      ↓
Select Customer / Address
      ↓
Review Booking
      ↓
Confirm Booking
      ↓
Booking Confirmation
      ↓
My Bookings
      ↓
Booking Details
```

---

# 7. Authentication for the Assignment

The current implementation uses mock authentication.

After successful login, customer information is stored in:

```text
localStorage
```

using the key:

```text
customer
```

The application uses this value to determine whether the customer is authenticated.

---

# 8. Protected Routes

The following routes require an authenticated customer:

```text
/services
/services/:categoryId
/services/:categoryId/:serviceId
/services/:categoryId/:serviceId/booking
/bookings
/bookings/:bookingId
```

If no customer session exists, the user is redirected to:

```text
/login
```

---

# 9. Public Routes

The authentication routes are:

```text
/login
/register
```

If an authenticated customer attempts to access these routes, the application redirects the customer to:

```text
/services
```

---

# 10. Mock API

The project currently uses a Promise-based mock API instead of a live backend.

Main mock API location:

```text
src/api/mock/mockApi.ts
```

The mock API simulates network latency.

This allows the application to demonstrate realistic:

* Loading states
* Successful requests
* Errors
* Empty responses
* Booking conflicts
* Validation failures

---

# 11. Mock Data

Static service data is stored separately from React components.

Example location:

```text
src/api/mock/mockData.ts
```

This data is used by the mock API for service-related operations.

---

# 12. Mock Database

Booking data is maintained in:

```text
src/api/mock/mockDatabase.ts
```

Bookings are stored in an in-memory array.

When a booking is created:

```text
Create Booking
      ↓
mockBookings.push(booking)
```

The new booking can then be returned by:

```text
GET /api/v1/bookings
```

and:

```text
GET /api/v1/bookings/:booking_id
```

The same data is also used for availability and booking-conflict checks.

---

# 13. API Service Layer

The frontend accesses API operations through service modules.

Example:

```text
src/api/services/
├── bookingApi.ts
└── serviceApi.ts
```

The component should call an API service instead of accessing mock data directly.

Example:

```text
Booking Component
       ↓
bookingApi.ts
       ↓
mockApi.ts
```

This makes the mock implementation replaceable.

---

# 14. API Error Handling

API errors are represented using:

```text
src/api/ApiError.ts
```

The application uses structured error codes such as:

```text
SERVICE_NOT_FOUND
SERVICE_UNAVAILABLE
BOOKING_NOT_FOUND
BOOKING_CONFLICT
INVALID_SERVICE
INVALID_SLOT
INVALID_DATE
INVALID_CUSTOMER
INVALID_ADDRESS
```

This allows components to display appropriate error messages.

---

# 15. TypeScript Types

Shared data models are stored in:

```text
src/types/
```

Important files include:

```text
booking.ts
customer.ts
service.ts
```

These types are shared between the API layer and UI components.

---

# 16. Available API Operations

The current API contract includes:

```text
GET    /api/v1/services

GET    /api/v1/services/:service_id

GET    /api/v1/services/:service_id/availability

POST   /api/v1/bookings

GET    /api/v1/bookings

GET    /api/v1/bookings/:booking_id
```

Detailed request and response structures are documented in:

```text
docs/api-contract.md
```

---

# 17. Running Tests

If automated tests are configured in the project, run:

```bash
npm test
```

If the project uses a dedicated test script, the exact command can be found in:

```text
package.json
```

Tests should cover important application behavior including:

* Service list success
* Service list error
* Service details
* Booking validation
* Successful booking
* Booking conflict
* Booking not found

---

# 18. Production Build

To create a production build:

```bash
npm run build
```

The generated production files are normally placed in:

```text
dist/
```

---

# 19. Preview Production Build

After building the application, the production build can be previewed locally using:

```bash
npm run preview
```

This allows the production build to be checked before deployment.

---

# 20. Linting

If ESLint is configured, run:

```bash
npm run lint
```

Linting helps identify:

* Unused imports
* Invalid patterns
* Potential bugs
* TypeScript/React issues
* Code-quality problems

The exact available scripts are defined in `package.json`.

---

# 21. Recommended Development Workflow

A typical development workflow is:

```text
1. Pull latest code
        ↓
2. npm install
        ↓
3. npm run dev
        ↓
4. Develop feature
        ↓
5. Run tests
        ↓
6. Run lint
        ↓
7. npm run build
        ↓
8. Review changes
        ↓
9. Commit changes
```

---

# 22. Recommended Git Workflow

Changes should be grouped into logical commits.

Example:

```text
feat: add service listing

feat: add service details

feat: implement booking flow

feat: add booking conflict handling

feat: add my bookings

fix: improve booking error handling

docs: add API contract

test: add booking tests
```

Avoid committing unrelated changes together where possible.

---

# 23. Development Troubleshooting

## Application Does Not Start

Try:

```bash
npm install
npm run dev
```

If dependencies are corrupted, remove the dependency directory and lock file if appropriate, then reinstall:

```bash
npm install
```

---

## TypeScript Errors

Run:

```bash
npm run build
```

The build process can reveal TypeScript errors that may not be immediately obvious during development.

Check:

* Imports
* Type definitions
* Route parameters
* API response types
* Component props

---

## API Data Is Not Updating

Because the current implementation uses an in-memory mock database, refresh behavior depends on the application's runtime session.

Check:

```text
src/api/mock/mockDatabase.ts
```

and make sure the same `mockBookings` array is used by:

* Create booking
* Get bookings
* Get booking details
* Availability

---

## Booking Conflict Is Not Triggering

The selected booking must match an existing booking by:

```text
service_id
+
date
+
slot_id
```

Cancelled bookings should not block the slot.

---

## Booking Details Shows Not Found

Verify that:

1. A booking was created successfully.
2. The booking was added to `mockBookings`.
3. The generated booking ID is passed to the route.
4. `getBookingById()` receives the correct ID.
5. `mockApi.getBookingById()` searches the same `mockBookings` array.

Expected route:

```text
/bookings/:bookingId
```

---

# 24. Resetting Mock Data

The current mock database is in-memory.

Restarting the development application resets the mock booking state to the initial mock data.

This is expected behavior for the assignment.

A production implementation would persist bookings in a backend database.

---

# 25. Production Migration

The current project intentionally separates API services from the mock API.

Current:

```text
React Component
      ↓
API Service
      ↓
Mock API
      ↓
Mock Data
```

Future:

```text
React Component
      ↓
API Service
      ↓
HTTP Client
      ↓
Backend REST API
      ↓
Database
```

The API contract can remain the same while replacing the implementation underneath.

---

# 26. Documentation Files

The project documentation is organized under:

```text
docs/
```

Current documentation includes:

```text
docs/
├── architecture.md
├── api-contract.md
├── decisions.md
└── setup.md
```

### `architecture.md`

Explains:

* Application layers
* Folder responsibilities
* Data flow
* Routing
* Authentication
* State management
* API interaction

### `api-contract.md`

Defines:

* API endpoints
* Request parameters
* Request bodies
* Response structures
* Error codes

### `decisions.md`

Documents important technical decisions and their reasoning.

### `setup.md`

Explains how to install, run, test, build, and troubleshoot the project.

---

# 27. Deployment Preparation

Before deployment, verify:

```text
✓ npm install works
✓ npm run dev works
✓ npm run build works
✓ npm run lint works
✓ Tests pass
✓ Routes work correctly
✓ Authentication redirects work
✓ Booking flow works
✓ Booking conflict handling works
✓ My Bookings displays created bookings
✓ Booking Details loads the selected booking
✓ No secrets are committed
```

---

# 28. Final Verification Checklist

Before submitting the assignment:

### Authentication

```text
[ ] Register works
[ ] Login works
[ ] Logout works
[ ] Protected routes redirect unauthenticated users
[ ] Authenticated users are redirected away from login/register
```

### Services

```text
[ ] Service categories load
[ ] Services load
[ ] Search works
[ ] Category filtering works
[ ] Loading state works
[ ] Empty state works
[ ] Error state works
[ ] Service details work
```

### Booking

```text
[ ] Date selection works
[ ] Availability loads
[ ] Time slots display correctly
[ ] Unavailable slots cannot be selected
[ ] Customer information is validated
[ ] Address is validated
[ ] Booking summary is correct
[ ] Booking confirmation works
[ ] Validation errors are displayed
[ ] Booking conflicts are handled
```

### My Bookings

```text
[ ] Bookings load
[ ] Empty state works
[ ] Booking information is displayed
[ ] Booking details can be opened
[ ] Booking not found is handled
```

### Technical Quality

```text
[ ] TypeScript has no build errors
[ ] API layer is separated from UI
[ ] Mock API is Promise-based
[ ] Mock data is separated from components
[ ] Error handling is structured
[ ] Loading/error/empty states are implemented
[ ] Responsive layout works
[ ] Documentation is complete
[ ] Tests are included
```

---

# 29. Quick Start

For evaluators who only need to run the application:

```bash
git clone <repository-url>

cd <project-directory>

npm install

npm run dev
```

For a production build:

```bash
npm run build
```

For tests:

```bash
npm test
```

For linting:

```bash
npm run lint
```

The exact commands available are defined by the project's `package.json`.

---

# 30. Final Notes

This project uses a mock backend intentionally to satisfy the API-first requirement while keeping the assignment self-contained.

The frontend communicates through API service modules rather than directly accessing mock data.

The architecture is designed to allow the mock implementation to be replaced with a real backend API with minimal changes to the React UI.

For additional architectural information, refer to:

```text
docs/architecture.md
```

For API details, refer to:

```text
docs/api-contract.md
```

For technical decisions, refer to:

```text
docs/decisions.md
```
# Setup and Development Guide

## Customer Service Booking System

This document explains how to install, configure, run, test, and build the Customer Service Booking System locally.

---

# 1. Prerequisites

Before running the project, make sure the following are installed:

* Node.js
* npm
* Git

Recommended versions:

```text
Node.js 20+
npm 10+
```

You can verify the installed versions with:

```bash
node --version
npm --version
```

---

# 2. Clone the Repository

Clone the project repository:

```bash
git clone <repository-url>
```

Navigate into the project directory:

```bash
cd <project-directory>
```

Replace `<repository-url>` and `<project-directory>` with the actual repository URL and folder name.

---

# 3. Install Dependencies

Install all project dependencies:

```bash
npm install
```

This installs the packages defined in `package.json`.

---

# 4. Environment Variables

The current assignment uses a mock API and does not require a production backend environment variable.

If environment variables are introduced later, create:

```text
.env
```

For Vite applications, frontend environment variables should use the `VITE_` prefix.

Example:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Do not commit sensitive credentials or API keys to Git.

---

# 5. Start the Development Server

Run:

```bash
npm run dev
```

Vite will start the development server.

The terminal will display the local development URL.

Open the displayed URL in a browser.

---

# 6. Application Flow

After starting the application, the main customer flow is:

```text
Login / Register
      ↓
Service Categories
      ↓
Service List
      ↓
Service Details
      ↓
Select Date
      ↓
Select Time Slot
      ↓
Select Customer / Address
      ↓
Review Booking
      ↓
Confirm Booking
      ↓
Booking Confirmation
      ↓
My Bookings
      ↓
Booking Details
```

---

# 7. Authentication for the Assignment

The current implementation uses mock authentication.

After successful login, customer information is stored in:

```text
localStorage
```

using the key:

```text
customer
```

The application uses this value to determine whether the customer is authenticated.

---

# 8. Protected Routes

The following routes require an authenticated customer:

```text
/services
/services/:categoryId
/services/:categoryId/:serviceId
/services/:categoryId/:serviceId/booking
/bookings
/bookings/:bookingId
```

If no customer session exists, the user is redirected to:

```text
/login
```

---

# 9. Public Routes

The authentication routes are:

```text
/login
/register
```

If an authenticated customer attempts to access these routes, the application redirects the customer to:

```text
/services
```

---

# 10. Mock API

The project currently uses a Promise-based mock API instead of a live backend.

Main mock API location:

```text
src/api/mock/mockApi.ts
```

The mock API simulates network latency.

This allows the application to demonstrate realistic:

* Loading states
* Successful requests
* Errors
* Empty responses
* Booking conflicts
* Validation failures

---

# 11. Mock Data

Static service data is stored separately from React components.

Example location:

```text
src/api/mock/mockData.ts
```

This data is used by the mock API for service-related operations.

---

# 12. Mock Database

Booking data is maintained in:

```text
src/api/mock/mockDatabase.ts
```

Bookings are stored in an in-memory array.

When a booking is created:

```text
Create Booking
      ↓
mockBookings.push(booking)
```

The new booking can then be returned by:

```text
GET /api/v1/bookings
```

and:

```text
GET /api/v1/bookings/:booking_id
```

The same data is also used for availability and booking-conflict checks.

---

# 13. API Service Layer

The frontend accesses API operations through service modules.

Example:

```text
src/api/services/
├── bookingApi.ts
└── serviceApi.ts
```

The component should call an API service instead of accessing mock data directly.

Example:

```text
Booking Component
       ↓
bookingApi.ts
       ↓
mockApi.ts
```

This makes the mock implementation replaceable.

---

# 14. API Error Handling

API errors are represented using:

```text
src/api/ApiError.ts
```

The application uses structured error codes such as:

```text
SERVICE_NOT_FOUND
SERVICE_UNAVAILABLE
BOOKING_NOT_FOUND
BOOKING_CONFLICT
INVALID_SERVICE
INVALID_SLOT
INVALID_DATE
INVALID_CUSTOMER
INVALID_ADDRESS
```

This allows components to display appropriate error messages.

---

# 15. TypeScript Types

Shared data models are stored in:

```text
src/types/
```

Important files include:

```text
booking.ts
customer.ts
service.ts
```

These types are shared between the API layer and UI components.

---

# 16. Available API Operations

The current API contract includes:

```text
GET    /api/v1/services

GET    /api/v1/services/:service_id

GET    /api/v1/services/:service_id/availability

POST   /api/v1/bookings

GET    /api/v1/bookings

GET    /api/v1/bookings/:booking_id
```

Detailed request and response structures are documented in:

```text
docs/api-contract.md
```

---

# 17. Running Tests

If automated tests are configured in the project, run:

```bash
npm test
```

If the project uses a dedicated test script, the exact command can be found in:

```text
package.json
```

Tests should cover important application behavior including:

* Service list success
* Service list error
* Service details
* Booking validation
* Successful booking
* Booking conflict
* Booking not found

---

# 18. Production Build

To create a production build:

```bash
npm run build
```

The generated production files are normally placed in:

```text
dist/
```

---

# 19. Preview Production Build

After building the application, the production build can be previewed locally using:

```bash
npm run preview
```

This allows the production build to be checked before deployment.

---

# 20. Linting

If ESLint is configured, run:

```bash
npm run lint
```

Linting helps identify:

* Unused imports
* Invalid patterns
* Potential bugs
* TypeScript/React issues
* Code-quality problems

The exact available scripts are defined in `package.json`.

---

# 21. Recommended Development Workflow

A typical development workflow is:

```text
1. Pull latest code
        ↓
2. npm install
        ↓
3. npm run dev
        ↓
4. Develop feature
        ↓
5. Run tests
        ↓
6. Run lint
        ↓
7. npm run build
        ↓
8. Review changes
        ↓
9. Commit changes
```

---

# 22. Recommended Git Workflow

Changes should be grouped into logical commits.

Example:

```text
feat: add service listing

feat: add service details

feat: implement booking flow

feat: add booking conflict handling

feat: add my bookings

fix: improve booking error handling

docs: add API contract

test: add booking tests
```

Avoid committing unrelated changes together where possible.

---

# 23. Development Troubleshooting

## Application Does Not Start

Try:

```bash
npm install
npm run dev
```

If dependencies are corrupted, remove the dependency directory and lock file if appropriate, then reinstall:

```bash
npm install
```

---

## TypeScript Errors

Run:

```bash
npm run build
```

The build process can reveal TypeScript errors that may not be immediately obvious during development.

Check:

* Imports
* Type definitions
* Route parameters
* API response types
* Component props

---

## API Data Is Not Updating

Because the current implementation uses an in-memory mock database, refresh behavior depends on the application's runtime session.

Check:

```text
src/api/mock/mockDatabase.ts
```

and make sure the same `mockBookings` array is used by:

* Create booking
* Get bookings
* Get booking details
* Availability

---

## Booking Conflict Is Not Triggering

The selected booking must match an existing booking by:

```text
service_id
+
date
+
slot_id
```

Cancelled bookings should not block the slot.

---

## Booking Details Shows Not Found

Verify that:

1. A booking was created successfully.
2. The booking was added to `mockBookings`.
3. The generated booking ID is passed to the route.
4. `getBookingById()` receives the correct ID.
5. `mockApi.getBookingById()` searches the same `mockBookings` array.

Expected route:

```text
/bookings/:bookingId
```

---

# 24. Resetting Mock Data

The current mock database is in-memory.

Restarting the development application resets the mock booking state to the initial mock data.

This is expected behavior for the assignment.

A production implementation would persist bookings in a backend database.

---

# 25. Production Migration

The current project intentionally separates API services from the mock API.

Current:

```text
React Component
      ↓
API Service
      ↓
Mock API
      ↓
Mock Data
```

Future:

```text
React Component
      ↓
API Service
      ↓
HTTP Client
      ↓
Backend REST API
      ↓
Database
```

The API contract can remain the same while replacing the implementation underneath.

---

# 26. Documentation Files

The project documentation is organized under:

```text
docs/
```

Current documentation includes:

```text
docs/
├── architecture.md
├── api-contract.md
├── decisions.md
└── setup.md
```

### `architecture.md`

Explains:

* Application layers
* Folder responsibilities
* Data flow
* Routing
* Authentication
* State management
* API interaction

### `api-contract.md`

Defines:

* API endpoints
* Request parameters
* Request bodies
* Response structures
* Error codes

### `decisions.md`

Documents important technical decisions and their reasoning.

### `setup.md`

Explains how to install, run, test, build, and troubleshoot the project.

---

# 27. Deployment Preparation

Before deployment, verify:

```text
✓ npm install works
✓ npm run dev works
✓ npm run build works
✓ npm run lint works
✓ Tests pass
✓ Routes work correctly
✓ Authentication redirects work
✓ Booking flow works
✓ Booking conflict handling works
✓ My Bookings displays created bookings
✓ Booking Details loads the selected booking
✓ No secrets are committed
```

---

# 28. Final Verification Checklist

Before submitting the assignment:

### Authentication

```text
[ ] Register works
[ ] Login works
[ ] Logout works
[ ] Protected routes redirect unauthenticated users
[ ] Authenticated users are redirected away from login/register
```

### Services

```text
[ ] Service categories load
[ ] Services load
[ ] Search works
[ ] Category filtering works
[ ] Loading state works
[ ] Empty state works
[ ] Error state works
[ ] Service details work
```

### Booking

```text
[ ] Date selection works
[ ] Availability loads
[ ] Time slots display correctly
[ ] Unavailable slots cannot be selected
[ ] Customer information is validated
[ ] Address is validated
[ ] Booking summary is correct
[ ] Booking confirmation works
[ ] Validation errors are displayed
[ ] Booking conflicts are handled
```

### My Bookings

```text
[ ] Bookings load
[ ] Empty state works
[ ] Booking information is displayed
[ ] Booking details can be opened
[ ] Booking not found is handled
```

### Technical Quality

```text
[ ] TypeScript has no build errors
[ ] API layer is separated from UI
[ ] Mock API is Promise-based
[ ] Mock data is separated from components
[ ] Error handling is structured
[ ] Loading/error/empty states are implemented
[ ] Responsive layout works
[ ] Documentation is complete
[ ] Tests are included
```

---

# 29. Quick Start

For evaluators who only need to run the application:

```bash
git clone <repository-url>

cd <project-directory>

npm install

npm run dev
```

For a production build:

```bash
npm run build
```

For tests:

```bash
npm test
```

For linting:

```bash
npm run lint
```

The exact commands available are defined by the project's `package.json`.

---

# 30. Final Notes

This project uses a mock backend intentionally to satisfy the API-first requirement while keeping the assignment self-contained.

The frontend communicates through API service modules rather than directly accessing mock data.

The architecture is designed to allow the mock implementation to be replaced with a real backend API with minimal changes to the React UI.

For additional architectural information, refer to:

```text
docs/architecture.md
```

For API details, refer to:

```text
docs/api-contract.md
```

For technical decisions, refer to:

```text
docs/decisions.md
```
