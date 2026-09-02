import { mockApi } from "../mock/mockApi";
import type { ServiceAvailabilityResponse } from "../../types/service";

export const getServiceAvailability = async (
  serviceId: string,
  date: string
): Promise<ServiceAvailabilityResponse> => {
  const response = await mockApi.getServiceAvailability(
    serviceId,
    date
  );

  if (!response.success || !response.data) {
    throw new Error(
      response.error?.message ||
        "Failed to fetch service availability."
    );
  }

  return response.data;
};