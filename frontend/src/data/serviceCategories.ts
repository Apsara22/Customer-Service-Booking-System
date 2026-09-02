import type { Service, ServiceCategory } from "../types/service";

import {
  FaBroom,
  FaWrench,
  FaBolt,
  FaPlug,
  FaPaintRoller,
  FaSeedling,
} from "react-icons/fa";

/**
 * Service Categories
 */
export const serviceCategories: ServiceCategory[] = [
  {
    id: "cleaning",
    name: "Cleaning",
    description: "Professional cleaning services for homes and offices.",
    icon: FaBroom,
  },
  {
    id: "plumbing",
    name: "Plumbing",
    description: "Professional plumbing repair and maintenance services.",
    icon: FaWrench,
  },
  {
    id: "electrical",
    name: "Electrical",
    description: "Professional electrical installation and repair services.",
    icon: FaBolt,
  },
  {
    id: "appliance",
    name: "Appliance Repair",
    description: "Professional repair services for home appliances.",
    icon: FaPlug,
  },
  {
    id: "painting",
    name: "Painting",
    description: "Professional interior and exterior painting services.",
    icon: FaPaintRoller,
  },
  {
    id: "gardening",
    name: "Gardening",
    description: "Professional gardening and landscaping services.",
    icon: FaSeedling,
  },
];

/**
 * Services
 */
export const services: Service[] = [
  // =========================
  // Cleaning Services
  // =========================

  {
    id: "home-cleaning",
    categoryId: "cleaning",
    name: "Home Cleaning",
    description: "Professional cleaning service for your home.",
    price: 1500,
    duration: 120,
  },

  {
    id: "office-cleaning",
    categoryId: "cleaning",
    name: "Office Cleaning",
    description: "Professional cleaning service for offices.",
    price: 2500,
    duration: 180,
  },

  {
    id: "deep-cleaning",
    categoryId: "cleaning",
    name: "Deep Cleaning",
    description: "Detailed deep cleaning for your property.",
    price: 3500,
    duration: 240,
  },

  {
    id: "move-cleaning",
    categoryId: "cleaning",
    name: "Move-in / Move-out Cleaning",
    description: "Complete cleaning service before moving in or out.",
    price: 3000,
    duration: 180,
  },

  // =========================
  // Plumbing Services
  // =========================

  {
    id: "pipe-repair",
    categoryId: "plumbing",
    name: "Pipe Repair",
    description: "Repair damaged or leaking pipes.",
    price: 1200,
    duration: 60,
  },

  {
    id: "tap-repair",
    categoryId: "plumbing",
    name: "Tap Repair",
    description: "Repair leaking or damaged taps.",
    price: 800,
    duration: 45,
  },

  {
    id: "toilet-repair",
    categoryId: "plumbing",
    name: "Toilet Repair",
    description: "Professional toilet repair and maintenance.",
    price: 1000,
    duration: 60,
  },

  {
    id: "water-leakage",
    categoryId: "plumbing",
    name: "Water Leakage Repair",
    description: "Find and repair water leakage problems.",
    price: 1500,
    duration: 90,
  },

  // =========================
  // Electrical Services
  // =========================

  {
    id: "wiring-repair",
    categoryId: "electrical",
    name: "Wiring Repair",
    description: "Professional electrical wiring repair.",
    price: 1500,
    duration: 90,
  },

  {
    id: "fan-installation",
    categoryId: "electrical",
    name: "Fan Installation",
    description: "Safe ceiling and exhaust fan installation.",
    price: 1000,
    duration: 60,
  },

  {
    id: "light-installation",
    categoryId: "electrical",
    name: "Light Installation",
    description: "Professional indoor and outdoor light installation.",
    price: 800,
    duration: 45,
  },

  {
    id: "switch-repair",
    categoryId: "electrical",
    name: "Switch Repair",
    description: "Repair and replacement of electrical switches.",
    price: 600,
    duration: 30,
  },

  // =========================
  // Appliance Repair
  // =========================

  {
    id: "refrigerator-repair",
    categoryId: "appliance",
    name: "Refrigerator Repair",
    description: "Professional refrigerator inspection and repair.",
    price: 1800,
    duration: 120,
  },

  {
    id: "washing-machine-repair",
    categoryId: "appliance",
    name: "Washing Machine Repair",
    description: "Washing machine inspection and repair service.",
    price: 1600,
    duration: 120,
  },

  {
    id: "ac-repair",
    categoryId: "appliance",
    name: "AC Repair",
    description: "Air conditioner inspection and repair.",
    price: 2000,
    duration: 120,
  },

  // =========================
  // Painting Services
  // =========================

  {
    id: "interior-painting",
    categoryId: "painting",
    name: "Interior Painting",
    description: "Professional interior wall painting service.",
    price: 5000,
    duration: 480,
  },

  {
    id: "exterior-painting",
    categoryId: "painting",
    name: "Exterior Painting",
    description: "Professional exterior painting service.",
    price: 7000,
    duration: 600,
  },

  {
    id: "room-painting",
    categoryId: "painting",
    name: "Room Painting",
    description: "Complete painting service for individual rooms.",
    price: 2500,
    duration: 240,
  },

  // =========================
  // Gardening Services
  // =========================

  {
    id: "lawn-maintenance",
    categoryId: "gardening",
    name: "Lawn Maintenance",
    description: "Regular lawn cleaning and maintenance.",
    price: 1200,
    duration: 120,
  },

  {
    id: "garden-cleaning",
    categoryId: "gardening",
    name: "Garden Cleaning",
    description: "Complete garden cleaning and maintenance.",
    price: 1500,
    duration: 120,
  },

  {
    id: "landscaping",
    categoryId: "gardening",
    name: "Landscaping",
    description: "Professional garden landscaping service.",
    price: 5000,
    duration: 300,
  },
];