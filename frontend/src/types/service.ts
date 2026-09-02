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
}