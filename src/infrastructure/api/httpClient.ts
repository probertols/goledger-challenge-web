const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_USERNAME = import.meta.env.VITE_API_USERNAME;
const API_PASSWORD = import.meta.env.VITE_API_PASSWORD;

function validateApiConfig() {
  const missing = [
    !API_BASE_URL && 'VITE_API_BASE_URL',
    !API_USERNAME && 'VITE_API_USERNAME',
    !API_PASSWORD && 'VITE_API_PASSWORD'
  ].filter(Boolean);

  if (missing.length > 0) {
    throw new Error(`Missing API environment variables: ${missing.join(', ')}`);
  }
}

function buildHeaders() {
  validateApiConfig();

  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Basic ${btoa(`${API_USERNAME}:${API_PASSWORD}`)}`
  };
}

export async function apiRequest<TResponse>(
  path: string,
  { method = 'POST', body }: { method?: 'POST' | 'PUT' | 'DELETE'; body?: unknown } = {}
): Promise<TResponse> {
  validateApiConfig();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: buildHeaders(),
    body: body ? JSON.stringify(body) : undefined
  });

  const text = await response.text();
  const data = text ? (JSON.parse(text) as TResponse & { error?: string; message?: string }) : null;

  if (!response.ok) {
    const message = data?.error ?? data?.message ?? `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data as TResponse;
}
