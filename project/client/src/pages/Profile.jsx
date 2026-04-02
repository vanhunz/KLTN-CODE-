import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const authData = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("authData") || "null");
    } catch {
      return null;
    }
  }, []);

  const user = authData?.user;

  const handleLogout = () => {
    localStorage.removeItem("authData");
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-12 text-[var(--on-surface)]">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="font-label text-sm font-bold uppercase tracking-[0.24em] text-[var(--primary)]">User Profile</p>
            <h1 className="font-headline mt-2 text-4xl font-bold">Xin chao {user?.fullName || user?.email || "Nguoi dung"}</h1>
            <p className="mt-3 text-[var(--on-surface-variant)]">Tai khoan cua ban dang dang nhap voi quyen {user?.role?.name || "CUSTOMER"}.</p>
          </div>
          <button type="button" onClick={handleLogout} className="rounded-md bg-slate-900 px-4 py-2 text-white">Dang xuat</button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <section className="rounded-xl bg-white p-6 shadow-sm"><p className="text-sm text-slate-500">Ho ten</p><p className="mt-2 text-lg font-semibold">{user?.fullName || "Chua cap nhat"}</p></section>
          <section className="rounded-xl bg-white p-6 shadow-sm"><p className="text-sm text-slate-500">Email</p><p className="mt-2 text-lg font-semibold">{user?.email || "Chua cap nhat"}</p></section>
          <section className="rounded-xl bg-white p-6 shadow-sm"><p className="text-sm text-slate-500">Vai tro</p><p className="mt-2 text-lg font-semibold">{user?.role?.name || "CUSTOMER"}</p></section>
        </div>
      </div>
    </main>
  );
}
