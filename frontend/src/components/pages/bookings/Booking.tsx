
// components/pages/services/Booking.tsx

import {
  useEffect,
  useState,
  type ChangeEvent,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUser,
  FaCheckCircle,
  FaExclamationTriangle,
  FaMoneyBillWave,
} from "react-icons/fa";

import {
  getServiceById,
} from "../../../api/services/serviceApi";

import {
  getServiceAvailability,
} from "../../../api/services/availabilityApi";

import {
  createBooking,
} from "../../../api/services/bookingApi";

import type {
  Service,
  AvailabilitySlot,
} from "../../../types/service";

import type {
  Customer,
  Address,
} from "../../../types/customer";

import type {
  Booking,
} from "../../../types/booking";

import PageBackground from "../../PageBackground";

// =========================================
// MOCK CUSTOMER DATA
// =========================================

const mockCustomer: Customer = {
  id: "customer-001",
  name: "John Doe",
  phone: "9800000000",
};

// =========================================
// MOCK ADDRESS DATA
// =========================================

const mockAddresses: Address[] = [
  {
    id: "address-001",
    label: "Home",
    address_line: "Kathmandu, Nepal",
  },
  {
    id: "address-002",
    label: "Office",
    address_line: "New Baneshwor, Kathmandu, Nepal",
  },
];

// =========================================
// BOOKING PAGE
// =========================================

