import { apiClient } from '../utils/api-client';
import { API_CONFIG } from '../config/api.config';
import { Product } from '../types';
import { ProductResponse, SuggestionsResponse } from '../types/api.types';

export class ProductService {
  static async searchProducts(query: string): Promise<Product[]> {
    try {
      // Make the API call
      const { data } = await apiClient.get<ProductResponse[]>('/retrieve', {
        params: { query },
      });

      console.log('API Response Data:', data); // Log the raw response

      // Map the raw API response directly (since it's already an array)
      const transformedProducts = (data || []).map((product, index) => ({
        id: index + 1, // Generate a numeric ID
        name: product.title,
        brand: product.brand || 'Unknown',
        price: product.price || '0',
        description: product.description || 'No description available',
        availability: product.availability || 'InStock',
        image: `https://source.unsplash.com/400x300/?${encodeURIComponent(product.title)}`,
      }));

      console.log('Transformed Products:', transformedProducts); // Debug the transformed products
      return transformedProducts;
    } catch (error) {
      console.error('Error in searchProducts:', error);
      throw error; // Re-throw error for upstream handling
    }
  }


  static async getSuggestions(query: string): Promise<string[]> {
    try {
      const { data } = await apiClient.post<SuggestionsResponse>(
        API_CONFIG.endpoints.products.suggestions,
        { query }
      );
      return data.suggestions || [];
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      return [];
    }
  }
}
