import { services } from "./mockData";
import type { Service } from "../../types/service";

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
      const search = params.search.trim().toLowerCase();

      result = result.filter(
        (service) =>
          service.name.toLowerCase().includes(search) ||
          service.description.toLowerCase().includes(search)
      );
    }

    return {
      success: true,
      data: result,
    };
  },

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
};