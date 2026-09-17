const API_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:5000";

type ApiOptions = {
  method?: "GET" | "POST";
  token?: string | null;
  body?: unknown;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method: options.method ?? "GET",
      headers,
      body:
        options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new ApiError(
      "Cannot reach the API. Check EXPO_PUBLIC_API_URL and that the server is running.",
      0,
    );
  }

  const data = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    message?: string;
  };

  if (!response.ok) {
    throw new ApiError(
      data.message || `Request failed (${response.status})`,
      response.status,
    );
  }

  return data as T;
}

export type LoginResponse = {
  success: true;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
};

export type GenerateResponse = {
  success: true;
  message: string;
};

export function loginRequest(email: string, password: string) {
  return apiRequest<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export function generateRequest(token: string, prompt: string) {
  return apiRequest<GenerateResponse>("/api/gemini/generate", {
    method: "POST",
    token,
    body: { prompt },
  });
}
