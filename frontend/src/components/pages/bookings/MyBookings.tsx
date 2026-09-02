import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUser,
  FaPhone,
  FaChevronRight,
  FaClipboardList,
} from "react-icons/fa";

import { getBookings } from "../../../api/services/bookingApi";
import type { Booking } from "../../../types/booking";

const MyBookings: React.FC = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getBookings();

      setBookings(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  /* =============================== */
  /* LOADING STATE                    */
  /* =============================== */

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <div className="h-8 w-48 animate-pulse rounded bg-white/10" />
            <div className="mt-3 h-4 w-72 animate-pulse rounded bg-white/10" />
          </div>

          <div className="space-y-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="h-6 w-56 rounded bg-white/10" />

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div className="h-16 rounded bg-white/10" />
                  <div className="h-16 rounded bg-white/10" />
                  <div className="h-16 rounded bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* =============================== */
  /* ERROR STATE                      */
  /* =============================== */

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-8 text-center">
            <h2 className="text-xl font-semibold text-red-300">
              Unable to Load Bookings
            </h2>

            <p className="mt-2 text-sm text-red-200/80">
              {error}
            </p>

            <button
              type="button"
              onClick={loadBookings}
              className="mt-6 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =============================== */
  /* EMPTY STATE                      */
  /* =============================== */

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen p-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">
              My Bookings
            </h1>

            <p className="mt-2 text-white/60">
              View and manage your service bookings.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
              <FaClipboardList className="text-2xl text-white/60" />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-white">
              No Bookings Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-white/60">
              You haven't booked any services yet. Browse our
              services and make your first booking.
            </p>

            <button
              type="button"
              onClick={() => navigate("/services")}
              className="mt-6 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
            >
              Browse Services
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =============================== */
  /* SUCCESS STATE                    */
  /* =============================== */

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-6xl">
        {/* PAGE HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            My Bookings
          </h1>

          <p className="mt-2 text-white/60">
            View and manage your service bookings.
          </p>
        </div>

        {/* BOOKING LIST */}
        <div className="space-y-5">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:border-white/20"
            >
              {/* TOP SECTION */}
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold text-white">
                      {booking.service.name}
                    </h2>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        booking.status === "CONFIRMED"
                          ? "bg-green-500/15 text-green-300"
                          : booking.status === "CANCELLED"
                          ? "bg-red-500/15 text-red-300"
                          : booking.status === "COMPLETED"
                          ? "bg-blue-500/15 text-blue-300"
                          : "bg-yellow-500/15 text-yellow-300"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-white/50">
                    Booking #{booking.booking_number}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-sm text-white/50">
                    Total Price
                  </p>

                  <p className="mt-1 text-xl font-bold text-white">
                    {booking.currency}{" "}
                    {booking.price.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* BOOKING INFORMATION */}
              <div className="mt-6 grid gap-4 border-t border-white/10 pt-6 md:grid-cols-2 lg:grid-cols-4">
                {/* DATE */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <FaCalendarAlt className="text-white/70" />
                  </div>

                  <div>
                    <p className="text-xs text-white/40">
                      Scheduled Date
                    </p>

                    <p className="mt-1 text-sm font-medium text-white">
                      {booking.scheduled_date}
                    </p>
                  </div>
                </div>

                {/* TIME */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <FaClock className="text-white/70" />
                  </div>

                  <div>
                    <p className="text-xs text-white/40">
                      Time
                    </p>

                    <p className="mt-1 text-sm font-medium text-white">
                      {booking.start_time} - {booking.end_time}
                    </p>
                  </div>
                </div>

                {/* PROVIDER */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <FaUser className="text-white/70" />
                  </div>

                  <div>
                    <p className="text-xs text-white/40">
                      Provider
                    </p>

                    <p className="mt-1 text-sm font-medium text-white">
                      {booking.provider.name}
                    </p>

                    <p className="mt-1 flex items-center gap-1 text-xs text-white/50">
                      <FaPhone />
                      {booking.provider.phone}
                    </p>
                  </div>
                </div>

                {/* ADDRESS */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <FaMapMarkerAlt className="text-white/70" />
                  </div>

                  <div>
                    <p className="text-xs text-white/40">
                      Service Address
                    </p>

                    <p className="mt-1 text-sm font-medium text-white">
                      {booking.address.label}
                    </p>

                    <p className="mt-1 line-clamp-2 text-xs text-white/50">
                      {booking.address.address_line}
                    </p>
                  </div>
                </div>
              </div>

              {/* FOOTER */}
              <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs text-white/40">
                    Duration
                  </p>

                  <p className="mt-1 text-sm text-white/70">
                    {booking.duration} minutes
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate(`/bookings/${booking.id}`)
                  }
                  className="flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  View Details
                  <FaChevronRight className="text-xs" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;