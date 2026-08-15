export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'wholesale' | 'admin';
  wholesaleStatus: 'none' | 'pending' | 'approved' | 'rejected';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponseData {
  user: User;
  token: string;
}

export interface ApiResponse<T = any> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}
