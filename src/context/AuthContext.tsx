import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef
} from "react";

import API from '../services/api';


export interface UserProfile {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role?: 'user' | 'admin';
  avatar: string;
  wishlist?: any[];
  cart?: any[];
  memberSince: string;
  addresses: string[];
  newsletterSubscribed: boolean;
  notificationsSettings: {
    orders: boolean;
    stock: boolean;
    newsletter: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  imageId?: string;
  product?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 'Ordered' | 'Processing' | 'Shipped' | 'Delivered';
  items: OrderItem[];
  price: number;
  date: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'wishlist' | 'newsletter' | 'stock';
  date: string;
  isRead: boolean;
}

export interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  orders: Order[];
  notifications: NotificationItem[];
  recentlyViewed: string[];
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  fetchProfile: () => Promise<UserProfile | null>;
  fetchOrders: () => Promise<Order[]>;
  updateProfile: (profile: Partial<UserProfile>) => void;
  updateSecurity: (currentPassword: string, newPassword: string) => Promise<boolean>;
  addOrder: (items: OrderItem[], total: number) => void;
  addNotification: (title: string, message: string, type: NotificationItem['type']) => void;
  markAllNotificationsAsRead: () => void;
  addRecentlyViewed: (productId: string) => void;
  clearRecentlyViewed: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_ORDERS: Order[] = [
  {
    id: 'o-90812',
    orderNumber: 'EK-ORD-90812',
    status: 'Delivered',
    date: '2026-07-10T14:32:00.000Z',
    price: 1448,
    items: [
      { id: 'esp32', name: 'ESP32 DevKit V1', quantity: 2, price: 649 },
      { id: 'mq2-sensor', name: 'MQ2 Gas Sensor', quantity: 1, price: 199 }
    ]
  }
];

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Order EK-ORD-90812 Delivered',
    message: 'Your prototyping package containing ESP32 boards has been successfully delivered to Lab 101.',
    type: 'order',
    date: '2026-07-10T15:00:00.000Z',
    isRead: false
  },
  {
    id: 'n-2',
    title: 'Raspberry Pi Pico W Back In Stock',
    message: 'Good news! RP2040 Pico boards are fully stocked. Grab them before they sell out.',
    type: 'stock',
    date: '2026-07-18T09:12:00.000Z',
    isRead: true
  }
];

