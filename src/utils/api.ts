import axios from 'axios';
import { Product, SearchSuggestion } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

export const searchProducts = async (query: string): Promise<Product[]> => {
  const response = await axios.get(`${API_BASE_URL}/products/search?q=${query}`);
  return response.data;
};

export const getSuggestions = async (query: string): Promise<SearchSuggestion[]> => {
  const response = await axios.get(`${API_BASE_URL}/products/suggestions?q=${query}`);
  return response.data;
};

export const sendChatMessage = async (message: string): Promise<string> => {
  const response = await axios.post(`${API_BASE_URL}/chat`, { message });
  return response.data.reply;
};