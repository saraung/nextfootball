export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price_at_purchase: number;
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
