export interface Product {
  id?: number;
  name: string;
  price: string;
  brand: string;
  description: string;
  image?: string;
  availability: string;
  category?: string;
}

export interface SearchSuggestion {
  id: number;
  name: string;
}