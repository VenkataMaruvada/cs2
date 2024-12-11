import { useState, useEffect } from 'react';
import { ShoppingBag, Sun, Moon, User } from 'lucide-react'; // Import the user icon
import SearchBar from './components/SearchBar';
import ProductGrid from './components/ProductGrid';
import ChatBot from './components/ChatBot';
import { Product } from './types';
import { ProductService } from './services/product.service';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

function App() {
  const [products, setProducts] = useState<Product[]>([]); // State to store products
  const [loading, setLoading] = useState(false); // State to manage loading spinner
  const [error, setError] = useState<string | null>(null); // State to handle error messages
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode

  // Handle theme toggle
  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  // Apply the saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
    AOS.init(); // Initialize AOS animations
  }, []);

  // Function to handle search queries
  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const results = await ProductService.searchProducts(query);
      console.log('Fetched Products:', results);
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <header className="bg-transparent dark:bg-transparent shadow-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              RetailStore
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <SearchBar onSearch={handleSearch} />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* User Icon in Top-Right Corner */}
      <div className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md">
        <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
      </div>

      {/* Hero Section with Background Animation */}
      <section className="relative w-full h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: "url('path-to-your-image.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </motion.div>

        {/* Text Animation */}
        <motion.div
          className="text-center z-10 relative px-4 sm:px-6 lg:px-8 py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.h2
            className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            Discover Amazing Products, Anytime, Anywhere
          </motion.h2>

          <motion.p
            className="text-xl md:text-2xl text-white opacity-80"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
          >
            Shop a wide range of products from top brands with ease. Your retail
            experience starts here.
          </motion.p>
        </motion.div>
      </section>

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
          <ProductGrid products={products} />
        ) : (
          !error && (
            <div className="text-center py-12">
              <h2 className="text-xl text-gray-600 dark:text-gray-200">
                Search for products to get started
              </h2>
            </div>
          )
        )}
      </main>

      {/* Parallax Scrolling Section */}
      <section className="relative py-16 bg-gradient-to-r from-indigo-500 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            data-aos="fade-up"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h3 className="text-3xl font-bold mb-4">Shop the Best Products</h3>
            <p className="text-lg mb-4">
              Explore the latest trends and top-quality products curated just
              for you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Interactive ChatBot */}
      <motion.div
        className="fixed bottom-10 right-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <ChatBot />
      </motion.div>
    </div>
  );
}

export default App;
