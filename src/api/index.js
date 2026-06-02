// localStorage-backed API — substitui o mock vazio
// Suporta: GET /analyses, POST /analyses, PUT /analyses/:id, DELETE /analyses/:id
// POST /upload — retorna object URL temporária (sem backend real)

const DB_KEY = 'sylvaai_analyses';

const readAll = () => {
  try {
    return JSON.parse(localStorage.getItem(DB_KEY) || '[]');
  } catch {
    return [];
  }
};

const writeAll = (items) => {
  localStorage.setItem(DB_KEY, JSON.stringify(items));
};

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

const api = {
  get: async (endpoint) => {
    await delay(200);
    if (endpoint === '/analyses') {
      const items = readAll().sort(
        (a, b) => new Date(b.dataHora) - new Date(a.dataHora)
      );
      return { data: items };
    }
    return { data: [] };
  },

  post: async (endpoint, payload) => {
    await delay(300);

    if (endpoint === '/upload') {
      // Sem backend real — retorna string vazia; a imagem não é persistida
      return { data: { file_url: '' } };
    }

    if (endpoint === '/analyses') {
      const items = readAll();
      const newItem = {
        ...payload,
        id: crypto.randomUUID(),
        created_date: new Date().toISOString(),
      };
      items.push(newItem);
      writeAll(items);
      return { data: newItem };
    }

    return { data: null };
  },

  put: async (endpoint, payload) => {
    await delay(200);
    // endpoint: /analyses/:id
    const id = endpoint.split('/').pop();
    const items = readAll();
    const idx = items.findIndex((i) => i.id === id);
    if (idx !== -1) {
      items[idx] = { ...items[idx], ...payload };
      writeAll(items);
      return { data: items[idx] };
    }
    return { data: null };
  },

  delete: async (endpoint) => {
    await delay(200);
    // endpoint: /analyses/:id
    const id = endpoint.split('/').pop();
    const items = readAll().filter((i) => i.id !== id);
    writeAll(items);
    return { data: { success: true } };
  },
};

export default api;
