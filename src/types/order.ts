export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price_at_purchase: number;
  // Enriched client-side from the products API
  product_name?: string;
  product_image_url?: string | null;
}

export interface ShippingAddress {
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string; // 6-digit Indian pincode
  country: string;
}

export interface Order {
  id: number;
  user_id: number;
  status: string;
  total_amount: number;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
  // Structured address fields returned by the backend
  address_line1?: string | null;
  address_line2?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  country?: string | null;
}

export interface CreateOrderItem {
  product_id: number;
  quantity: number;
}

export interface CreateOrderRequest {
  status?: string;
  items: CreateOrderItem[];
  shipping_address: ShippingAddress;
}
