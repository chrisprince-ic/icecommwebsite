'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

export default function DebugDatabase() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkDatabase = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check products
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const productsData = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Check orders
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        const ordersData = ordersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setProducts(productsData);
        setOrders(ordersData);

        console.log('Database check completed:');
        console.log('Products found:', productsData.length);
        console.log('Orders found:', ordersData.length);
        console.log('Products:', productsData);
        console.log('Orders:', ordersData);

      } catch (err) {
        console.error('Error checking database:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkDatabase();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Database Debug</h1>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Checking database...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Database Debug</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Products Section */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Products Collection</h2>
              <div className="text-3xl font-bold text-blue-600 mb-2">{products.length}</div>
              <div className="text-sm text-gray-600 mb-4">Total products</div>
              
              {products.length > 0 ? (
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Featured Products:</h3>
                  <div className="text-sm text-gray-600">
                    {products.filter(p => p.featured).length} featured products
                  </div>
                  
                  <h3 className="font-medium text-gray-900 mt-4">Sample Products:</h3>
                  {products.slice(0, 3).map((product, index) => (
                    <div key={index} className="text-sm text-gray-600 border-l-2 border-gray-200 pl-2">
                      • {product.name} - ${product.price}
                      {product.featured && <span className="text-red-600 ml-2">(Featured)</span>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  No products found. The database is empty.
                </div>
              )}
            </div>

            {/* Orders Section */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Orders Collection</h2>
              <div className="text-3xl font-bold text-green-600 mb-2">{orders.length}</div>
              <div className="text-sm text-gray-600 mb-4">Total orders</div>
              
              {orders.length > 0 ? (
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Sample Orders:</h3>
                  {orders.slice(0, 3).map((order, index) => (
                    <div key={index} className="text-sm text-gray-600 border-l-2 border-gray-200 pl-2">
                      • Order #{order.orderNumber || order.id} - ${order.total?.toFixed(2) || '0.00'}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  No orders found.
                </div>
              )}
            </div>
          </div>

          {/* Recommendations */}
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Recommendations</h3>
            <div className="space-y-2 text-sm text-blue-800">
              {products.length === 0 && (
                <div>• <strong>Add sample products:</strong> Visit <a href="/add-sample-products" className="underline">/add-sample-products</a> to populate the database</div>
              )}
              {products.length > 0 && products.filter(p => p.featured).length === 0 && (
                <div>• <strong>No featured products:</strong> Add some products with featured: true to see them on the homepage</div>
              )}
              {products.length > 0 && (
                <div>• <strong>Database is working:</strong> Products are loading correctly</div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 flex gap-4">
            <a
              href="/add-sample-products"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Sample Products
            </a>
            <a
              href="/"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go to Homepage
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
