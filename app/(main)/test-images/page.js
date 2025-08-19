'use client';

import FallbackImage from '../../../components/FallbackImage';

export default function TestImages() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Image Fallback Test</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Working Image */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Working Image</h3>
              <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-lg">
                <FallbackImage
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"
                  alt="Working image test"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">This should display normally</p>
            </div>

            {/* Broken Image */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Broken Image</h3>
              <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-lg">
                <FallbackImage
                  src="https://example.com/nonexistent-image.jpg"
                  alt="Broken image test"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">This should show fallback</p>
            </div>

            {/* Empty URL */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Empty URL</h3>
              <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-lg">
                <FallbackImage
                  src=""
                  alt="Empty URL test"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">This should show fallback</p>
            </div>

            {/* Fixed Size Image */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Fixed Size (Working)</h3>
              <div className="flex justify-center">
                <FallbackImage
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop"
                  alt="Fixed size test"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">Fixed dimensions</p>
            </div>

            {/* Fixed Size Broken */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Fixed Size (Broken)</h3>
              <div className="flex justify-center">
                <FallbackImage
                  src="https://broken-url.com/image.jpg"
                  alt="Fixed size broken test"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">Should show fallback</p>
            </div>

            {/* Product Card Style */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Product Card Style</h3>
              <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-lg">
                <FallbackImage
                  src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop"
                  alt="Product card test"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">Product card styling</p>
            </div>

          </div>

          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Test Instructions</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• <strong>Working Image:</strong> Should display the Unsplash image normally</p>
              <p>• <strong>Broken Image:</strong> Should show the fallback with "Image unavailable" message</p>
              <p>• <strong>Empty URL:</strong> Should show the fallback immediately</p>
              <p>• <strong>Fixed Size:</strong> Test both working and broken images with fixed dimensions</p>
              <p>• <strong>Product Card Style:</strong> Shows how it looks in actual product cards</p>
            </div>
          </div>

          <div className="mt-6">
            <a
              href="/"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Homepage
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 