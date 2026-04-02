import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateProfile, changePassword, clearAuth, refreshProfile } = useAuth();
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    setProfileForm({
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
    });
  }, [user]);

  useEffect(() => {
    refreshProfile().catch(() => undefined);
  }, [refreshProfile]);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const handleBackHome = () => {
    navigate("/");
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const submitProfile = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setProfileMessage("");
    setPasswordMessage("");
    setIsSavingProfile(true);

    try {
      await updateProfile({
        fullName: profileForm.fullName.trim(),
        email: profileForm.email.trim(),
        phone: profileForm.phone.trim(),
        address: profileForm.address.trim(),
      });
      setProfileMessage("Cap nhat thong tin thanh cong");
    } catch (error) {
      setErrorMessage(error.message || "Cap nhat that bai");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const submitPassword = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setProfileMessage("");
    setPasswordMessage("");

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setErrorMessage("Xac nhan mat khau moi khong khop");
      return;
    }

    setIsChangingPassword(true);

    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordMessage("Doi mat khau thanh cong");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      setErrorMessage(error.message || "Doi mat khau that bai");
    } finally {
      setIsChangingPassword(false);
    }
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
          <div className="flex items-center gap-2">
            <button type="button" onClick={handleBackHome} className="rounded-md border border-slate-300 bg-white px-4 py-2 text-slate-700">Quay lai trang chu</button>
            <button type="button" onClick={handleLogout} className="rounded-md bg-slate-900 px-4 py-2 text-white">Dang xuat</button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <section className="rounded-xl bg-white p-6 shadow-sm"><p className="text-sm text-slate-500">Ho ten</p><p className="mt-2 text-lg font-semibold">{user?.fullName || "Chua cap nhat"}</p></section>
          <section className="rounded-xl bg-white p-6 shadow-sm"><p className="text-sm text-slate-500">Email</p><p className="mt-2 text-lg font-semibold">{user?.email || "Chua cap nhat"}</p></section>
          <section className="rounded-xl bg-white p-6 shadow-sm"><p className="text-sm text-slate-500">Vai tro</p><p className="mt-2 text-lg font-semibold">{user?.role?.name || "CUSTOMER"}</p></section>
        </div>

        {errorMessage ? <p className="mt-6 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p> : null}
        {profileMessage ? <p className="mt-6 rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{profileMessage}</p> : null}
        {passwordMessage ? <p className="mt-6 rounded-md bg-blue-50 px-4 py-3 text-sm text-blue-700">{passwordMessage}</p> : null}

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <form onSubmit={submitProfile} className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Thay doi thong tin</h2>
            <div className="mt-4 space-y-3">
              <input className="w-full rounded-md border border-slate-200 px-3 py-2" name="fullName" placeholder="Ho ten" value={profileForm.fullName} onChange={handleProfileChange} />
              <input className="w-full rounded-md border border-slate-200 px-3 py-2" name="email" type="email" placeholder="Email" value={profileForm.email} onChange={handleProfileChange} />
              <input className="w-full rounded-md border border-slate-200 px-3 py-2" name="phone" placeholder="So dien thoai" value={profileForm.phone} onChange={handleProfileChange} />
              <input className="w-full rounded-md border border-slate-200 px-3 py-2" name="address" placeholder="Dia chi" value={profileForm.address} onChange={handleProfileChange} />
            </div>
            <button disabled={isSavingProfile} className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-white">{isSavingProfile ? "Dang luu..." : "Luu thong tin"}</button>
          </form>

          <form onSubmit={submitPassword} className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Doi mat khau</h2>
            <div className="mt-4 space-y-3">
              <input className="w-full rounded-md border border-slate-200 px-3 py-2" name="currentPassword" type="password" placeholder="Mat khau hien tai" value={passwordForm.currentPassword} onChange={handlePasswordChange} />
              <input className="w-full rounded-md border border-slate-200 px-3 py-2" name="newPassword" type="password" placeholder="Mat khau moi" value={passwordForm.newPassword} onChange={handlePasswordChange} />
              <input className="w-full rounded-md border border-slate-200 px-3 py-2" name="confirmNewPassword" type="password" placeholder="Xac nhan mat khau moi" value={passwordForm.confirmNewPassword} onChange={handlePasswordChange} />
            </div>
            <button disabled={isChangingPassword} className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white">{isChangingPassword ? "Dang doi..." : "Doi mat khau"}</button>
          </form>
        </div>
      </div>
    </main>
  );
}
