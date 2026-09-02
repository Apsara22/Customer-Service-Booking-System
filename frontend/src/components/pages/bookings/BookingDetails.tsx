// src/components/pages/services/BookingDetails.tsx

import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaTools,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaClipboardList,
  FaRedo,
  FaHashtag,
} from "react-icons/fa";

import PageBackground from "../../PageBackground";

import {
  getBookingById,
} from "../../../api/services/bookingApi";

import { ApiError } from "../../../api/ApiError";

import type {
  Booking,
  BookingStatus,
} from "../../../types/booking";

/* =========================================================
   BOOKING DETAILS
   ========================================================= */

const BookingDetails: React.FC = () => {
  const { bookingId } = useParams<{
    bookingId: string;
  }>();

  const navigate = useNavigate();

  const [booking, setBooking] =
    useState<Booking | null>(null);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string | null>(null);

  const [errorCode, setErrorCode] =
    useState<string | null>(null);

  /* =========================================================
     LOAD BOOKING
     ========================================================= */

  const loadBooking = useCallback(async () => {
    if (!bookingId) {
      setBooking(null);
      setErrorCode("INVALID_BOOKING_ID");
      setError("Booking ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setErrorCode(null);

      const data = await getBookingById(bookingId);

      setBooking(data);
    } catch (err) {
      console.error(
        "GET BOOKING DETAILS ERROR:",
        err
      );

      setBooking(null);

      if (err instanceof ApiError) {
        setErrorCode(err.code);
        setError(err.message);
      } else if (err instanceof Error) {
        setErrorCode("BOOKING_FETCH_FAILED");
        setError(err.message);
      } else {
        setErrorCode("BOOKING_FETCH_FAILED");
        setError(
          "Unable to load booking details."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  /* =========================================================
     FETCH BOOKING WHEN PAGE LOADS
     ========================================================= */

  useEffect(() => {
    loadBooking();
  }, [loadBooking]);

  /* =========================================================
     STATUS CONFIGURATION
     ========================================================= */

  const getStatusConfig = (
    status: BookingStatus
  ) => {
    switch (status) {
      case "CONFIRMED":
        return {
          label: "Confirmed",
          className:
            "bg-green-100 text-green-700",
          icon: <FaCheckCircle />,
        };

      case "COMPLETED":
        return {
          label: "Completed",
          className:
            "bg-blue-100 text-blue-700",
          icon: <FaCheckCircle />,
        };

      case "CANCELLED":
        return {
          label: "Cancelled",
          className:
            "bg-red-100 text-red-700",
          icon: <FaTimesCircle />,
        };

      case "PENDING":
        return {
          label: "Pending",
          className:
            "bg-yellow-100 text-yellow-700",
          icon: <FaHourglassHalf />,
        };

      default:
        return {
          label: status,
          className:
            "bg-gray-100 text-gray-700",
          icon: <FaClipboardList />,
        };
    }
  };

  /* =========================================================
     FORMAT DATE
     ========================================================= */

  const formatDate = (date: string) => {
    const parsedDate = new Date(
      `${date}T00:00:00`
    );

    if (
      Number.isNaN(parsedDate.getTime())
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  /* =========================================================
     FORMAT CREATED DATE
     ========================================================= */

  const formatCreatedAt = (date: string) => {
    const parsedDate = new Date(date);

    if (
      Number.isNaN(parsedDate.getTime())
    ) {
      return date;
    }

    return parsedDate.toLocaleString(
      "en-US",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  /* =========================================================
     FORMAT PRICE
     ========================================================= */

  const formatPrice = (
    price: number,
    currency: string
  ) => {
    return `${currency} ${price.toLocaleString()}`;
  };

  /* =========================================================
     ERROR TITLE
     ========================================================= */

  const getErrorTitle = () => {
    switch (errorCode) {
      case "BOOKING_NOT_FOUND":
        return "Booking Not Found";

      case "INVALID_BOOKING_ID":
        return "Invalid Booking";

      default:
        return "Unable to Load Booking";
    }
  };

  /* =========================================================
     ERROR MESSAGE
     ========================================================= */

  const getErrorMessage = () => {
    if (errorCode === "BOOKING_NOT_FOUND") {
      return (
        error ||
        "The booking you are looking for does not exist or may have been removed."
      );
    }

    if (errorCode === "INVALID_BOOKING_ID") {
      return (
        error ||
        "A valid booking ID is required."
      );
    }

    return (
      error ||
      "Unable to load booking details. Please try again."
    );
  };

  /* =========================================================
     LOADING STATE
     ========================================================= */

  if (loading) {
    return (
      <PageBackground>
        <div className="min-h-screen px-4 py-8 md:px-8">
          <div className="mx-auto max-w-5xl">

            {/* Back button skeleton */}
            <div className="mb-6 h-5 w-40 animate-pulse rounded bg-gray-200" />

            {/* Header skeleton */}
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="mb-2 h-4 w-28 animate-pulse rounded bg-gray-200" />

                <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />

                <div className="mt-2 h-4 w-40 animate-pulse rounded bg-gray-200" />
              </div>

              <div className="h-9 w-28 animate-pulse rounded-full bg-gray-200" />
            </div>

            {/* Main skeleton */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="animate-pulse p-6 md:p-8">

                <div className="mb-6 h-6 w-40 rounded bg-gray-200" />

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="h-24 rounded-xl bg-gray-100" />
                  <div className="h-24 rounded-xl bg-gray-100" />
                  <div className="h-24 rounded-xl bg-gray-100" />
                </div>
              </div>

              <div className="space-y-5 border-t border-gray-100 p-6 md:p-8">
                <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
                <div className="h-28 animate-pulse rounded-xl bg-gray-100" />
              </div>

              <div className="space-y-5 border-t border-gray-100 p-6 md:p-8">
                <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
                <div className="h-24 animate-pulse rounded-xl bg-gray-100" />
              </div>

              <div className="space-y-5 border-t border-gray-100 p-6 md:p-8">
                <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
                <div className="h-24 animate-pulse rounded-xl bg-gray-100" />
              </div>
            </div>
          </div>
        </div>
      </PageBackground>
    );
  }

  /* =========================================================
     ERROR / NOT FOUND STATE
     ========================================================= */

  if (error || !booking) {
    const isNotFound =
      errorCode === "BOOKING_NOT_FOUND";

    return (
      <PageBackground>
        <div className="min-h-screen px-4 py-8 md:px-8">
          <div className="mx-auto max-w-5xl">

            {/* Back */}
            <button
              type="button"
              onClick={() =>
                navigate("/bookings")
              }
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
            >
              <FaArrowLeft />
              Back to My Bookings
            </button>

            {/* Error Card */}
            <div className="rounded-2xl bg-white px-6 py-14 text-center shadow-sm">

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                <FaTimesCircle className="text-2xl" />
              </div>

              <h1 className="text-2xl font-bold text-gray-900">
                {getErrorTitle()}
              </h1>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
                {getErrorMessage()}
              </p>

              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

                {!isNotFound &&
                  errorCode !==
                    "INVALID_BOOKING_ID" && (
                    <button
                      type="button"
                      onClick={loadBooking}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      <FaRedo />
                      Try Again
                    </button>
                  )}

                <button
                  type="button"
                  onClick={() =>
                    navigate("/bookings")
                  }
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Back to My Bookings
                </button>

              </div>
            </div>
          </div>
        </div>
      </PageBackground>
    );
  }

  /* =========================================================
     STATUS
     ========================================================= */

  const status = getStatusConfig(
    booking.status
  );

  /* =========================================================
     MAIN UI
     ========================================================= */

  return (
    <PageBackground>
      <div className="min-h-screen px-4 py-8 md:px-8">
        <div className="mx-auto max-w-5xl">

          {/* =================================================
              BACK NAVIGATION
              ================================================= */}

          <button
            type="button"
            onClick={() =>
              navigate("/bookings")
            }
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
          >
            <FaArrowLeft />
            Back to My Bookings
          </button>

          {/* =================================================
              PAGE HEADER
              ================================================= */}

          <div className="mb-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div>
                <p className="mb-1 text-sm font-medium text-gray-500">
                  Booking Details
                </p>

                <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                  {booking.service.name}
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Booking #{booking.booking_number}
                </p>
              </div>

              {/* Status */}
              <div
                className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${status.className}`}
              >
                {status.icon}
                {status.label}
              </div>

            </div>
          </div>

          {/* =================================================
              MAIN BOOKING CARD
              ================================================= */}

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

            {/* =================================================
                BOOKING SUMMARY
                ================================================= */}

            <section className="border-b border-gray-100 p-6 md:p-8">

              <h2 className="mb-5 text-lg font-semibold text-gray-900">
                Booking Summary
              </h2>

              <div className="grid gap-4 md:grid-cols-3">

                {/* Date */}
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-blue-600">
                    <FaCalendarAlt />

                    <span className="text-xs font-semibold uppercase tracking-wide">
                      Date
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-gray-900">
                    {formatDate(
                      booking.scheduled_date
                    )}
                  </p>
                </div>

                {/* Time */}
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-blue-600">
                    <FaClock />

                    <span className="text-xs font-semibold uppercase tracking-wide">
                      Time
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-gray-900">
                    {booking.start_time} -{" "}
                    {booking.end_time}
                  </p>
                </div>

                {/* Price */}
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-blue-600">
                    <FaMoneyBillWave />

                    <span className="text-xs font-semibold uppercase tracking-wide">
                      Total
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-gray-900">
                    {formatPrice(
                      booking.price,
                      booking.currency
                    )}
                  </p>
                </div>

              </div>
            </section>

            {/* =================================================
                SERVICE INFORMATION
                ================================================= */}

            <section className="border-b border-gray-100 p-6 md:p-8">

              <h2 className="mb-5 text-lg font-semibold text-gray-900">
                Service Information
              </h2>

              <div className="rounded-xl border border-gray-200 p-5">

                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <FaTools />
                  </div>

                  <div className="min-w-0 flex-1">

                    <h3 className="text-base font-semibold text-gray-900">
                      {booking.service.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Category:{" "}
                      {booking.service.category}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-sm text-gray-600">

                      <span>
                        <strong>
                          Duration:
                        </strong>{" "}
                        {booking.duration} minutes
                      </span>

                      <span>
                        <strong>
                          Time Slot:
                        </strong>{" "}
                        {booking.start_time} -{" "}
                        {booking.end_time}
                      </span>

                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                PROVIDER INFORMATION
                ================================================= */}

            <section className="border-b border-gray-100 p-6 md:p-8">

              <h2 className="mb-5 text-lg font-semibold text-gray-900">
                Service Provider
              </h2>

              <div className="rounded-xl border border-gray-200 p-5">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                    <FaUser />
                  </div>

                  <div>

                    <h3 className="font-semibold text-gray-900">
                      {booking.provider.name}
                    </h3>

                    <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                      <FaPhone className="text-xs" />
                      {booking.provider.phone}
                    </p>

                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                CUSTOMER INFORMATION
                ================================================= */}

            <section className="border-b border-gray-100 p-6 md:p-8">

              <h2 className="mb-5 text-lg font-semibold text-gray-900">
                Customer Information
              </h2>

              <div className="grid gap-4 md:grid-cols-2">

                {/* Customer Name */}
                <div className="rounded-xl border border-gray-200 p-5">

                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Name
                  </p>

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <FaUser className="text-sm" />
                    </div>

                    <p className="font-medium text-gray-900">
                      {booking.customer.name}
                    </p>

                  </div>
                </div>

                {/* Customer Phone */}
                <div className="rounded-xl border border-gray-200 p-5">

                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Phone
                  </p>

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-green-600">
                      <FaPhone className="text-sm" />
                    </div>

                    <p className="font-medium text-gray-900">
                      {booking.customer.phone}
                    </p>

                  </div>
                </div>

              </div>
            </section>

            {/* =================================================
                SERVICE ADDRESS
                ================================================= */}

            <section className="border-b border-gray-100 p-6 md:p-8">

              <h2 className="mb-5 text-lg font-semibold text-gray-900">
                Service Address
              </h2>

              <div className="flex items-start gap-4 rounded-xl border border-gray-200 p-5">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600">
                  <FaMapMarkerAlt />
                </div>

                <div>

                  <p className="font-semibold text-gray-900">
                    {booking.address.label}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    {booking.address.address_line}
                  </p>

                </div>
              </div>
            </section>

            {/* =================================================
                BOOKING INFORMATION
                ================================================= */}

            <section className="p-6 md:p-8">

              <h2 className="mb-5 text-lg font-semibold text-gray-900">
                Booking Information
              </h2>

              <div className="space-y-4 rounded-xl bg-gray-50 p-5">

                {/* Booking Number */}
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">

                  <span className="flex items-center gap-2 text-sm text-gray-500">
                    <FaHashtag className="text-xs" />
                    Booking Number
                  </span>

                  <span className="font-semibold text-gray-900">
                    {booking.booking_number}
                  </span>

                </div>

                {/* Booking ID */}
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">

                  <span className="text-sm text-gray-500">
                    Booking ID
                  </span>

                  <span className="break-all text-sm font-medium text-gray-700">
                    {booking.id}
                  </span>

                </div>

                {/* Status */}
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">

                  <span className="text-sm text-gray-500">
                    Status
                  </span>

                  <span className="font-semibold text-gray-900">
                    {status.label}
                  </span>

                </div>

                {/* Created */}
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">

                  <span className="text-sm text-gray-500">
                    Created At
                  </span>

                  <span className="text-sm font-medium text-gray-700">
                    {formatCreatedAt(
                      booking.created_at
                    )}
                  </span>

                </div>

                {/* Currency */}
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">

                  <span className="text-sm text-gray-500">
                    Currency
                  </span>

                  <span className="font-medium text-gray-700">
                    {booking.currency}
                  </span>

                </div>

              </div>
            </section>

            {/* =================================================
                ACTIONS
                ================================================= */}

            <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50 p-6 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  navigate("/services")
                }
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
              >
                Browse Services
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/bookings")
                }
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                My Bookings
              </button>

            </div>

          </div>
        </div>
      </div>
    </PageBackground>
  );
};

export default BookingDetails;