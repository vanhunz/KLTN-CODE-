import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { otpApi } from "../services/otp.api";

const ShieldIcon = () => (
  <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M12 3l7 3v6c0 4.6-3.04 7.94-7 9-3.96-1.06-7-4.4-7-9V6l7-3Z" />
    <path d="m9.5 12 1.7 1.7 3.8-4.2" />
  </svg>
);

const EyeIcon = ({ visible }) => (
  <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    {visible ? (
      <>
        <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M3 3l18 18" />
        <path d="M10.6 10.7a2 2 0 0 0 2.7 2.7" />
        <path d="M9.36 5.37A10.94 10.94 0 0 1 12 5c6.4 0 10 7 10 7a18.92 18.92 0 0 1-3.17 3.86" />
        <path d="M6.23 6.23A19.36 19.36 0 0 0 2 12s3.6 7 10 7a10.8 10.8 0 0 0 5.03-1.2" />
      </>
    )}
  </svg>
);

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: gửi email, 2: register với OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  // Step 1: Gửi OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      // Validate email
      if (!email.trim()) {
        setErrorMessage('Vui lòng nhập email');
        setLoading(false);
        return;
      }

      const emailRegex = /.+@.+\..+/;
      if (!emailRegex.test(email)) {
        setErrorMessage('Email không hợp lệ');
        setLoading(false);
        return;
      }

      // Gửi OTP
      const result = await otpApi.sendOtp(email);
      setSuccessMessage(result.message || 'OTP đã được gửi tới email của bạn');
      setStep(2);
      setOtpTimer(300); // 5 phút = 300 giây

      // Countdown timer
      const interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setErrorMessage(err.message || 'Lỗi khi gửi OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Đăng ký với OTP
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      // Validate
      if (!otp.trim()) {
        setErrorMessage('Vui lòng nhập OTP');
        setLoading(false);
        return;
      }

      if (!/^\d{6}$/.test(otp)) {
        setErrorMessage('OTP phải là 6 số');
        setLoading(false);
        return;
      }

      if (!fullName.trim() || fullName.length < 2) {
        setErrorMessage('Họ tên phải có ít nhất 2 ký tự');
        setLoading(false);
        return;
      }

      if (!phone.trim() || phone.length < 10) {
        setErrorMessage('Số điện thoại không hợp lệ');
        setLoading(false);
        return;
      }

      if (!address.trim() || address.length < 5) {
        setErrorMessage('Địa chỉ phải có ít nhất 5 ký tự');
        setLoading(false);
        return;
      }

      if (!password || password.length < 6) {
        setErrorMessage('Mật khẩu phải có ít nhất 6 ký tự');
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage('Mật khẩu xác nhận không khớp');
        setLoading(false);
        return;
      }

      if (!acceptedTerms) {
        setErrorMessage('Bạn cần đồng ý điều khoản trước khi đăng ký');
        setLoading(false);
        return;
      }

      // Gọi API register
      const result = await otpApi.register({
        email,
        password,
        otp,
        fullName,
        phone,
        address,
      });

      setSuccessMessage(result.message || 'Đăng ký thành công! Bạn sẽ được chuyển sang trang đăng nhập.');

      // Chuyển về trang login sau 2 giây
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setErrorMessage(err.message || 'Lỗi khi đăng ký');
    } finally {
      setLoading(false);
    }
  };

  // Format timer
  const formatTimer = () => {
    const minutes = Math.floor(otpTimer / 60);
    const seconds = otpTimer % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className="auth-orb auth-orb-top" />
      <div className="auth-orb auth-orb-bottom" />

      <main className="flex min-h-screen w-full bg-[var(--background)] text-[var(--on-surface)]">
        <section className="relative hidden items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#c2e0ff_0%,#e7f2ff_100%)] lg:flex lg:w-7/12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,89,182,0.24),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(104,160,255,0.25),transparent_28%)]" />

          <div className="relative z-10 max-w-2xl p-16">
            <span className="font-headline mb-4 inline-block rounded-full bg-white/55 px-4 py-1 text-xs font-bold uppercase tracking-[0.28em] text-[var(--primary)] backdrop-blur-md">
              Guided Onboarding
            </span>
            <h1 className="font-headline mb-6 text-6xl font-bold leading-none tracking-[-0.06em] text-[var(--on-primary-fixed)] xl:text-7xl">
              Build Your <br />
              Intelligence Hub
            </h1>
            <p className="mb-12 max-w-xl text-xl leading-relaxed text-[var(--on-surface-variant)]">
              Create your Silicon Curator workspace and start orchestrating hardware, analytics,
              and intelligent procurement from one polished control layer.
            </p>

            <div className="grid gap-5">
              {[
                "Provision a secure organization workspace in minutes.",
                "Invite staff members and assign operational access instantly.",
                "Activate curated recommendation flows for your inventory stack.",
              ].map((item) => (
                <div
                  key={item}
                  className="glass-effect flex items-start gap-4 rounded-2xl border border-white/25 p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--primary)] text-white">
                    <ShieldIcon />
                  </div>
                  <p className="text-sm leading-6 text-[var(--on-surface)]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex w-full flex-col justify-center bg-[var(--surface-container-lowest)] px-8 py-12 sm:px-16 lg:w-5/12 lg:px-24">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-12 flex items-center gap-3 lg:hidden">
              <span className="font-headline text-3xl font-bold tracking-[-0.06em] text-[var(--primary)]">
                Silicon Curator
              </span>
            </div>

            <div className="mb-10">
              <h2 className="font-headline mb-2 text-3xl font-bold text-[var(--on-surface)]">
                Create Account
              </h2>
              <p className="text-[var(--on-surface-variant)]">
                {step === 1 ? 'Nhập email để nhận mã xác thực' : 'Hoàn tất thông tin đăng ký'}
              </p>
            </div>

            <div className="mb-10 flex rounded-lg bg-[var(--surface-container-low)] p-1">
              <Link
                className="font-label flex-1 py-2.5 text-center text-sm font-medium text-[var(--on-surface-variant)] transition-all hover:text-[var(--on-surface)]"
                to="/login"
              >
                Login
              </Link>
              <Link
                className="font-label flex-1 rounded-md bg-white py-2.5 text-center text-sm font-semibold text-[var(--primary)] shadow-sm transition-all"
                to="/register"
              >
                Sign Up
              </Link>
            </div>

            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {successMessage}
              </div>
            )}

            {step === 1 ? (
              <form className="space-y-5" onSubmit={handleSendOtp}>
                <div className="space-y-1.5">
                  <label
                    className="font-label block text-xs font-bold uppercase tracking-[0.22em] text-[var(--on-surface-variant)]"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    disabled={loading}
                    className="h-12 w-full rounded-md border-0 bg-[var(--surface-container-low)] px-4 py-2 text-[var(--on-surface)] outline-none transition-all placeholder:text-[rgba(142,177,210,0.8)] focus:bg-white focus:ring-2 focus:ring-[rgba(0,89,182,0.2)] disabled:bg-gray-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="font-headline liquid-sky-gradient h-14 w-full rounded-md text-lg font-bold text-white shadow-lg shadow-[rgba(0,89,182,0.2)] transition-all active:scale-[0.98] disabled:bg-gray-400"
                >
                  {loading ? 'Đang gửi...' : 'Gửi OTP'}
                </button>
              </form>
            ) : (
              <form className="space-y-5" onSubmit={handleRegister}>
                <div className="space-y-1.5">
                  <div className="flex justify-between mb-2">
                    <label className="font-label block text-xs font-bold uppercase tracking-[0.22em] text-[var(--on-surface-variant)]">OTP</label>
                    <span className="text-xs text-red-600 font-semibold">
                      {otpTimer > 0 ? `Hết hạn: ${formatTimer()}` : 'OTP hết hạn'}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength="6"
                    disabled={loading}
                    className="h-12 w-full rounded-md border-0 bg-[var(--surface-container-low)] px-4 py-2 text-[var(--on-surface)] outline-none transition-all placeholder:text-[rgba(142,177,210,0.8)] focus:bg-white focus:ring-2 focus:ring-[rgba(0,89,182,0.2)] disabled:bg-gray-100 text-center text-2xl tracking-widest font-font-label"
                  />
                  <p className="text-xs text-gray-500 mt-1">Kiểm tra email để lấy OTP</p>
                </div>

                <div className="space-y-1.5">
                  <label
                    className="font-label block text-xs font-bold uppercase tracking-[0.22em] text-[var(--on-surface-variant)]"
                    htmlFor="fullName"
                  >
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Nguyen Van A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={loading}
                    className="h-12 w-full rounded-md border-0 bg-[var(--surface-container-low)] px-4 py-2 text-[var(--on-surface)] outline-none transition-all placeholder:text-[rgba(142,177,210,0.8)] focus:bg-white focus:ring-2 focus:ring-[rgba(0,89,182,0.2)] disabled:bg-gray-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    className="font-label block text-xs font-bold uppercase tracking-[0.22em] text-[var(--on-surface-variant)]"
                    htmlFor="phone"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="0912345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    disabled={loading}
                    className="h-12 w-full rounded-md border-0 bg-[var(--surface-container-low)] px-4 py-2 text-[var(--on-surface)] outline-none transition-all placeholder:text-[rgba(142,177,210,0.8)] focus:bg-white focus:ring-2 focus:ring-[rgba(0,89,182,0.2)] disabled:bg-gray-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    className="font-label block text-xs font-bold uppercase tracking-[0.22em] text-[var(--on-surface-variant)]"
                    htmlFor="address"
                  >
                    Address
                  </label>
                  <textarea
                    id="address"
                    placeholder="123 Main Street, City, Country"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={loading}
                    rows="2"
                    className="w-full rounded-md border-0 bg-[var(--surface-container-low)] px-4 py-2 text-[var(--on-surface)] outline-none transition-all placeholder:text-[rgba(142,177,210,0.8)] focus:bg-white focus:ring-2 focus:ring-[rgba(0,89,182,0.2)] disabled:bg-gray-100 resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    className="font-label block text-xs font-bold uppercase tracking-[0.22em] text-[var(--on-surface-variant)]"
                    htmlFor="register-password"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a secure password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="h-12 w-full rounded-md border-0 bg-[var(--surface-container-low)] px-4 py-2 pr-12 text-[var(--on-surface)] outline-none transition-all placeholder:text-[rgba(142,177,210,0.8)] focus:bg-white focus:ring-2 focus:ring-[rgba(0,89,182,0.2)] disabled:bg-gray-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-3 top-3 text-[rgba(60,95,124,0.55)] transition-colors hover:text-[var(--on-surface)]"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      <EyeIcon visible={showPassword} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    className="font-label block text-xs font-bold uppercase tracking-[0.22em] text-[var(--on-surface-variant)]"
                    htmlFor="confirm-password"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repeat your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                      className="h-12 w-full rounded-md border-0 bg-[var(--surface-container-low)] px-4 py-2 pr-12 text-[var(--on-surface)] outline-none transition-all placeholder:text-[rgba(142,177,210,0.8)] focus:bg-white focus:ring-2 focus:ring-[rgba(0,89,182,0.2)] disabled:bg-gray-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((current) => !current)}
                      className="absolute right-3 top-3 text-[rgba(60,95,124,0.55)] transition-colors hover:text-[var(--on-surface)]"
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                      <EyeIcon visible={showConfirmPassword} />
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-3 py-1">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(event) => setAcceptedTerms(event.target.checked)}
                    className="mt-1 h-5 w-5 cursor-pointer rounded-sm border border-[var(--outline-variant)] bg-[var(--surface-container-low)] text-[var(--primary)] focus:ring-[rgba(0,89,182,0.2)]"
                  />
                  <label className="font-label text-sm leading-6 text-[var(--on-surface-variant)]" htmlFor="terms">
                    I agree to the{" "}
                    <a className="font-semibold text-[var(--on-surface)] hover:underline" href="#!">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a className="font-semibold text-[var(--on-surface)] hover:underline" href="#!">
                      Privacy Policy
                    </a>
                    .
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading || otpTimer === 0}
                  className="font-headline liquid-sky-gradient h-14 w-full rounded-md text-lg font-bold text-white shadow-lg shadow-[rgba(0,89,182,0.2)] transition-all active:scale-[0.98] disabled:bg-gray-400"
                >
                  {loading ? 'Đang đăng ký...' : 'Create Workspace'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtp('');
                    setFullName('');
                    setPhone('');
                    setAddress('');
                    setPassword('');
                    setConfirmPassword('');
                    setOtpTimer(0);
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="font-label w-full bg-gray-200 text-gray-800 py-3 rounded-md font-semibold hover:bg-gray-300 transition"
                >
                  Quay lại
                </button>
              </form>
            )}

            <p className="mt-8 text-center text-sm text-[var(--on-surface-variant)]">
              Already have access?{" "}
              <Link className="font-semibold text-[var(--primary)] hover:underline" to="/login">
                Sign in here
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
