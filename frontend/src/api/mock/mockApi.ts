
import { services } from "./mockData";
import { mockBookings } from "./mockDatabase";

import type {
  Service,
  ServiceAvailabilityResponse,
  AvailabilitySlot,
} from "../../types/service";

import type {
  Booking,
  CreateBookingRequest,
  CreateBookingResponse,
} from "../../types/booking";

const MOCK_DELAY = 700;

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export interface MockApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export const mockApi = {
  // =========================================
  // GET SERVICES
  // =========================================

  async getServices(params?: {
    search?: string;
    category?: string;
  }): Promise<MockApiResponse<Service[]>> {
    await delay(MOCK_DELAY);

    let result = [...services];

    // Category filter
    if (params?.category) {
      result = result.filter(
        (service) =>
          service.categoryId === params.category
      );
    }

    // Search filter
    if (params?.search) {
      const search = params.search
        .trim()
        .toLowerCase();

      result = result.filter(
        (service) =>
          service.name
            .toLowerCase()
            .includes(search) ||
          service.description
            .toLowerCase()
            .includes(search)
      );
    }

    return {
      success: true,
      data: result,
    };
  },

  // =========================================
  // GET SERVICE BY ID
  // =========================================

  async getServiceById(
    serviceId: string
  ): Promise<MockApiResponse<Service>> {
    await delay(MOCK_DELAY);

    const service = services.find(
      (item) => item.id === serviceId
    );

    if (!service) {
      return {
        success: false,
        error: {
          code: "SERVICE_NOT_FOUND",
          message: "Service not found.",
        },
      };
    }

    return {
      success: true,
      data: service,
    };
  },

  // =========================================
  // GET SERVICE AVAILABILITY
  // =========================================

  async getServiceAvailability(
    serviceId: string,
    date: string
  ): Promise<
    MockApiResponse<ServiceAvailabilityResponse>
  > {
    await delay(MOCK_DELAY);

    // -----------------------------------------
    // Check service
    // -----------------------------------------

    const service = services.find(
      (item) => item.id === serviceId
    );

    if (!service) {
      return {
        success: false,
        error: {
          code: "SERVICE_NOT_FOUND",
          message: "Service not found.",
        },
      };
    }

    // -----------------------------------------
    // Check service availability
    // -----------------------------------------

    if (!service.isAvailable) {
      return {
        success: false,
        error: {
          code: "SERVICE_UNAVAILABLE",
          message:
            "This service is currently unavailable.",
        },
      };
    }

    // -----------------------------------------
    // Validate date
    // -----------------------------------------

    if (!date) {
      return {
        success: false,
        error: {
          code: "INVALID_DATE",
          message: "A valid date is required.",
        },
      };
    }

    // -----------------------------------------
    // Mock time slots
    // -----------------------------------------

    const slots: AvailabilitySlot[] = [
      {
        id: `${serviceId}-${date}-09`,
        start_time: "09:00",
        end_time: "11:00",
        available: true,
      },
      {
        id: `${serviceId}-${date}-11`,
        start_time: "11:00",
        end_time: "13:00",
        available: true,
      },
      {
        id: `${serviceId}-${date}-14`,
        start_time: "14:00",
        end_time: "16:00",
        available: true,
      },
      {
        id: `${serviceId}-${date}-16`,
        start_time: "16:00",
        end_time: "18:00",
        available: true,
      },
    ];

    // -----------------------------------------
    // Mark already booked slots unavailable
    // -----------------------------------------

    const updatedSlots = slots.map((slot) => {
      const alreadyBooked = mockBookings.some(
        (booking) =>
          booking.service.id === serviceId &&
          booking.scheduled_date === date &&
          booking.slot_id === slot.id &&
          booking.status !== "CANCELLED"
      );

      return {
        ...slot,
        available: !alreadyBooked,
      };
    });

    return {
      success: true,
      data: {
        service_id: serviceId,
        date,
        slots: updatedSlots,
      },
    };
  },

  // =========================================
  // CREATE BOOKING
  // POST /api/v1/bookings
  // =========================================

  async createBooking(
    request: CreateBookingRequest
  ): Promise<MockApiResponse<CreateBookingResponse>> {
    await delay(MOCK_DELAY);

    // -----------------------------------------
    // Validate service ID
    // -----------------------------------------

    if (!request.service_id) {
      return {
        success: false,
        error: {
          code: "INVALID_SERVICE",
          message: "Service is required.",
        },
      };
    }

    // -----------------------------------------
    // Validate slot ID
    // -----------------------------------------

    if (!request.slot_id) {
      return {
        success: false,
        error: {
          code: "INVALID_SLOT",
          message: "Time slot is required.",
        },
      };
    }

    // -----------------------------------------
    // Validate date
    // -----------------------------------------

    if (!request.date) {
      return {
        success: false,
        error: {
          code: "INVALID_DATE",
          message: "Booking date is required.",
        },
      };
    }

    // -----------------------------------------
    // Validate customer
    // -----------------------------------------

    if (!request.customer) {
      return {
        success: false,
        error: {
          code: "INVALID_CUSTOMER",
          message: "Customer information is required.",
        },
      };
    }

    if (
      !request.customer.id ||
      !request.customer.name ||
      !request.customer.phone
    ) {
      return {
        success: false,
        error: {
          code: "INVALID_CUSTOMER",
          message:
            "Complete customer information is required.",
        },
      };
    }

    // -----------------------------------------
    // Validate address
    // -----------------------------------------

    if (!request.address) {
      return {
        success: false,
        error: {
          code: "INVALID_ADDRESS",
          message: "Address is required.",
        },
      };
    }

    if (
      !request.address.id ||
      !request.address.label ||
      !request.address.address_line
    ) {
      return {
        success: false,
        error: {
          code: "INVALID_ADDRESS",
          message:
            "Complete address information is required.",
        },
      };
    }

    // -----------------------------------------
    // Find service
    // -----------------------------------------

    const service = services.find(
      (item) => item.id === request.service_id
    );

    if (!service) {
      return {
        success: false,
        error: {
          code: "SERVICE_NOT_FOUND",
          message: "Service not found.",
        },
      };
    }

    // -----------------------------------------
    // Check service availability
    // -----------------------------------------

    if (!service.isAvailable) {
      return {
        success: false,
        error: {
          code: "SERVICE_UNAVAILABLE",
          message:
            "This service is currently unavailable.",
        },
      };
    }

    // -----------------------------------------
    // Validate slot
    // -----------------------------------------

    const validSlotIds = [
      `${request.service_id}-${request.date}-09`,
      `${request.service_id}-${request.date}-11`,
      `${request.service_id}-${request.date}-14`,
      `${request.service_id}-${request.date}-16`,
    ];

    if (!validSlotIds.includes(request.slot_id)) {
      return {
        success: false,
        error: {
          code: "INVALID_SLOT",
          message:
            "The selected time slot is invalid.",
        },
      };
    }

    // -----------------------------------------
    // Find selected slot
    // -----------------------------------------

    const slotMap: Record<
      string,
      { start_time: string; end_time: string }
    > = {
      [`${request.service_id}-${request.date}-09`]: {
        start_time: "09:00",
        end_time: "11:00",
      },

      [`${request.service_id}-${request.date}-11`]: {
        start_time: "11:00",
        end_time: "13:00",
      },

      [`${request.service_id}-${request.date}-14`]: {
        start_time: "14:00",
        end_time: "16:00",
      },

      [`${request.service_id}-${request.date}-16`]: {
        start_time: "16:00",
        end_time: "18:00",
      },
    };

    const selectedSlot = slotMap[request.slot_id];

    if (!selectedSlot) {
      return {
        success: false,
        error: {
          code: "INVALID_SLOT",
          message:
            "The selected time slot is invalid.",
        },
      };
    }

    // -----------------------------------------
    // Check booking conflict
    // -----------------------------------------

    const existingBooking = mockBookings.find(
      (booking) =>
        booking.service.id === request.service_id &&
        booking.scheduled_date === request.date &&
        booking.slot_id === request.slot_id &&
        booking.status !== "CANCELLED"
    );

    if (existingBooking) {
      return {
        success: false,
        error: {
          code: "BOOKING_CONFLICT",
          message:
            "This time slot has already been booked. Please select another slot.",
        },
      };
    }

    // -----------------------------------------
    // Generate booking ID
    // -----------------------------------------

    const bookingId = `booking-${Date.now()}`;

    // -----------------------------------------
    // Generate booking number
    // -----------------------------------------

    const bookingNumber = `BK-${Date.now()
      .toString()
      .slice(-6)}`;

    // -----------------------------------------
    // Create booking
    // -----------------------------------------

    const booking: Booking = {
      id: bookingId,

      booking_number: bookingNumber,

      service: {
        id: service.id,
        name: service.name,
        category: service.categoryId,
      },

      provider: {
        id: "provider-001",
        name: "Service Professional",
        phone: "9800000000",
      },

      scheduled_date: request.date,

      start_time: selectedSlot.start_time,

      end_time: selectedSlot.end_time,

      slot_id: request.slot_id,

      status: "CONFIRMED",

      price: service.price,

      currency: "NPR",

      duration: service.duration,

      customer: request.customer,

      address: request.address,

      created_at: new Date().toISOString(),
    };

    // -----------------------------------------
    // Save booking
    // -----------------------------------------

    mockBookings.push(booking);

    // -----------------------------------------
    // Return response
    // -----------------------------------------

    return {
      success: true,
      data: {
        booking,
      },
    };
  },

  // =========================================
  // GET ALL BOOKINGS
  // GET /api/v1/bookings
  // =========================================

  async getBookings(): Promise<
    MockApiResponse<Booking[]>
  > {
    await delay(MOCK_DELAY);

    return {
      success: true,
      data: [...mockBookings],
    };
  },

  // =========================================
  // GET BOOKING BY ID
  // GET /api/v1/bookings/:booking_id
  // =========================================

  async getBookingById(
    bookingId: string
  ): Promise<MockApiResponse<Booking>> {
    await delay(MOCK_DELAY);

    const booking = mockBookings.find(
      (item) => item.id === bookingId
    );

    if (!booking) {
      return {
        success: false,
        error: {
          code: "BOOKING_NOT_FOUND",
          message: "Booking not found.",
        },
      };
    }

    return {
      success: true,
      data: booking,
    };
  },
};

