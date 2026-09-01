import { customers } from "../data/customers";
import type {
  Customer,
  RegisterCustomerInput,
} from "../types/customer";

export const registerCustomer = async (
  data: RegisterCustomerInput
): Promise<Customer> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Check if email already exists
  const existingCustomer = customers.find(
    (customer) =>
      customer.email.toLowerCase() === data.email.toLowerCase()
  );

  if (existingCustomer) {
    throw new Error("Email is already registered");
  }

  const newCustomer: Customer = {
    id: crypto.randomUUID(),
    name: data.name,
    email: data.email,
    phone: data.phone,
    password: data.password,
  };

  customers.push(newCustomer);

  return newCustomer;
};


// LOGIN
export const loginCustomer = async (
  email: string,
  password: string
): Promise<Customer> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const customer = customers.find(
    (customer) =>
      customer.email.toLowerCase() === email.toLowerCase() &&
      customer.password === password
  );

  if (!customer) {
    throw new Error("Invalid email or password");
  }

  return customer;
};