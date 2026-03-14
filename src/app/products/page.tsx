import Link from "next/link"

type Product = {
    id: number
    name: string
    description: string | null
    price: number
    stock_quantity: number
    image_url: string | null
    is_active: boolean
    created_at: string
    updated_at: string
}

const products: Product[] = [
    {
        id: 1,
        name: "Phantom Strike Elite",
        description: "Lightweight speed boots built for explosive forwards and sharp directional changes.",
        price: 189.99,
        stock_quantity: 14,
        image_url: "https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=900&q=80",
        is_active: true,
        created_at: "2026-03-01T09:00:00Z",
        updated_at: "2026-03-10T14:15:00Z",
    },
    {
        id: 2,
        name: "Control Pro Midfield",
        description: "Textured upper and balanced stud layout for players who dictate tempo in midfield.",
        price: 149.5,
        stock_quantity: 22,
        image_url: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=900&q=80",
        is_active: true,
        created_at: "2026-02-25T11:30:00Z",
        updated_at: "2026-03-08T08:45:00Z",
    },
    {
        id: 3,
        name: "Keeper Grip X",
        description: "Goalkeeper gloves with reinforced palms, secure wrist support, and wet-weather grip.",
        price: 79.0,
        stock_quantity: 8,
        image_url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=900&q=80",
        is_active: true,
        created_at: "2026-02-18T15:20:00Z",
        updated_at: "2026-03-05T12:00:00Z",
    },
    {
        id: 4,
        name: "Training Bib Set",
        description: "Durable, breathable training bibs for small-sided sessions and team drills.",
        price: 34.99,
        stock_quantity: 0,
        image_url: null,
        is_active: false,
        created_at: "2026-01-30T10:10:00Z",
        updated_at: "2026-03-12T17:40:00Z",
    },
    {
        id: 5,
        name: "Matchday Shield Shin Guards",
        description: "Slim-profile shin guards designed for comfort without sacrificing impact protection.",
        price: 28.75,
        stock_quantity: 31,
        image_url: "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=900&q=80",
        is_active: true,
        created_at: "2026-03-03T07:50:00Z",
        updated_at: "2026-03-13T09:25:00Z",
    },
    {
        id: 6,
        name: "Street Touch Ball",
        description: "High-durability training ball for hard surfaces, compact spaces, and everyday sessions.",
        price: 42.0,
        stock_quantity: 18,
        image_url: "https://images.unsplash.com/photo-1508098682722-e99c643e7485?auto=format&fit=crop&w=900&q=80",
        is_active: true,
        created_at: "2026-02-11T13:05:00Z",
        updated_at: "2026-03-11T16:30:00Z",
    },
]

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
})

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
})

