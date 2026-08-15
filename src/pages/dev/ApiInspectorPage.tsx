import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  ShieldCheck,
  UserCheck,
  Server,
  Key,
  RefreshCw,
  Send,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  Search,
  Tag,
  Upload,
  Lock,
  Unlock,
  FolderPlus,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  ShoppingCart,
  PackageCheck,
  CreditCard,
  Truck,
  DollarSign,
  AlertTriangle
} from 'lucide-react';

interface UserData {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  wholesaleStatus: string;
}

interface CategoryData {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

interface BookData {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  description: string;
  category: any;
  publisher?: string;
  edition?: string;
  language: string;
  coverImage?: string;
  regularPrice: number;
  wholesalePrice?: number;
  price: number;
  effectivePrice: number;
  isWholesaleDiscounted: boolean;
  stockQuantity: number;
  sku: string;
  status: string;
}

interface CartItemData {
  bookId: string;
  title: string;
  author: string;
  coverImage?: string;
  stockQuantity: number;
  status: string;
  quantity: number;
  regularPrice: number;
  wholesalePrice?: number;
  unitPrice: number;
  subtotal: number;
}

interface CartData {
  cartId: string;
  userId: string;
  items: CartItemData[];
  totalAmount: number;
  updatedAt: string;
}

interface OrderData {
  _id: string;
  userId: any;
  orderType: 'regular' | 'wholesale';
  items: {
    bookId: string;
    title: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    province: string;
    district: string;
    municipality: string;
    ward: string;
    tole?: string;
    streetAddress?: string;
    deliveryNotes?: string;
    name?: string;
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
  paymentMethod: 'Cash on Delivery' | 'Bank Transfer' | 'Online Payment' | 'COD' | 'Online' | string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const ApiInspectorPage: React.FC = () => {
  // Authentication State
  const [token, setToken] = useState<string | null>(localStorage.getItem('hpb_token'));
  const [user, setUser] = useState<UserData | null>(null);
  const [loadingMe, setLoadingMe] = useState<boolean>(false);

  // Form States for Auth
  const [email, setEmail] = useState('admin@hamropustak.com');
  const [password, setPassword] = useState('Admin@123456');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<'customer' | 'wholesale'>('customer');

  // Categories State
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [catName, setCatName] = useState('');
  const [catDescription, setCatDescription] = useState('');

  // Books State
  const [books, setBooks] = useState<BookData[]>([]);
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookIsbn, setBookIsbn] = useState('');
  const [bookDesc, setBookDesc] = useState('');
  const [bookCategory, setBookCategory] = useState('');
  const [bookRegularPrice, setBookRegularPrice] = useState('500');
  const [bookWholesalePrice, setBookWholesalePrice] = useState('350');
  const [bookStock, setBookStock] = useState('50');
  const [bookCoverFile, setBookCoverFile] = useState<File | null>(null);

  // Cart State
  const [cart, setCart] = useState<CartData | null>(null);

  // Checkout Form State (Nepal Structure)
  const [shipFullName, setShipFullName] = useState('Ramesh Sharma');
  const [shipPhone, setShipPhone] = useState('+977-9841234567');
  const [shipProvince, setShipProvince] = useState('Bagmati');
  const [shipDistrict, setShipDistrict] = useState('Kathmandu');
  const [shipMunicipality, setShipMunicipality] = useState('Kathmandu Metropolitan City');
  const [shipWard, setShipWard] = useState('10');
  const [shipTole, setShipTole] = useState('New Baneshwor');
  const [shipStreetAddress, setShipStreetAddress] = useState('Main Lane, House #42');
  const [shipDeliveryNotes, setShipDeliveryNotes] = useState('Call recipient before delivery');
  const [payMethod, setPayMethod] = useState<'Cash on Delivery' | 'Bank Transfer' | 'Online Payment'>('Cash on Delivery');
  const [orderNotes, setOrderNotes] = useState('Urgent delivery preferred');

  // Customer Orders State
  const [myOrders, setMyOrders] = useState<OrderData[]>([]);

  // Admin Orders State
  const [adminOrders, setAdminOrders] = useState<OrderData[]>([]);
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('all');

  // Wholesale Application Form State
  const [wsCompanyName, setWsCompanyName] = useState('Valley Book Distributors');
  const [wsPanVat, setWsPanVat] = useState('600123456');
  const [wsBusinessType, setWsBusinessType] = useState('Bookstore Chain');
  const [wsContactPerson, setWsContactPerson] = useState('Hari Bahadur');
  const [wsBusinessPhone, setWsBusinessPhone] = useState('+977-1-4223344');
  const [wsStreet, setWsStreet] = useState('New Road');
  const [wsCity, setWsCity] = useState('Kathmandu');
  const [wsState, setWsState] = useState('Bagmati');
  const [wsDocumentFile, setWsDocumentFile] = useState<File | null>(null);

  // My Wholesale Status State
  const [myWsStatus, setMyWsStatus] = useState<any>(null);

  // Admin Wholesale Applications State
  const [adminWsApps, setAdminWsApps] = useState<any[]>([]);

  // UI Tabs & Feedback
  const [activeTab, setActiveTab] = useState<'auth' | 'categories' | 'books' | 'wholesale' | 'cart' | 'orders' | 'admin'>('auth');
  const [apiLog, setApiLog] = useState<string>('API Inspector initialized.');
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Helper log function
  const logApi = (title: string, data: any) => {
    setApiLog(`[${new Date().toLocaleTimeString()}] ${title}:\n${JSON.stringify(data, null, 2)}`);
  };

  // Fetch Current User Profile
  const fetchMe = async () => {
    if (!token) return;
    setLoadingMe(true);
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.data.user);
        setStatusMsg({ text: `Logged in as ${data.data.user.name} (${data.data.user.role})`, type: 'success' });
      } else {
        localStorage.removeItem('hpb_token');
        setToken(null);
        setUser(null);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingMe(false);
    }
  };

