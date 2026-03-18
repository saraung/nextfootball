import api from "@/lib/api/axios";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { Product, ProductCreate, ProductUpdate } from "@/types/product";

export async function getProductsAPI(
  skip = 0,
  limit = 20,
): Promise<Product[]> {
  const { data } = await api.get<Product[]>(ENDPOINTS.PRODUCTS, {
    params: { skip, limit },
  });
  return data;
}

export async function getProductAPI(id: number | string): Promise<Product> {
  const { data } = await api.get<Product>(ENDPOINTS.PRODUCT(id));
  return data;
}

export async function createProductAPI(body: ProductCreate): Promise<Product> {
  const { data } = await api.post<Product>(ENDPOINTS.PRODUCTS, body);
  return data;
}

export async function updateProductAPI(
  id: number | string,
  body: ProductUpdate,
): Promise<Product> {
  const { data } = await api.put<Product>(ENDPOINTS.PRODUCT(id), body);
  return data;
}

export async function deleteProductAPI(id: number | string): Promise<void> {
  await api.delete(ENDPOINTS.PRODUCT(id));
}