export default function ProductsPage() {
    const activeProducts = products.filter((product) => product.is_active)
    const inactiveProducts = products.filter((product) => !product.is_active)

    return (
        <main className="fc-page-wrap py-12 sm:py-16">
            <section className="fc-card fc-reveal overflow-hidden p-7 sm:p-10">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="inline-flex rounded-full border border-[#17412b]/20 bg-[#f2f8f2] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#17412b]">
                            Product Catalog
                        </p>
                        <h1 className="fc-display mt-4 text-5xl leading-[0.95] text-[#153322] sm:text-7xl">
                            MATCHDAY
                            <br />
                            ESSENTIALS
                        </h1>
                        <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#3f5a4b] sm:text-lg">
                            Dummy product data shaped after your backend Product model. Each card includes pricing,
                            stock state, activity status, timestamps, and optional image support.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm text-[#21452f] sm:min-w-[280px]">
                        <div className="rounded-2xl border border-[#17412b]/10 bg-white/75 p-4">
                            <p className="text-xs uppercase tracking-[0.18em] text-[#577060]">Active</p>
                            <p className="mt-2 text-3xl font-semibold">{activeProducts.length}</p>
                        </div>
                        <div className="rounded-2xl border border-[#17412b]/10 bg-white/75 p-4">
                            <p className="text-xs uppercase tracking-[0.18em] text-[#577060]">Low / Empty</p>
                            <p className="mt-2 text-3xl font-semibold">
                                {products.filter((product) => product.stock_quantity < 10).length}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mt-6 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
                {products.map((product, index) => {
                    const inStock = product.stock_quantity > 0

                    return (
                        <article
                            key={product.id}
                            className="fc-card fc-reveal overflow-hidden"
                            style={{ animationDelay: `${index * 80}ms` }}
                        >
                            <div className="relative h-52 overflow-hidden bg-[#dce9dd]">
                                {product.image_url ? (
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#dce9dd_0%,#f5efe2_100%)] px-6 text-center text-sm uppercase tracking-[0.18em] text-[#486354]">
                                        Image unavailable
                                    </div>
                                )}

                                <div className="absolute left-4 top-4 flex gap-2">
                                    <span className="rounded-full bg-[#123e27] px-3 py-1 text-xs uppercase tracking-[0.16em] text-white/95">
                                        #{product.id}
                                    </span>
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.16em] ${product.is_active
                                                ? "bg-[#eef8f1] text-[#155836]"
                                                : "bg-[#f5e8e1] text-[#8a4b2f]"
                                            }`}
                                    >
                                        {product.is_active ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            </div>

                            <div className="p-5 sm:p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-2xl font-semibold text-[#163825]">{product.name}</h2>
                                        <p className="mt-2 text-sm leading-relaxed text-[#4f6657]">
                                            {product.description ?? "No description provided."}
                                        </p>
                                    </div>
                                    <p className="text-lg font-semibold text-[#155836]">
                                        {currencyFormatter.format(product.price)}
                                    </p>
                                </div>

                                <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-[#264433]">
                                    <div className="rounded-2xl border border-[#17412b]/10 bg-white/65 p-3">
                                        <p className="text-xs uppercase tracking-[0.16em] text-[#648070]">Stock</p>
                                        <p className="mt-2 font-semibold">
                                            {inStock ? `${product.stock_quantity} available` : "Out of stock"}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-[#17412b]/10 bg-white/65 p-3">
                                        <p className="text-xs uppercase tracking-[0.16em] text-[#648070]">Updated</p>
                                        <p className="mt-2 font-semibold">{dateFormatter.format(new Date(product.updated_at))}</p>
                                    </div>
                                </div>

                                <div className="mt-4 text-xs uppercase tracking-[0.16em] text-[#648070]">
                                    Created {dateFormatter.format(new Date(product.created_at))}
                                </div>

                                <div className="mt-5 flex items-center justify-between gap-3">
                                    <span
                                        className={`rounded-full px-3 py-2 text-sm font-medium ${inStock ? "bg-[#edf6ef] text-[#155836]" : "bg-[#f8ebe4] text-[#8a4b2f]"
                                            }`}
                                    >
                                        {inStock ? "Ready to order" : "Restock pending"}
                                    </span>

                                    <Link
                                        href="/register"
                                        className="fc-btn fc-btn-primary px-5 py-2 text-sm"
                                    >
                                        View Product
                                    </Link>
                                </div>
                            </div>
                        </article>
                    )
                })}
            </section>

            <section className="mt-6 grid gap-4 md:grid-cols-[1.5fr_1fr]">
                <article className="fc-card fc-reveal p-6" style={{ animationDelay: "180ms" }}>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#577060]">Schema Preview</p>
                    <h2 className="mt-3 text-2xl font-semibold text-[#163825]">Mapped from your SQLAlchemy model</h2>
                    <p className="mt-3 text-sm leading-relaxed text-[#4f6657]">
                        This page currently uses hard-coded frontend data, but the structure mirrors the backend
                        Product entity so it can be replaced with API data later with minimal changes.
                    </p>
                    <div className="mt-5 grid gap-2 text-sm text-[#264433] sm:grid-cols-2">
                        <div className="rounded-2xl bg-white/70 px-4 py-3">Fields: id, name, description, price</div>
                        <div className="rounded-2xl bg-white/70 px-4 py-3">Inventory: stock_quantity, is_active</div>
                        <div className="rounded-2xl bg-white/70 px-4 py-3">Media: image_url</div>
                        <div className="rounded-2xl bg-white/70 px-4 py-3">Audit: created_at, updated_at</div>
                    </div>
                </article>

                <aside className="fc-card fc-reveal p-6" style={{ animationDelay: "240ms" }}>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#577060]">Inactive Items</p>
                    <h2 className="mt-3 text-2xl font-semibold text-[#163825]">Hidden from shoppers</h2>
                    <div className="mt-4 space-y-3">
                        {inactiveProducts.map((product) => (
                            <div key={product.id} className="rounded-2xl border border-[#17412b]/10 bg-white/75 p-4">
                                <p className="font-semibold text-[#163825]">{product.name}</p>
                                <p className="mt-1 text-sm text-[#4f6657]">Stock: {product.stock_quantity}</p>
                            </div>
                        ))}
                    </div>
                </aside>
            </section>
        </main>
    )
}
