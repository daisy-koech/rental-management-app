// Mock data for the frontend

export const property = {
  name: "Cedar Court",
  address: "Elgon View, Eldoret",
  description:
    "A quiet 6 unit residential building a short walk from Elgon View shopping centre. Managed directly by the owner, with maintenance handled on site.",
  images: {
    exterior:
      "https://images.unsplash.com/photo-1651995859057-9f4668c96831?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    interior:
      "https://images.unsplash.com/photo-1746439324733-cae3b67aa0fa?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  latitude: 0.5254,
  longitude: 35.2698,
  totalUnits: 6,
  landlord: { name: "Johnson Koech", phone: "++254 700 000 000", email: "johnsonkoech@example.com" }
};

export const units = [
  { id: 1, unitNumber: "A1", bedrooms: 2, bathrooms: 1, status: "occupied", tenantName: "Marion Jane" },
  { id: 2, unitNumber: "A2", bedrooms: 2, bathrooms: 1, status: "occupied", tenantName: "Peter Kamau" },
  { id: 3, unitNumber: "B1", bedrooms: 1, bathrooms: 1, status: "vacant", tenantName: null },
  { id: 4, unitNumber: "B2", bedrooms: 2, bathrooms: 1, status: "occupied", tenantName: "Susan Achieng" },
  { id: 5, unitNumber: "C1", bedrooms: 1, bathrooms: 1, status: "occupied", tenantName: "Daniel Too" },
  { id: 6, unitNumber: "C2", bedrooms: 2, bathrooms: 2, status: "vacant", tenantName: null }
];

// Mock "logged in" tenant for the Tenant Dashboard.
export const currentTenant = {
  name: "Marion Jane",
  unit: "A1",
  leaseStart: "2025-02-01",
  leaseEnd: "2027-01-31",
  leaseStatus: "active",
  rentAmount: 22000,
  rentStatus: "paid",
  lastPaymentDate: "2026-08-03"
};

export const notices = [
  {
    id: 1,
    title: "Water tank cleaning",
    date: "2026-08-31",
    message: "The main water tank will be cleaned on Saturday morning. Expect low pressure between 8am and 11am."
  },
  {
    id: 2,
    title: "Parking reminder",
    date: "2026-07-28",
    message: "Please do not block entrances, driveways, or other vehicles."
  }
];

export const maintenanceTickets = [
  {
    id: 1,
    unit: "A1",
    tenantName: "Marion Jane",
    description: "Kitchen sink is leaking under the cabinet.",
    status: "In Progress",
    priority: "Medium",
    dateSubmitted: "2026-08-20"
  },
  {
    id: 2,
    unit: "B2",
    tenantName: "Susan Achieng",
    description: "Bedroom window doesn't lock properly.",
    status: "Open",
    priority: "High",
    dateSubmitted: "2026-08-17"
  },
  {
    id: 3,
    unit: "C1",
    tenantName: "Daniel Too",
    description: "Bathroom light bulb needs replacing.",
    status: "Resolved",
    priority: "Low",
    dateSubmitted: "2026-07-30"
  }
];

// Replacement for the old Overpass fetch
export const nearbyPlaces = [
  { name: "Testimony School", type: "School" },
  { name: "TOPHILL HOSPITAL", type: "Health" },
  { name: "Elgon View Mall", type: "Market" },
  { name: "Local commute stage", type: "Transport" }
];

