export const API_CONFIG = {
  baseURL: 'http://127.0.0.1:5000', // Flask backend URL
  endpoints: {
    products: {
      search: '/retrieve', // Endpoint for product retrieval
      suggestions: '/suggest', // Endpoint for suggestions
    },
    chat: '/chat', // Chat endpoint
    //logQuery: '/log_query', // Logging endpoint
  },
  timeout: 10000, // Request timeout in milliseconds (10 seconds)
  retries: 3, // Number of retries for failed requests
};
