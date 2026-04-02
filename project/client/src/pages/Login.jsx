import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const GoogleIcon = () => (
  <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
    <path d="M21.805 10.023H12.24v3.955h5.486c-.472 2.53-2.71 3.955-5.486 3.955a6.066 6.066 0 1 1 0-12.132c1.55 0 2.963.55 4.07 1.455l2.95-2.95A10.013 10.013 0 0 0 12.24 2a10 10 0 1 0 0 20c5.773 0 9.58-4.056 9.58-9.772 0-.658-.074-1.291-.214-1.905Z" fill="#FFC107" />
    <path d="M3.392 7.345 6.64 9.727a6.066 6.066 0 0 1 5.6-3.926c1.55 0 2.963.55 4.07 1.455l2.95-2.95A10.013 10.013 0 0 0 12.24 2a9.992 9.992 0 0 0-8.848 5.345Z" fill="#FF3D00" />
    <path d="M12.24 22a9.993 9.993 0 0 0 6.852-2.641l-3.163-2.675a6.25 6.25 0 0 1-3.689 1.249c-2.764 0-5.004-1.41-5.484-3.928l-3.223 2.485A9.998 9.998 0 0 0 12.24 22Z" fill="#4CAF50" />
    <path d="M21.805 10.023H12.24v3.955h5.486a4.936 4.936 0 0 1-1.797 2.706l3.163 2.675c1.833-1.688 2.713-4.18 2.713-7.131 0-.658-.074-1.291-.214-1.905Z" fill="#1976D2" />
  </svg>
);

