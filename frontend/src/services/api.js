const TOKEN_KEY = 'nerouteiq_access_token';

export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);
export const setAccessToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearAccessToken = () => localStorage.removeItem(TOKEN_KEY);

export async function apiFetch(path, options = {}) {
    const headers = new Headers(options.headers || {});
    const token = getAccessToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
    if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    const response = await fetch(path, { ...options, headers });
    if (!response.ok) throw new Error(`API request failed: ${response.status}`);
    return response.json();
}

export const authApi = {
    login: (payload) => apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
    register: (payload) => apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
    me: () => apiFetch('/api/auth/me')
};

export const missionApi = {
    list: () => apiFetch('/api/missions'),
    create: (payload) => apiFetch('/api/missions', { method: 'POST', body: JSON.stringify(payload) }),
    get: (id) => apiFetch(`/api/missions/${id}`)
};

export const alertApi = { list: () => apiFetch('/api/alerts') };
