export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductCreate {
  name: string;
  description?: string | null;
  price: number;
  stock_quantity: number;
  image_url?: string | null;
  is_active?: boolean;
}

export interface ProductUpdate {
  name?: string;
  description?: string | null;
  price?: number;
  stock_quantity?: number;
  image_url?: string | null;
  is_active?: boolean;
}
