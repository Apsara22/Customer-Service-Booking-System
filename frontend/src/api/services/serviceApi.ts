import { mockApi } from "../mock/mockApi";
import type { Service } from "../../types/service";

export interface GetServicesParams {
  search?: string;
  category?: string;
}

export const getServices = async (
  params?: GetServicesParams
): Promise<Service[]> => {
  const response = await mockApi.getServices(params);

  if (!response.success || !response.data) {
    throw new Error(
      response.error?.message || "Failed to fetch services."
    );
  }

  return response.data;
};

export const getServiceById = async (
  serviceId: string
): Promise<Service> => {
  const response = await mockApi.getServiceById(serviceId);

  if (!response.success || !response.data) {
    throw new Error(
      response.error?.message || "Failed to fetch service."
    );
  }

  return response.data;
};