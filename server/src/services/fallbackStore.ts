import bcrypt from 'bcryptjs';
import { UserRole, WholesaleStatus } from '../models/User.js';

export interface FallbackUser {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  role: UserRole;
  wholesaleStatus: WholesaleStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface FallbackCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FallbackBook {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  description: string;
  category: string;
  categoryObj?: FallbackCategory;
  publisher?: string;
  edition?: string;
  language: string;
  coverImage?: string;
  regularPrice: number;
  wholesalePrice: number;
  stockQuantity: number;
  sku: string;
  status: 'active' | 'out_of_stock' | 'discontinued';
  createdAt: Date;
  updatedAt: Date;
}

export interface FallbackWholesaleProfile {
  _id: string;
  userId: string;
  userObj?: FallbackUser;
  companyName: string;
  panVatNumber: string;
  businessType: string;
  contactPerson: string;
  businessPhone: string;
  businessAddress: {
    street: string;
    city: string;
    state: string;
    postalCode?: string;
    country?: string;
  };
  documentUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  appliedAt: Date;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface FallbackCartItem {
  bookId: string;
  bookObj?: FallbackBook;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface FallbackCart {
  _id: string;
  userId: string;
  items: FallbackCartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FallbackOrderItem {
  bookId: string;
  title: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface FallbackOrder {
  _id: string;
  userId: string;
  userObj?: FallbackUser;
  orderType: 'regular' | 'wholesale';
  items: FallbackOrderItem[];
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
  };
  paymentMethod: 'Cash on Delivery' | 'Bank Transfer' | 'Online Payment' | 'COD' | 'Online';
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FallbackEnquiry {
  _id: string;
  organizationName: string;
  organizationType: 'College' | 'School' | 'Institution' | 'Office' | 'Stationery' | 'Other';
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  requirements: string;
  estimatedQuantity?: number;
  status: 'pending' | 'quoted' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

export interface FallbackQuotationItem {
  title: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface FallbackQuotation {
  _id: string;
  enquiryId?: string;
  quotationNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  organizationName: string;
  items: FallbackQuotationItem[];
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  notes?: string;
  validUntil: Date;
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'expired';
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

class FallbackStore {
  private users: FallbackUser[] = [];
  private categories: FallbackCategory[] = [];
  private books: FallbackBook[] = [];
  private wholesaleProfiles: FallbackWholesaleProfile[] = [];
  private carts: FallbackCart[] = [];
  private orders: FallbackOrder[] = [];
  private enquiries: FallbackEnquiry[] = [];
  private quotations: FallbackQuotation[] = [];

  constructor() {
    this.seedDefaultUsers();
    this.seedDefaultCategoriesAndBooks();
  }

  private async seedDefaultUsers() {
    const defaultPassword = await bcrypt.hash('Password123!', 10);

    this.users = [
      {
        _id: '65f1a2b3c4d5e6f7a8b9c0d1',
        name: 'Demo Customer',
        email: 'customer@hamropustak.com',
        passwordHash: defaultPassword,
        phone: '+977-9801234567',
        address: {
          street: 'New Road',
          city: 'Kathmandu',
          state: 'Bagmati',
          postalCode: '44600',
          country: 'Nepal',
        },
        role: 'customer',
        wholesaleStatus: 'none',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: '65f1a2b3c4d5e6f7a8b9c0d2',
        name: 'Demo Wholesale Partner',
        email: 'wholesale@hamropustak.com',
        passwordHash: defaultPassword,
        phone: '+977-9812345678',
        address: {
          street: 'Main Bazaar',
          city: 'Pokhara',
          state: 'Gandaki',
          postalCode: '33700',
          country: 'Nepal',
        },
        role: 'wholesale',
        wholesaleStatus: 'approved',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: '65f1a2b3c4d5e6f7a8b9c0d3',
        name: 'Store Administrator',
        email: 'admin@hamropustak.com',
        passwordHash: defaultPassword,
        phone: '+977-9823456789',
        address: {
          street: 'Thamel',
          city: 'Kathmandu',
          state: 'Bagmati',
          postalCode: '44600',
          country: 'Nepal',
        },
        role: 'admin',
        wholesaleStatus: 'none',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  private seedDefaultCategoriesAndBooks() {
    const cat1: FallbackCategory = {
      _id: 'cat_nepali_lit',
      name: 'Nepali Literature',
      slug: 'nepali-literature',
      description: 'Classic and modern literature from Nepalese authors.',
      icon: 'BookOpen',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const cat2: FallbackCategory = {
      _id: 'cat_loksewa',
      name: 'Loksewa & Competitive',
      slug: 'loksewa-competitive',
      description: 'Public service examination, Loksewa preparation, and general knowledge guides.',
      icon: 'Award',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const cat3: FallbackCategory = {
      _id: 'cat_academic',
      name: 'Academic Textbooks',
      slug: 'academic-textbooks',
      description: 'School, +2, and University level textbooks across subjects.',
      icon: 'GraduationCap',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.categories = [cat1, cat2, cat3];

    this.books = [
      {
        _id: 'bk_001',
        title: 'Muna Madan (मुना मदन)',
        author: 'Laxmi Prasad Devkota',
        isbn: '978-9937000011',
        description: 'An iconic Nepali epic poem written in 1936 describing human emotions, sacrifice, and resilience.',
        category: cat1._id,
        categoryObj: cat1,
        publisher: 'Sajha Prakashan',
        edition: '2024 Edition',
        language: 'Nepali',
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
        regularPrice: 250,
        wholesalePrice: 175,
        stockQuantity: 150,
        sku: 'HPB-LIT-001',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'bk_002',
        title: 'Palpasa Cafe (पालपासा क्याफे)',
        author: 'Narayan Wagle',
        isbn: '978-9937000022',
        description: 'Madan Puraskar winning novel narrating love, art, and hardship set during the Nepalese conflict era.',
        category: cat1._id,
        categoryObj: cat1,
        publisher: 'nepalaya',
        edition: '15th Edition',
        language: 'Nepali',
        coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600',
        regularPrice: 450,
        wholesalePrice: 310,
        stockQuantity: 80,
        sku: 'HPB-LIT-002',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'bk_003',
        title: 'Loksewa General Knowledge & Current Affairs 2083',
        author: 'Ram Prasad Sharma',
        isbn: '978-9937000033',
        description: 'Comprehensive study material for Section Officer, Naasu, and Kharidar public examinations in Nepal.',
        category: cat2._id,
        categoryObj: cat2,
        publisher: 'Heritage Publication',
        edition: '2083 Updated',
        language: 'Nepali',
        coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600',
        regularPrice: 650,
        wholesalePrice: 450,
        stockQuantity: 200,
        sku: 'HPB-LOK-001',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  // Category methods
  public getCategories(): FallbackCategory[] {
    return this.categories;
  }

  public getCategoryById(id: string): FallbackCategory | undefined {
    return this.categories.find((c) => c._id === id || c.slug === id);
  }

  public createCategory(data: { name: string; slug?: string; description?: string; icon?: string }): FallbackCategory {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCat: FallbackCategory = {
      _id: 'cat_' + Date.now().toString(36),
      name: data.name,
      slug,
      description: data.description || '',
      icon: data.icon || 'BookOpen',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.categories.push(newCat);
    return newCat;
  }

  public updateCategory(id: string, data: Partial<FallbackCategory>): FallbackCategory | undefined {
    const cat = this.categories.find((c) => c._id === id);
    if (!cat) return undefined;
    if (data.name) cat.name = data.name;
    if (data.slug) cat.slug = data.slug;
    if (data.description !== undefined) cat.description = data.description;
    if (data.icon) cat.icon = data.icon;
    cat.updatedAt = new Date();
    return cat;
  }

  public deleteCategory(id: string): boolean {
    const idx = this.categories.findIndex((c) => c._id === id);
    if (idx === -1) return false;
    this.categories.splice(idx, 1);
    return true;
  }

  // Book methods
  public getBooks(params: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    page?: number;
    limit?: number;
  }) {
    let filtered = [...this.books];

    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.isbn.toLowerCase().includes(q) ||
          (b.publisher && b.publisher.toLowerCase().includes(q))
      );
    }

    if (params.category) {
      filtered = filtered.filter(
        (b) =>
          b.category === params.category ||
          (b.categoryObj && (b.categoryObj._id === params.category || b.categoryObj.slug === params.category))
      );
    }

    if (params.minPrice !== undefined && !isNaN(params.minPrice)) {
      filtered = filtered.filter((b) => b.regularPrice >= params.minPrice!);
    }

    if (params.maxPrice !== undefined && !isNaN(params.maxPrice)) {
      filtered = filtered.filter((b) => b.regularPrice <= params.maxPrice!);
    }

    // Sort
    if (params.sortBy === 'price_asc') {
      filtered.sort((a, b) => a.regularPrice - b.regularPrice);
    } else if (params.sortBy === 'price_desc') {
      filtered.sort((a, b) => b.regularPrice - a.regularPrice);
    } else if (params.sortBy === 'title_asc') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (params.sortBy === 'title_desc') {
      filtered.sort((a, b) => b.title.localeCompare(a.title));
    } else {
      // newest default
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 10);
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedBooks = filtered.slice(startIndex, startIndex + limit);

    return {
      books: paginatedBooks,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  public getBookById(id: string): FallbackBook | undefined {
    return this.books.find((b) => b._id === id);
  }

  public findBookById(id: string): FallbackBook | undefined {
    return this.getBookById(id);
  }

  public saveBook(book: FallbackBook): FallbackBook {
    const idx = this.books.findIndex((b) => b._id === book._id);
    if (idx !== -1) {
      this.books[idx] = book;
    } else {
      this.books.push(book);
    }
    return book;
  }

  public createBook(data: Omit<FallbackBook, '_id' | 'createdAt' | 'updatedAt'>): FallbackBook {
    const categoryObj = this.categories.find((c) => c._id === data.category);
    const newBook: FallbackBook = {
      ...data,
      _id: 'bk_' + Date.now().toString(36),
      categoryObj,
      status: data.stockQuantity <= 0 ? 'out_of_stock' : data.status || 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.books.push(newBook);
    return newBook;
  }

  public updateBook(id: string, data: Partial<FallbackBook>): FallbackBook | undefined {
    const book = this.books.find((b) => b._id === id);
    if (!book) return undefined;

    Object.assign(book, data);
    if (data.category) {
      book.categoryObj = this.categories.find((c) => c._id === data.category);
    }
    if (book.status !== 'discontinued') {
      if (book.stockQuantity <= 0) book.status = 'out_of_stock';
      else if (book.stockQuantity > 0 && book.status === 'out_of_stock') book.status = 'active';
    }
    book.updatedAt = new Date();
    return book;
  }

  public deleteBook(id: string): boolean {
    const idx = this.books.findIndex((b) => b._id === id);
    if (idx === -1) return false;
    this.books.splice(idx, 1);
    return true;
  }

  public findUserByEmail(email: string): FallbackUser | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): FallbackUser | undefined {
    return this.users.find((u) => u._id === id);
  }

  public async createUser(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: any;
  }): Promise<FallbackUser> {
    const passwordHash = await bcrypt.hash(userData.password, 10);
    const newUser: FallbackUser = {
      _id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      name: userData.name,
      email: userData.email.toLowerCase().trim(),
      passwordHash,
      phone: userData.phone || '',
      address: {
        street: userData.address?.street || '',
        city: userData.address?.city || '',
        state: userData.address?.state || '',
        postalCode: userData.address?.postalCode || '',
        country: userData.address?.country || 'Nepal',
      },
      role: 'customer',
      wholesaleStatus: 'none',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);
    return newUser;
  }

  public updateUserProfile(
    id: string,
    updates: { name?: string; phone?: string; address?: any }
  ): FallbackUser | undefined {
    const user = this.findUserById(id);
    if (!user) return undefined;

    if (updates.name) user.name = updates.name;
    if (updates.phone !== undefined) user.phone = updates.phone;
    if (updates.address) {
      user.address = {
        ...user.address,
        ...updates.address,
      };
    }
    user.updatedAt = new Date();
    return user;
  }

  public toSafeObject(user: FallbackUser) {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  public getAllUsersPaginated(params: {
    search?: string;
    role?: string;
    wholesaleStatus?: string;
    page?: number;
    limit?: number;
  }) {
    let filtered = [...this.users];

    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.phone && u.phone.toLowerCase().includes(q))
      );
    }

    if (params.role && params.role !== 'all') {
      filtered = filtered.filter((u) => u.role === params.role);
    }

    if (params.wholesaleStatus && params.wholesaleStatus !== 'all') {
      filtered = filtered.filter((u) => u.wholesaleStatus === params.wholesaleStatus);
    }

    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 20);
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedUsers = filtered
      .slice(startIndex, startIndex + limit)
      .map((u) => this.toSafeObject(u));

    return {
      users: paginatedUsers,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  // Wholesale Profile methods
  public getWholesaleProfileByUserId(userId: string): FallbackWholesaleProfile | undefined {
    return this.wholesaleProfiles.find((wp) => wp.userId === userId);
  }

  public getWholesaleProfileById(id: string): FallbackWholesaleProfile | undefined {
    const wp = this.wholesaleProfiles.find((p) => p._id === id);
    if (wp) {
      const user = this.findUserById(wp.userId);
      if (user) {
        wp.userObj = this.toSafeObject(user) as any;
      }
    }
    return wp;
  }

  public getAllWholesaleProfiles(status?: string): FallbackWholesaleProfile[] {
    let list = [...this.wholesaleProfiles];
    if (status) {
      list = list.filter((wp) => wp.status === status);
    }
    return list.map((wp) => {
      const user = this.findUserById(wp.userId);
      return {
        ...wp,
        userObj: user ? (this.toSafeObject(user) as any) : undefined,
      };
    });
  }

  public createWholesaleProfile(data: {
    userId: string;
    companyName: string;
    panVatNumber: string;
    businessType: string;
    contactPerson: string;
    businessPhone: string;
    businessAddress: {
      street: string;
      city: string;
      state: string;
      postalCode?: string;
      country?: string;
    };
    documentUrl: string;
  }): FallbackWholesaleProfile {
    const user = this.findUserById(data.userId);
    if (user) {
      user.wholesaleStatus = 'pending';
      user.updatedAt = new Date();
    }

    const newProfile: FallbackWholesaleProfile = {
      _id: 'wp_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      userId: data.userId,
      userObj: user ? (this.toSafeObject(user) as any) : undefined,
      companyName: data.companyName,
      panVatNumber: data.panVatNumber,
      businessType: data.businessType,
      contactPerson: data.contactPerson,
      businessPhone: data.businessPhone,
      businessAddress: data.businessAddress,
      documentUrl: data.documentUrl,
      status: 'pending',
      rejectionReason: '',
      appliedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.wholesaleProfiles.push(newProfile);
    return newProfile;
  }

  public approveWholesaleProfile(profileId: string): FallbackWholesaleProfile | undefined {
    const profile = this.wholesaleProfiles.find((p) => p._id === profileId);
    if (!profile) return undefined;

    profile.status = 'approved';
    profile.reviewedAt = new Date();
    profile.updatedAt = new Date();

    const user = this.findUserById(profile.userId);
    if (user) {
      user.wholesaleStatus = 'approved';
      user.role = 'wholesale';
      user.updatedAt = new Date();
      profile.userObj = this.toSafeObject(user) as any;
    }

    return profile;
  }

  public rejectWholesaleProfile(profileId: string, reason: string): FallbackWholesaleProfile | undefined {
    const profile = this.wholesaleProfiles.find((p) => p._id === profileId);
    if (!profile) return undefined;

    profile.status = 'rejected';
    profile.rejectionReason = reason;
    profile.reviewedAt = new Date();
    profile.updatedAt = new Date();

    const user = this.findUserById(profile.userId);
    if (user) {
      user.wholesaleStatus = 'rejected';
      user.updatedAt = new Date();
      profile.userObj = this.toSafeObject(user) as any;
    }

    return profile;
  }

  // Cart Methods
  public getCartByUserId(userId: string): FallbackCart {
    let cart = this.carts.find((c) => c.userId === userId);
    if (!cart) {
      cart = {
        _id: 'cart_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
        userId,
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.carts.push(cart);
    }
    return cart;
  }

  public saveCart(cart: FallbackCart): FallbackCart {
    const idx = this.carts.findIndex((c) => c.userId === cart.userId);
    cart.updatedAt = new Date();
    if (idx !== -1) {
      this.carts[idx] = cart;
    } else {
      this.carts.push(cart);
    }
    return cart;
  }

  public clearCart(userId: string): void {
    const cart = this.getCartByUserId(userId);
    cart.items = [];
    cart.updatedAt = new Date();
  }

  // Order Methods
  public createOrder(orderData: Omit<FallbackOrder, '_id' | 'createdAt' | 'updatedAt'>): FallbackOrder {
    const newOrder: FallbackOrder = {
      ...orderData,
      _id: 'ord_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.push(newOrder);
    return newOrder;
  }

  public getOrdersByUserId(userId: string): FallbackOrder[] {
    return this.orders
      .filter((o) => o.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  public getOrderById(orderId: string): FallbackOrder | undefined {
    return this.orders.find((o) => o._id === orderId);
  }

  public getAllOrders(filters?: { orderStatus?: string; paymentStatus?: string; orderType?: string }): FallbackOrder[] {
    let list = [...this.orders];
    if (filters?.orderStatus) {
      list = list.filter((o) => o.orderStatus === filters.orderStatus);
    }
    if (filters?.paymentStatus) {
      list = list.filter((o) => o.paymentStatus === filters.paymentStatus);
    }
    if (filters?.orderType) {
      list = list.filter((o) => o.orderType === filters.orderType);
    }
    return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map(o => {
      const user = this.findUserById(o.userId);
      return {
        ...o,
        userObj: user ? (this.toSafeObject(user) as any) : undefined,
      };
    });
  }

  public updateOrderStatus(
    orderId: string,
    updates: { orderStatus?: any; paymentStatus?: any }
  ): FallbackOrder | undefined {
    const order = this.orders.find((o) => o._id === orderId);
    if (!order) return undefined;

    if (updates.orderStatus) order.orderStatus = updates.orderStatus;
    if (updates.paymentStatus) order.paymentStatus = updates.paymentStatus;
    order.updatedAt = new Date();

    return order;
  }

  // Enquiry Methods
  public createEnquiry(data: Omit<FallbackEnquiry, '_id' | 'createdAt' | 'updatedAt' | 'status'>): FallbackEnquiry {
    const enquiry: FallbackEnquiry = {
      ...data,
      _id: 'enq_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.enquiries.push(enquiry);
    return enquiry;
  }

  public getAllEnquiries(statusFilter?: string): FallbackEnquiry[] {
    let list = [...this.enquiries];
    if (statusFilter && statusFilter !== 'all') {
      list = list.filter((e) => e.status === statusFilter);
    }
    return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  public getEnquiryById(id: string): FallbackEnquiry | undefined {
    return this.enquiries.find((e) => e._id === id);
  }

  public updateEnquiryStatus(id: string, status: 'pending' | 'quoted' | 'closed'): FallbackEnquiry | undefined {
    const eq = this.enquiries.find((e) => e._id === id);
    if (!eq) return undefined;
    eq.status = status;
    eq.updatedAt = new Date();
    return eq;
  }

  // Quotation Methods
  public createQuotation(data: Omit<FallbackQuotation, '_id' | 'createdAt' | 'updatedAt' | 'quotationNumber'>): FallbackQuotation {
    const count = this.quotations.length + 1;
    const qNum = `HPB-QT-${new Date().getFullYear()}-${count.toString().padStart(3, '0')}`;
    const quotation: FallbackQuotation = {
      ...data,
      _id: 'quo_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      quotationNumber: qNum,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.quotations.push(quotation);
    if (data.enquiryId) {
      this.updateEnquiryStatus(data.enquiryId, 'quoted');
    }
    return quotation;
  }

  public getAllQuotations(): FallbackQuotation[] {
    return [...this.quotations].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  public getQuotationById(id: string): FallbackQuotation | undefined {
    return this.quotations.find((q) => q._id === id);
  }
}

export const fallbackStore = new FallbackStore();
