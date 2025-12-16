// Decodes base64url safely
function decodeBase64Url(base64Url: string): string {
  return atob(base64Url.replace(/-/g, "+").replace(/_/g, "/"));
}

/**
 * Get raw token from localStorage
 */
export function getToken(): string | null {
  const token = localStorage.getItem("token");
  return token ? token : null;
}

/**
 * Get decoded payload from JWT token (returns user data inside token)
 */
export function getTokenData(): any | null {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = token.split(".")[1]; // JWT format: header.payload.signature
    const decoded = decodeBase64Url(payload);
    return JSON.parse(decoded); // Contains user info
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}
