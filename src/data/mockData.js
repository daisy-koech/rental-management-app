// Mock data standing in for the future Flask + PostgreSQL backend.

export const property = {
  name: "Cedar Court",
  address: "Elgon View, Eldoret",
  description:
    "A quiet 6 unit residential building a short walk from Elgon View shopping centre. Managed directly by the owner, with maintenance handled on site.",
  images: {
    exterior:
      "https://images.unsplash.com/photo-1651995859057-9f4668c96831?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    interior:
      "https://images.unsplash.com/photo-1746439324733-cae3b67aa0fa?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  latitude: 0.5036,
  longitude: 35.2789,
  totalUnits: 6,
  landlord: {
    name: "Johnson Koech",
    phone: "0712 345 678",
    email: "johnsonkoech@example.com"
},
};

export const units = [
  { id: 1, unitNumber: "A1", bedrooms: 2, bathrooms: 1, status: "occupied", tenantName: "Marion Jane" },
  { id: 2, unitNumber: "A2", bedrooms: 2, bathrooms: 1, status: "occupied", tenantName: "Peter Kamau" },
  { id: 3, unitNumber: "B1", bedrooms: 1, bathrooms: 1, status: "vacant", tenantName: null },
  { id: 4, unitNumber: "B2", bedrooms: 2, bathrooms: 1, status: "occupied", tenantName: "Susan Achieng" },
  { id: 5, unitNumber: "C1", bedrooms: 1, bathrooms: 1, status: "occupied", tenantName: "Daniel Too" },
  { id: 6, unitNumber: "C2", bedrooms: 2, bathrooms: 2, status: "vacant", tenantName: null },
];

// For "logged in" tenant
export const currentTenant = {
  name: "Peter Kamau",
  unit: "A2",
  leaseStart: "2025-03-01",
  leaseEnd: "2027-01-31",
  leaseStatus: "active",
  rentAmount: 22000,
  rentStatus: "paid",
  lastPaymentDate: "2026-08-02",
};

export const leases = [
  {
    id: 1,
    unit: "A1",
    tenantName: "Marion Jane",
    startDate: "2025-02-01",
    endDate: "2027-07-31",
    rentAmount: 22000,
    status: "active",
    endOfStayNoticeSubmitted: false,
  },
  {
    id: 2,
    unit: "A2",
    tenantName: "Peter Kamau",
    startDate: "2025-03-01",
    endDate: "2027-01-31",
    rentAmount: 22000,
    status: "active",
    endOfStayNoticeSubmitted: false,
  },
  {
    id: 3,
    unit: "B2",
    tenantName: "Susan Achieng",
    startDate: "2024-11-01",
    endDate: "2026-10-31",
    rentAmount: 18000,
    status: "active",
    endOfStayNoticeSubmitted: true,
  },
  {
    id: 4,
    unit: "C1",
    tenantName: "Daniel Too",
    startDate: "2025-06-01",
    endDate: "2027-01-31",
    rentAmount: 15000,
    status: "active",
    endOfStayNoticeSubmitted: false,
  },
];

// Rent plus utilities
export const payments = [
  {
    id: 1,
    unit: "A2",
    tenantName: "Peter Kamau",
    period: "August 2026",
    rent: 22000,
    water: 1200,
    electricity: 1800,
    total: 25000,
    status: "paid",
    datePaid: "2026-08-02",
  },
  {
    id: 2,
    unit: "A2",
    tenantName: "Peter Kamau",
    period: "July 2026",
    rent: 22000,
    water: 1100,
    electricity: 1700,
    total: 24800,
    status: "paid",
    datePaid: "2026-07-03",
  },
  {
    id: 3,
    unit: "A2",
    tenantName: "Peter Kamau",
    period: "September 2026",
    rent: 22000,
    water: 1200,
    electricity: 1800,
    total: 25000,
    status: "due",
    datePaid: null,
  },
  {
    id: 4,
    unit: "A1",
    tenantName: "Marion Jane",
    period: "August 2026",
    rent: 22000,
    water: 1300,
    electricity: 1600,
    total: 24900,
    status: "paid",
    datePaid: "2026-08-01",
  },
  {
    id: 5,
    unit: "B2",
    tenantName: "Susan Achieng",
    period: "August 2026",
    rent: 18000,
    water: 900,
    electricity: 1400,
    total: 20300,
    status: "overdue",
    datePaid: null,
  },
  {
    id: 6,
    unit: "C1",
    tenantName: "Daniel Too",
    period: "August 2026",
    rent: 15000,
    water: 800,
    electricity: 1200,
    total: 17000,
    status: "paid",
    datePaid: "2026-08-04",
  },
];

// audience is either "all" or a specific unit number
export const notices = [
  {
    id: 1,
    title: "Water tank cleaning",
    date: "2026-08-20",
    message:
      "The main water tank will be cleaned on Saturday morning. Expect low pressure between 8am and 11am.",
    audience: "all",
  },
  {
    id: 2,
    title: "Parking reminder",
    date: "2026-07-28",
    message: "Please do not block entrances, driveways, or other vehicles.",
    audience: "all",
  },
  {
    id: 3,
    title: "Rent reminder",
    date: "2026-08-25",
    message: "Rent for September is due on the 1st. Let us know if you need to discuss timing.",
    audience: "all",
  },
];

export const maintenanceTickets = [
  {
    id: 1,
    unit: "A1",
    tenantName: "Marion Jane",
    description: "Kitchen sink is leaking under the cabinet.",
    status: "Pending",
    priority: "Medium",
    dateSubmitted: "2026-08-20",
  },
  {
    id: 2,
    unit: "B2",
    tenantName: "Susan Achieng",
    description: "Bedroom window doesn't lock properly.",
    status: "Pending",
    priority: "High",
    dateSubmitted: "2026-08-22",
  },
  {
    id: 3,
    unit: "C1",
    tenantName: "Daniel Too",
    description: "Bathroom light bulb needs replacing.",
    status: "Resolved",
    priority: "Low",
    dateSubmitted: "2026-07-30",
  },
];

// Replacement for the Overpass fetch.
export const nearbyPlaces = [
  { name: "Elgon View Mall", type: "Shopping centre", distance: "1.8 km" },
  { name: "Testimony School", type: "school", distance: "2.1 km" },
  { name: "TOPHILL HOSPITAL", type: "hospital", distance: "3.4 km" },
  { name: "Local Commute", type: "transport", distance: "1.2 km" },
];
