# Rental Management App
A full-stack rental property management application built for a single rental property, with separate experiences for landlords and tenants.

The application brings property information, units, leases, payments, maintenance requests and notices into one place instead of relying on notebooks, spreadsheets, phone calls and message threads.

## Live Application
### Frontend
https://rental-management-kenya.vercel.app/

### Backend API
https://rental-management-app-api.onrender.com/

The frontend is deployed on Vercel and the Flask API is deployed on Render.


# Overview
Managing a rental property usually means keeping track of several things at once: who lives in which unit, whether rent has been paid, what needs fixing, and what tenants need to know.

This application was built to bring those activities into one system with separate dashboards for landlords and tenants.

The original location and map functionality from phase 1 has been preserved and now supports the property itself rather than being the main purpose of the application.

The application currently focuses on three main areas:
- **Property information** - a public-facing overview of the property, its location and nearby amenities.
- **Tenant dashboard** - lease information, payment history, maintenance requests and property notices for the logged-in tenant.
- **Landlord dashboard** - property units, leases, payments, maintenance requests and notices.

# Main Features

## Property Information
The public property page introduces the rental property and provides information such as:
- Property name
- Location
- Description
- Number of units
- Property location on a map
- Nearby amenities
The property location is displayed using its stored latitude and longitude.


# Authentication
The application supports separate landlord and tenant accounts.
Users can:
- Sign up
- Log in
- Log out
- Maintain a logged-in session
- Access functionality based on their role

Two roles are supported:

- `landlord`
- `tenant`

A landlord can manage the property and its associated records.
A tenant can only access information associated with their own lease and account.

Authentication is handled by the Flask backend using sessions.


# Landlord Dashboard
The landlord dashboard provides an overview of the property and access to the main management features.

The landlord can manage:

### Units
- View units
- Add units
- Update units
- Delete units
- View unit numbers
- View monthly rent

### Leases
- Create leases
- View leases
- Update leases
- Delete leases
- Assign a tenant to a unit
- Set lease start and end dates
- Track lease status

### Payments
- View property payments
- Record payments
- Update payment information
- Track payment status
- Record payment references

### Maintenance
- View maintenance requests submitted by tenants
- Update maintenance status
- Track pending, in-progress and resolved requests

### Notices
- Create property notices
- View notices
- Update notices
- Delete notices

# Tenant Dashboard
The tenant dashboard displays information relevant to the currently logged-in tenant.

A tenant can:

### Home
View:
- Their unit
- Lease status
- Payment information
- Maintenance information
- Recent property notices

### Lease
View:
- Lease start date
- Lease end date
- Monthly rent
- Lease status



### Payments
View:
- Payment history
- Payment amounts
- Payment dates
- Payment status
- Payment references

### Maintenance
Tenants can submit maintenance requests with:
- Title
- Description

They can also view their previous maintenance requests and their current status.


### Notices
Tenants can view notices posted by the landlord for their property.


# Application Structure
The application follows a full-stack architecture:

```text
React Frontend
      |
      | HTTP Requests
      ↓
Flask REST API
      |
      | SQLAlchemy
      ↓
PostgreSQL Database
````

The frontend is responsible for the user interface and client-side routing.

The Flask backend handles:
* Authentication
* Authorization
* Business logic
* CRUD operations
* Database communication
* API responses

PostgreSQL stores the application's persistent data.



# Backend API
The Flask API provides endpoints for the main application resources.

## Authentication

```text
POST   /signup
POST   /login
GET    /check-session
DELETE /logout
```

## Property

```text
POST   /property
GET    /property
PATCH  /property
DELETE /property
```

## Units

```text
GET    /property/units
POST   /property/units
PATCH  /property/units/<id>
DELETE /property/units/<id>
```

## Leases

```text
POST   /property/units/<unit_id>/leases
GET    /property/leases
GET    /my-lease
PATCH  /property/leases/<lease_id>
DELETE /property/leases/<lease_id>
```

## Payments

```text
GET    /property/payments
POST   /property/payments
PATCH  /property/payments/<payment_id>

