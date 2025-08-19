'use client';

import { useState } from 'react';

export const dynamic = 'force-dynamic';

const sampleProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
    price: 89.99,
    category: "Electronics",
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    featured: true,
    createdAt: new Date()
  },
  {
    name: "Smart Fitness Watch",
    description: "Advanced fitness tracking with heart rate monitor and GPS capabilities.",
    price: 199.99,
    category: "Electronics",
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    featured: true,
    createdAt: new Date()
  },
  {
    name: "Organic Cotton T-Shirt",
    description: "Comfortable and sustainable cotton t-shirt available in multiple colors.",
    price: 24.99,
    category: "Clothing",
    stock: 100,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
    featured: false,
    createdAt: new Date()
  },
  {
    name: "Professional Camera Lens",
    description: "High-quality 50mm f/1.8 lens perfect for portrait photography.",
    price: 299.99,
    category: "Electronics",
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop",
    featured: true,
    createdAt: new Date()
  },
  {
    name: "Yoga Mat Premium",
    description: "Non-slip yoga mat made from eco-friendly materials.",
    price: 39.99,
    category: "Sports",
    stock: 75,
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop",
    featured: false,
    createdAt: new Date()
  },
  {
    name: "Wireless Charging Pad",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices.",
    price: 49.99,
    category: "Electronics",
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&h=500&fit=crop",
    featured: false,
    createdAt: new Date()
  },
  {
    name: "Designer Sunglasses",
    description: "Stylish sunglasses with UV protection and polarized lenses.",
    price: 129.99,
    category: "Clothing",
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
    featured: true,
    createdAt: new Date()
  },
  {
    name: "Smart Home Speaker",
    description: "Voice-controlled smart speaker with premium sound quality.",
    price: 149.99,
    category: "Electronics",
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&h=500&fit=crop",
    featured: true,
    createdAt: new Date()
  }
];

export default function AddSampleProducts() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const addSampleProducts = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const { collection, addDoc } = await import('firebase/firestore');
      const { db } = await import('../../firebase/config');
      for (const product of sampleProducts) {
        await addDoc(collection(db, 'products'), {
          ...product,
          updatedAt: new Date()
        });
      }
      setMessage('Sample products added successfully!');
    } catch (error) {
      console.error('Error adding sample products:', error);
      setMessage('Error adding sample products: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Add Sample Products</h1>
          <p className="text-gray-600 mb-8">
            This page will add {sampleProducts.length} sample products to your database for testing purposes.
          </p>
          
          <button
            onClick={addSampleProducts}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding Products...' : 'Add Sample Products'}
          </button>
          
          {message && (
            <div className={`mt-4 p-4 rounded-lg ${
              message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {message}
            </div>
          )}
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sample Products:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sampleProducts.map((product, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.category}</p>
                  <p className="text-lg font-bold text-blue-600">${product.price}</p>
                  {product.featured && (
                    <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mt-1">
                      Featured
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
