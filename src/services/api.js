const API_URL = "http://localhost:5000";

export async function login(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Login failed");
  }

  return data;
}

export async function checkSession() {
  const response = await fetch(`${API_URL}/check-session`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export async function getLandlordUnits() {
    const response = await fetch(`${API_URL}/property/units`, {
        method: "GET",
        credentials: "include",
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Failed to load units");
    }

    return data.units;
}

export async function getLandlordMaintenanceTickets() {
    const response = await fetch(`${API_URL}/property/maintenance-tickets`, {
      method: "GET",
      credentials: "include",
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.error || "Failed to load maintenance tickets");
    }
  
    return data.tickets;
}

export async function updateMaintenanceTicket(ticketId, status) {
    const response = await fetch(
      `${API_URL}/property/maintenance-tickets/${ticketId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          status,
        }),
      }
    );
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.error || "Failed to update maintenance ticket");
    }
  
    return data;
}

export async function logout() {
  const response = await fetch(`${API_URL}/logout`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }

  return true;
}