GET    /my-payments
```

## Maintenance

```text
POST   /maintenance-tickets
GET    /my-maintenance-tickets

GET    /property/maintenance-tickets
PATCH  /property/maintenance-tickets/<ticket_id>
```

## Notices

```text
POST   /property/notices
GET    /property/notices
PATCH  /property/notices/<notice_id>
DELETE /property/notices/<notice_id>

GET    /my-notices
```
## End of Stay (future enhancement)

```text
POST   /end-of-stay
GET    /my-end-of-stay

GET    /property/end-of-stay
PATCH  /property/end-of-stay/<end_of_stay_id>
```

# Database
The application uses PostgreSQL for persistent storage.
The main database relationships are:

```text
User
 |
 |-- Landlord
 |       |
 |       └── Property
 |              |
 |              └── Units
 |
 └── Tenant
        |
        └── Leases
               |
               └── Payments
```

Other relationships include:

```text
Tenant → Maintenance Tickets
Property → Notices
Lease → End of Stay Request
Unit → Lease
```

This relational structure allows the application to connect the correct information to the correct tenant, unit and property.


# Technologies Used

## Frontend
### React
React is used to build the user interface and reusable components.

### Vite
Vite is used as the frontend development environment and build tool.

### React Router
React Router handles navigation between public pages and tenant and landlord dashboard pages.

### React Leaflet and Leaflet
React leaflet integrates Leaflet maps into the React application.

The map displays:
* OpenStreetMap tiles
* The property's location
* A property marker
* A popup showing the property name

The Leaflet stylesheet is imported in `app.jsx`:

```jsx
import "leaflet/dist/leaflet.css";
```

### Lucide React
Lucide React provides icons used throughout the interface.

# Backend Technologies
## Flask
Flask provides the REST API and backend application logic.

## SQLAlchemy
SQLAlchemy is used as the ORM for communicating with PostgreSQL and defining database models.

## Flask-Migrate
Flask-Migrate is used to manage database schema migrations.

## Flask-Bcrypt
Flask-Bcrypt is used for password hashing.

## Flask-CORS
Flask-CORS allows the deployed React frontend to communicate with the Flask API.

## PostgreSQL
PostgreSQL is used as the production database for persistent application data.


# Frontend Routes
The main React routes are:

```text
/                           Home

/property                   Property information

/area                       Location and nearby amenities

/about                      About

/tenant                     Tenant dashboard

/tenant/lease               Tenant lease

/tenant/payments            Tenant payments

/tenant/maintenance         Tenant maintenance requests

/tenant/notices             Tenant notices

/landlord                   Landlord dashboard

/landlord/units             Landlord units

/landlord/tickets           Landlord maintenance

/landlord/payments          Landlord payments

/landlord/leases            Landlord leases

/landlord/notices           Landlord notices
```

# Location and Nearby Amenities
The property's location is stored using latitude and longitude.
The current property is located in:
```text
Elgon View, Eldoret, Kenya
```

The map uses the property's stored coordinates rather than requesting coordinates every time the application loads.
Nearby amenities such as schools, hospitals, markets and transport are represented using a manually maintained static list.

An earlier version of the application used the Overpass API to retrieve nearby amenities dynamically. However, the external API proved unreliable, so the application no longer depends on it.

# Installation
## 1. Clone the repository

```bash
git clone https://github.com/daisy-koech/rental-area-explorer.git
```
Navigate into the project

# Frontend Setup
Navigate to the frontend/project directory:
```bash
cd frontend
```

Install the dependencies:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```
The frontend will be available at the local URL provided by Vite, usually:

# Backend Setup
cd backend directory

## Install Pipenv
pip install pipenv

## Create the virtual environment and install dependencies
pipenv install

## Activate the virtual environment
pipenv shell

## Run database migrations
flask db upgrade

## Start the Flask server
python app.py

## Install the backend dependencies:
pip install -r requirements.txt


# Environment Variables
Create a `.env` file in the backend directory.
For production, the database URL and secret key are configured through the Render environment variables.

# Database Setup
Make sure PostgreSQL is installed and running.
Create the database:

```sql
CREATE DATABASE rental_management;
```

