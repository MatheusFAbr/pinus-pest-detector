const api = {
  call: async (endpoint, payload) => {
    console.log("API MOCK:", endpoint, payload);

    return {
      success: true,
      data: null,
    };
  },
};

export default api;