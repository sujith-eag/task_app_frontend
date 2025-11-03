// Lightweight fetch wrapper with exponential backoff and jitter for 429 / transient failures
export async function fetchWithRetry(url, options = {}, retries = 3, baseDelay = 500) {
  // baseDelay in ms
  const jitter = (n) => Math.floor(Math.random() * n);

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);

      // If rate-limited, optionally use Retry-After header
      if (res.status === 429) {
        if (attempt === retries) return res; // give up, return response so caller can handle

        const retryAfter = res.headers.get('Retry-After');
        const waitMs = retryAfter ? parseFloat(retryAfter) * 1000 : baseDelay * Math.pow(2, attempt) + jitter(200);
        await new Promise((r) => setTimeout(r, waitMs));
        continue; // retry
      }

      // For other 5xx errors, we can retry a couple of times as well
      if (res.status >= 500 && res.status < 600) {
        if (attempt === retries) return res;
        const waitMs = baseDelay * Math.pow(2, attempt) + jitter(200);
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }

      return res;
    } catch (err) {
      // Network error — retry unless out of attempts
      if (attempt === retries) throw err;
      const waitMs = baseDelay * Math.pow(2, attempt) + jitter(200);
      await new Promise((r) => setTimeout(r, waitMs));
    }
  }
}

export default fetchWithRetry;
