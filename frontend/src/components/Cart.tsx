'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/src/contexts/CartContext';
import Swal from 'sweetalert2';
import { CartProps } from '@/src/types';

const Cart: React.FC<CartProps> = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();

  const handleCheckout = (): void => {
    Swal.fire({
      icon: 'info',
      title: 'Checkout',
      text: 'Checkout functionality coming soon! For now, you can continue shopping.',
      confirmButtonText: 'OK'
    });
  };

  const handleClearCart = (): void => {
    Swal.fire({
      title: 'Clear Cart?',
      text: 'Are you sure you want to remove all items from your cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, clear it!'
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
        Swal.fire('Cleared!', 'Your cart has been cleared.', 'success');
      }
    });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Start shopping to add items to your cart</p>
          <Link
            href="/marketplace"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Clear Cart
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {cart.map((item) => (
            <div key={`${item.store_id}-${item.id}`} className="flex gap-4 py-4 border-b last:border-0">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                  }}
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No Image</span>
                </div>
              )}
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <span>{item.store_logo}</span>
                      <span>{item.store_name}</span>
                    </p>
                    <p className="text-lg font-bold text-blue-600 mt-2">
                      ${item.price?.toFixed(2)} each
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id, item.store_id || 0)}
                    className="text-red-600 hover:text-red-700 h-fit"
                    title="Remove from cart"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <label className="text-sm font-medium">Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => {
                      const qty = parseInt(e.target.value) || 1;
                      updateQuantity(item.id, item.store_id || 0, qty);
                    }}
                    className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-500">
                    = ${((item.price || 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-semibold">Total:</span>
            <span className="text-2xl font-bold text-blue-600">
              ${getCartTotal().toFixed(2)}
            </span>
          </div>
          <div className="flex gap-4">
            <Link
              href="/marketplace"
              className="flex-1 px-6 py-3 border border-gray-300 rounded-md text-center hover:bg-gray-50 transition-colors font-medium"
            >
              Continue Shopping
            </Link>
            <button
              onClick={handleCheckout}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;


