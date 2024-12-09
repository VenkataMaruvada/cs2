import { apiClient } from '../utils/api-client';
import { API_CONFIG } from '../config/api.config';
import { ChatMessage, ChatResponse, ProductDataType } from '../types/api.types';
import axios from 'axios';

export class ChatService {
  private static chatHistory: ChatMessage[] = [];
  private static productData: ProductDataType[] | null = null;

  static async sendMessage(message: string): Promise<ChatResponse> {
    try {
      const payload = {
        message,
        chat_history: this.chatHistory,
        product_data: this.productData,
      };

      const { data } = await apiClient.post<ChatResponse>(
        API_CONFIG.endpoints.chat,
        payload
      );

      this.chatHistory.push({ role: 'user', content: message });

      if (data.response) {
        this.chatHistory.push({ role: 'assistant', content: data.response });
      }

      if (data.intent === 'New Query' && Array.isArray(data.product_data)) {
        this.productData = data.product_data.map((product, index) => ({
          id: index + 1,
          name: product.title,
          brand: product.brand || 'Unknown',
          price: parseFloat(product.price || '0'),
          description: product.description || 'No description available',
          availability: product.availability || 'Unknown',
          image: product.image || `https://via.placeholder.com/150?text=${encodeURIComponent(product.title)}`,
        }));
      }

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios Error:', error.message);
        if (error.response) {
          console.error('Response Data:', error.response.data);
        }
      } else if (error instanceof Error) {
        console.error('General Error:', error.message);
      } else {
        console.error('Unknown Error:', error);
      }
      throw new Error('Failed to process chat message. Please try again.');
    }
  }

  static setProductData(data: ProductDataType[]): void {
    this.productData = data;
  }

  static clearChat(): void {
    this.chatHistory = [];
    this.productData = null;
  }

  static getChatHistory(): ChatMessage[] {
    return [...this.chatHistory];
  }

  static getProductData(): ProductDataType[] | null {
    return this.productData ? [...this.productData] : null;
  }
}
