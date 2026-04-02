import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatShortDate = (value) => {
  if (!value) return "--";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

const statusClasses = {
  DELIVERED: "bg-green-100 text-green-700",
  SHIPPING: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-amber-100 text-amber-700",
  PENDING: "bg-slate-200 text-slate-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const authData = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("authData") || "null");
    } catch {
      return null;
    }
  }, []);

  const user = authData?.user;

  useEffect(() => {
    if (!authData?.token) {
      navigate("/login");
      return;
    }

    const fetchDashboard = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch("http://localhost:3000/api/auth/dashboard", {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Khong tai duoc dashboard");
        }

        setDashboardData(result.data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [authData?.token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authData");
    navigate("/login");
  };

  const overview = dashboardData?.overview;
  const recentOrders = dashboardData?.recentOrders || [];
  const lowStockProducts = dashboardData?.lowStockProducts || [];

  return (
    <div className="min-h-screen bg-[#f2f7ff] font-sans text-[#07314d] selection:bg-[#68a0ff] selection:text-[#00224d]">
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-slate-50 py-6 pr-4">
        <div className="mb-8 px-4 text-lg font-black tracking-tighter text-blue-700">
          Staff Command
          <div className="text-[10px] font-normal uppercase tracking-[0.3em] opacity-60">Silicon Curator Admin</div>
        </div>
        <nav className="flex-grow space-y-1">
          {[["Analytics", "leaderboard", true],["Inventory", "inventory_2", false],["Orders", "shopping_bag", false],["Users", "group", false],["AI Insights", "auto_awesome", false],["Settings", "settings", false]].map(([label, icon, active]) => (
            <a key={label} className={active ? "flex items-center gap-3 rounded-r-full bg-white px-4 py-3 font-semibold text-blue-700 shadow-sm" : "flex items-center gap-3 px-4 py-3 text-slate-500 transition-all duration-200 hover:translate-x-1 hover:text-blue-600"} href="#">
              <span className="material-symbols-outlined">{icon}</span>
              <span className="text-[11px] uppercase tracking-[0.28em]">{label}</span>
            </a>
          ))}
        </nav>
        <div className="mt-auto px-4">
          <button className="w-full rounded-lg bg-[#68a0ff] px-4 py-3 text-xs font-bold uppercase tracking-[0.24em] text-[#00224d] transition-opacity hover:opacity-90">Staff Chat</button>
          <div className="mt-6 border-t border-blue-100/20 pt-6">
            <button type="button" onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-slate-500 transition-colors hover:text-red-600">
              <span className="material-symbols-outlined">logout</span>
              <span className="text-[11px] uppercase tracking-[0.28em]">Logout</span>
            </button>
          </div>
        </div>
      </aside>
      <main className="ml-64 min-h-screen">
        <header className="fixed left-64 right-0 top-0 z-30 flex items-center justify-between bg-blue-50/80 px-8 py-4 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-8">
            <div>
              <h1 className="text-xl font-bold">Analytics Dashboard</h1>
              <p className="mt-1 text-sm text-[#3c5f7c]">Xin chao {user?.fullName || user?.email || "Admin"}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-[#3c5f7c]">
              <button className="rounded-md p-2 transition-all hover:bg-blue-100/50" type="button"><span className="material-symbols-outlined">notifications</span></button>
              <div className="flex items-center gap-2 rounded-full border border-[#8eb1d2]/30 bg-white px-2 py-1 pr-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">{(user?.fullName || user?.email || "A").slice(0, 1).toUpperCase()}</div>
                <span className="text-xs font-semibold">{user?.role?.name || "ADMIN"}</span>
              </div>
            </div>
          </div>
        </header>
        <div className="px-8 pb-12 pt-24">
          {errorMessage ? <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{errorMessage}</div> : null}
          <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Monthly Revenue", value: formatCurrency(overview?.monthlyRevenue), hint: `${(overview?.revenueGrowth || 0).toFixed(1)}% vs last month`, icon: "payments", tone: "text-blue-700 bg-blue-100", badge: "text-green-600 bg-green-50" },
              { label: "Active Orders", value: overview?.activeOrders ?? 0, hint: `${recentOrders.length} latest orders`, icon: "local_shipping", tone: "text-cyan-700 bg-cyan-100", badge: "text-blue-600 bg-blue-50" },
              { label: "Inventory Items", value: overview?.inventoryItems ?? 0, hint: `${overview?.lowStockCount ?? 0} low stock products`, icon: "inventory", tone: "text-slate-700 bg-slate-200", badge: "text-slate-700 bg-slate-100" },
              { label: "Users", value: overview?.totalUsers ?? 0, hint: `${overview?.totalAdmins ?? 0} admin / ${overview?.totalCustomers ?? 0} customer`, icon: "group", tone: "text-red-700 bg-red-100", badge: "text-red-700 bg-red-50" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-[#8eb1d2]/10 bg-white p-6 shadow-[0px_0px_32px_0px_rgba(7,49,77,0.06)]">
                <div className="mb-4 flex items-start justify-between">
                  <div className={`rounded-lg p-2 ${item.tone}`}><span className="material-symbols-outlined">{item.icon}</span></div>
                  <span className={`rounded px-2 py-1 text-xs font-bold ${item.badge}`}>{item.hint}</span>
                </div>
                <p className="mb-1 text-sm uppercase tracking-[0.24em] text-[#3c5f7c]">{item.label}</p>
                <h3 className="text-2xl font-bold text-[#07314d]">{loading ? "..." : item.value}</h3>
              </div>
            ))}
          </section>
          <div className="flex flex-col gap-8 xl:flex-row">
            <div className="flex-grow space-y-8">
              <section className="rounded-xl border border-[#8eb1d2]/10 bg-white p-8 shadow-[0px_0px_32px_0px_rgba(7,49,77,0.06)]">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold">Revenue Pulse</h2>
                    <p className="text-sm text-[#3c5f7c]">Last 30 days performance metrics</p>
                  </div>
                </div>
                <div className="relative flex h-[300px] items-end gap-4 overflow-hidden rounded-lg bg-[#e7f2ff]/50 px-2">
                  <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 1000 300"><defs><linearGradient id="chartGradient" x1="0%" x2="0%" y1="0%" y2="100%"><stop offset="0%" stopColor="#0059b6" stopOpacity="0.2" /><stop offset="100%" stopColor="#0059b6" stopOpacity="0" /></linearGradient></defs><path d="M0,250 Q150,150 300,200 T600,100 T1000,150 L1000,300 L0,300 Z" fill="url(#chartGradient)" /><path d="M0,250 Q150,150 300,200 T600,100 T1000,150" fill="none" stroke="#0059b6" strokeWidth="3" /></svg>
                  <div className="absolute bottom-4 flex w-full justify-between px-8 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400"><span>Day 01</span><span>Day 10</span><span>Day 20</span><span>Day 30</span></div>
                </div>
              </section>
              <section className="overflow-hidden rounded-xl border border-[#8eb1d2]/10 bg-white shadow-[0px_0px_32px_0px_rgba(7,49,77,0.06)]">
                <div className="border-b border-[#d8eaff] p-6"><h2 className="text-lg font-bold">Recent Acquisitions</h2></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#e7f2ff]/60"><tr>{["Order ID", "Configuration", "Client", "Amount", "Status"].map((label) => <th key={label} className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.24em] text-[#3c5f7c]">{label}</th>)}</tr></thead>
                    <tbody className="divide-y divide-[#d8eaff]">
                      {recentOrders.length > 0 ? recentOrders.map((order) => (
                        <tr key={order.id} className="transition-colors hover:bg-[#e7f2ff]/30">
                          <td className="px-6 py-4 font-mono text-xs font-bold text-blue-700">{order.code}</td>
                          <td className="px-6 py-4"><div className="text-sm font-semibold">{order.configuration}</div><div className="text-[10px] text-[#3c5f7c]">{formatShortDate(order.createdAt)}</div></td>
                          <td className="px-6 py-4 text-sm">{order.client}</td>
                          <td className="px-6 py-4 text-sm font-bold">{formatCurrency(order.amount)}</td>
                          <td className="px-6 py-4"><span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${statusClasses[order.status] || "bg-slate-100 text-slate-700"}`}>{order.status}</span></td>
                        </tr>
                      )) : <tr><td className="px-6 py-10 text-sm text-[#3c5f7c]" colSpan="5">Chua co don hang nao trong he thong.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
            <aside className="w-full flex-shrink-0 xl:w-80">
              <div className="h-full rounded-xl border border-blue-100 bg-[#c2e0ff]/20 p-6 backdrop-blur-sm">
                <div className="mb-6 flex items-center gap-2"><span className="material-symbols-outlined text-red-600">report</span><h2 className="text-sm font-bold uppercase tracking-[0.24em] text-[#07314d]">Critical Stock Alerts</h2></div>
                <div className="space-y-4">
                  {lowStockProducts.length > 0 ? lowStockProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-4 rounded-lg border-l-4 border-red-500 bg-white p-4 shadow-sm">
                      <div className="flex h-12 w-12 items-center justify-center rounded bg-[#d8eaff] text-blue-700"><span className="material-symbols-outlined">memory</span></div>
                      <div><p className="text-[11px] font-bold uppercase tracking-tight text-red-600">Only {product.stockQuantity} left</p><h4 className="text-xs font-bold leading-tight">{product.name}</h4><p className="text-[10px] text-[#3c5f7c]">Updated: {formatShortDate(product.updatedAt)}</p></div>
                    </div>
                  )) : <div className="rounded-lg bg-white p-4 text-sm text-[#3c5f7c] shadow-sm">Hien chua co san pham nao o muc ton kho nguy cap.</div>}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
