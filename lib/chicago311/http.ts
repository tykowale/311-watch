export async function fetchJson<T>(
  url: string,
  options?: {
    fetchFn?: typeof fetch;
    timeoutMs?: number;
  }
) {
  const fetchFn = options?.fetchFn ?? fetch;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options?.timeoutMs ?? 10000);

  try {
    const response = await fetchFn(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Chicago 311 request failed with ${response.status}`);
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}
