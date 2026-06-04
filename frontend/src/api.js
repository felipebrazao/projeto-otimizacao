const BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function postJson(path, body) {
  const resp = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const payload = await resp.json().catch(() => ({}));
    let msg = `Erro ${resp.status}`;
    if (typeof payload.detail === 'string') {
      msg = payload.detail;
    } else if (Array.isArray(payload.detail)) {
      msg = payload.detail
        .map((d) => `${(d.loc || []).slice(1).join('.')}: ${d.msg}`)
        .join('; ');
    }
    throw new Error(msg);
  }
  return resp.json();
}

export const otimizar = (params) => postJson('/otimizar', params);
export const superficie = (params) => postJson('/superficie', params);
