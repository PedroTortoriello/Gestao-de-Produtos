import axios from 'axios';

const api = axios.create({
  baseURL: 'https://interview.t-alpha.com.br',
});

// Adiciona o token ao cabeçalho de cada requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
