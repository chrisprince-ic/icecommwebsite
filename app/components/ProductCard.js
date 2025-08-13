'use client';

import { useState, memo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { auth } from '../firebase/config';

const ProductCard = memo(function ProductCard({ product }) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const addToCart = () => {
    setIsAddingToCart(true);
    
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already exists in cart
    const existingProductIndex = existingCart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex >= 0) {
      // Increment quantity if product already exists
      existingCart[existingProductIndex].quantity += 1;
    } else {
      // Add new product to cart
      existingCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1
      });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Trigger cart update event
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 1000);
  };

  const toggleWishlist = () => {
    // Get current user from auth
    const user = auth.currentUser;
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    const wishlistKey = `wishlist_${user.uid}`;
    const existingWishlist = JSON.parse(localStorage.getItem(wishlistKey) || '[]');
    
    if (isInWishlist) {
      // Remove from wishlist
      const updatedWishlist = existingWishlist.filter(item => item.id !== product.id);
      localStorage.setItem(wishlistKey, JSON.stringify(updatedWishlist));
      setIsInWishlist(false);
    } else {
      // Add to wishlist
      const wishlistItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
        description: product.description,
        stock: product.stock,
        featured: product.featured
      };
      existingWishlist.push(wishlistItem);
      localStorage.setItem(wishlistKey, JSON.stringify(existingWishlist));
      setIsInWishlist(true);
    }
  };

  // Check if product is in wishlist on mount
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const wishlistKey = `wishlist_${user.uid}`;
      const existingWishlist = JSON.parse(localStorage.getItem(wishlistKey) || '[]');
      setIsInWishlist(existingWishlist.some(item => item.id === product.id));
    }
  }, [product.id]);

  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {product.featured && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              Featured
            </div>
          )}
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist();
            }}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-red-500 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100"
          >
            <svg className="w-5 h-5" fill={isInWishlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
          {product.stock < 10 && product.stock > 0 && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              Only {product.stock} left
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-bold text-lg bg-gray-500 px-4 py-2 rounded-full">Out of Stock</span>
            </div>
          )}
          {/* Quick add button overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              onClick={addToCart}
              disabled={product.stock === 0 || isAddingToCart}
              className={`px-6 py-3 rounded-full font-bold text-white transition-all duration-300 transform scale-90 group-hover:scale-100 ${
                product.stock === 0
                  ? 'bg-gray-500 cursor-not-allowed'
                  : isAddingToCart
                  ? 'bg-green-500 shadow-lg'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl'
              }`}
            >
              {product.stock === 0
                ? 'Out of Stock'
                : isAddingToCart
                ? '✓ Added!'
                : 'Quick Add'}
            </button>
          </div>
        </div>
      </Link>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide bg-blue-50 px-3 py-1 rounded-full">
            {product.category}
          </span>
          {product.stock > 0 && (
            <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
              In Stock
            </span>
          )}
        </div>
        
        <Link href={`/product/${product.id}`}>
          <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <button
            onClick={addToCart}
            disabled={product.stock === 0 || isAddingToCart}
            className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
              product.stock === 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : isAddingToCart
                ? 'bg-green-500 text-white shadow-lg'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transform hover:scale-105'
            }`}
          >
            {product.stock === 0
              ? 'Out of Stock'
              : isAddingToCart
              ? '✓ Added!'
              : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
