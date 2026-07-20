import { useState } from 'react';
import { X, Plus, Minus, ShoppingCart, Trash2, MessageCircle, Wallet, Smartphone, AlertTriangle } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEnquiry: () => void;
}

type PaymentMethod = 'esewa' | 'khalti' | 'cod' | '';

export default function CartPanel({ isOpen, onClose, onOpenEnquiry }: CartPanelProps) {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('');
  const [processing, setProcessing] = useState(false);

  const hasLowStock = items.some((item) => item.book.stock <= 5);
  const hasOutOfStock = items.some((item) => item.book.stock === 0);

  const whatsappMessage = encodeURIComponent(
    `Hi Hamro Pustak Bhandar, I would like to order:\n${items
      .map((item) => `${item.book.title} x${item.quantity} - Rs. ${(item.priceMode === 'wholesale' ? item.book.wholesalePrice : item.book.retailPrice) * item.quantity}`)
      .join('\n')}\n\nTotal: Rs. ${totalPrice}`
  );

  const whatsappLink = `https://wa.me/9779866115029?text=${whatsappMessage}`;

  const handlePayment = async () => {
    if (!paymentMethod) return;
    setProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    alert(`Payment initiated via ${paymentMethod.toUpperCase()}. This is a demo integration.`);
    setProcessing(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-[#1a1209] shadow-2xl">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gold-500/10 px-6 py-4">
            <div className="flex items-center gap-3">
              <ShoppingCart size={20} className="text-gold-400" />
              <h3 className="font-serif text-lg font-bold text-gold-200">Your Cart</h3>
              <span className="rounded-full bg-gold-500/10 px-2 py-0.5 text-xs font-bold text-gold-400">
                {totalItems}
              </span>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gold-500/20 text-gold-400 transition hover:bg-gold-500/10"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {hasOutOfStock && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">
                <AlertTriangle size={14} />
                Some items in your cart are now out of stock. Please remove them to proceed.
              </div>
            )}
            {hasLowStock && !hasOutOfStock && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-xs text-yellow-400">
                <AlertTriangle size={14} />
                Some items are running low. Stock may not last long.
              </div>
            )}

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <ShoppingCart size={48} className="text-gold-500/30" />
                <p className="mt-4 text-sm text-gold-400/60">Your cart is empty</p>
                <button
                  onClick={onClose}
                  className="mt-4 rounded-full border border-gold-500/30 bg-gold-500/10 px-6 py-2 text-xs font-bold tracking-wider text-gold-300 transition hover:bg-gold-500/20"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.book.id + item.priceMode}
                    className={`rounded-xl border p-4 ${
                      item.book.stock === 0
                        ? 'border-red-500/20 bg-red-500/5'
                        : item.book.stock <= 5
                        ? 'border-yellow-500/20 bg-yellow-500/5'
                        : 'border-gold-500/10 bg-[#2d1a0a]/60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-gold-200">{item.book.title}</h4>
                        <p className="text-xs text-gold-400/60">
                          {item.priceMode === 'wholesale' ? 'Wholesale' : 'Retail'} Price
                        </p>
                        <p className="mt-1 text-sm font-bold text-gold-400">
                          Rs. {item.priceMode === 'wholesale' ? item.book.wholesalePrice : item.book.retailPrice}
                        </p>
                        {item.book.stock <= 5 && item.book.stock > 0 && (
                          <p className="mt-1 text-[10px] font-bold text-yellow-400">
                            Only {item.book.stock} left in stock
                          </p>
                        )}
                        {item.book.stock === 0 && (
                          <p className="mt-1 text-[10px] font-bold text-red-400">Out of stock</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.book.id)}
                        className="text-gold-400/40 transition hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || item.book.stock === 0}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gold-500/20 text-gold-400 transition hover:bg-gold-500/10 disabled:opacity-40"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-bold text-gold-200">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                          disabled={item.quantity >= item.book.stock || item.book.stock === 0}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gold-500/20 text-gold-400 transition hover:bg-gold-500/10 disabled:opacity-40"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="text-sm font-bold text-gold-300">
                        Rs. {(item.priceMode === 'wholesale' ? item.book.wholesalePrice : item.book.retailPrice) * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-gold-500/10 px-6 py-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-bold text-gold-300">Total</span>
                <span className="text-xl font-bold text-gold-200">Rs. {totalPrice}</span>
              </div>
              <div className="mb-4">
                <h4 className="mb-2 text-xs font-bold tracking-widest text-gold-400">PAYMENT METHOD</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'esewa', label: 'eSewa', icon: Wallet, color: 'purple' },
                    { id: 'khalti', label: 'Khalti', icon: Smartphone, color: 'blue' },
                    { id: 'cod', label: 'Cash on Delivery', icon: MessageCircle, color: 'emerald' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setPaymentMethod(option.id as PaymentMethod)}
                      disabled={hasOutOfStock}
                      className={`flex flex-col items-center gap-2 rounded-lg border-2 px-3 py-3 text-xs font-bold transition ${
                        paymentMethod === option.id
                          ? 'border-gold-400 bg-gold-500/10 text-gold-200'
                          : 'border-gold-500/20 text-gold-300/70 hover:border-gold-500/40'
                      } ${hasOutOfStock ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      <option.icon size={18} />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {paymentMethod === 'esewa' || paymentMethod === 'khalti' ? (
                  <button
                    onClick={handlePayment}
                    disabled={processing || hasOutOfStock}
                    className="flex items-center justify-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-bold tracking-wider text-brown-900 transition hover:bg-gold-400 disabled:opacity-60"
                  >
                    {processing ? 'Processing...' : `PAY WITH ${paymentMethod.toUpperCase()}`}
                  </button>
                ) : (
                  <a
                    href={hasOutOfStock ? '#' : whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => hasOutOfStock && e.preventDefault()}
                    className={`flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold tracking-wider transition ${
                      hasOutOfStock
                        ? 'bg-emerald-600/30 text-white/60 cursor-not-allowed'
                        : 'bg-emerald-600 text-white hover:bg-emerald-500'
                    }`}
                  >
                    <MessageCircle size={18} />
                    ORDER VIA WHATSAPP
                  </a>
                )}
                <button
                  onClick={onOpenEnquiry}
                  className="rounded-full border border-gold-500/30 bg-gold-500/10 px-6 py-3 text-sm font-bold tracking-wider text-gold-300 transition hover:bg-gold-500/20"
                >
                  REQUEST BULK QUOTATION
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}