Run the Flask application and apply the database migrations.
If migrations already exist:

```bash
flask db upgrade
```
The database will then contain the application's tables.


# Running the Backend
From the backend directory:

```bash
python app.py
```

The Flask API will run locally.
The local API is typically available at:

```text
http://127.0.0.1:5000
```

---

# Connecting the Frontend to the Backend
The frontend uses the Flask API URL for its requests.

For local development, the API URL can point to:

```text
http://127.0.0.1:5000
```

For the deployed application, the API URL points to:

```text
https://rental-management-app-api.onrender.com
```

# Deployment
## Frontend - Vercel
The React frontend is deployed using Vercel.
Live frontend:

```text
https://rental-management-kenya.vercel.app/
```

The frontend is connected to the GitHub repository so that new deployments can be created when changes are pushed.

# Backend - Render
The Flask backend is deployed using Render.
Live API:

```text
https://rental-management-app-api.onrender.com/
```

Render hosts the Flask application and connects it to the PostgreSQL production database.
The production environment variables include:

```text
DATABASE_URL
SECRET_KEY
```

The backend also allows the deployed Vercel frontend to make authenticated requests using CORS and session cookies.


# Authentication and Sessions
Authentication is handled by Flask sessions.

When a user successfully logs in, their user ID is stored in the session.
The backend retrieves the currently authenticated user using:

```python
session.get("user_id")
```

The application then checks the user's role before allowing access to protected functionality.
Session cookies are configured to support authenticated requests between the deployed frontend and backend.


# Example User Flow

## Landlord
```text
Sign up / Log in
       ↓
Create or view property
       ↓
Add units
       ↓
Create tenant lease
       ↓
Record payments
       ↓
Manage maintenance requests
       ↓
Post property notices
```

## Tenant
```text
Sign up / Log in
       ↓
View dashboard
       ↓
View lease
       ↓
View payments
       ↓
Submit maintenance request
       ↓
Read property notices
```

# Data Validation and Authorization
The backend validates requests before modifying the database.

Examples include:
* Only landlords can create properties.
* Only landlords can create units.
* Only landlords can create leases.
* Only tenants can view their own lease.
* Only tenants can submit maintenance requests.
* Only landlords can update maintenance ticket status.
* Only landlords can create property notices.
* Users must be authenticated before accessing protected resources.
* Tenant IDs must belong to users with the tenant role.
* Units must belong to the landlord's property before they can be used in leases.

This prevents users from accessing or modifying unrelated property information.


# Mock Data
Mock data `mockData.js`  was used to demonstrate the tenant and landlord interfaces before the backend was implemented.

The Phase 2 version now uses the Flask API and PostgreSQL for the main property management data.
Some frontend static data is still used for information that does not currently require a database, such as the manually maintained nearby amenities list.

# Development Approach
The project was developed in two main phases.

## Phase 1 - Frontend Prototype
The first phase focused on:
* React
* Component design
* Routing
* Responsive UI
* Property information
* Tenant dashboard
* Landlord dashboard
* Mock data
* Map integration

## Phase 2 - Full-Stack Application
The second phase introduced:
* Flask
* REST API endpoints
* PostgreSQL
* SQLAlchemy
* Flask-Migrate
* Authentication
* Sessions
* CRUD operations
* Persistent data
* Tenant and landlord roles
* Production deployment

# Future Development
## M-Pesa Payments
Integrate M-Pesa so tenants can make rent payments directly through the application.

## Utility Billing
Add support for:
* Water billing
* Electricity billing
* Utility usage
* Automatic utility calculations

## Improved Tenant Management
Allow landlords to manage tenant information directly from the dashboard.

## Payment Reminders
Add automatic reminders for upcoming or overdue rent payments.

# Project Goal
The goal of the Rental Management App is to make everyday rental management easier to organize and understand.

Instead of information being scattered across notebooks, spreadsheets and message threads, the application provides one place for:

```text
Property
   ↓
Units
   ↓
Tenants
   ↓
Leases
   ↓
Payments
```

with:

```text
Maintenance
Notices
End-of-Stay Requests
```
connected to the same property and tenant information.