export interface CurrentUser {
  userId: number;
  name: string;
}

export async function fetchCurrentUser(): Promise<CurrentUser | null> {
  try {
    const res = await fetch("/api/auth/me", {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function logoutUser(): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Cache-Control": "no-cache" },
    });
    return res.ok;
  } catch {
    return false;
  }
}
