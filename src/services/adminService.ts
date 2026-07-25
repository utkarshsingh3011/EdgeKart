import API from './api';
import type { Product } from '../types/product';

export interface DashboardKPIs {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  revenue: number;
  totalRevenue?: number;
  pendingOrders: number;
  lowStockCount: number;
  lowStockProductsCount?: number;
}

export interface DashboardOrder {
  _id: string;
  id?: string;
  orderNumber: string;
  status: 'Ordered' | 'Processing' | 'Shipped' | 'Delivered';
  totalPrice: number;
  price?: number;
  user?: {
    _id?: string;
    name?: string;
    email?: string;
  };
  createdAt: string;
  date?: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export interface DashboardUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
  createdAt: string;
}

export interface DashboardStatsResponse {
  success: boolean;
  message?: string;
  totalProducts?: number;
  totalOrders?: number;
  totalUsers?: number;
  totalRevenue?: number;
  pendingOrders?: number;
  lowStockProductsCount?: number;
  kpis: DashboardKPIs;
  recentOrders: DashboardOrder[];
  lowStockProducts: Product[];
  recentUsers: DashboardUser[];
}

export interface AdminOrderProductItem {
  product?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  imageId?: string;
}

export interface AdminOrderShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface AdminOrderUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export interface AdminOrder {
  _id: string;
  id?: string;
  orderNumber: string;
  user: AdminOrderUser;
  items: AdminOrderProductItem[];
  shippingAddress: AdminOrderShippingAddress;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  discountAmount: number;
  totalPrice: number;
  price?: number;
  status: 'Ordered' | 'Processing' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
  date?: string;
}

export interface AdminOrdersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
  dateRange?: string;
}

export interface AdminOrdersResponse {
  success: boolean;
  count: number;
  totalOrders: number;
  page: number;
  totalPages: number;
  orders: AdminOrder[];
}

export interface AdminUserItem {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  isBlocked?: boolean;
  avatar?: string;
  ordersCount?: number;
  wishlistCount?: number;
  cartCount?: number;
  createdAt: string;
  updatedAt: string;
  wishlist?: any[];
  cart?: any[];
}

export interface AdminUsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  sort?: string;
}

export interface AdminUsersResponse {
  success: boolean;
  count: number;
  totalUsers: number;
  page: number;
  totalPages: number;
  users: AdminUserItem[];
}

export interface AdminUserDetailResponse {
  success: boolean;
  user: AdminUserItem;
  orders: AdminOrder[];
}

export interface AdminMessageItem {
  _id: string;
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  isReplied: boolean;
  replyMessage?: string;
  repliedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminMessagesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  read?: string;
  replied?: string;
  sort?: string;
}

export interface AdminMessagesResponse {
  success: boolean;
  count: number;
  totalMessages: number;
  unreadCount: number;
  pendingReplyCount: number;
  page: number;
  totalPages: number;
  messages: AdminMessageItem[];
}

export interface NewsletterSubscriberItem {
  _id: string;
  id?: string;
  name?: string;
  email: string;
  status: 'Subscribed' | 'Unsubscribed';
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort?: string;
}

export interface NewsletterResponse {
  success: boolean;
  count: number;
  totalSubscribers: number;
  activeSubscribers: number;
  unsubscribedCount: number;
  newThisMonthCount: number;
  page: number;
  totalPages: number;
  subscribers: NewsletterSubscriberItem[];
}

export interface StoreSettingsItem {
  _id?: string;
  storeName: string;
  storeDescription: string;
  supportEmail: string;
  supportPhone: string;
  companyAddress: string;
  gstNumber: string;
  website: string;
  currency: string;
  taxPercentage: number;
  shippingCharge: number;
  freeShippingThreshold: number;
  codEnabled: boolean;
  lowStockThreshold: number;
  autoHideOutOfStock: boolean;
  defaultProductStatus: 'Active' | 'Draft';
  autoConfirmOrders: boolean;
  autoUpdateInventory: boolean;
  allowOrderCancellation: boolean;
  emailNotifications: boolean;
  newOrderAlerts: boolean;
  lowStockAlerts: boolean;
  newsletterNotifications: boolean;
  sessionTimeout: number;
  requireStrongPasswords: boolean;
  enableAdminActivityLogs: boolean;
}

