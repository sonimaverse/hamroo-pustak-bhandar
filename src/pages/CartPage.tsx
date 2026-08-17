import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorAlert } from '../components/common/ErrorAlert';
import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  ShieldCheck,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    loading,
    error,
    updateQuantity,
    removeItem,
    clearCart,
    totalAmount,
    itemCount,
  } = useCart();

  const navigate = useNavigate();

  React.useEffect(() => {
    document.title = 'Shopping Cart | Hamro Pustak Bhandar';
  }, []);

  if (loading && (!cart || !cart.items)) {
    return (
      <div className="py-16">
        <LoadingSpinner label="Fetching your shopping cart..." />
      </div>
    );
  }

  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-700">
            <ShoppingCart className="w-4 h-4" />
            <span>Shopping Cart</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
            Your Selected Titles ({itemCount})
          </h1>
        </div>

        {!isEmpty && (
          <button
            onClick={clearCart}
            disabled={loading}
            className="text-xs font-bold text-stone-500 hover:text-red-700 flex items-center gap-1 transition disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Cart
          </button>
        )}
      </div>

      {error && <ErrorAlert message={error} />}

      {isEmpty ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center my-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-700 flex items-center justify-center mx-auto">
            <ShoppingCart className="w-8 h-8 stroke-1" />
          </div>

          <h2 className="text-xl font-serif font-bold text-stone-900">
            Your Cart is Empty
          </h2>

          <p className="text-xs text-stone-500 max-w-md mx-auto">
            You haven't added any books to your cart yet. Explore our extensive
            catalog of literature and educational guides.
          </p>

          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              <span>Explore Bookstore Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-3">
            {cart.items.map((item) => (
              <div
                key={item.bookId}
                className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">

                  <div className="w-16 h-20 bg-stone-100 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                    {item.coverImage ? (
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <BookOpen className="w-8 h-8 text-stone-400 stroke-1" />
                    )}
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-stone-900 text-sm">
                      {item.title}
                    </h3>

                    <p className="text-xs text-stone-500 font-medium">
                      by {item.author}
                    </p>

                    <div className="text-xs font-bold text-stone-900 mt-1">
                      Rs. {item.unitPrice.toLocaleString()}

                      {item.wholesalePrice &&
                        item.wholesalePrice < item.regularPrice && (
                          <span className="text-[10px] text-emerald-700 font-bold ml-1">
                            (Wholesale Rate Available)
                          </span>
                        )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">

                  {/* Quantity */}
                  <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.bookId,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                      disabled={item.quantity <= 1 || loading}
                      className="px-2.5 py-1 text-stone-700 hover:bg-stone-200 rounded-l-xl font-bold disabled:opacity-40"
                    >
                      -
                    </button>

                    <span className="px-3 py-1 font-bold text-xs text-stone-900 w-8 text-center">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(item.bookId, item.quantity + 1)
                      }
                      disabled={
                        item.quantity >= item.stockQuantity || loading
                      }
                      className="px-2.5 py-1 text-stone-700 hover:bg-stone-200 rounded-r-xl font-bold disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <span className="text-xs text-stone-400 block font-medium">
                      Subtotal
                    </span>

                    <span className="text-sm font-bold text-stone-900 font-sans">
                      Rs. {item.subtotal.toLocaleString()}
                    </span>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.bookId)}
                    disabled={loading}
                    className="p-2 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-xl transition disabled:opacity-40"
                    title="Remove Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-900 pt-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>

          {/* Summary */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs h-fit space-y-4">

            <h3 className="text-base font-serif font-bold text-stone-900 pb-3 border-b border-stone-100">
              Order Summary
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal ({itemCount} items)</span>

                <span className="font-bold text-stone-900 font-sans">
                  Rs. {totalAmount.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-stone-600">
                <span>Estimated Shipping</span>

                <span className="font-bold text-emerald-700">
                  Calculated at Checkout
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex justify-between items-baseline">
              <span className="text-sm font-bold text-stone-900">
                Total Payable
              </span>

              <span className="text-xl font-bold text-red-700 font-sans">
                Rs. {totalAmount.toLocaleString()}
              </span>
            </div>

            {/* IMPORTANT:
                No authentication check here.
                Guest customers can checkout directly.
            */}
            <button
              onClick={() => navigate('/checkout')}
              disabled={loading || isEmpty}
              className="w-full py-3 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-[11px] text-stone-500 pt-2 border-t border-stone-100">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />

              <span>
                Official Tax Invoicing & Delivery Guarantee across Nepal.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};