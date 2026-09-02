
import { services } from "./mockData";

import type {
  Service,
  ServiceAvailabilityResponse,
  AvailabilitySlot,
} from "../../types/service";

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

    return {
      success: true,
      data: {
        service_id: serviceId,
        date,
        slots,
      },
    };
  },
};

