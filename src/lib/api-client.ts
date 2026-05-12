/**
 * Client-side authentication helper for API calls.
 * Checks localStorage for admin bypass session and includes
 * the appropriate headers in API requests.
 */

/**
 * Get authentication headers for API calls.
 * Checks localStorage for admin bypass session first,
 * then falls back to NextAuth session (handled via cookies).
 */
export function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};

  try {
    const adminAuth = localStorage.getItem("adminAuth");
    if (adminAuth) {
      const auth = JSON.parse(adminAuth);
      if (auth?.isLoggedIn && auth.userId && auth.authHeader) {
        return {
          "x-user-id": auth.userId,
          "x-admin-auth": auth.authHeader,
        };
      }
    }
  } catch {
    // Not logged in as admin
  }

  return {};
}

/**
 * Fetch wrapper that automatically includes auth headers.
 * Use this instead of raw fetch() for any API calls that require authentication.
 */
export async function authFetch(url: string, options: RequestInit = {}) {
  const headers = {
    ...options.headers,
    ...getAuthHeaders(),
  };

  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * Check if the user is logged in via admin bypass.
 */
export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const adminAuth = localStorage.getItem("adminAuth");
    if (adminAuth) {
      const auth = JSON.parse(adminAuth);
      return !!(auth?.isLoggedIn && auth.userId && auth.authHeader);
    }
  } catch {
    // Not logged in as admin
  }

  return false;
}

/**
 * Get the stored admin auth data.
 */
export function getAdminAuthData(): { userId: string; email: string } | null {
  if (typeof window === "undefined") return null;

  try {
    const adminAuth = localStorage.getItem("adminAuth");
    if (adminAuth) {
      const auth = JSON.parse(adminAuth);
      if (auth?.isLoggedIn && auth.userId) {
        return { userId: auth.userId, email: auth.email || "admin@undangannauka.com" };
      }
    }
  } catch {
    // Not logged in as admin
  }

  return null;
}

/**
 * Clear admin auth data from localStorage (logout).
 */
export function clearAdminAuth(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("adminAuth");
  } catch {
    // Ignore
  }
}
