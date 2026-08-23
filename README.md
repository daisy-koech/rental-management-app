# Rental Management App
A React application for managing a single rental property, built for both the landlord and the tenants who live there. The application keeps units, leases, payments, maintenance requests and notices in one place, instead of spread across notebooks, phone calls and message threads.

## Overview
Managing a rental property usually means keeping track of several things at once: who is in which unit, whether rent has come in, what needs fixing, and what tenants need to know. This application was built to bring all of that into one application, with a clear landlord side and a clear tenant side.

This project began as a neighbourhood exploration tool (searching a Kenyan area and browsing nearby amenities on a map). It has since evolved into a full property management platform for one specific property. The location and map functionality from that earlier version is preserved and now supports the property itself, rather than being the main purpose of the application.

The application currently focuses on three main areas:
- **Property information** - a public-facing overview of the property, its location and what is nearby.
- **Tenant dashboard** - lease details, payment status, maintenance requests and notices, for one logged-in tenant.
- **Landlord dashboard** - units, tenants, maintenance tickets, payments, leases and notices, across the whole property.

The application is currently a frontend-focused project using mock data.

## Features
### Property Information
A public-facing page introduces the property: its name, address, description, number of units and who manages it. This is the page a visitor sees before going into either dashboard.

### Landlord Dashboard
The landlord can see an overview of the property (occupancy, open maintenance requests, overdue payments) and move between focused pages:
- **Units** - every unit, its tenant if occupied, and its status.
- **Maintenance** - tickets submitted by tenants, with the ability to mark a ticket as Pending or Resolved.
- **Payments** - rent, water and electricity for every tenant, itemised, with a paid, due or overdue status.
- **Leases** - lease start and end dates, rent amount, status, and whether an end of stay notice has been submitted.
- **Notices** - post a notice (for example, a water maintenance schedule or a rent reminder) that tenants can read.

### Tenant Dashboard
A tenant sees only information relevant to their own unit:
- **Home** - unit, lease status, next payment due, any open maintenance request, and the most recent notice.
- **Lease** - lease start and end dates, monthly rent, and a form to notify the landlord of an intended move-out date.
- **Payments** - the next payment due, itemised by rent, water and electricity, and a history of past payments.
- **Maintenance** - submit a new maintenance request with a description and priority, and see the status of previous requests.
- **Notices** - read notices posted by the landlord.

At present, the application shows one mock tenant at a time.

### Interactive Map
The property's location is shown on a Leaflet map using its stored latitude and longitude. The map includes:
- OpenStreetMap map tiles
- A marker for the property
- A popup showing the property name

### Nearby Amenities
Nearby schools, hospitals, markets and transport are shown using a manually entered, static list rather than a live third-party API. This replaces an earlier version of the application that queried the Overpass API for this data. The Overpass API proved unreliable during development, so the application no longer depends on it to display this information.

### Client-Side Routing
React Router provides navigation between the application's views. The current routes are:
```text
/                        Home
/property                Property information
/area                    Location and nearby amenities
/about                   About

/tenant                  Tenant dashboard, home
/tenant/lease             Tenant lease and end of stay notice
/tenant/payments          Tenant payments
/tenant/maintenance       Tenant maintenance requests
/tenant/notices           Tenant notices

/landlord                 Landlord dashboard, overview
/landlord/units            Landlord units
/landlord/tickets          Landlord maintenance tickets
/landlord/payments         Landlord payments
/landlord/leases           Landlord leases
/landlord/notices          Landlord notices
```

### Responsive Interface
The application includes responsive styling so the interface adapts to smaller screens. This covers navigation, dashboard sections, tables, forms and images, so the application remains usable on desktop, tablet and mobile.

## Technologies Used
### React
The application is built using React. React is used to create reusable components and manage application state.

### Vite
Vite is used as the development environment and build tool for the React application.

### React Router
React Router handles navigation between the application's views, including nested tenant and landlord dashboard pages.

