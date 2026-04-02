import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";

const defaultFilters = {
  search: "",
  category: "",
  minPrice: "",
  maxPrice: "",
  sort: "featured",
};

export default function Home() {
  const [filters, setFilters] = useState(defaultFilters);
  const [storefront, setStorefront] = useState({
    products: [],
    categories: [],
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            params.set(key, value);
          }
        });

        const response = await fetch(`http://localhost:3000/api/products?${params.toString()}`, {
          signal: controller.signal,
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Khong tai duoc san pham");
        }

        setStorefront(result.data);
      } catch (error) {
        if (error.name !== "AbortError") {
          setErrorMessage(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [filters]);

  const authData = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("authData") || "null");
    } catch {
      return null;
    }
  }, []);

  const user = authData?.user;

  const handleFilterChange = (key, value) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <>
      <header className="fixed top-0 z-50 flex w-full items-center justify-between bg-blue-50/80 px-8 py-4 shadow-sm backdrop-blur-md">
        <a className="font-headline text-2xl font-bold tracking-tighter text-blue-700" href="/">
          Silicon Curator
        </a>

        <nav className="hidden items-center space-x-8 lg:flex">
          {storefront.categories.slice(0, 6).map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => handleFilterChange("category", category.slug)}
              className={
                filters.category === category.slug
                  ? "border-b-2 border-blue-600 pb-1 font-headline font-bold text-blue-700 transition-all duration-300"
                  : "font-headline text-slate-600 transition-colors hover:text-blue-500"
              }
            >
              {category.name}
            </button>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <input
              className="w-64 rounded-full bg-[var(--surface-container-highest)] px-6 py-2 text-sm outline-none transition-all duration-300 placeholder:text-[color:var(--on-surface-variant)]/50 focus:ring-2 focus:ring-[var(--primary)]/20"
              placeholder="Tim kiem linh kien..."
              type="text"
              value={filters.search}
              onChange={(event) => handleFilterChange("search", event.target.value)}
            />
            <span className="material-symbols-outlined absolute right-4 top-2 text-[color:var(--on-surface-variant)]/70">
              search
            </span>
          </div>
          <button className="rounded-md p-2 transition-all duration-300 hover:bg-blue-100/50">
            <span className="material-symbols-outlined text-blue-600">shopping_cart</span>
          </button>
          <a
            className="rounded-md p-2 transition-all duration-300 hover:bg-blue-100/50"
            href={user ? "/profile" : "/login"}
          >
            <span className="material-symbols-outlined text-blue-600">account_circle</span>
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-8 pb-24 pt-24">
        <section className="relative mb-24 flex h-[500px] items-center overflow-hidden rounded-xl">
          <div className="absolute inset-0 z-0">
            <img
              className="h-full w-full object-cover"
              alt="Hero hardware"
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)] via-[rgba(242,247,255,0.4)] to-transparent" />
          </div>

          <div className="relative z-10 grid w-full grid-cols-12 gap-8 px-12">
            <div className="col-span-12 md:col-span-6 lg:col-span-5">
              <span className="font-headline mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
                Kho Luu Tru Theo Mua 01
              </span>
              <h1 className="font-headline mb-6 text-6xl font-bold leading-[1.1] tracking-tighter text-[var(--on-surface)] md:text-7xl">
                Ky Thuat Chinh Xac Quantum.
              </h1>
              <p className="mb-8 max-w-md text-lg text-[var(--on-surface-variant)]">
                Trai nghiem the he may tinh tiep theo voi cac kien truc phan cung duoc tuyen chon,
                thiet ke cho hieu nang toi da va hieu qua nhiet tuyet doi.
              </p>
              <button className="liquid-sky-gradient rounded-md px-8 py-4 font-bold text-[var(--on-primary)] shadow-xl transition-transform hover:scale-105">
                Kham Pha Bo Suu Tap
              </button>
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-12 lg:flex-row">
          <aside className="w-full shrink-0 lg:w-72">
            <div className="sticky top-28 space-y-10">
              <div>
                <h3 className="font-headline mb-6 flex items-center gap-2 text-lg font-bold">
                  <span className="h-6 w-1.5 rounded-full bg-[var(--primary)]" />
                  Tinh Chinh Kien Truc
                </h3>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="font-label text-[11px] font-bold uppercase tracking-widest text-[color:var(--on-surface-variant)]/70">
                      Danh Muc
                    </label>
                    <div className="space-y-3">
                      <label className="flex cursor-pointer items-center">
                        <input
                          type="radio"
                          name="category"
                          checked={!filters.category}
                          onChange={() => handleFilterChange("category", "")}
                          className="mr-3 h-4 w-4 border-[var(--outline-variant)] text-[var(--primary)] focus:ring-[var(--primary)]/20"
                        />
                        <span className="text-sm">Tat ca</span>
                      </label>
                      {storefront.categories.map((category) => (
                        <label key={category.slug} className="flex cursor-pointer items-center">
                          <input
                            type="radio"
                            name="category"
                            checked={filters.category === category.slug}
                            onChange={() => handleFilterChange("category", category.slug)}
                            className="mr-3 h-4 w-4 border-[var(--outline-variant)] text-[var(--primary)] focus:ring-[var(--primary)]/20"
                          />
                          <span className="text-sm">{category.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="font-label text-[11px] font-bold uppercase tracking-widest text-[color:var(--on-surface-variant)]/70">
                      Muc Dau Tu
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        placeholder="Tu"
                        value={filters.minPrice}
                        onChange={(event) => handleFilterChange("minPrice", event.target.value)}
                        className="rounded-md bg-[var(--surface-container-low)] px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                      />
                      <input
                        type="number"
                        placeholder="Den"
                        value={filters.maxPrice}
                        onChange={(event) => handleFilterChange("maxPrice", event.target.value)}
                        className="rounded-md bg-[var(--surface-container-low)] px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="font-label text-[11px] font-bold uppercase tracking-widest text-[color:var(--on-surface-variant)]/70">
                      Sap Xep
                    </label>
                    <select
                      value={filters.sort}
                      onChange={(event) => handleFilterChange("sort", event.target.value)}
                      className="w-full rounded-md bg-[var(--surface-container-low)] px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                    >
                      <option value="featured">Hieu nang cao nhat</option>
                      <option value="newest">Moi cap nhat</option>
                      <option value="price_asc">Gia thap den cao</option>
                      <option value="price_desc">Gia cao den thap</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={resetFilters}
                    className="w-full rounded-md border border-[var(--outline-variant)] bg-white px-4 py-3 text-sm font-bold transition-colors hover:bg-[var(--surface-container-low)]"
                  >
                    Dat lai bo loc
                  </button>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl bg-[var(--surface-container)] p-6">
                <div className="relative z-10">
                  <h4 className="font-headline mb-2 text-lg font-bold">Huong Dan Build May</h4>
                  <p className="mb-4 text-sm">
                    Ban moi lam quen voi he thong tuy chinh? Doi ngu cua chung toi da chuan bi
                    danh muc khoi dau cho nam 2024.
                  </p>
                  <button className="flex items-center gap-1 text-sm font-bold text-[var(--primary)] transition-all group-hover:gap-2">
                    Xem Huong Dan
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h2 className="font-headline text-3xl font-bold tracking-tight">Danh Muc Hien Co</h2>
                <p className="text-sm text-[var(--on-surface-variant)]">
                  Hien thi {storefront.total} san pham dang co trong he thong
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-label text-sm font-bold uppercase tracking-widest text-[color:var(--on-surface-variant)]/60">
                  Sap Xep Theo
                </span>
                <select
                  value={filters.sort}
                  onChange={(event) => handleFilterChange("sort", event.target.value)}
                  className="cursor-pointer border-none bg-transparent text-sm font-bold focus:ring-0"
                >
                  <option value="featured">Hieu Nang Cao Nhat</option>
                  <option value="newest">Moi Cap Nhat</option>
                  <option value="price_asc">Gia Tang Dan</option>
                  <option value="price_desc">Gia Giam Dan</option>
                </select>
              </div>
            </div>

            {errorMessage ? (
              <div className="mb-6 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            ) : null}

            {loading ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-[420px] animate-pulse rounded-xl bg-[var(--surface-container-low)]"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                {storefront.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}

                <div className="relative overflow-hidden rounded-xl bg-[var(--surface-dim)] p-8 xl:col-span-2">
                  <div className="absolute right-0 top-0 p-8">
                    <span className="material-symbols-outlined text-8xl text-[var(--primary)]/20">
                      auto_awesome
                    </span>
                  </div>
                  <div className="relative z-10 max-w-lg">
                    <span className="font-headline mb-2 block text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
                      Dang Kich Hoat Tuyen Chon AI
                    </span>
                    <h3 className="font-headline mb-4 text-3xl font-bold leading-tight">
                      Danh Muc Tram Lam Viec Toi Uu
                    </h3>
                    <p className="mb-6 text-[var(--on-surface-variant)]">
                      Dua tren lich su xem linh kien va phan khuc ban quan tam, chung toi de xuat
                      mot tap hop cau hinh can bang giua hieu nang, nhiet do va chi phi.
                    </p>
                    <div className="mb-8 flex flex-wrap gap-4">
                      <div className="flex items-center gap-3 rounded-lg bg-white/50 px-4 py-2 backdrop-blur-md">
                        <span className="material-symbols-outlined text-[var(--primary)]">memory</span>
                        <span className="text-xs font-bold">San sang cho LGA 1700</span>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg bg-white/50 px-4 py-2 backdrop-blur-md">
                        <span className="material-symbols-outlined text-[var(--primary)]">ac_unit</span>
                        <span className="text-xs font-bold">Tan nhiet yen tinh</span>
                      </div>
                    </div>
                    <button className="rounded-md bg-[var(--primary)] px-6 py-3 font-bold text-[var(--on-primary)] transition-colors hover:bg-[#004da0]">
                      Xem Chi Tiet Bo San Pham
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!loading && storefront.products.length === 0 ? (
              <div className="mt-8 rounded-xl bg-white p-10 text-center shadow-sm">
                <h3 className="font-headline text-2xl font-bold">Khong tim thay san pham</h3>
                <p className="mt-3 text-sm text-[var(--on-surface-variant)]">
                  Thu thay doi tu khoa tim kiem hoac dat lai bo loc de xem them linh kien.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </main>

      <button className="group ai-glow liquid-sky-gradient fixed bottom-12 right-12 z-50 flex items-center gap-2 rounded-full p-5 text-[var(--on-primary)] shadow-2xl">
        <span className="material-symbols-outlined text-3xl">auto_awesome</span>
        <span className="max-w-0 overflow-hidden whitespace-nowrap pr-2 text-sm font-bold transition-all duration-500 group-hover:max-w-[200px]">
          Tu Van Build May
        </span>
      </button>

      <footer className="mt-24 w-full border-t border-blue-100/20 bg-white py-12 text-sm">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-12 md:grid-cols-4">
          <div>
            <div className="font-headline mb-4 text-xl font-bold tracking-tighter text-blue-700">
              Silicon Curator
            </div>
            <p className="mb-6 text-slate-500">
              Dinh nghia lai dien toan hieu nang cao thong qua viec tuyen chon thong minh va ky
              thuat chinh xac.
            </p>
            <div className="flex gap-4">
              <span className="material-symbols-outlined cursor-pointer text-slate-400 hover:text-[var(--primary)]">
                public
              </span>
              <span className="material-symbols-outlined cursor-pointer text-slate-400 hover:text-[var(--primary)]">
                alternate_email
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-headline text-[11px] font-bold uppercase tracking-widest text-[var(--on-surface)]">
              Tai Nguyen
            </h4>
            <ul className="space-y-2">
              <li><a className="text-slate-500 hover:text-blue-400" href="#">Ho Tro</a></li>
              <li><a className="text-slate-500 hover:text-blue-400" href="#">Bao Hanh</a></li>
              <li><a className="text-slate-500 hover:text-blue-400" href="#">Van Chuyen</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-headline text-[11px] font-bold uppercase tracking-widest text-[var(--on-surface)]">
              Cong Ty
            </h4>
            <ul className="space-y-2">
              <li><a className="text-slate-500 hover:text-blue-400" href="#">Cau Chuyen Cua Chung Toi</a></li>
              <li><a className="text-slate-500 hover:text-blue-400" href="#">Tuyen Dung</a></li>
              <li><a className="text-slate-500 hover:text-blue-400" href="#">Phat Trien Ben Vung</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-headline text-[11px] font-bold uppercase tracking-widest text-[var(--on-surface)]">
              Ban Tin
            </h4>
            <p className="text-xs text-slate-500">
              Dang ky de cap nhat nhung linh kien moi nhat cua chung toi.
            </p>
            <div className="flex overflow-hidden rounded-md bg-[var(--surface-container-low)] p-1">
              <input
                className="w-full border-none bg-transparent px-3 text-xs focus:ring-0"
                placeholder="Dia chi email"
                type="email"
              />
              <button className="rounded-md bg-[var(--primary)] p-2 text-[var(--on-primary)]">
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-blue-50 px-12 pt-12 text-xs text-slate-400 md:flex-row">
          <div>© 2024 Silicon Curator. Duoc thiet ke cho su chinh xac.</div>
          <div className="flex gap-8">
            <a className="hover:text-[var(--primary)]" href="#">Chinh Sach Bao Mat</a>
            <a className="hover:text-[var(--primary)]" href="#">Dieu Khoan Dich Vu</a>
            <a className="hover:text-[var(--primary)]" href="#">Tuyen Ngon</a>
          </div>
        </div>
      </footer>
    </>
  );
}
