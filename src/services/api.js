const API_BASE = 'https://3.26.1.70:8000/api';

async function fetchAPI(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error(`API call failed: ${endpoint}`, error);
    throw error;
  }
}

export const api = {
  getProfile: () => fetchAPI('/profile'),
  getProjects: (category) => fetchAPI(`/projects${category ? `?category=${category}` : ''}`),
  getProject: (slug) => fetchAPI(`/projects/${slug}`),
  getSkills: () => fetchAPI('/skills'),
  getJourney: () => fetchAPI('/journey'),
  sendChat: (message, sessionId) =>
    fetchAPI('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, session_id: sessionId }),
    }),
  sendContact: (data) =>
    fetchAPI('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
