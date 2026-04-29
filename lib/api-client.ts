"use client"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.gym.staffkhata.com/api";

interface RequestOptions extends RequestInit {
  gymId?: string;
  token?: string;
}

export async function apiFetch(endpoint: string, options: RequestOptions = {}) {
  const { gymId, token, ...init } = options;

  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (gymId) {
    headers.set("X-Gym-ID", gymId);
  }

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      ...init,
      headers,
    });
  } catch (err) {
    throw new Error(
      `Cannot reach the API server at ${BASE_URL}. Make sure the backend is running and CORS is configured to allow requests from this origin.`
    );
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  get: (endpoint: string, options?: RequestOptions) => 
    apiFetch(endpoint, { ...options, method: "GET" }),
  
  post: (endpoint: string, body: any, options?: RequestOptions) => 
    apiFetch(endpoint, { ...options, method: "POST", body: JSON.stringify(body) }),
  
  put: (endpoint: string, body: any, options?: RequestOptions) => 
    apiFetch(endpoint, { ...options, method: "PUT", body: JSON.stringify(body) }),
  
  patch: (endpoint: string, body: any, options?: RequestOptions) => 
    apiFetch(endpoint, { ...options, method: "PATCH", body: JSON.stringify(body) }),
  
  delete: (endpoint: string, options?: RequestOptions) => 
    apiFetch(endpoint, { ...options, method: "DELETE" }),
};
