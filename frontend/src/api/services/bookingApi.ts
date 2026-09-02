// src/api/services/bookingApi.ts

import { mockApi } from "../mock/mockApi";
import { ApiError } from "../ApiError";

import type {
  Booking,
  CreateBookingRequest,
} from "../../types/booking";

/**
 * Create a new booking
 *
 * POST /api/v1/bookings
 */
export const createBooking = async (
  request: CreateBookingRequest
): Promise<Booking> => {
  const response = await mockApi.createBooking(request);

  if (!response.success || !response.data) {
    throw new ApiError(
      response.error?.code || "BOOKING_CREATE_FAILED",
      response.error?.message || "Failed to create booking."
    );
  }

  return response.data.booking;
};

/**
 * Get all bookings
 *
 * GET /api/v1/bookings
 */
export const getBookings = async (): Promise<Booking[]> => {
  const response = await mockApi.getBookings();

  if (!response.success || !response.data) {
    throw new ApiError(
      response.error?.code || "BOOKINGS_FETCH_FAILED",
      response.error?.message || "Failed to fetch bookings."
    );
  }

  return response.data;
};

/**
 * Get a single booking by ID
 *
 * GET /api/v1/bookings/:booking_id
 */
export const getBookingById = async (
  bookingId: string
): Promise<Booking> => {
  if (!bookingId) {
    throw new ApiError(
      "INVALID_BOOKING_ID",
      "Booking ID is required."
    );
  }

  const response = await mockApi.getBookingById(bookingId);

  if (!response.success || !response.data) {
    throw new ApiError(
      response.error?.code || "BOOKING_FETCH_FAILED",
      response.error?.message || "Failed to fetch booking."
    );
  }

  return response.data;
};