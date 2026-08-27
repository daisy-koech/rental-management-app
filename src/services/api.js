const API_URL = "https://rental-management-app-api.onrender.com";

export async function register(name, email, password, role) {
  const response = await fetch(`${API_URL}/signup`, {   // <-- changed from /register
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      name,
      email,
      password,
      role,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Registration failed");
  }

  return data;
}

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

export async function createProperty(name, location, latitude, longitude) {
  const response = await fetch(`${API_URL}/property`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      name,
      location,
      latitude,
      longitude,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to create property");
  }

  return data;
}

export async function getLandlordProperty() {
  const response = await fetch(`${API_URL}/property`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to load property");
  }

  return data;
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

export async function createLandlordUnit(unitData) {
  const response = await fetch(`${API_URL}/property/units`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(unitData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to create unit");
  }

  return data;
}


export async function updateLandlordUnit(unitId, unitData) {
  const response = await fetch(
    `${API_URL}/property/units/${unitId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(unitData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to update unit");
  }

  return data;
}


export async function deleteLandlordUnit(unitId) {
  const response = await fetch(
    `${API_URL}/property/units/${unitId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!response.ok) {
    let data = {};

    try {
      data = await response.json();
    } catch {
      // DELETE may return an empty 204 response
    }

    throw new Error(
      data.error || "Failed to delete unit"
    );
  }

  return true;
}

export async function getLandlordLeases() {
    const response = await fetch(`${API_URL}/property/leases`, {
      method: "GET",
      credentials: "include",
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.error || "Failed to load leases");
    }
  
    return data.leases;
}

export async function createLandlordLease(unitId, leaseData) {
  const response = await fetch(
    `${API_URL}/property/units/${unitId}/leases`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(leaseData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to create lease");
  }

  return data;
}

export async function updateLandlordLease(leaseId, leaseData) {
  const response = await fetch(
    `${API_URL}/property/leases/${leaseId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(leaseData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to update lease");
  }

  return data;
}

export async function deleteLandlordLease(leaseId) {
  const response = await fetch(
    `${API_URL}/property/leases/${leaseId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      data.error || "Failed to delete lease"
    );
  }

  return true;
}

export async function getLandlordPayments() {
    const response = await fetch(`${API_URL}/property/payments`, {
      method: "GET",
      credentials: "include",
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.error || "Failed to load payments");
    }
  
    return data.payments;
}

export async function createLandlordPayment(payment) {
  const response = await fetch(`${API_URL}/property/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payment),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Failed to create payment"
    );
  }

  return data;
}

export async function updateLandlordPayment(paymentId, payment) {
  const response = await fetch(
    `${API_URL}/property/payments/${paymentId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payment),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Failed to update payment"
    );
  }

  return data;
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

export async function getLandlordNotices() {
  const response = await fetch(`${API_URL}/property/notices`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to load notices");
  }

  return data.notices;
}

export async function createLandlordNotice(title, message) {
  const response = await fetch(`${API_URL}/property/notices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      title,
      message,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to create notice");
  }

  return data;
}

export async function updateLandlordNotice(
  noticeId,
  title,
  message
) {
  const response = await fetch(
    `${API_URL}/property/notices/${noticeId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        title,
        message,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to update notice");
  }

  return data;
}

export async function deleteLandlordNotice(noticeId) {
  const response = await fetch(
    `${API_URL}/property/notices/${noticeId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to delete notice");
  }

  return true;
}

export async function getMyNotices() {
  const response = await fetch(`${API_URL}/my-notices`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to load notices");
  }

  return data.notices;
}

export async function getMyLease() {
  const response = await fetch(`${API_URL}/my-lease`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to load lease");
  }

  return data;
}

export async function getMyPayments() {
  const response = await fetch(`${API_URL}/my-payments`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to load payments");
  }

  return data.payments;
}

export async function getMyMaintenanceTickets() {
  const response = await fetch(`${API_URL}/my-maintenance-tickets`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Failed to load maintenance tickets"
    );
  }

  return data.tickets;
}

export async function createMaintenanceTicket(title, description) {
  const response = await fetch(`${API_URL}/maintenance-tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      title,
      description,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Failed to create maintenance ticket"
    );
  }

  return data;
}

export async function submitEndOfStay(data) {
  const response = await fetch(`${API_URL}/end-of-stay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "Failed to submit end of stay notice"
    );
  }

  return result;
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