export const adminService = {
  /**
   * Fetch complete statistics, recent orders, low stock products, and recent users for Admin Dashboard
   */
  getDashboardStats: async (): Promise<DashboardStatsResponse> => {
    const response = await API.get<DashboardStatsResponse>('/admin/dashboard');
    return response.data;
  },

  /**
   * Fetch filtered and paginated orders list for Admin Orders Management
   */
  getAdminOrders: async (params: AdminOrdersQueryParams = {}): Promise<AdminOrdersResponse> => {
    const response = await API.get<AdminOrdersResponse>('/admin/orders', { params });
    return response.data;
  },

  /**
   * Update Order Status or Payment Status in MongoDB
   */
  updateOrderStatus: async (
    id: string,
    status?: string,
    paymentStatus?: string
  ): Promise<{ success: boolean; message: string; order: AdminOrder }> => {
    const response = await API.patch<{ success: boolean; message: string; order: AdminOrder }>(
      `/admin/orders/${id}/status`,
      { status, paymentStatus }
    );
    return response.data;
  },

  /**
   * Delete Order record from MongoDB
   */
  deleteOrder: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await API.delete<{ success: boolean; message: string }>(`/admin/orders/${id}`);
    return response.data;
  },

  /**
   * Fetch filtered and paginated users list for Admin Users Management
   */
  getAdminUsers: async (params: AdminUsersQueryParams = {}): Promise<AdminUsersResponse> => {
    const response = await API.get<AdminUsersResponse>('/admin/users', { params });
    return response.data;
  },

  /**
   * Fetch complete user profile and order history by ID
   */
  getAdminUserById: async (id: string): Promise<AdminUserDetailResponse> => {
    const response = await API.get<AdminUserDetailResponse>(`/admin/users/${id}`);
    return response.data;
  },

  /**
   * Update User Role (Promote to Admin or Demote to User)
   */
  updateUserRole: async (id: string, role: 'admin' | 'user'): Promise<{ success: boolean; message: string; user: AdminUserItem }> => {
    const response = await API.patch<{ success: boolean; message: string; user: AdminUserItem }>(
      `/admin/users/${id}/role`,
      { role }
    );
    return response.data;
  },

  /**
   * Block or Unblock User Account
   */
  toggleUserBlock: async (id: string, isBlocked: boolean): Promise<{ success: boolean; message: string; user: AdminUserItem }> => {
    const response = await API.patch<{ success: boolean; message: string; user: AdminUserItem }>(
      `/admin/users/${id}/block`,
      { isBlocked }
    );
    return response.data;
  },

  /**
   * Delete User Account from MongoDB
   */
  deleteUser: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await API.delete<{ success: boolean; message: string }>(`/admin/users/${id}`);
    return response.data;
  },

  /**
   * Fetch customer inquiry messages for Admin Inbox
   */
  getAdminMessages: async (params: AdminMessagesQueryParams = {}): Promise<AdminMessagesResponse> => {
    const response = await API.get<AdminMessagesResponse>('/admin/messages', { params });
    return response.data;
  },

  /**
   * Fetch single message detail
   */
  getAdminMessageById: async (id: string): Promise<{ success: boolean; message: AdminMessageItem }> => {
    const response = await API.get<{ success: boolean; message: AdminMessageItem }>(`/admin/messages/${id}`);
    return response.data;
  },

  /**
   * Update Message Read / Unread Status
   */
  updateMessageReadStatus: async (id: string, isRead: boolean): Promise<{ success: boolean; message: string; data: AdminMessageItem }> => {
    const response = await API.patch<{ success: boolean; message: string; data: AdminMessageItem }>(
      `/admin/messages/${id}/read`,
      { isRead }
    );
    return response.data;
  },

  /**
   * Update Message Replied Status and optional reply body
   */
  updateMessageRepliedStatus: async (
    id: string,
    isReplied: boolean,
    replyMessage?: string
  ): Promise<{ success: boolean; message: string; data: AdminMessageItem }> => {
    const response = await API.patch<{ success: boolean; message: string; data: AdminMessageItem }>(
      `/admin/messages/${id}/reply`,
      { isReplied, replyMessage }
    );
    return response.data;
  },

  /**
   * Delete Message record from MongoDB
   */
  deleteMessage: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await API.delete<{ success: boolean; message: string }>(`/admin/messages/${id}`);
    return response.data;
  },

  /**
   * Fetch Newsletter Subscribers list for Admin
   */
  getNewsletterSubscribers: async (params: NewsletterQueryParams = {}): Promise<NewsletterResponse> => {
    const response = await API.get<NewsletterResponse>('/admin/newsletter', { params });
    return response.data;
  },

  /**
   * Manually add new Newsletter Subscriber (Admin)
   */
  addNewsletterSubscriber: async (data: { email: string; name?: string; status?: string }): Promise<{ success: boolean; message: string; data: NewsletterSubscriberItem }> => {
    const response = await API.post<{ success: boolean; message: string; data: NewsletterSubscriberItem }>('/admin/newsletter', data);
    return response.data;
  },

  /**
   * Update Newsletter Subscriber Status (Subscribed / Unsubscribed)
   */
  updateNewsletterStatus: async (id: string, status: 'Subscribed' | 'Unsubscribed'): Promise<{ success: boolean; message: string; data: NewsletterSubscriberItem }> => {
    const response = await API.patch<{ success: boolean; message: string; data: NewsletterSubscriberItem }>(
      `/admin/newsletter/${id}/status`,
      { status }
    );
    return response.data;
  },

  /**
   * Delete Newsletter Subscriber record from MongoDB
   */
  deleteNewsletterSubscriber: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await API.delete<{ success: boolean; message: string }>(`/admin/newsletter/${id}`);
    return response.data;
  },

  /**
   * Fetch Store Settings from MongoDB
   */
  getStoreSettings: async (): Promise<{ success: boolean; settings: StoreSettingsItem }> => {
    const response = await API.get<{ success: boolean; settings: StoreSettingsItem }>('/admin/settings');
    return response.data;
  },

  /**
   * Update Store Settings in MongoDB
   */
  updateStoreSettings: async (data: Partial<StoreSettingsItem>): Promise<{ success: boolean; message: string; settings: StoreSettingsItem }> => {
    const response = await API.put<{ success: boolean; message: string; settings: StoreSettingsItem }>('/admin/settings', data);
    return response.data;
  }
};

export default adminService;
