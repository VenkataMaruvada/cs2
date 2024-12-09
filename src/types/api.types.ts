export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface ProductResponse {
  title: string;
  brand: string;
  description: string;
  price: string; // Price as a string from the backend
  availability: string;
  image:string;
}

export interface ProductDataType {
  id: number;
  name: string;
  brand: string;
  price: number;
  description: string;
  availability: string;
  image: string;
}

export interface SearchResponse {
  products: ProductResponse[];
  total: number;
  page: number;
  per_page: number;
}

export interface ChatResponse {
  response: string;
  intent?: 'New Query' | 'Follow Up';
  chat_history?: ChatMessage[];
  product_data?: ProductResponse[]; // Matches backend response type
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface SuggestionsResponse {
  suggestions: string[];
}
