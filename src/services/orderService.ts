import { apiClient } from './apiClient';
import { ApiResponse } from '../types/auth';
import {
  Order,
  CreateOrderPayload,
} from '../types/order';

export const orderService = {
  /**
   * Create a new order.
   *
   * Supports:
   * - Regular checkout
   * - Wholesale checkout
   * - Guest checkout
   * - Payment screenshot upload
   */
  createOrder: async (
    payload: CreateOrderPayload,
    paymentScreenshot?: File | null
  ): Promise<{ order: Order }> => {
    const formData = new FormData();

    /* =====================================================
       ORDER ITEMS
    ===================================================== */

    if (
      payload.items &&
      payload.items.length > 0
    ) {
      formData.append(
        'items',
        JSON.stringify(payload.items)
      );
    }

    /* =====================================================
       SHIPPING ADDRESS
    ===================================================== */

    formData.append(
      'shippingAddress',
      JSON.stringify(
        payload.shippingAddress
      )
    );

    /* =====================================================
       PAYMENT METHOD
    ===================================================== */

    formData.append(
      'paymentMethod',
      payload.paymentMethod
    );

    /* =====================================================
       NOTES
    ===================================================== */

    if (payload.notes) {
      formData.append(
        'notes',
        payload.notes
      );
    }

    /* =====================================================
       PAYMENT SCREENSHOT
       
       IMPORTANT:
       Backend route uses:
       
       upload.single('paymentScreenshot')
       
       So the field name MUST exactly match:
       
       paymentScreenshot
    ===================================================== */

    if (paymentScreenshot) {
      formData.append(
        'paymentScreenshot',
        paymentScreenshot,
        paymentScreenshot.name
      );
    }

    /* =====================================================
       DEBUG
    ===================================================== */

    console.log(
      '[OrderService] Payment screenshot:',
      paymentScreenshot
        ? {
            name: paymentScreenshot.name,
            type: paymentScreenshot.type,
            size: paymentScreenshot.size,
          }
        : 'NO FILE'
    );

    /* =====================================================
       SEND REQUEST
       
       IMPORTANT:
       DO NOT manually set Content-Type.
       
       Browser/Axios must automatically generate:
       
       multipart/form-data;
       boundary=....
    ===================================================== */

    const res =
      await apiClient.post<
        ApiResponse<{ order: Order }>
      >(
        '/orders',
        formData
      );

    return res.data.data;
  },

  /* =======================================================
     GET MY ORDERS
  ======================================================= */

  getMyOrders: async (): Promise<{
    orders: Order[];
  }> => {
    const res =
      await apiClient.get<
        ApiResponse<{
          orders: Order[];
        }>
      >('/orders/my-orders');

    return res.data.data;
  },

  /* =======================================================
     GET ORDER BY ID
  ======================================================= */

  getOrderById: async (
    id: string
  ): Promise<{ order: Order }> => {
    const res =
      await apiClient.get<
        ApiResponse<{ order: Order }>
      >(`/orders/${id}`);

    return res.data.data;
  },
};