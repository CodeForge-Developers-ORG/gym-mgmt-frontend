"use client"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.gym.staffkhata.com/api";

interface RequestOptions extends RequestInit {
  gymId?: string;
  token?: string;
}

export async function apiFetch(endpoint: string, options: RequestOptions = {}) {
  const { gymId, ...init } = options;
  let authToken = options.token;

  // Auto-fetch token from localStorage if not provided
  if (!authToken && typeof window !== "undefined") {
    authToken = localStorage.getItem("token") || undefined;
  }

  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  
  // Don't set Content-Type if body is FormData (browser will set it with boundary)
  if (!(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (authToken) {
    headers.set("Authorization", `Bearer ${authToken}`);
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
    apiFetch(endpoint, { ...options, method: "POST", body: body instanceof FormData ? body : JSON.stringify(body) }),
  
  put: (endpoint: string, body: any, options?: RequestOptions) => 
    apiFetch(endpoint, { ...options, method: "PUT", body: body instanceof FormData ? body : JSON.stringify(body) }),
  
  patch: (endpoint: string, body: any, options?: RequestOptions) => 
    apiFetch(endpoint, { ...options, method: "PATCH", body: body instanceof FormData ? body : JSON.stringify(body) }),
  
  delete: (endpoint: string, options?: RequestOptions) => 
    apiFetch(endpoint, { ...options, method: "DELETE" }),

  validateToken: () => apiFetch("/auth/validate", { method: "GET" }),
};
