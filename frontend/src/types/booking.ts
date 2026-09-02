import type { Address, Customer } from "./customer";

export type BookingStatus =
  | "CONFIRMED"
  | "PENDING"
  | "COMPLETED"
  | "CANCELLED";

export interface BookingProvider {
  id: string;
  name: string;
  phone: string;
}

export interface BookingService {
  id: string;
  name: string;
  category: string;
}

export interface Booking {
  id: string;
  booking_number: string;

  service: BookingService;

  provider: BookingProvider;

  scheduled_date: string;

  start_time: string;
  end_time: string;

  slot_id: string;

  status: BookingStatus;

  price: number;
  currency: string;
  duration: number;

  customer: Customer;
  address: Address;

  created_at: string;
}

export interface CreateBookingRequest {
  service_id: string;
  slot_id: string;
  date: string;

  customer: Customer;
  address: Address;
}

export interface CreateBookingResponse {
  booking: Booking;
}