const GithubIcon = () => (
  <svg aria-hidden="true" className="h-5 w-5 fill-current" viewBox="0 0 24 24">
    <path d="M12 .5C5.648.5.5 5.648.5 12A11.5 11.5 0 0 0 8.36 22.93c.575.105.786-.25.786-.556 0-.274-.01-1-.016-1.962-3.197.695-3.872-1.54-3.872-1.54-.522-1.326-1.274-1.68-1.274-1.68-1.04-.712.08-.698.08-.698 1.15.081 1.755 1.181 1.755 1.181 1.021 1.75 2.678 1.245 3.33.952.103-.74.4-1.246.727-1.533-2.552-.29-5.236-1.276-5.236-5.68 0-1.255.449-2.282 1.184-3.086-.118-.29-.514-1.46.112-3.043 0 0 .965-.31 3.162 1.178A10.986 10.986 0 0 1 12 6.095a10.99 10.99 0 0 1 2.88.387c2.196-1.488 3.16-1.178 3.16-1.178.627 1.582.232 2.752.114 3.043.737.804 1.183 1.83 1.183 3.086 0 4.415-2.688 5.387-5.248 5.672.412.355.779 1.056.779 2.128 0 1.538-.014 2.779-.014 3.157 0 .309.208.667.792.554A11.502 11.502 0 0 0 23.5 12C23.5 5.648 18.352.5 12 .5Z" />
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

const ChipIcon = () => (
  <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <rect x="7" y="7" width="10" height="10" rx="2" />
    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3M5 9H1M23 9h-4M5 15H1M23 15h-4" />
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const socialButtons = [
    { label: "Google", icon: <GoogleIcon /> },
    { label: "GitHub", icon: <GithubIcon /> },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const result = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      const roleName = result?.user?.role?.name;
      navigate(roleName === "ADMIN" ? "/admin/dashboard" : "/");
    } catch (error) {
      setErrorMessage(error.message || "Dang nhap that bai");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="auth-orb auth-orb-top" />
      <div className="auth-orb auth-orb-bottom" />

      <main className="flex min-h-screen w-full bg-[var(--background)] text-[var(--on-surface)]">
        <section className="relative hidden items-center justify-center overflow-hidden bg-[var(--surface-container-highest)] lg:flex lg:w-7/12">
          <div className="absolute inset-0 z-0">
            <img alt="Artificial Intelligence visual" className="h-full w-full scale-105 object-cover opacity-90" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVES4UkgLr1c4g-zkFocFrLb333ihw6WmCAWWE-HuP9mcD7JV6iHew-X0D42T4VUkVfqrFlGDrmgzHteViO4Ro_lgUN3vbEGy4gBx03-wxLl2mL-vloLc2NHOy2lz4yO0siC3Cj5UPqTkYjhlyRJeOGt8NS2CtteY7-MApSCItmBeLtWOsTStdKysUpgLfPKO2fkfeFpqzehvXkA7i9uo5DQ354JWI-1HSSEyHZo36mebymsirzYnFMBkNLlMguQ6R38mASRfrG1w" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[rgba(0,89,182,0.4)] to-transparent" />
          </div>

          <div className="relative z-10 max-w-2xl p-16">
            <div className="mb-12">
              <span className="font-headline mb-4 inline-block rounded-full bg-[rgba(0,89,182,0.1)] px-4 py-1 text-xs font-bold uppercase tracking-[0.28em] text-[var(--primary)] backdrop-blur-md">
                Intelligent Systems
              </span>
              <h1 className="font-headline mb-6 text-6xl font-bold leading-none tracking-[-0.06em] text-[var(--on-primary-fixed)] xl:text-7xl">
                Silicon <br />
                Curator
              </h1>
              <p className="max-w-xl text-xl leading-relaxed text-[var(--on-surface-variant)] opacity-90">
                Bridging the gap between high-performance computing and human-centric intelligence through curated hardware ecosystems.
              </p>
            </div>

            <div className="glass-effect ai-glow rounded-2xl border border-white/20 p-8">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--primary)] text-white">
                  <ChipIcon />
                </div>
                <h3 className="font-headline text-lg font-semibold text-[var(--on-surface)]">
                  Precision Architecture
                </h3>
              </div>
              <p className="text-sm leading-6 text-[var(--on-surface-variant)]">
                Our AI engine analyzes millions of data points to recommend the exact hardware configurations for your specific computational needs.
              </p>
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
              <h2 className="font-headline mb-2 text-3xl font-bold text-[var(--on-surface)]">Welcome Back</h2>
              <p className="text-[var(--on-surface-variant)]">Manage your hardware intelligence hub.</p>
            </div>

            <div className="mb-10 flex rounded-lg bg-[var(--surface-container-low)] p-1">
              <Link className="font-label flex-1 rounded-md bg-white py-2.5 text-center text-sm font-semibold text-[var(--primary)] shadow-sm transition-all" to="/login">Login</Link>
              <Link className="font-label flex-1 py-2.5 text-center text-sm font-medium text-[var(--on-surface-variant)] transition-all hover:text-[var(--on-surface)]" to="/register">Sign Up</Link>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="font-label block text-xs font-bold uppercase tracking-[0.22em] text-[var(--on-surface-variant)]" htmlFor="email">Email Address</label>
                <div className="relative">
                  <input id="email" name="email" type="email" placeholder="name@company.com" value={formData.email} onChange={handleChange} className="h-12 w-full rounded-md border-0 bg-[var(--surface-container-low)] px-4 py-2 text-[var(--on-surface)] outline-none transition-all placeholder:text-[rgba(142,177,210,0.8)] focus:bg-white focus:ring-2 focus:ring-[rgba(0,89,182,0.2)]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-label block text-xs font-bold uppercase tracking-[0.22em] text-[var(--on-surface-variant)]" htmlFor="password">Password</label>
                  <Link to="/forgot-password" className="text-xs text-blue-600 hover:text-blue-800 font-semibold">
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="********" value={formData.password} onChange={handleChange} className="h-12 w-full rounded-md border-0 bg-[var(--surface-container-low)] px-4 py-2 pr-12 text-[var(--on-surface)] outline-none transition-all placeholder:text-[rgba(142,177,210,0.8)] focus:bg-white focus:ring-2 focus:ring-[rgba(0,89,182,0.2)]" />
                  <button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute right-3 top-3 text-[rgba(60,95,124,0.55)] transition-colors hover:text-[var(--on-surface)]" aria-label={showPassword ? "Hide password" : "Show password"}>
                    <EyeIcon visible={showPassword} />
                  </button>
                </div>
              </div>

              {errorMessage ? <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p> : null}

              <button type="submit" disabled={isSubmitting} className="font-headline liquid-sky-gradient h-14 w-full rounded-md text-lg font-bold text-white shadow-lg shadow-[rgba(0,89,182,0.2)] transition-all active:scale-[0.98]">
                {isSubmitting ? "Dang dang nhap..." : "Access Dashboard"}
              </button>
            </form>

            <div className="relative mt-12 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--surface-container-high)]" /></div>
              <span className="font-label relative bg-[var(--surface-container-lowest)] px-4 text-xs font-bold uppercase tracking-[0.24em] text-[var(--outline-variant)]">Or connect with</span>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {socialButtons.map((button) => (
                <button key={button.label} type="button" className="font-label flex h-12 items-center justify-center gap-2 rounded-md border border-[rgba(142,177,210,0.2)] text-sm font-medium text-[var(--on-surface)] transition-all hover:bg-[var(--surface-container-low)]">
                  {button.icon}
                  {button.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
