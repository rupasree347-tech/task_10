// src/api.js
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'API error');
  return json;
}

// Records
export const getRecords = (params = {}) => {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
  ).toString();
  return request(`/records${qs ? `?${qs}` : ''}`);
};
export const getRecord     = (id)      => request(`/records/${id}`);
export const createRecord  = (body)    => request('/records', { method: 'POST',  body: JSON.stringify(body) });
export const updateRecord  = (id, body)=> request(`/records/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteRecord  = (id)      => request(`/records/${id}`, { method: 'DELETE' });

// Analytics
export const getAnalytics  = ()        => request('/dashboard/analytics');

// Categories
export const getCategories = ()        => request('/categories');
