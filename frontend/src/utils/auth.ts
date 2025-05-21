// src/utils/auth.ts
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("access_token");
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
}
