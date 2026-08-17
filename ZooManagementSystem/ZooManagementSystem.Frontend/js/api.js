/**
 * API Service Layer
 * Reusable HTTP client for Zoo Management System backend
 */

const API_BASE_URL = 'https://infinity-loop-zoo-api.onrender.com/api';

/**
 * Core fetch wrapper with error handling
 */
async function request(method, endpoint, data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type');
  let body = null;

  if (contentType && contentType.includes('application/json')) {
    body = await response.json();
  } else {
    const text = await response.text();
    body = text ? { message: text } : null;
  }

  if (!response.ok) {
    const message =
      body?.message ||
      body?.title ||
      body?.detail ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return body;
}

/** GET request */
async function get(endpoint) {
  return request('GET', endpoint);
}

/** POST request */
async function post(endpoint, data) {
  return request('POST', endpoint, data);
}

/** PUT request */
async function put(endpoint, data) {
  return request('PUT', endpoint, data);
}

/** DELETE request */
async function del(endpoint) {
  return request('DELETE', endpoint);
}

/* ========== Animals API ========== */

const AnimalsAPI = {
  getAll: () => get('/animals'),
  getById: (id) => get(`/animals/${id}`),
  create: (data) => post('/animals', data),
  update: (id, data) => put(`/animals/${id}`, data),
  delete: (id) => del(`/animals/${id}`),
  assignKeeper: (animalId, keeperId) => post(`/animals/${animalId}/keeper/${keeperId}`),
  assignEnclosure: (animalId, enclosureId) => post(`/animals/${animalId}/enclosure/${enclosureId}`),
  feed: (id, data) => post(`/animals/${id}/feed`, data),
  healthCheck: (id, data) => post(`/animals/${id}/health-check`, data),
};

/* ========== Keepers API ========== */

const KeepersAPI = {
  getAll: () => get('/keepers'),
  getById: (id) => get(`/keepers/${id}`),
  create: (data) => post('/keepers', data),
  update: (id, data) => put(`/keepers/${id}`, data),
  delete: (id) => del(`/keepers/${id}`),
};

/* ========== Enclosures API ========== */

const EnclosuresAPI = {
  getAll: () => get('/enclosures'),
  getById: (id) => get(`/enclosures/${id}`),
  create: (data) => post('/enclosures', data),
  update: (id, data) => put(`/enclosures/${id}`, data),
  delete: (id) => del(`/enclosures/${id}`),
};

/* ========== Tickets API ========== */

const TicketsAPI = {
  getAll: () => get('/tickets'),
  getById: (id) => get(`/tickets/${id}`),
  create: (data) => post('/tickets', data),
  update: (id, data) => put(`/tickets/${id}`, data),
  delete: (id) => del(`/tickets/${id}`),
};

/* ========== Reports API ========== */

const ReportsAPI = {
  animals: () => get('/reports/animals'),
  revenue: () => get('/reports/revenue'),
  visitors: () => get('/reports/visitors'),
  foodRequirements: () => get('/reports/food-requirements'),
};
