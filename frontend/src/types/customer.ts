export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterCustomerInput {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface Address {
  id: string;
  label: string;
  address_line: string;
}