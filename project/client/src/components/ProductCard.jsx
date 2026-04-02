const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value || 0);

export default function ProductCard({ product }) {
  return (
    <article className="group rounded-xl bg-[var(--surface-container-lowest)] transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden rounded-t-xl bg-[var(--surface-container-low)]">
        <img
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          src={product.imageUrl}
        />
        {product.featured ? (
          <div className="absolute left-4 top-4 rounded-sm bg-[var(--primary)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--on-primary)]">
            Featured
          </div>
        ) : null}
      </div>

      <div className="p-6">
        <div className="mb-2 flex items-start justify-between">
          <span className="font-label text-[11px] font-bold uppercase tracking-wider text-[var(--primary)]">
            {product.categoryName}
          </span>
          <div className="flex gap-1">
            <span className="material-symbols-outlined text-xs text-yellow-500">star</span>
            <span className="text-[10px] font-bold">{product.rating}</span>
          </div>
        </div>

        <h3 className="font-headline mb-1 text-xl font-bold transition-colors group-hover:text-[var(--primary)]">
          {product.name}
        </h3>
        <p className="mb-4 min-h-[48px] text-sm text-[var(--on-surface-variant)]">
          {product.description}
        </p>

        <div className="flex items-center justify-between border-t border-blue-50 pt-4">
          <div>
            <span className="font-headline text-xl font-bold">{formatCurrency(product.price)}</span>
            <p className="mt-1 text-[11px] text-[var(--on-surface-variant)]">
              Ton kho: {product.stockQuantity}
            </p>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--surface-container-high)] transition-colors hover:bg-[var(--primary)] hover:text-[var(--on-primary)]">
            <span className="material-symbols-outlined">add_shopping_cart</span>
          </button>
        </div>
      </div>
    </article>
  );
}
