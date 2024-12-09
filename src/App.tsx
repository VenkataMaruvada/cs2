import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import SearchBar from './components/SearchBar';
import ProductGrid from './components/ProductGrid';
import ChatBot from './components/ChatBot';
import { Product } from './types';
import { ProductService } from './services/product.service';

function App() {
  const [products, setProducts] = useState<Product[]>([]); // State to store products
  const [loading, setLoading] = useState(false); // State to manage loading spinner
  const [error, setError] = useState<string | null>(null); // State to handle error messages

  // Function to handle search queries
  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const results = await ProductService.searchProducts(query);
      console.log('Fetched Products:', results); // Ensure products are being fetched correctly
      setProducts(results); // Update state with fetched products
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products. Please try again later.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">RetailStore</h1>
            </div>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : products.length > 0 ? (
          // Product Grid
          <ProductGrid products={products} />
        ) : !error && (
          // Fallback Message
          <div className="text-center py-12">
            <h2 className="text-xl text-gray-600">
              Search for products to get started
            </h2>
          </div>
        )}
      </main>

      {/* ChatBot Component */}
      <ChatBot />
    </div>
  );
}

export default App;