const Booking = () => {
  const {
    categoryId,
    serviceId,
  } = useParams();

  const navigate = useNavigate();

  // =========================================
  // SERVICE STATE
  // =========================================

  const [service, setService] =
    useState<Service | null>(null);

  const [serviceLoading, setServiceLoading] =
    useState(true);

  const [serviceError, setServiceError] =
    useState<string | null>(null);

  // =========================================
  // BOOKING SELECTION STATE
  // =========================================

  const [selectedDate, setSelectedDate] =
    useState("");

  const [slots, setSlots] =
    useState<AvailabilitySlot[]>([]);

  const [selectedSlotId, setSelectedSlotId] =
    useState("");

  // =========================================
  // AVAILABILITY STATE
  // =========================================

  const [availabilityLoading, setAvailabilityLoading] =
    useState(false);

  const [availabilityError, setAvailabilityError] =
    useState<string | null>(null);

  // =========================================
  // CUSTOMER / ADDRESS STATE
  // =========================================

  const [selectedCustomer] =
    useState<Customer>(mockCustomer);

  const [selectedAddressId, setSelectedAddressId] =
    useState(mockAddresses[0].id);

  // =========================================
  // FORM ERROR STATE
  // =========================================

  const [validationError, setValidationError] =
    useState<string | null>(null);

  // =========================================
  // BOOKING API STATE
  // =========================================

  const [bookingLoading, setBookingLoading] =
    useState(false);

  const [bookingError, setBookingError] =
    useState<string | null>(null);

  // =========================================
  // BOOKING SUCCESS STATE
  // =========================================

  const [bookingSuccessful, setBookingSuccessful] =
    useState(false);

  const [createdBooking, setCreatedBooking] =
    useState<Booking | null>(null);

  // =========================================
  // FETCH SERVICE
  // =========================================

  const loadService = async () => {
    if (!serviceId) {
      setServiceError(
        "Service ID is missing."
      );

      setServiceLoading(false);

      return;
    }

    try {
      setServiceLoading(true);
      setServiceError(null);

      const data =
        await getServiceById(serviceId);

      setService(data);
    } catch (error) {
      setServiceError(
        error instanceof Error
          ? error.message
          : "Failed to load service."
      );
    } finally {
      setServiceLoading(false);
    }
  };

  // =========================================
  // LOAD SERVICE ON PAGE LOAD
  // =========================================

  useEffect(() => {
    loadService();
  }, [serviceId]);

  // =========================================
  // FETCH AVAILABLE TIME SLOTS
  // =========================================

  const loadAvailability = async (
    date: string
  ) => {
    if (!serviceId || !date) {
      return;
    }

    try {
      setAvailabilityLoading(true);
      setAvailabilityError(null);

      setSlots([]);
      setSelectedSlotId("");
      setValidationError(null);
      setBookingError(null);

      const data =
        await getServiceAvailability(
          serviceId,
          date
        );

      setSlots(data.slots);
    } catch (error) {
      setAvailabilityError(
        error instanceof Error
          ? error.message
          : "Failed to load available time slots."
      );
    } finally {
      setAvailabilityLoading(false);
    }
  };

  // =========================================
  // DATE CHANGE
  // =========================================

  const handleDateChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const date = event.target.value;

    setSelectedDate(date);
    setValidationError(null);
    setBookingError(null);
    setSelectedSlotId("");

    if (date) {
      loadAvailability(date);
    } else {
      setSlots([]);
      setSelectedSlotId("");
      setAvailabilityError(null);
    }
  };

  // =========================================
  // SELECT TIME SLOT
  // =========================================

  const handleSlotSelect = (
    slotId: string
  ) => {
    setSelectedSlotId(slotId);
    setValidationError(null);
    setBookingError(null);
  };

  // =========================================
  // SELECT ADDRESS
  // =========================================

  const handleAddressChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedAddressId(
      event.target.value
    );

    setValidationError(null);
    setBookingError(null);
  };

  // =========================================
  // SELECTED SLOT
  // =========================================

  const selectedSlot = slots.find(
    (slot) =>
      slot.id === selectedSlotId
  );

  // =========================================
  // SELECTED ADDRESS
  // =========================================

  const selectedAddress =
    mockAddresses.find(
      (address) =>
        address.id === selectedAddressId
    );

  // =========================================
  // CONFIRM BOOKING
  // =========================================

  const handleConfirmBooking = async () => {
    // -----------------------------------------
    // Clear previous errors
    // -----------------------------------------

    setValidationError(null);
    setBookingError(null);

    // -----------------------------------------
    // Prevent duplicate submission
    // -----------------------------------------

    if (bookingLoading) {
      return;
    }

    // -----------------------------------------
    // Validate service
    // -----------------------------------------

    if (!service) {
      setValidationError(
        "Service information is unavailable."
      );

      return;
    }

    // -----------------------------------------
    // Validate date
    // -----------------------------------------

    if (!selectedDate) {
      setValidationError(
        "Please select a booking date."
      );

      return;
    }

    // -----------------------------------------
    // Validate time slot
    // -----------------------------------------

    if (!selectedSlot) {
      setValidationError(
        "Please select an available time slot."
      );

      return;
    }

    // -----------------------------------------
    // Validate slot availability
    // -----------------------------------------

    if (!selectedSlot.available) {
      setValidationError(
        "This time slot is no longer available. Please select another slot."
      );

      return;
    }

    // -----------------------------------------
    // Validate address
    // -----------------------------------------

    if (!selectedAddress) {
      setValidationError(
        "Please select an address."
      );

      return;
    }

    // -----------------------------------------
    // CREATE BOOKING
    // -----------------------------------------

    try {
      setBookingLoading(true);

      const booking =
        await createBooking({
          service_id: service.id,
          slot_id: selectedSlot.id,
          date: selectedDate,
          customer: selectedCustomer,
          address: selectedAddress,
        });

      // ---------------------------------------
      // Save created booking
      // ---------------------------------------

      setCreatedBooking(booking);

      // ---------------------------------------
      // Show success screen
      // ---------------------------------------

      setBookingSuccessful(true);
    } catch (error) {
      // ---------------------------------------
      // Handle API / business error
      // ---------------------------------------

      setBookingError(
        error instanceof Error
          ? error.message
          : "Failed to create booking. Please try again."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // =========================================
  // LOADING SERVICE
  // =========================================

  if (serviceLoading) {
    return (
      <>
        <PageBackground />

        <section className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <div className="text-center">

            <div
              className="
                w-12
                h-12
                mx-auto
                border-4
                border-white/20
                border-t-purple-500
                rounded-full
                animate-spin
              "
            />

            <p className="mt-5 text-white/60">
              Loading booking details...
            </p>

          </div>
        </section>
      </>
    );
  }

  // =========================================
  // SERVICE ERROR
  // =========================================

  if (serviceError || !service) {
    return (
      <>
        <PageBackground />

        <section className="relative z-10 min-h-screen flex items-center justify-center px-4">

          <div
            className="
              w-full
              max-w-lg
              text-center
              bg-white/10
              backdrop-blur-xl
              border
              border-white/20
              rounded-2xl
              p-8
            "
          >

            <div
              className="
                w-16
                h-16
                mx-auto
                rounded-full
                bg-red-500/20
                flex
                items-center
                justify-center
              "
            >
              <FaExclamationTriangle
                className="text-red-400 text-2xl"
              />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-white">
              Unable to Load Service
            </h1>

            <p className="mt-3 text-white/60">
              {serviceError ||
                "The service could not be found."}
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  categoryId
                    ? `/services/${categoryId}`
                    : "/services"
                )
              }
              className="
                mt-6
                inline-flex
                items-center
                justify-center
                gap-2
                px-6
                py-3
                rounded-lg
                bg-gradient-to-r
                from-purple-600
                to-pink-600
                text-white
                font-semibold
                hover:opacity-90
                transition
              "
            >
              <FaArrowLeft />
              Back to Services
            </button>

          </div>
        </section>
      </>
    );
  }

  // =========================================
  // BOOKING SUCCESS
  // =========================================

  if (bookingSuccessful && createdBooking) {
    return (
      <>
        <PageBackground />

        <section className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">

          <div
            className="
              w-full
              max-w-lg
              text-center
              bg-white/10
              backdrop-blur-xl
              border
              border-white/20
              rounded-2xl
              p-8
              sm:p-10
            "
          >

            {/* Success Icon */}

            <div
              className="
                w-20
                h-20
                mx-auto
                rounded-full
                bg-green-500/15
                border
                border-green-400/20
                flex
                items-center
                justify-center
              "
            >
              <FaCheckCircle
                className="text-green-400 text-4xl"
              />
            </div>

            {/* Heading */}

            <h1 className="mt-6 text-3xl font-bold text-white">
              Booking Successful!
            </h1>

            <p className="mt-3 text-white/60">
              Your service booking has been
              successfully confirmed.
            </p>

            {/* Booking Number */}

            <div
              className="
                mt-5
                inline-flex
                items-center
                px-4
                py-2
                rounded-lg
                bg-green-500/10
                border
                border-green-400/20
              "
            >
              <span className="text-sm text-white/50">
                Booking No:
              </span>

              <span className="ml-2 text-sm font-semibold text-green-300">
                {createdBooking.booking_number}
              </span>
            </div>

            {/* Booking Details */}

            <div
              className="
                mt-7
                text-left
                p-5
                rounded-xl
                bg-white/5
                border
                border-white/10
                space-y-4
              "
            >

              {/* Service */}

              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">
                  Service
                </p>

                <p className="mt-1 text-white font-medium">
                  {createdBooking.service.name}
                </p>
              </div>

              {/* Customer */}

              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">
                  Customer
                </p>

                <p className="mt-1 text-white">
                  {createdBooking.customer.name}
                </p>
              </div>

              {/* Date */}

              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">
                  Date
                </p>

                <p className="mt-1 text-white">
                  {createdBooking.scheduled_date}
                </p>
              </div>

              {/* Time */}

              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">
                  Time
                </p>

                <p className="mt-1 text-white">
                  {createdBooking.start_time} -{" "}
                  {createdBooking.end_time}
                </p>
              </div>

              {/* Address */}

              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">
                  Service Address
                </p>

                <p className="mt-1 text-white">
                  {createdBooking.address.address_line}
                </p>
              </div>

              {/* Status */}

              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">
                  Status
                </p>

                <span
                  className="
                    mt-1
                    inline-flex
                    px-3
                    py-1
                    rounded-full
                    bg-green-500/10
                    border
                    border-green-400/20
                    text-green-300
                    text-xs
                    font-medium
                  "
                >
                  {createdBooking.status}
                </span>
              </div>

              {/* Price */}

              <div
                className="
                  pt-3
                  border-t
                  border-white/10
                  flex
                  items-center
                  justify-between
                "
              >
                <span className="text-white/60">
                  Total
                </span>

                <span className="text-xl font-bold text-white">
                  {createdBooking.currency}{" "}
                  {createdBooking.price.toLocaleString()}
                </span>
              </div>

            </div>

            {/* Buttons */}

            <div className="mt-7 flex flex-col sm:flex-row gap-3">

              <button
                type="button"
                onClick={() =>
                  navigate("/bookings")
                }
                className="
                  flex-1
                  py-3
                  rounded-xl
                  bg-gradient-to-r
                  from-purple-600
                  to-pink-600
                  text-white
                  font-semibold
                  hover:opacity-90
                  transition
                "
              >
                My Bookings
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/services")
                }
                className="
                  flex-1
                  py-3
                  rounded-xl
                  bg-white/10
                  border
                  border-white/20
                  text-white
                  font-semibold
                  hover:bg-white/15
                  transition
                "
              >
                Browse Services
              </button>

            </div>

            <p className="mt-5 text-xs text-white/40">
              Thank you for choosing our service.
            </p>

          </div>
        </section>
      </>
    );
  }

  // =========================================
  // MAIN BOOKING PAGE
  // =========================================

  return (
    <>
      <PageBackground />

      <section
        className="
          relative
          z-10
          min-h-screen
          px-4
          sm:px-6
          py-8
        "
      >

        <div className="max-w-6xl mx-auto">

          {/* ================================= */}
          {/* BACK BUTTON */}
          {/* ================================= */}

          <button
            type="button"
            onClick={() =>
              navigate(
                `/services/${categoryId}/${serviceId}`
              )
            }
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              text-white/60
              hover:text-white
              transition
              mb-6
            "
          >
            <FaArrowLeft />
            Back to Service Details
          </button>

          {/* ================================= */}
          {/* PAGE TITLE */}
          {/* ================================= */}

          <div className="mb-8">

            <span
              className="
                inline-flex
                items-center
                px-3
                py-1
                rounded-full
                bg-purple-500/15
                border
                border-purple-400/20
                text-purple-300
                text-xs
                font-medium
              "
            >
              Booking
            </span>

            <h1
              className="
                mt-3
                text-3xl
                sm:text-4xl
                font-bold
                text-white
              "
            >
              Book Your Service
            </h1>

            <p className="mt-2 text-white/60">
              Select your preferred date and time
              to continue.
            </p>

          </div>

          {/* ================================= */}
          {/* MAIN GRID */}
          {/* ================================= */}

          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-3
              gap-6
            "
          >

            {/* ================================= */}
            {/* LEFT - BOOKING FORM */}
            {/* ================================= */}

            <div
              className="
                lg:col-span-2
                space-y-6
              "
            >

              {/* ================================= */}
              {/* DATE */}
              {/* ================================= */}

              <div
                className="
                  bg-white/10
                  backdrop-blur-xl
                  border
                  border-white/20
                  rounded-2xl
                  p-6
                "
              >

                <div className="flex items-center gap-3">

                  <div
                    className="
                      w-10
                      h-10
                      rounded-lg
                      bg-purple-500/15
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <FaCalendarAlt className="text-purple-400" />
                  </div>

                  <div>

                    <h2 className="text-lg font-semibold text-white">
                      Select Date
                    </h2>

                    <p className="text-sm text-white/50">
                      Choose your preferred booking date.
                    </p>

                  </div>

                </div>

                <div className="mt-5">

                  <input
                    type="date"
                    value={selectedDate}
                    min={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={handleDateChange}
                    className="
                      w-full
                      px-4
                      py-3
                      bg-white/10
                      border
                      border-white/20
                      rounded-xl
                      text-white
                      outline-none
                      focus:border-purple-400
                      focus:ring-2
                      focus:ring-purple-500/30
                    "
                  />

                </div>

              </div>

              {/* ================================= */}
              {/* TIME SLOTS */}
              {/* ================================= */}

              <div
                className="
                  bg-white/10
                  backdrop-blur-xl
                  border
                  border-white/20
                  rounded-2xl
                  p-6
                "
              >

                <div className="flex items-center gap-3">

                  <div
                    className="
                      w-10
                      h-10
                      rounded-lg
                      bg-purple-500/15
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <FaClock className="text-purple-400" />
                  </div>

                  <div>

                    <h2 className="text-lg font-semibold text-white">
                      Select Time
                    </h2>

                    <p className="text-sm text-white/50">
                      Choose an available time slot.
                    </p>

                  </div>

                </div>

                {/* No date */}

                {!selectedDate && (
                  <div className="mt-6 text-center py-8">

                    <FaCalendarAlt
                      className="
                        mx-auto
                        text-white/30
                        text-2xl
                      "
                    />

                    <p className="mt-3 text-white/50">
                      Please select a date first.
                    </p>

                  </div>
                )}

                {/* Loading */}

                {selectedDate &&
                  availabilityLoading && (
                    <div className="mt-6 text-center py-8">

                      <div
                        className="
                          w-8
                          h-8
                          mx-auto
                          border-4
                          border-white/20
                          border-t-purple-500
                          rounded-full
                          animate-spin
                        "
                      />

                      <p className="mt-3 text-white/50">
                        Loading available slots...
                      </p>

                    </div>
                  )}

                {/* Availability error */}

                {selectedDate &&
                  !availabilityLoading &&
                  availabilityError && (
                    <div
                      className="
                        mt-6
                        p-4
                        rounded-xl
                        bg-red-500/10
                        border
                        border-red-400/20
                      "
                    >

                      <div className="flex items-center gap-3">

                        <FaExclamationTriangle className="text-red-400" />

                        <p className="text-sm text-red-300">
                          {availabilityError}
                        </p>

                      </div>

                    </div>
                  )}

                {/* Empty slots */}

                {selectedDate &&
                  !availabilityLoading &&
                  !availabilityError &&
                  slots.length === 0 && (
                    <div className="mt-6 text-center py-8">

                      <FaClock
                        className="
                          mx-auto
                          text-white/30
                          text-2xl
                        "
                      />

                      <p className="mt-3 text-white/50">
                        No time slots are available
                        for this date.
                      </p>

                    </div>
                  )}

                {/* Slots */}

                {selectedDate &&
                  !availabilityLoading &&
                  !availabilityError &&
                  slots.length > 0 && (

                    <div
                      className="
                        mt-6
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        gap-3
                      "
                    >

                      {slots.map((slot) => {

                        const isSelected =
                          selectedSlotId === slot.id;

                        return (
                          <button
                            key={slot.id}
                            type="button"
                            disabled={
                              !slot.available ||
                              bookingLoading
                            }
                            onClick={() =>
                              slot.available &&
                              handleSlotSelect(
                                slot.id
                              )
                            }
                            className={`
                              p-4
                              rounded-xl
                              border
                              text-left
                              transition-all
                              ${
                                isSelected
                                  ? "bg-purple-600/30 border-purple-400 text-white"
                                  : slot.available
                                  ? "bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-purple-400/50"
                                  : "bg-gray-600/20 border-white/10 text-white/30 cursor-not-allowed"
                              }
                            `}
                          >

                            <div className="flex items-center justify-between">

                              <div className="flex items-center gap-3">

                                <FaClock
                                  className={
                                    isSelected
                                      ? "text-purple-300"
                                      : "text-white/40"
                                  }
                                />

                                <span className="font-medium">
                                  {slot.start_time}
                                  {" - "}
                                  {slot.end_time}
                                </span>

                              </div>

                              {isSelected && (
                                <FaCheckCircle className="text-purple-300" />
                              )}

                            </div>

                            <p className="mt-2 text-xs text-white/40">
                              {slot.available
                                ? "Available"
                                : "Unavailable"}
                            </p>

                          </button>
                        );
                      })}

                    </div>
                  )}

              </div>

              {/* ================================= */}
              {/* CUSTOMER */}
              {/* ================================= */}

              <div
                className="
                  bg-white/10
                  backdrop-blur-xl
                  border
                  border-white/20
                  rounded-2xl
                  p-6
                "
              >

                <div className="flex items-center gap-3">

                  <div
                    className="
                      w-10
                      h-10
                      rounded-lg
                      bg-purple-500/15
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <FaUser className="text-purple-400" />
                  </div>

                  <div>

                    <h2 className="text-lg font-semibold text-white">
                      Customer
                    </h2>

                    <p className="text-sm text-white/50">
                      Booking will be created for this customer.
                    </p>

                  </div>

                </div>

                <div
                  className="
                    mt-5
                    p-4
                    rounded-xl
                    bg-white/5
                    border
                    border-white/10
                  "
                >

                  <p className="font-medium text-white">
                    {selectedCustomer.name}
                  </p>

                  <p className="mt-1 text-sm text-white/50">
                    {selectedCustomer.phone}
                  </p>

                </div>

              </div>

              {/* ================================= */}
              {/* ADDRESS */}
              {/* ================================= */}

              <div
                className="
                  bg-white/10
                  backdrop-blur-xl
                  border
                  border-white/20
                  rounded-2xl
                  p-6
                "
              >

                <div className="flex items-center gap-3">

                  <div
                    className="
                      w-10
                      h-10
                      rounded-lg
                      bg-purple-500/15
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <FaMapMarkerAlt className="text-purple-400" />
                  </div>

                  <div>

                    <h2 className="text-lg font-semibold text-white">
                      Service Address
                    </h2>

                    <p className="text-sm text-white/50">
                      Where should the service be provided?
                    </p>

                  </div>

                </div>

                <div className="mt-5">

                  <select
                    value={selectedAddressId}
                    onChange={handleAddressChange}
                    disabled={bookingLoading}
                    className="
                      w-full
                      px-4
                      py-3
                      bg-gray-900
                      border
                      border-white/20
                      rounded-xl
                      text-white
                      outline-none
                      focus:border-purple-400
                      focus:ring-2
                      focus:ring-purple-500/30
                      disabled:opacity-50
                    "
                  >

                    {mockAddresses.map(
                      (address) => (
                        <option
                          key={address.id}
                          value={address.id}
                        >
                          {address.label} -{" "}
                          {address.address_line}
                        </option>
                      )
                    )}

                  </select>

                </div>

              </div>

              {/* ================================= */}
              {/* VALIDATION ERROR */}
              {/* ================================= */}

              {validationError && (
                <div
                  className="
                    p-4
                    rounded-xl
                    bg-red-500/10
                    border
                    border-red-400/20
                  "
                >

                  <div className="flex items-start gap-3">

                    <FaExclamationTriangle className="mt-0.5 text-red-400" />

                    <p className="text-sm text-red-300">
                      {validationError}
                    </p>

                  </div>

                </div>
              )}

              {/* ================================= */}
              {/* BOOKING API ERROR */}
              {/* ================================= */}

              {bookingError && (
                <div
                  className="
                    p-4
                    rounded-xl
                    bg-red-500/10
                    border
                    border-red-400/20
                  "
                >

                  <div className="flex items-start gap-3">

                    <FaExclamationTriangle className="mt-0.5 text-red-400" />

                    <div>
                      <p className="text-sm font-medium text-red-300">
                        Booking Failed
                      </p>

                      <p className="mt-1 text-sm text-red-300/80">
                        {bookingError}
                      </p>
                    </div>

                  </div>

                </div>
              )}

            </div>

            {/* ================================= */}
            {/* RIGHT - BOOKING SUMMARY */}
            {/* ================================= */}

            <aside>

              <div
                className="
                  lg:sticky
                  lg:top-24
                  bg-white/10
                  backdrop-blur-xl
                  border
                  border-white/20
                  rounded-2xl
                  p-6
                "
              >

                <h2 className="text-xl font-bold text-white">
                  Booking Summary
                </h2>

                {/* Service */}

                <div className="mt-6">

                  <p className="text-xs uppercase tracking-wide text-white/40">
                    Service
                  </p>

                  <p className="mt-2 text-lg font-semibold text-white">
                    {service.name}
                  </p>

                  <p className="mt-1 text-sm text-white/50">
                    {service.description}
                  </p>

                </div>

                {/* Divider */}

                <div className="my-5 border-t border-white/10" />

                {/* Date */}

                <div className="flex items-start gap-3">

                  <FaCalendarAlt className="mt-1 text-purple-400" />

                  <div>

                    <p className="text-xs text-white/40">
                      Date
                    </p>

                    <p className="mt-1 text-sm text-white">
                      {selectedDate ||
                        "Not selected"}
                    </p>

                  </div>

                </div>

                {/* Time */}

                <div className="mt-4 flex items-start gap-3">

                  <FaClock className="mt-1 text-purple-400" />

                  <div>

                    <p className="text-xs text-white/40">
                      Time
                    </p>

                    <p className="mt-1 text-sm text-white">
                      {selectedSlot
                        ? `${selectedSlot.start_time} - ${selectedSlot.end_time}`
                        : "Not selected"}
                    </p>

                  </div>

                </div>

                {/* Address */}

                <div className="mt-4 flex items-start gap-3">

                  <FaMapMarkerAlt className="mt-1 text-purple-400" />

                  <div>

                    <p className="text-xs text-white/40">
                      Address
                    </p>

                    <p className="mt-1 text-sm text-white">
                      {selectedAddress?.address_line ||
                        "Not selected"}
                    </p>

                  </div>

                </div>

                {/* Divider */}

                <div className="my-5 border-t border-white/10" />

                {/* Price */}

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2">

                    <FaMoneyBillWave className="text-green-400" />

                    <span className="text-white/60">
                      Total
                    </span>

                  </div>

                  <span className="text-xl font-bold text-white">
                    NPR{" "}
                    {service.price.toLocaleString()}
                  </span>

                </div>

                {/* Confirm */}

                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  disabled={bookingLoading}
                  className="
                    mt-6
                    w-full
                    py-3.5
                    rounded-xl
                    bg-gradient-to-r
                    from-purple-600
                    to-pink-600
                    text-white
                    font-semibold
                    hover:from-purple-700
                    hover:to-pink-700
                    hover:shadow-lg
                    hover:shadow-purple-500/20
                    transition-all
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                    disabled:hover:shadow-none
                  "
                >
                  {bookingLoading ? (
                    <span className="flex items-center justify-center gap-3">

                      <span
                        className="
                          w-5
                          h-5
                          border-2
                          border-white/30
                          border-t-white
                          rounded-full
                          animate-spin
                        "
                      />

                      Confirming Booking...

                    </span>
                  ) : (
                    "Confirm Booking"
                  )}
                </button>

                <p className="mt-3 text-center text-xs text-white/40">
                  Please review your booking details
                  before confirming.
                </p>

              </div>

            </aside>

          </div>

        </div>

      </section>
    </>
  );
};

export default Booking;

