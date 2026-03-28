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

export interface Order {
  id: number;
  user_id: number;
  status: string;
  total_amount: number;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface CreateOrderItem {
  product_id: number;
  quantity: number;
}

export interface CreateOrderRequest {
  status?: string;
  items: CreateOrderItem[];
}