const formatUser = (rawUser: any): UserProfile => {
  return {
    ...rawUser,
    id: rawUser._id || rawUser.id,
    avatar: rawUser.avatar || '🤖',
    memberSince: rawUser.createdAt
      ? new Date(rawUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : 'July 2026',
    addresses: rawUser.addresses || [
      '101 Prototype Lab, Silicon Valley, KA - 560001',
      '404 Debug Alley, Firmware Estate, DL - 110001'
    ],
    newsletterSubscribed: rawUser.newsletterSubscribed !== undefined ? rawUser.newsletterSubscribed : true,
    notificationsSettings: rawUser.notificationsSettings || { orders: true, stock: true, newsletter: true }
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(true);

  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const initialized = useRef(false);

  // Fetch user profile from backend using JWT token
  const fetchProfile = useCallback(async (): Promise<UserProfile | null> => {
    try {
      const { data } = await API.get("/auth/profile");

      if (data.success && data.user) {
        const formatted = formatUser(data.user);
        setUser(formatted);
        return formatted;
      }

      return null;
    } catch (error) {
      console.error("Fetch profile error:", error);
      return null;
    }
  }, []);

  // Fetch user orders from backend
  const fetchOrders = useCallback(async (): Promise<Order[]> => {
    try {
      const { data } = await API.get("/orders");
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
        return data.orders;
      }
      return [];
    } catch (error) {
      console.error("Fetch orders error:", error);
      return [];
    }
  }, []);

  // Logout handler
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("edgekart_current_user");
    localStorage.removeItem("userInfo");

    setToken(null);
    setUser(null);
  }, []);

  // On application startup: restore session from JWT
  useEffect(() => {
    if (initialized.current) return;

    initialized.current = true;

    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        setToken(storedToken);

        try {
          const profile = await fetchProfile();

          if (!profile) {
            logout();
          } else {
            await fetchOrders();
          }
        } catch (err) {
          console.error(err);
          logout();
        }
      }

      setLoading(false);

      const storedOrders = localStorage.getItem("edgekart_orders");

      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      } else {
        setOrders(DEFAULT_ORDERS);
        localStorage.setItem(
          "edgekart_orders",
          JSON.stringify(DEFAULT_ORDERS)
        );
      }

      const storedNotifications =
        localStorage.getItem("edgekart_notifications");

      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      } else {
        setNotifications(DEFAULT_NOTIFICATIONS);
        localStorage.setItem(
          "edgekart_notifications",
          JSON.stringify(DEFAULT_NOTIFICATIONS)
        );
      }

      const storedRecent =
        localStorage.getItem("edgekart_recently_viewed");

      if (storedRecent) {
        setRecentlyViewed(JSON.parse(storedRecent));
      }
    };

    initAuth();

    const handleUnauthorized = () => logout();

    window.addEventListener(
      "auth:unauthorized",
      handleUnauthorized
    );

    return () => {
      window.removeEventListener(
        "auth:unauthorized",
        handleUnauthorized
      );
    };
  }, [fetchProfile]);

  // Register API call
  const register = useCallback(async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const { data } = await API.post('/auth/register', { name, email, password });
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        const formatted = formatUser(data.user);
        setUser(formatted);
        addNotification('Welcome to EdgeKart!', 'Explore our hardware catalogue and launch your build today.', 'newsletter');
        return true;
      }
      throw new Error(data.message || 'Registration failed');
    } catch (error: any) {
      console.error('Registration API error:', error);
      const message = error.response?.data?.message || error.message || 'Registration failed';
      throw new Error(message);
    }
  }, []);

  // Login API call
  const login = useCallback(async (
    email: string,
    password: string,
    _rememberMe?: boolean
  ): Promise<boolean> => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        const formatted = formatUser(data.user);
        setUser(formatted);
        return true;
      }
      throw new Error(data.message || 'Login failed');
    } catch (error: any) {
      console.error('Login API error:', error);
      const message = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(message);
    }
  }, []);

  const updateProfile = (profile: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...profile };
    setUser(updated);
  };

  const updateSecurity = async (_currentPassword: string, _newPassword: string): Promise<boolean> => {
    if (!user) return false;
    addNotification('Security Alert', 'Your profile settings were updated.', 'order');
    return true;
  };

  const addOrder = (items: OrderItem[], total: number) => {
    const newOrder: Order = {
      id: `o-${Math.floor(10000 + Math.random() * 90000)}`,
      orderNumber: `EK-ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'Ordered',
      items,
      price: total,
      date: new Date().toISOString()
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('edgekart_orders', JSON.stringify(updatedOrders));

    addNotification(
      'Order Placed Successfully!',
      `Simulated checkout synced! Order ${newOrder.orderNumber} is processing.`,
      'order'
    );
  };

  const addNotification = (title: string, message: string, type: NotificationItem['type']) => {
    const newNotif: NotificationItem = {
      id: `n-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      message,
      type,
      date: new Date().toISOString(),
      isRead: false
    };

    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    localStorage.setItem('edgekart_notifications', JSON.stringify(updatedNotifs));
  };

  const markAllNotificationsAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    localStorage.setItem('edgekart_notifications', JSON.stringify(updated));
  };

  const addRecentlyViewed = useCallback((productId: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      const updated = [productId, ...filtered].slice(0, 5);
      try {
        localStorage.setItem('edgekart_recently_viewed', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save recently viewed to localStorage:', e);
      }
      return updated;
    });
  }, []);

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    localStorage.removeItem('edgekart_recently_viewed');
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        orders,
        notifications,
        recentlyViewed,
        login,
        register,
        logout,
        fetchProfile,
        fetchOrders,
        updateProfile,
        updateSecurity,
        addOrder,
        addNotification,
        markAllNotificationsAsRead,
        addRecentlyViewed,
        clearRecentlyViewed,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
