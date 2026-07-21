import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      <motion.div
        className="fixed inset-0 z-50 bg-coffee-900/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 24, stiffness: 200 }}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-coffee-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <ShoppingCart size={20} className="text-gold-600" />
              <h3 className="font-serif text-xl font-bold text-coffee-800">Your Cart</h3>
              <span className="rounded-full bg-gold-50 px-2.5 py-0.5 text-xs font-bold text-gold-700">
                {totalItems}
              </span>
            </div>
            <motion.button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-coffee-200 text-coffee-600 transition hover:bg-coffee-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X size={18} />
            </motion.button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <AnimatePresence>
              {hasOutOfStock && (
                <motion.div
                  className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertTriangle size={14} />
                  Some items in your cart are now out of stock. Please remove them to proceed.
                </motion.div>
              )}
              {hasLowStock && !hasOutOfStock && (
                <motion.div
                  className="mb-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertTriangle size={14} />
                  Some items are running low. Stock may not last long.
                </motion.div>
              )}
            </AnimatePresence>

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <ShoppingCart size={48} className="text-gold-300" />
                <p className="mt-4 text-sm text-slate-500">Your cart is empty</p>
                <motion.button
                  onClick={onClose}
                  className="mt-4 rounded-full border border-coffee-200 bg-white px-6 py-2 text-xs font-bold tracking-wider text-coffee-700 transition hover:border-gold-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  CONTINUE SHOPPING
                </motion.button>
              </div>
            ) : (
              <motion.div
                className="space-y-4"
                initial="hidden"
                animate="visible"
                transition={{ staggerChildren: 0.05 }}
              >
                {items.map((item) => (
                  <motion.div
                    key={item.book.id + item.priceMode}
                    className={`rounded-2xl border p-4 ${
                      item.book.stock === 0
                        ? 'border-red-200 bg-red-50'
                        : item.book.stock <= 5
                        ? 'border-amber-200 bg-amber-50'
                        : 'border-coffee-100 bg-white'
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-coffee-800">{item.book.title}</h4>
                        <p className="text-xs text-slate-500">
                          {item.priceMode === 'wholesale' ? 'Wholesale' : 'Retail'} Price
                        </p>
                        <p className="mt-1 text-sm font-bold text-coffee-700">
                          Rs. {item.priceMode === 'wholesale' ? item.book.wholesalePrice : item.book.retailPrice}
                        </p>
                        {item.book.stock <= 5 && item.book.stock > 0 && (
                          <p className="mt-1 text-[10px] font-bold text-amber-600">
                            Only {item.book.stock} left in stock
                          </p>
                        )}
                        {item.book.stock === 0 && (
                          <p className="mt-1 text-[10px] font-bold text-red-600">Out of stock</p>
                        )}
                      </div>
                      <motion.button
                        onClick={() => removeItem(item.book.id)}
                        className="text-slate-400 transition hover:text-red-500"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <motion.button
                          onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || item.book.stock === 0}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-coffee-200 text-coffee-600 transition hover:bg-coffee-50 disabled:opacity-40"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Minus size={14} />
                        </motion.button>
                        <span className="text-sm font-bold text-coffee-800">{item.quantity}</span>
                        <motion.button
                          onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                          disabled={item.quantity >= item.book.stock || item.book.stock === 0}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-coffee-200 text-coffee-600 transition hover:bg-coffee-50 disabled:opacity-40"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Plus size={14} />
                        </motion.button>
                      </div>
                      <p className="text-sm font-bold text-coffee-700">
                        Rs. {(item.priceMode === 'wholesale' ? item.book.wholesalePrice : item.book.retailPrice) * item.quantity}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-coffee-100 px-6 py-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-bold text-coffee-700">Total</span>
                <span className="text-xl font-bold text-coffee-800">Rs. {totalPrice}</span>
              </div>
              <div className="mb-4">
                <h4 className="mb-3 text-xs font-bold tracking-widest text-coffee-500">PAYMENT METHOD</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'esewa', label: 'eSewa', icon: Wallet, color: 'purple' },
                    { id: 'khalti', label: 'Khalti', icon: Smartphone, color: 'blue' },
                    { id: 'cod', label: 'Cash on Delivery', icon: MessageCircle, color: 'emerald' },
                  ].map((option) => (
                    <motion.button
                      key={option.id}
                      type="button"
                      onClick={() => setPaymentMethod(option.id as PaymentMethod)}
                      disabled={hasOutOfStock}
                      className={`flex flex-col items-center gap-2 rounded-xl border-2 px-3 py-3 text-xs font-bold transition ${
                        paymentMethod === option.id
                          ? 'border-gold-400 bg-gold-50 text-coffee-800'
                          : 'border-coffee-200 text-coffee-600 hover:border-gold-300'
                      } ${hasOutOfStock ? 'opacity-40 cursor-not-allowed' : ''}`}
                      whileHover={{ scale: hasOutOfStock ? 1 : 1.02 }}
                      whileTap={{ scale: hasOutOfStock ? 1 : 0.98 }}
                    >
                      <option.icon size={18} />
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {paymentMethod === 'esewa' || paymentMethod === 'khalti' ? (
                  <motion.button
                    onClick={handlePayment}
                    disabled={processing || hasOutOfStock}
                    className="flex items-center justify-center gap-2 rounded-full bg-coffee-700 px-6 py-3.5 text-sm font-bold tracking-wider text-ivory-50 transition hover:bg-coffee-800 disabled:opacity-60"
                    whileHover={{ scale: hasOutOfStock ? 1 : 1.01 }}
                    whileTap={{ scale: hasOutOfStock ? 1 : 0.98 }}
                  >
                    {processing ? 'Processing...' : `PAY WITH ${paymentMethod.toUpperCase()}`}
                  </motion.button>
                ) : (
                  <motion.a
                    href={hasOutOfStock ? '#' : whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => hasOutOfStock && e.preventDefault()}
                    className={`flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold tracking-wider transition ${
                      hasOutOfStock
                        ? 'bg-emerald-600/30 text-white/60 cursor-not-allowed'
                        : 'bg-emerald-600 text-white hover:bg-emerald-500'
                    }`}
                    whileHover={{ scale: hasOutOfStock ? 1 : 1.01 }}
                    whileTap={{ scale: hasOutOfStock ? 1 : 0.98 }}
                  >
                    <MessageCircle size={18} />
                    ORDER VIA WHATSAPP
                  </motion.a>
                )}
                <motion.button
                  onClick={onOpenEnquiry}
                  className="rounded-full border border-coffee-200 bg-white px-6 py-3.5 text-sm font-bold tracking-wider text-coffee-700 transition hover:border-gold-300"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  REQUEST BULK QUOTATION
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
