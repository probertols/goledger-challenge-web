const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://ec2-50-19-36-138.compute-1.amazonaws.com/api';
const API_USERNAME = import.meta.env.VITE_API_USERNAME ?? 'goledger';
const API_PASSWORD = import.meta.env.VITE_API_PASSWORD ?? '5NxVCAjC';

function buildHeaders() {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Basic ${btoa(`${API_USERNAME}:${API_PASSWORD}`)}`
  };
}

export async function apiRequest(path, { method = 'POST', body } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: buildHeaders(),
    body: body ? JSON.stringify(body) : undefined
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.error ?? data?.message ?? `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}
