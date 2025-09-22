// src/lib/adminUtils.ts
// Utility for admin verification and product management

export function verifyAdmin(password: string): boolean {
  // Simple hardcoded password check for demonstration (replace with real auth in production)
  return password === "admin123";
}

// You can expand this utility with token-based or API-based verification as needed.
