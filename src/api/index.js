// localStorage-backed API — substitui o mock vazio
// Suporta: GET /analyses, POST /analyses, PUT /analyses/:id, DELETE /analyses/:id
// POST /upload — retorna object URL temporária (sem backend real)

const DB_ANALYSES = 'sylvaai_analyses';
const DB_PLANTATIONS = 'plantations';

const readAll = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
};

const writeAll = (key, items) => {
  localStorage.setItem(key, JSON.stringify(items));
};

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

const api = {
  get: async (endpoint) => {
    await delay(200);
    if (endpoint === '/analyses') {
      const items = readAll(DB_ANALYSES).sort(
        (a, b) => new Date(b.dataHora) - new Date(a.dataHora)
      );
      return { data: items };
    }
    if (endpoint === '/plantations') {
      const items = readAll(DB_PLANTATIONS);
      return { data: items };
    }
    return { data: [] };
  },

  post: async (endpoint, payload) => {
    await delay(300);

    if (endpoint === '/upload') {
      return { data: { file_url: '' } };
    }

    if (endpoint === '/analyses') {
      const items = readAll(DB_ANALYSES);
      const newItem = {
        ...payload,
        id: crypto.randomUUID(),
        created_date: new Date().toISOString(),
      };
      items.push(newItem);
      writeAll(DB_ANALYSES, items);
      return { data: newItem };
    }

    return { data: null };
  },

  put: async (endpoint, payload) => {
    await delay(200);
    const id = endpoint.split('/').pop();
    const items = readAll(DB_ANALYSES);
    const idx = items.findIndex((i) => i.id === id);
    if (idx !== -1) {
      items[idx] = { ...items[idx], ...payload };
      writeAll(DB_ANALYSES, items);
      return { data: items[idx] };
    }
    return { data: null };
  },

  delete: async (endpoint) => {
    await delay(200);
    const id = endpoint.split('/').pop();
    const items = readAll(DB_ANALYSES).filter((i) => i.id !== id);
    writeAll(DB_ANALYSES, items);
    return { data: { success: true } };
  },
};

export default api;