  useEffect(() => {
    fetchMe();
    fetchCategories();
    fetchBooks();
  }, [token]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      logApi('POST /api/auth/login', data);

      if (res.ok) {
        localStorage.setItem('hpb_token', data.data.token);
        setToken(data.data.token);
        setUser(data.data.user);
        setStatusMsg({ text: 'Login successful!', type: 'success' });
      } else {
        setStatusMsg({ text: data.message || 'Login failed', type: 'error' });
      }
    } catch (err: any) {
      setStatusMsg({ text: err.message, type: 'error' });
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (res.ok) {
        setCategories(data.data.categories);
        if (data.data.categories.length > 0 && !bookCategory) {
          setBookCategory(data.data.categories[0]._id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Books
  const fetchBooks = async () => {
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/books', { headers });
      const data = await res.json();
      if (res.ok) {
        setBooks(data.data.books);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Cart
  const fetchCart = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      logApi('GET /api/cart', data);
      if (res.ok) {
        setCart(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add to Cart
  const handleAddToCart = async (bookId: string) => {
    if (!token) {
      setStatusMsg({ text: 'Please sign in to add items to cart.', type: 'error' });
      return;
    }
    try {
      const res = await fetch('/api/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ bookId, quantity: 1 })
      });
      const data = await res.json();
      logApi('POST /api/cart/items', data);
      if (res.ok) {
        setCart(data.data);
        setStatusMsg({ text: 'Item added to cart!', type: 'success' });
      } else {
        setStatusMsg({ text: data.message || 'Failed to add item', type: 'error' });
      }
    } catch (err: any) {
      setStatusMsg({ text: err.message, type: 'error' });
    }
  };

  // Update Cart Quantity
  const handleUpdateCartQty = async (bookId: string, quantity: number) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/cart/items/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
      });
      const data = await res.json();
      logApi(`PUT /api/cart/items/${bookId}`, data);
      if (res.ok) {
        setCart(data.data);
      } else {
        setStatusMsg({ text: data.message, type: 'error' });
      }
    } catch (err: any) {
      setStatusMsg({ text: err.message, type: 'error' });
    }
  };

  // Remove Item from Cart
  const handleRemoveCartItem = async (bookId: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/cart/items/${bookId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      logApi(`DELETE /api/cart/items/${bookId}`, data);
      if (res.ok) {
        setCart(data.data);
        setStatusMsg({ text: 'Item removed from cart', type: 'info' });
      }
    } catch (err: any) {
      setStatusMsg({ text: err.message, type: 'error' });
    }
  };

  // Checkout (Create Order)
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          shippingAddress: {
            fullName: shipFullName,
            phone: shipPhone,
            province: shipProvince,
            district: shipDistrict,
            municipality: shipMunicipality,
            ward: shipWard,
            tole: shipTole,
            streetAddress: shipStreetAddress,
            deliveryNotes: shipDeliveryNotes,
          },
          paymentMethod: payMethod,
          notes: orderNotes,
        })
      });
      const data = await res.json();
      logApi('POST /api/orders', data);
      if (res.ok) {
        setStatusMsg({ text: `Order created successfully! ID: ${data.data.order._id}`, type: 'success' });
        fetchCart();
        fetchMyOrders();
        fetchBooks();
      } else {
        setStatusMsg({ text: data.message || 'Checkout failed', type: 'error' });
      }
    } catch (err: any) {
      setStatusMsg({ text: err.message, type: 'error' });
    }
  };

  // Fetch My Orders
  const fetchMyOrders = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      logApi('GET /api/orders/my-orders', data);
      if (res.ok) {
        setMyOrders(data.data.orders);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Admin Orders
  const fetchAdminOrders = async () => {
    if (!token || user?.role !== 'admin') return;
    try {
      const query = orderFilterStatus !== 'all' ? `?orderStatus=${orderFilterStatus}` : '';
      const res = await fetch(`/api/admin/orders${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      logApi('GET /api/admin/orders', data);
      if (res.ok) {
        setAdminOrders(data.data.orders);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update Order Status (Admin)
  const handleUpdateOrderStatus = async (orderId: string, orderStatus: string, paymentStatus: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ orderStatus, paymentStatus })
      });
      const data = await res.json();
      logApi(`PUT /api/admin/orders/${orderId}/status`, data);
      if (res.ok) {
        setStatusMsg({ text: 'Order status updated successfully!', type: 'success' });
        fetchAdminOrders();
      } else {
        setStatusMsg({ text: data.message, type: 'error' });
      }
    } catch (err: any) {
      setStatusMsg({ text: err.message, type: 'error' });
    }
  };

  useEffect(() => {
    if (activeTab === 'cart') fetchCart();
    if (activeTab === 'orders') fetchMyOrders();
    if (activeTab === 'admin') fetchAdminOrders();
  }, [activeTab]);

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <h2 className="text-xl font-serif font-bold text-stone-900 flex items-center gap-2">
            <Server className="w-5 h-5 text-red-700" />
            Backend API Inspector & Debug Console
          </h2>
          <p className="text-xs text-stone-500">
            Direct interface to verify REST API endpoints, JWT token permissions, Wholesale, Cart & Order engines.
          </p>
        </div>

        {user && (
          <div className="text-right text-xs">
            <p className="font-bold text-stone-900">{user.name}</p>
            <p className="text-[10px] text-stone-500 uppercase font-mono">{user.role} ({user.wholesaleStatus})</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('auth')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activeTab === 'auth' ? 'bg-red-700 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}
        >
          Auth & Users
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activeTab === 'categories' ? 'bg-red-700 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}
        >
          Categories ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab('books')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activeTab === 'books' ? 'bg-red-700 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}
        >
          Books ({books.length})
        </button>
        <button
          onClick={() => setActiveTab('cart')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activeTab === 'cart' ? 'bg-red-700 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}
        >
          Cart ({cart?.items?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activeTab === 'orders' ? 'bg-red-700 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}
        >
          My Orders ({myOrders.length})
        </button>
        {user?.role === 'admin' && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activeTab === 'admin' ? 'bg-purple-700 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'}`}
          >
            Admin Orders ({adminOrders.length})
          </button>
        )}
      </div>

      {statusMsg && (
        <div className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between ${statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : statusMsg.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-blue-50 text-blue-800 border border-blue-200'}`}>
          <span>{statusMsg.text}</span>
          <button onClick={() => setStatusMsg(null)} className="text-xs opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Auth Tab */}
      {activeTab === 'auth' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Key className="w-4 h-4 text-red-700" /> Sign In
            </h3>
            <form onSubmit={handleLogin} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-medium"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-medium"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-red-700 text-white font-bold rounded-xl hover:bg-red-800 transition"
              >
                Authenticate Token
              </button>
            </form>
          </div>

          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-700" /> Active Session Details
            </h3>
            {user ? (
              <div className="space-y-2 text-xs font-mono bg-white p-3 rounded-xl border border-stone-200">
                <p><span className="font-bold text-stone-500">ID:</span> {user._id}</p>
                <p><span className="font-bold text-stone-500">Name:</span> {user.name}</p>
                <p><span className="font-bold text-stone-500">Email:</span> {user.email}</p>
                <p><span className="font-bold text-stone-500">Role:</span> {user.role}</p>
                <p><span className="font-bold text-stone-500">Wholesale Status:</span> {user.wholesaleStatus}</p>
              </div>
            ) : (
              <p className="text-xs text-stone-500 italic">No active JWT session. Sign in or register to test authenticated routes.</p>
            )}
          </div>
        </div>
      )}

      {/* Cart & Checkout Tab */}
      {activeTab === 'cart' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-red-700" /> Active User Cart
              </h3>
              <button onClick={fetchCart} className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            </div>

            {cart?.items && cart.items.length > 0 ? (
              <div className="space-y-2">
                {cart.items.map((item) => (
                  <div key={item.bookId} className="bg-stone-50 p-3 rounded-2xl border border-stone-200 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-stone-900">{item.title}</h4>
                      <p className="text-stone-500">Unit Rate: Rs. {item.unitPrice} | Subtotal: Rs. {item.subtotal}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateCartQty(item.bookId, Math.max(1, item.quantity - 1))}
                        className="w-6 h-6 rounded-lg bg-stone-200 text-stone-800 font-bold flex items-center justify-center hover:bg-stone-300"
                      >
                        -
                      </button>
                      <span className="font-bold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateCartQty(item.bookId, item.quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-stone-200 text-stone-800 font-bold flex items-center justify-center hover:bg-stone-300"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleRemoveCartItem(item.bookId)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-lg ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="p-3 bg-red-50 rounded-2xl border border-red-200 text-right text-xs font-bold text-stone-900">
                  Total Order Amount: Rs. {cart.totalAmount.toLocaleString()}
                </div>
              </div>
            ) : (
              <p className="text-xs text-stone-500 italic bg-stone-50 p-4 rounded-2xl border border-stone-200">Your cart is empty. Add books from the Books tab to test checkout.</p>
            )}
          </div>

          {/* Checkout Form */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-700" /> Nepal Address Checkout Engine
            </h3>

            <form onSubmit={handleCheckout} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={shipFullName}
                  onChange={(e) => setShipFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Phone Number *</label>
                <input
                  type="text"
                  value={shipPhone}
                  onChange={(e) => setShipPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Province *</label>
                  <select
                    value={shipProvince}
                    onChange={(e) => setShipProvince(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-medium text-xs"
                    required
                  >
                    <option value="Koshi">Koshi</option>
                    <option value="Madhesh">Madhesh</option>
                    <option value="Bagmati">Bagmati</option>
                    <option value="Gandaki">Gandaki</option>
                    <option value="Lumbini">Lumbini</option>
                    <option value="Karnali">Karnali</option>
                    <option value="Sudurpashchim">Sudurpashchim</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">District *</label>
                  <input
                    type="text"
                    value={shipDistrict}
                    onChange={(e) => setShipDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Municipality *</label>
                  <input
                    type="text"
                    value={shipMunicipality}
                    onChange={(e) => setShipMunicipality(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Ward No. *</label>
                  <input
                    type="text"
                    value={shipWard}
                    onChange={(e) => setShipWard(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Tole / Locality</label>
                  <input
                    type="text"
                    value={shipTole}
                    onChange={(e) => setShipTole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    value={shipStreetAddress}
                    onChange={(e) => setShipStreetAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Payment Method</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold bg-white"
                >
                  <option value="Cash on Delivery">Cash on Delivery</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Online Payment">Online Payment</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={!cart?.items || cart.items.length === 0}
                className="w-full py-2.5 bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl hover:bg-emerald-800 transition shadow-xs"
              >
                Submit Order to Backend
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-red-700" /> Customer Order History
            </h3>
            <button onClick={fetchMyOrders} className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
          </div>

          {myOrders.length > 0 ? (
            <div className="space-y-3">
              {myOrders.map((ord) => (
                <div key={ord._id} className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-2 text-xs">
                    <div>
                      <span className="font-bold text-stone-900">Order #{ord._id.slice(-6)}</span>
                      <span className="text-stone-400 text-[10px] ml-2">{new Date(ord.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-lg text-[10px] font-bold uppercase">{ord.orderStatus}</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-lg text-[10px] font-bold uppercase">{ord.paymentStatus}</span>
                    </div>
                  </div>

                  <div className="text-xs text-stone-600 bg-white p-3 rounded-xl border border-stone-100 space-y-1">
                    <p><span className="font-semibold text-stone-800">Recipient:</span> {ord.shippingAddress.fullName || ord.shippingAddress.name} ({ord.shippingAddress.phone})</p>
                    <p><span className="font-semibold text-stone-800">Shipping:</span> {ord.shippingAddress.tole ? `${ord.shippingAddress.tole}, ` : ''}{ord.shippingAddress.streetAddress || ord.shippingAddress.street || ''} Ward {ord.shippingAddress.ward || 'N/A'}, {ord.shippingAddress.municipality || ord.shippingAddress.city || ''}, {ord.shippingAddress.district || ''}, {ord.shippingAddress.province || ord.shippingAddress.state || ''} Province</p>
                  </div>

                  <div className="space-y-1 text-xs">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-stone-700">
                        <span>{it.title} x {it.quantity}</span>
                        <span className="font-mono font-semibold">Rs. {it.subtotal}</span>
                      </div>
                    ))}
                    <div className="border-t border-stone-200 pt-1 flex justify-between font-bold text-stone-900">
                      <span>Total Paid/Due:</span>
                      <span className="font-mono text-red-700">Rs. {ord.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-500 italic bg-stone-50 p-4 rounded-2xl border border-stone-200">No orders placed yet.</p>
          )}
        </div>
      )}

      {/* Admin Tab */}
      {activeTab === 'admin' && user?.role === 'admin' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-700" /> Admin Order Console
            </h3>
            <button onClick={fetchAdminOrders} className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
          </div>

          {adminOrders.length > 0 ? (
            <div className="space-y-3">
              {adminOrders.map((ord) => (
                <div key={ord._id} className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-2 text-xs">
                    <div>
                      <span className="font-bold text-stone-900">Order #{ord._id}</span>
                      <span className="text-stone-400 text-[10px] ml-2">Type: {ord.orderType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value, ord.paymentStatus)}
                        className="px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs font-bold"
                      >
                        <option value="pending">pending</option>
                        <option value="processing">processing</option>
                        <option value="shipped">shipped</option>
                        <option value="delivered">delivered</option>
                        <option value="cancelled">cancelled</option>
                      </select>

                      <select
                        value={ord.paymentStatus}
                        onChange={(e) => handleUpdateOrderStatus(ord._id, ord.orderStatus, e.target.value)}
                        className="px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs font-bold text-emerald-700"
                      >
                        <option value="pending">pending</option>
                        <option value="paid">paid</option>
                        <option value="failed">failed</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-xs text-stone-600 bg-white p-3 rounded-xl border border-stone-100 space-y-1">
                    <p><span className="font-semibold text-stone-800">Customer:</span> {ord.shippingAddress.fullName || ord.shippingAddress.name} ({ord.shippingAddress.phone})</p>
                    <p><span className="font-semibold text-stone-800">Shipping:</span> {ord.shippingAddress.tole ? `${ord.shippingAddress.tole}, ` : ''}{ord.shippingAddress.streetAddress || ord.shippingAddress.street || ''} Ward {ord.shippingAddress.ward || 'N/A'}, {ord.shippingAddress.municipality || ord.shippingAddress.city || ''}, {ord.shippingAddress.district || ''}, {ord.shippingAddress.province || ord.shippingAddress.state || ''} Province</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-500 italic bg-stone-50 p-4 rounded-2xl border border-stone-200">No admin orders found.</p>
          )}
        </div>
      )}

      {/* Raw Output Log */}
      <div className="mt-6 pt-4 border-t border-stone-200">
        <h4 className="text-xs font-bold text-stone-700 mb-2 font-mono">Raw Endpoint API Output Log</h4>
        <pre className="bg-stone-900 text-emerald-400 p-4 rounded-2xl text-[11px] font-mono overflow-x-auto max-h-48 leading-relaxed">
          {apiLog}
        </pre>
      </div>
    </div>
  );
};
