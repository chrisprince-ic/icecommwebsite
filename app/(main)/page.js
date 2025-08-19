'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import ProductCard from '../components/ProductCard';
import Link from 'next/link';
import FallbackImage from '../components/FallbackImage';
import LoadingSpinner from '../components/LoadingSpinner';
import StaggeredGrid from '../components/StaggeredGrid';

// Cache for products to avoid refetching
const productCache = {
  featured: null,
  hero: null,
  newArrivals: null,
  lastFetch: null
};

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [heroProducts, setHeroProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [loadingStates, setLoadingStates] = useState({
    featured: false,
    hero: false,
    newArrivals: false
  });

  // Check if cache is valid
  const isCacheValid = useMemo(() => {
    return productCache.lastFetch && (Date.now() - productCache.lastFetch < CACHE_DURATION);
  }, []);

  // Load from cache if valid
  useEffect(() => {
    if (isCacheValid) {
      setFeaturedProducts(productCache.featured || []);
      setHeroProducts(productCache.hero || []);
      setNewArrivals(productCache.newArrivals || []);
      setLoading(false);
    }
  }, [isCacheValid]);

  useEffect(() => {
    const fetchProducts = async () => {
      // If cache is valid, don't fetch again
      if (isCacheValid) return;

      try {
        console.log('Fetching products from Firebase...');
        
        // Set loading states
        setLoadingStates({
          featured: true,
          hero: true,
          newArrivals: true
        });

        // Fetch all products in parallel for better performance
        const [featuredSnapshot, heroSnapshot, newArrivalsSnapshot] = await Promise.all([
          // Featured products
          getDocs(query(
            collection(db, 'products'),
            where('featured', '==', true),
            limit(8)
          )),
          // Hero products (first 2 featured)
          getDocs(query(
            collection(db, 'products'),
            where('featured', '==', true),
            limit(2)
          )),
          // New arrivals (only if window is available)
          typeof window !== 'undefined' ? 
            getDocs(query(
              collection(db, 'products'),
              where('createdAt', '>=', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
              orderBy('createdAt', 'desc'),
              limit(8)
            )) : 
            Promise.resolve({ docs: [] })
        ]);

        console.log('Featured products found:', featuredSnapshot.docs.length);
        console.log('Hero products found:', heroSnapshot.docs.length);
        console.log('New arrivals found:', newArrivalsSnapshot.docs.length);

        // Process results
        const featured = featuredSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const hero = heroSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const newArrivalsData = newArrivalsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Update state
        setFeaturedProducts(featured);
        setHeroProducts(hero);
        setNewArrivals(newArrivalsData);

        // Update cache
        productCache.featured = featured;
        productCache.hero = hero;
        productCache.newArrivals = newArrivalsData;
        productCache.lastFetch = Date.now();

      } catch (error) {
        console.error('Error fetching products:', error);
        console.error('Error details:', error.message);
        // Fallback to cached data if available
        if (productCache.featured) {
          setFeaturedProducts(productCache.featured);
          setHeroProducts(productCache.hero);
          setNewArrivals(productCache.newArrivals);
        }
      } finally {
        setLoading(false);
        setLoadingStates({
          featured: false,
          hero: false,
          newArrivals: false
        });
      }
    };

    fetchProducts();
  }, [isCacheValid]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const categories = [
    { name: 'Electronics', icon: '📱', href: '/categories/electronics' },
    { name: 'Books', icon: '📚', href: '/categories/books' },
    { name: 'Clothing', icon: '👕', href: '/categories/clothing' },
    { name: 'Home & Garden', icon: '🏠', href: '/categories/home-garden' },
    { name: 'Sports', icon: '⚽', href: '/categories/sports' },
    { name: 'Toys', icon: '🧸', href: '/categories/toys' },
  ];

  // Show skeleton loading instead of spinner for better UX
  if (loading && !isCacheValid) {
    return (
      <div className="min-h-screen">
        {/* Hero Section Skeleton */}
        <section className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Hero Content Skeleton */}
              <div className="text-white">
                <div className="h-16 bg-white/20 rounded-lg mb-6 animate-pulse"></div>
                <div className="h-8 bg-white/20 rounded-lg mb-8 animate-pulse"></div>
                <div className="flex gap-4">
                  <div className="h-12 bg-white/20 rounded-xl w-40 animate-pulse"></div>
                  <div className="h-12 bg-white/10 rounded-xl w-40 animate-pulse"></div>
                </div>
              </div>

              {/* Hero Products Skeleton */}
              <div className="grid grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="aspect-square bg-white/20 rounded-xl mb-4 animate-pulse"></div>
                    <div className="h-6 bg-white/20 rounded mb-2 animate-pulse"></div>
                    <div className="h-8 bg-white/20 rounded w-20 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section Skeleton */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-10 bg-gray-200 rounded-lg mb-12 animate-pulse"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="h-12 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Skeleton */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-white">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Elevate Your
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Style Game
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Discover premium products that define modern excellence. 
                From cutting-edge tech to timeless classics.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/categories" 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Explore Collection
                </Link>
                <Link 
                  href="/search" 
                  className="border-2 border-white/30 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all duration-300"
                >
                  Search Products
                </Link>
              </div>
            </div>

            {/* Hero Products */}
            <div className="relative">
              {heroProducts.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {heroProducts.map((product, index) => (
                    <div 
                      key={product.id}
                      className={`relative group cursor-pointer transform transition-all duration-500 ${
                        index === 0 ? 'translate-y-8' : '-translate-y-8'
                      } hover:scale-105`}
                    >
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <div className="relative aspect-square mb-4 overflow-hidden rounded-xl">
                          <FallbackImage
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-blue-300 font-bold text-xl">
                          ${product.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                href={category.href}
                className="group bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border border-transparent hover:border-blue-200"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl mb-4 transition-transform duration-500 group-hover:scale-110">{category.icon}</div>
                <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link
              href="/categories"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All →
            </Link>
          </div>
          {featuredProducts.length > 0 ? (
            <StaggeredGrid staggerDelay={150}>
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </StaggeredGrid>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No featured products available</p>
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">New Arrivals</h2>
            <Link
              href="/new-arrivals"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All →
            </Link>
          </div>
          {newArrivals.length > 0 ? (
            <StaggeredGrid staggerDelay={150}>
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </StaggeredGrid>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No new arrivals available</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action - Only show if user is not signed in */}
      {!user && (
        <section className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">Ready to Start Shopping?</h2>
            <p className="text-xl mb-8 text-gray-300">
              Join thousands of satisfied customers who trust IceComm for their shopping needs.
            </p>
            <Link
              href="/register"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Create Account
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
