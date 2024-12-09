
import { cn } from '../utils/cn';
import { Product } from '../types';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl text-gray-600">No products available</h2>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <div
          key={product.id}
          className={cn(
            'bg-white rounded-lg shadow-md overflow-hidden',
            'transform transition-transform duration-200 hover:scale-105'
          )}
        >
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={product.image || 'https://via.placeholder.com/400x300'}
              alt={product.name}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
              <span className="text-sm text-gray-500 whitespace-nowrap ml-2">{product.brand}</span>
            </div>
            <p className="text-gray-600 text-sm line-clamp-3 mb-4">{product.description}</p>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900">${product.price}</span>
                <span
                  className={cn(
                    'text-sm',
                    product.availability.toLowerCase().includes('in stock')
                      ? 'text-red-600'
                      : 'text-green-600'
                  )}
                >
                  {product.availability}
                </span>
              </div>
              <button
                className={cn(
                  'px-4 py-2 rounded-lg text-white font-medium',
                  'bg-blue-600 hover:bg-blue-700',
                  'transition-colors duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                )}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
