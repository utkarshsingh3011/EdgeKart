import API from './api';

export interface CheckoutPayload {
    discountAmount?: number;
    shippingAddress?: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
    paymentMethod?: string;
}

export const orderService = {
    // Process checkout for authenticated user
    checkout: async (payload?: CheckoutPayload) => {
        const { data } = await API.post('/orders/checkout', payload || {});
        return data;
    },

    // Fetch user order history
    getUserOrders: async () => {
        const { data } = await API.get('/orders');
        return data;
    },

    // Fetch single order by ID
    getOrderById: async (id: string) => {
        const { data } = await API.get(`/orders/${id}`);
        return data;
    }
};

export default orderService;
