export default defineNuxtPlugin(() => {
  const originalFetch = (globalThis as any).fetch as typeof fetch;

  (globalThis as any).fetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const token = sessionStorage.getItem('admin_token');
    if (token) {
      init = init || {};
      init.headers = new Headers(init.headers);
      init.headers.set('Authorization', `Bearer ${token}`);
    }
    return originalFetch(input, init);
  };
});
