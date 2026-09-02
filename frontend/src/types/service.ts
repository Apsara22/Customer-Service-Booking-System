import type { IconType } from "react-icons";

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: IconType;
}

export interface Service {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  isAvailable: boolean;
}

/**
 * Available time slot
 */
export interface AvailabilitySlot {
  id: string;
  start_time: string;
  end_time: string;
  available: boolean;
}

/**
 * Service availability response
 */
export interface ServiceAvailabilityResponse {
  service_id: string;
  date: string;
  slots: AvailabilitySlot[];
}