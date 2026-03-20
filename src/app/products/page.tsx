"use client";

import { useEffect } from "react";
import { useProductStore } from "@/features/products/store";
import ProductGrid from "@/components/products/product-grid";
import Loader from "@/components/ui/loader";

export default function ProductsPage() {
  const products = useProductStore((s) => s.products);
  const isLoading = useProductStore((s) => s.isLoading);
  const error = useProductStore((s) => s.error);
  const fetchProducts = useProductStore((s) => s.fetchProducts);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <main className="fc-page-wrap py-10">
      <div className="fc-reveal">
        <h1 className="fc-display text-4xl sm:text-5xl text-[var(--primary)]">
          SHOP COLLECTION
        </h1>
        <p className="mt-2 text-[var(--muted)]">
          Browse our curated selection of elite football gear.
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8">
        {isLoading ? <Loader /> : <ProductGrid products={products} />}
      </div>
    </main>
  );
}
