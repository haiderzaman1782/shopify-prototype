'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Product } from '@/src/types';
import { useCart } from '@/src/contexts/CartContext';

interface ProductDetailProps {
  productId?: string | number | null;
  product?: Product | null;
  isOpen?: boolean;
  onClose?: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  productId: propProductId,
  product: propProduct,
  isOpen = true,
  onClose
}) => {
  const router = useRouter();
  const params = useParams();

  const productId = useMemo(() => {
    if (propProductId) return String(propProductId);
    const rawId = Array.isArray(params?.productId) ? params?.productId[0] : params?.productId;
    return rawId ? String(rawId) : null;
  }, [params, propProductId]);

  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(propProduct || null);
  const [loading, setLoading] = useState<boolean>(!propProduct);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (propProduct) {
      setProduct(propProduct);
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      if (!productId) {
        setError('Invalid product');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get<Product>(`/products/${productId}`);
        setProduct(response.data);
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          router.push(`/login?redirect=/product/${productId}`);
        } else {
          setError(err?.response?.data?.error || 'Failed to load product');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, router, propProduct]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  if (!isOpen) return null;

  const content = (
    <div className={`flex flex-col md:flex-row gap-10 ${onClose ? 'bg-white p-6 rounded-2xl max-w-4xl w-full relative' : 'p-6 md:p-10 max-w-6xl mx-auto'}`}>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {loading ? (
        <div className="p-8 text-gray-600 flex justify-center items-center w-full min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3">Loading product...</span>
        </div>
      ) : error ? (
        <div className="p-8 text-red-600 w-full text-center">{error}</div>
      ) : !product ? (
        <div className="p-8 text-gray-700 w-full text-center">Product not found.</div>
      ) : (
        <>
          <div className="w-full md:w-1/2">
            <div className="aspect-square w-full bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden flex items-center justify-center">
              {product.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="text-gray-400 text-sm">No image available</div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 md:w-1/2">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-gray-900">{product.name}</h1>
              {product.store_name && (
                <p className="text-sm text-gray-500">Sold by {product.store_name}</p>
              )}
            </div>

            <div className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</div>

            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {product.description || 'No description provided.'}
            </p>

            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-white font-medium shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
              >
                Add to Cart
              </button>
              {product.store_id && (
                <Link
                  href={`/store/${product.store_id}`}
                  className="inline-flex items-center justify-center rounded-md bg-gray-200 px-4 py-3 text-gray-700 font-medium shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition-colors text-sm"
                  onClick={onClose} // Close modal if it's open
                >
                  Visit Store
                </Link>
              )}
              {product.is_featured && (
                <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded">
                  Featured
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (onClose) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto">
        <div className="min-h-screen py-8 flex items-center justify-center w-full">
          {content}
          <div
            className="fixed inset-0 -z-10"
            onClick={onClose}
          />
        </div>
      </div>
    );
  }

  return content;
};

export default ProductDetail;


