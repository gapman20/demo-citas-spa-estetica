const BASE_URL = '/api/sync-calendar';
const TIMEOUT_MS = 10000;

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest(action, payload = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...payload }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || 'Error en la solicitud.',
        response.status,
        data
      );
    }

    return data;
  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === 'AbortError') {
      throw new ApiError('La solicitud tardó demasiado. Intentá de nuevo.', 0, null);
    }

    if (err instanceof ApiError) {
      throw err;
    }

    throw new ApiError(
      'Error de conexión. Verificá tu internet e intentá de nuevo.',
      0,
      null
    );
  }
}
