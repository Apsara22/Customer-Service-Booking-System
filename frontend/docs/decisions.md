# Technical Decisions

## 1. React + TypeScript + Vite

### Decision
The application is built using React, TypeScript, and Vite.

### Reason
React provides a component-based architecture suitable for the booking workflow. TypeScript improves type safety and maintainability, while Vite provides a fast development and build experience.

---

## 2. Feature-Based Organization

### Decision
Application features are organized around business functionality rather than only technical file types.

### Reason
The booking system contains distinct features such as services, booking, and my bookings. Feature-based organization makes the application easier to understand, maintain, and extend.

Example:

```text
src/
├── api/
├── components/
├── types/
└── data/