### React Leaflet and Leaflet
React Leaflet integrates Leaflet maps into the React application, providing map containers, tile layers, markers and popups. The Leaflet stylesheet is imported in `main.jsx`:
```jsx
import "leaflet/dist/leaflet.css";
```

### OpenStreetMap and Nominatim
OpenStreetMap provides the map tiles used for the property's location. Nominatim was used during development to look up the property's coordinates. Once those coordinates were known, they were stored directly as data, so the running application does not require a live Nominatim request to function.

### Lucide React
Lucide React provides the icons used on amenity cards, so different amenity types are easy to tell apart visually.

### Data
`mockData.js` holds the property, units, leases, payments, notices, maintenance tickets and nearby amenities used throughout the application.
Every component reads from this file rather than defining its own data, so this is the single place mock data will later be replaced by requests to the Flask API.

### Components
Reusable interface pieces used across more than one view: `StatusBadge` (a consistent way to show Active, Paid, Pending, Overdue and similar statuses), `TicketCard` and `TicketForm` (maintenance requests), `PaymentRow` (a line of payment history), `NoticeCard`, `EndOfStayForm`, and `DashboardTabs` (the sub-navigation used inside both dashboards).

### Views
Public pages (`HomeView`, `PropertyView`, `AreaView`, `AboutView`), tenant dashboard pages under `views/tenant/`, and landlord dashboard pages under `views/landlord/`.

## Running the Application
The application is deployed and can be accessed directly from the live link below:
https://rental-area-explorer.vercel.app/

No installation is required when using the deployed version. Open the link in a browser to explore the application.

## Installation
### 1. Clone the repository

Clone the project from GitHub:

```bash
git clone https://github.com/daisy-koech/rental-area-explorer
```

### 2. Navigate into the cloned project directory

### 3. Install dependencies
Run:
```bash
npm install
```
- This installs the dependencies listed in `package.json`.

Start the Vite development server:
```bash
npm run dev
```
Open the provided URL in a browser.



## Using the Application
### As a visitor
Open the Home page to see an introduction to the property, then visit Property or Location for more detail.

### As a tenant
Select Tenant Dashboard from the navigation. From there, use the tabs to move between Home, Lease, Payments, Maintenance and Notices. A maintenance request can be submitted from the Maintenance tab, and an end of stay notice can be submitted from the Lease tab.

### As a landlord
Select Landlord Dashboard from the navigation. From there, use the tabs to move between Overview, Units, Maintenance, Payments, Leases and Notices. A maintenance ticket's status can be updated from the Maintenance tab, and a new notice can be posted from the Notices tab.

At present there is no login. The application shows one example tenant and the full landlord view.

## Mock Data
The application uses realistic mock data rather than a live database. Property, units, leases, payments and notices are set up so that the interface feels close to what a real running property would look like, including a tenant with no open maintenance ticket and units with no lease, so that empty states are part of the design rather than an afterthought.

This is temporary frontend data. It is clearly separated in `mockData.js` and structured so that it can be replaced by real API requests without needing to change the components that use it.

## Data Sources
The property's location was originally looked up using Nominatim during development. The running application now stores this location directly, so it does not depend on a live request to Nominatim, OpenStreetMap or the Overpass API to function.

- Nominatim: `https://nominatim.openstreetmap.org/`
- OpenStreetMap: `https://www.openstreetmap.org/`

## Future Development
### Authentication
Add real login and logout, with separate access for the landlord and for tenants, so that each tenant sees only their own lease, payments and maintenance requests.

### Real Payments
Add M-Pesa integration so a tenant can pay rent directly from the application, replacing the current mock "Pay" area with a real payment flow.

### CRUD for Maintenance, Leases and Notices
Connect the maintenance ticket, lease and notice features to the backend, so a ticket a tenant submits, a lease the landlord creates, or a notice the landlord posts is stored and updated for real.
